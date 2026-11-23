"""Landings de Black Friday de ticket alto (frontend/lib/black-friday-landings.ts).

Fija las reglas del pedido del 23/11/2026: solo productos que existen en los
datos del repo, sin marcas BGH ni HP/OMEN/Victus, sin % de descuento, precio
tachado, «mínimo histórico» ni cupones, la IdeaPad Slim 3 primera en notebooks
y títulos/descripciones que entran en Google.
"""
import json
import re
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
LANDINGS = FRONT / "lib" / "black-friday-landings.ts"
COMPONENTE = FRONT / "components" / "black-friday" / "LandingBF.tsx"
CATALOGO = FRONT / "data" / "productos_rentables.json"
AIRES = FRONT / "lib" / "mejor-aires.ts"

PROHIBIDAS = re.compile(r"\b(bgh|hp|omen|victus)\b", re.I)


def _bloques(src: str) -> dict[str, str]:
    """slug -> texto de su bloque en LANDINGS_BF."""
    partes = re.split(r"\n  \{\n    slug: '", src)
    out = {}
    for p in partes[1:]:
        slug = p.split("'", 1)[0]
        out[slug] = p
    return out


class TestLandingsBlackFriday(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = LANDINGS.read_text(encoding="utf-8")
        cls.comp = COMPONENTE.read_text(encoding="utf-8")
        cls.bloques = _bloques(cls.src)
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}
        cls.aires = set(re.findall(r"id: '(MLA\d+)'", AIRES.read_text(encoding="utf-8")))

    def test_estan_las_cuatro(self):
        for slug in (
            "black-friday-notebooks",
            "black-friday-celulares",
            "black-friday-smart-tv",
            "black-friday-aires-acondicionados",
        ):
            self.assertIn(slug, self.bloques)

    def test_ideapad_primera_en_notebooks(self):
        ids = re.findall(r"id: '(MLA\d+)'", self.bloques["black-friday-notebooks"])
        self.assertEqual(ids[0], "MLA77766168")
        p = self.catalogo.get("MLA77766168")
        if p:  # el bot poda a los 14 días: si sigue, tiene que ser la de 16/512
            self.assertIn("Ideapad Slim 3", p["titulo"])
            self.assertEqual(int(p["precio_actual"]), 1573949)

    def test_productos_del_repo_y_sin_marcas_prohibidas(self):
        for slug, b in self.bloques.items():
            ids = re.findall(r"id: '(MLA\d+)'", b)
            self.assertGreaterEqual(len(ids), 4, slug)
            for i in ids:
                p = self.catalogo.get(i)
                if p is None:
                    # Fuera del catálogo solo valen los aires verificados a mano.
                    self.assertIn(i, self.aires, f"{slug}: {i} no está en los datos del repo")
                    continue
                self.assertNotRegex(p["titulo"], PROHIBIDAS, f"{slug}: {i}")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
        for nombre in re.findall(r"nombre: '([^']+)'", self.src):
            self.assertNotRegex(nombre, PROHIBIDAS)

    def test_sin_descuentos_tachados_minimos_ni_cupones(self):
        texto = (self.src + self.comp).lower()
        # Los comentarios explican la regla: se miran solo los textos y el JSX.
        sin_comentarios = re.sub(r"//.*", "", texto)
        for prohibido in ("% off", "descuento_pct", "precio_anterior", "line-through", "minimo_historico",
                          "mínimo histórico", "minimo historico", "cupón", "cupones de", "cupones-mercado-libre"):
            self.assertNotIn(prohibido, sin_comentarios, prohibido)
        self.assertNotRegex(sin_comentarios, r"\d+\s*%")

    def test_seo(self):
        for slug, b in self.bloques.items():
            titulo = re.search(r"titulo: '([^']+)'", b).group(1)
            desc = re.search(r"descripcion:\s*'([^']+)'", b).group(1)
            self.assertLessEqual(len(titulo), 65, slug)
            self.assertLessEqual(len(desc), 158, slug)
            self.assertIn("black friday 2026", titulo.lower(), slug)
            self.assertIn("argentina", titulo.lower(), slug)
        kws = re.search(r"keywords: \[([^\]]+)\]", self.bloques["black-friday-notebooks"]).group(1)
        self.assertIn("black friday 2026 notebooks argentina", kws)

    def test_boton_ver_en_mercado_libre(self):
        self.assertIn("Ver en Mercado Libre", self.comp)
        self.assertIn("pulgar.webp", self.comp)  # Don Ofertín
        self.assertIn('<Footer brand="ofertas" sinCupones />', self.comp)  # sin el link a cupones del footer


if __name__ == "__main__":
    unittest.main()
