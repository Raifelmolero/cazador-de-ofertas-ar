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
            "black-friday-lavarropas",
            "black-friday-cafeteras",
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

    def test_boton_principal_con_link_de_afiliado(self):
        # El botón grande de arriba abre el link del recomendado (no la búsqueda) y
        # productosBF descarta los productos sin link de afiliado.
        self.assertRegex(self.comp, r"href=\{principal\.url\}[\s\S]{0,800}Ver en Mercado Libre")
        self.assertIn("esLinkAfiliado(p ? p.url_producto : a?.url)", self.src)
        self.assertIn("'37267219'", self.src)


class TestLavarropasCafeterasBF(unittest.TestCase):
    """/mejores/black-friday-lavarropas y -cafeteras (SEO quick wins del 24/11/2026):
    reciben el 308 de su /mejores/cyber-monday-* y están en sitemap, llms.txt y /black-friday."""

    SLUGS = ("black-friday-lavarropas", "black-friday-cafeteras")

    @classmethod
    def setUpClass(cls):
        cls.bloques = _bloques(LANDINGS.read_text(encoding="utf-8"))
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_estan_y_son_del_rubro(self):
        palabra = {"black-friday-lavarropas": r"(?i)lava(seca)?rropas", "black-friday-cafeteras": r"(?i)cafetera"}
        for slug in self.SLUGS:
            self.assertIn(slug, self.bloques)
            for i in re.findall(r"id: '(MLA\d+)'", self.bloques[slug]):
                p = self.catalogo.get(i)
                if p:  # el bot poda a los 14 días: la página saltea los que ya no están
                    self.assertRegex(p["titulo"], palabra[slug], i)

    def test_titulos_60_y_descripcion_158(self):
        for slug in self.SLUGS + ("black-friday-aires-acondicionados", "black-friday-smart-tv"):
            b = self.bloques[slug]
            self.assertLessEqual(len(re.search(r"titulo: '([^']+)'", b).group(1)), 60, slug)
            self.assertLessEqual(len(re.search(r"descripcion:\s*'([^']+)'", b).group(1)), 158, slug)

    def test_redirects_cyber_a_su_landing(self):
        conf = (FRONT / "next.config.mjs").read_text(encoding="utf-8")
        rubros = re.search(r"const rubrosBF = \[([^\]]+)\]", conf).group(1)
        for r in ("aires-acondicionados", "lavarropas", "cafeteras"):
            self.assertIn(f"'{r}'", rubros)
        self.assertIn("[`/mejores/cyber-monday-${r}`, `/mejores/black-friday-${r}`]", conf)

    def test_sitemap_llms_y_black_friday(self):
        comp = (FRONT / "lib" / "comparativas.ts").read_text(encoding="utf-8")
        perennes = comp.split("const PERENNES")[1].split("])")[0]
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        for slug in self.SLUGS:
            self.assertIn(f"slug: '{slug}'", comp)  # generateStaticParams, sitemap y OG
            self.assertIn(f"'{slug}'", perennes)
            self.assertIn(f"/mejores/{slug})", llms)
        self.assertIn("LANDINGS_BF.map", (FRONT / "app" / "black-friday" / "page.tsx").read_text(encoding="utf-8"))

    def test_guia_de_lavarropas_ida_y_vuelta(self):
        self.assertIn("/guias/mejores-lavarropas-black-friday-2026", self.bloques["black-friday-lavarropas"])
        guia = (FRONT / "lib" / "guias-tecno.ts").read_text(encoding="utf-8")
        self.assertIn("href: '/mejores/black-friday-lavarropas'", guia)


class TestBicicletasBF(unittest.TestCase):
    """Landing corta /mejores/black-friday-bicicletas (pedido del 23/11/2026)."""

    @classmethod
    def setUpClass(cls):
        cls.bloques = _bloques(LANDINGS.read_text(encoding="utf-8"))
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_battle_primera_y_todas_r29(self):
        b = self.bloques["black-friday-bicicletas"]
        ids = re.findall(r"id: '(MLA\d+)'", b)
        self.assertEqual(ids[0], "MLA53194352")
        for i in ids:
            p = self.catalogo.get(i)
            if p:
                self.assertRegex(p["titulo"], r"(?i)\b(r29|rodado 29)\b", i)
                self.assertIn("bicicleta", p["titulo"].lower(), i)

    def test_titulo_60_y_en_comparativas(self):
        b = self.bloques["black-friday-bicicletas"]
        self.assertLessEqual(len(re.search(r"titulo: '([^']+)'", b).group(1)), 60)
        comp = (FRONT / "lib" / "comparativas.ts").read_text(encoding="utf-8")
        self.assertIn("slug: 'black-friday-bicicletas'", comp)  # generateStaticParams, sitemap y OG
        self.assertIn("'black-friday-bicicletas'", comp.split("const PERENNES")[1].split("])")[0])

    def test_enlazada_desde_black_friday(self):
        # /black-friday arma los botones por rubro con LANDINGS_BF.
        self.assertIn("LANDINGS_BF.map", (FRONT / "app" / "black-friday" / "page.tsx").read_text(encoding="utf-8"))


class TestGuiasBF2026(unittest.TestCase):
    """Guías «Qué notebook / qué TV de 50 pulgadas comprar en Black Friday 2026»."""

    @classmethod
    def setUpClass(cls):
        cls.src = (FRONT / "lib" / "guias-bf-2026.ts").read_text(encoding="utf-8")
        cls.comp = (FRONT / "components" / "black-friday" / "GuiaBF.tsx").read_text(encoding="utf-8")
        cls.guias = {}
        for parte in re.split(r"\n  \{\n    slug: '", cls.src)[1:]:
            cls.guias[parte.split("'", 1)[0]] = parte
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_estan_las_dos_y_su_recomendada_primero(self):
        nb = self.guias["que-notebook-comprar-black-friday-2026"]
        tv = self.guias["que-tv-50-pulgadas-comprar-black-friday-2026"]
        self.assertEqual(re.findall(r"id: '(MLAU?\d+)'", nb)[0], "MLA77766168")
        self.assertEqual(re.findall(r"id: '(MLAU?\d+)'", tv)[0], "MLA53221633")
        p = self.catalogo.get("MLA53221633")
        if p:
            self.assertIn("dv50x8580", p["titulo"].lower())
        for g in (nb, tv):
            self.assertIn("/mejores/black-friday-notebooks", g)
            self.assertIn("/mejores/black-friday-smart-tv", g)

    def test_productos_del_repo_sin_marcas_prohibidas(self):
        for slug, b in self.guias.items():
            for i in re.findall(r"id: '(MLAU?\d+)'", b):
                p = self.catalogo.get(i)
                if p is None:
                    continue  # el bot poda a los 14 días: la página lo saltea
                self.assertNotRegex(p["titulo"], PROHIBIDAS, f"{slug}: {i}")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
        self.assertNotRegex(re.sub(r"//.*", "", self.src), PROHIBIDAS)

    def test_seo_y_respuesta_directa(self):
        for slug, b in self.guias.items():
            self.assertLessEqual(len(re.search(r"seoTitulo: '([^']+)'", b).group(1)), 60, slug)
            self.assertLessEqual(len(re.search(r"seoDescripcion:\s*'([^']+)'", b).group(1)), 158, slug)
            self.assertIn("respuestaCorta", b)
            self.assertIn("faq:", b)

    def test_sin_descuentos_tachados_minimos_ni_cupones(self):
        texto = re.sub(r"//.*", "", (self.src + self.comp).lower())
        for prohibido in ("% off", "descuento", "precio_anterior", "line-through", "minimo_historico",
                          "mínimo histórico", "minimo historico", "cupón", "cupones de", "cupones-mercado-libre"):
            self.assertNotIn(prohibido, texto, prohibido)
        self.assertNotRegex(texto, r"\d+\s*%")
        self.assertIn('<Footer brand="ofertas" sinCupones />', self.comp)

    def test_en_guias_sitemap_y_llms(self):
        guias = (FRONT / "lib" / "guias.ts").read_text(encoding="utf-8")
        self.assertIn("...GUIAS_BF_2026", guias)
        self.assertIn("GUIAS.filter(guiaIndexable)", (FRONT / "app" / "sitemap.ts").read_text(encoding="utf-8"))
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        for slug in self.guias:
            self.assertIn("/guias/" + slug + ")", llms)
        self.assertIn("/mejores/black-friday-bicicletas)", llms)
        pagina = (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("if (g.bf) return <GuiaBFPage g={g} />", pagina)


class TestAvisoBFCalculadora(unittest.TestCase):
    """Bloque amarillo arriba de la calculadora (calculadoraml.com.ar, etiqueta calcml)."""

    def test_bloque(self):
        comp = (FRONT / "components" / "AvisoBFCalculadora.tsx").read_text(encoding="utf-8")
        self.assertIn("#FACC15", comp)
        self.assertIn("text-black", comp)
        for ruta in ("/black-friday", "/mejores/black-friday-notebooks", "/mejores/black-friday-smart-tv"):
            self.assertIn(ruta, comp)
        self.assertIn("avisoBFVigente()", comp)
        self.assertIn("SoloHastaFinBF", comp)
        self.assertNotRegex(re.sub(r"//.*", "", comp), r"\d+\s*%|cup[oó]n|m[ií]nimo hist")

    def test_en_las_paginas_de_la_calculadora(self):
        self.assertIn("<AvisoBFCalculadora />", (FRONT / "components" / "CalcHeader.tsx").read_text(encoding="utf-8"))
        self.assertIn("<AvisoBFCalculadora />", (FRONT / "app" / "calculadora" / "[id]" / "page.tsx").read_text(encoding="utf-8"))
        for f in ("app/page.tsx", "app/calculadora/page.tsx", "app/calculadora-de-comisiones/page.tsx"):
            self.assertIn("<CalcHeader />", (FRONT / f).read_text(encoding="utf-8"), f)


class TestAvisoBFRubro(unittest.TestCase):
    """Bloque «Black Friday 27/11: lo que conviene» en 10 páginas (lib/bf-enlaces.ts)."""

    @classmethod
    def setUpClass(cls):
        cls.src = (FRONT / "lib" / "bf-enlaces.ts").read_text(encoding="utf-8")
        cls.comp = (FRONT / "components" / "AvisoBFRubro.tsx").read_text(encoding="utf-8")
        cls.rutas = dict(re.findall(r"'(/(?:mejor|mejores|guias|precio-hoy)/[a-z0-9-]+)': (\w+)", cls.src))

    def test_diez_paginas_de_los_cuatro_rubros(self):
        self.assertEqual(len(self.rutas), 10)
        self.assertEqual(set(self.rutas.values()), {"NOTEBOOKS", "CELULARES", "TV", "AIRES"})
        landings = LANDINGS.read_text(encoding="utf-8")
        for slug in re.findall(r"slug: '(black-friday-[a-z-]+)'", self.src):
            self.assertIn(f"slug: '{slug}'", landings)

    def test_se_apaga_despues_del_30_11(self):
        self.assertIn("FIN_AVISO_BF = '2026-12-01T00:00:00-03:00'", self.src)
        self.assertIn("avisoBFVigente()", self.comp)
        self.assertIn("SoloHastaFinBF", self.comp)

    def test_texto_y_colores(self):
        self.assertIn("Black Friday 27/11: lo que conviene", self.comp)
        self.assertIn("#FACC15", self.comp)
        self.assertIn("text-black", self.comp)
        # Los comentarios explican la regla: se miran solo los textos y el JSX.
        sin_comentarios = re.sub(r"//.*", "", self.src + self.comp)
        self.assertNotRegex(sin_comentarios, r"\d+\s*%|cup[oó]n|m[ií]nimo hist")

    def test_las_plantillas_lo_usan(self):
        for f in ("app/mejores/[slug]/page.tsx", "app/precio-hoy/[slug]/page.tsx",
                  "app/guias/[slug]/page.tsx", "app/mejor/aires-acondicionados/page.tsx"):
            self.assertIn("<AvisoBFRubro ruta=", (FRONT / f).read_text(encoding="utf-8"), f)


if __name__ == "__main__":
    unittest.main()
