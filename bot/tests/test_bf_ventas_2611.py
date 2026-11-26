"""Lote bf-ventas-2611 (26/11/2026, víspera del Black Friday).

- Publicaciones alternativas del MISMO modelo (PUBLICACIONES_ALTERNATIVAS): si la elegida quedó con
  el precio visto hace más de 7 días, landings, guías y cuadros muestran otra con precio reciente.
- Cuadros de arriba (/black-friday y /mejores/black-friday-*): con precio primero.
- Marcas excluidas también en los cuadros: Omnibook y Vivobook.
- La calculadora manda al sitio de ofertas con ?utm_source=calcml (solo analytics); los clics a ML
  de esa visita salen con `sitio`, no con calcml.
- 3 guías nuevas (heladera y colchón de Black Friday, regalo de Navidad para hombre) registradas.
"""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
CATALOGO = FRONT / "data" / "productos_rentables.json"
TS = FRONT / "node_modules" / "typescript"
EXCLUIDAS = re.compile(r"\b(bgh|hp|omen|victus|omnibook|vivobook|likon)\b", re.I)
SIN_DESCUENTOS = re.compile(r"\d+\s*%|tachad|m[ií]nimo hist|cup[oó]n|\bestaba\b", re.I)
GUIAS_NUEVAS = {
    "que-heladera-comprar-black-friday-2026": "black-friday-heladeras",
    "que-colchon-comprar-black-friday-2026": "black-friday-colchones",
    "que-regalarle-a-un-hombre-en-navidad": "black-friday-herramientas",
}


def _leer(rel: str) -> str:
    return (FRONT / rel).read_text(encoding="utf-8")


def _sin_comentarios(src: str) -> str:
    return re.sub(r"//.*", "", re.sub(r"\{/\*.*?\*/\}", "", src, flags=re.S))


class TestAlternativas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = _leer("lib/black-friday-landings.ts")
        cls.catalogo = {p["id_ml"]: p for p in json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]}
        cuerpo = cls.src.split("export const PUBLICACIONES_ALTERNATIVAS")[1].split("\n}\n")[0]
        cls.mapa = {}
        for linea in cuerpo.splitlines():
            m = re.match(r"\s*(MLA\d+): \[(.*)\],", linea)
            if m:
                cls.mapa[m.group(1)] = re.findall(r"id: '(MLA\d+)'", m.group(2))

    def test_mismo_modelo_del_catalogo_y_sin_marcas_excluidas(self):
        self.assertGreaterEqual(len(self.mapa), 3)
        # Palabras del modelo que tienen que estar en las dos publicaciones.
        modelo = {"MLA77766168": ("ideapad slim 3", "ryzen 5", "16", "512"), "MLA72201400": ("v15", "i5", "16", "512"),
                  "MLA1040287808": ("iphone 16", "128")}
        for principal, alts in self.mapa.items():
            for alt in alts:
                p = self.catalogo.get(alt)
                if p is None:
                    continue  # el bot poda a los 14 días: la página la saltea
                self.assertNotRegex(p["titulo"], EXCLUIDAS, alt)
                self.assertIn("matt_tool=37267219", p["url_producto"], alt)
                for palabra in modelo.get(principal, ()):
                    self.assertIn(palabra, p["titulo"].lower(), f"{principal} → {alt}")

    def test_se_usa_solo_si_la_elegida_no_tiene_precio(self):
        self.assertIn("precioMostrable(p.precio_actual, p.precio_visto, hoy) === null", self.src)
        self.assertIn("const alt = alternativaVigente(it, hoy)", self.src)
        self.assertIn("if (precio === null) continue", self.src)

    def test_marcas_excluidas_tambien_omnibook(self):
        self.assertIn("omnibook|vivobook|likon", self.src)
        cta = _leer("lib/cta-destacados.ts")
        self.assertRegex(cta, r"MARCAS_EXCLUIDAS_CTA = /\\b\([^)]*omnibook\|vivobook\)")


class TestCuadrosConPrecioPrimero(unittest.TestCase):
    def test_cuadros(self):
        cta = _leer("lib/cta-destacados.ts")
        self.assertIn("export function conPrecioPrimero", cta)
        self.assertIn("conPrecioPrimero(productos.filter(p => !excluidoDeCta(p))).slice(0, MAX_DESTACADOS)", cta)
        self.assertIn("conPrecioPrimero(productosDeItems(def.items, hoy)", cta)
        bloque = cta.split("'/black-friday': {")[1].split("\n  },")[0]
        self.assertNotRegex(_sin_comentarios(bloque), SIN_DESCUENTOS)
        self.assertNotRegex(re.sub(r"//.*", "", bloque), EXCLUIDAS)


class TestCalculadoraConUtm(unittest.TestCase):
    def test_links_de_la_calculadora_al_sitio_de_ofertas(self):
        aviso = _leer("components/AvisoBFCalculadora.tsx")
        self.assertIn("desdeCalculadora(`${DEALS_URL}/black-friday`)", aviso)
        self.assertEqual(aviso.count("desdeCalculadora(`${DEALS_URL}/mejores/black-friday-"), 4)
        self.assertNotIn("href={`${DEALS_URL}", aviso)
        calc = _leer("lib/calc-ofertas.ts")
        self.assertIn("href: desdeCalculadora(v.href)", calc)
        self.assertIn("desdeCalculadora(`${DEALS_URL}${esNotebook ?", calc)
        # La de consumo eléctrico vive en el sitio de ofertas: sin utm de la calculadora.
        consumo = calc.split("export function ctaConsumo")[1]
        self.assertNotIn("desdeCalculadora", consumo)

    def test_visita_con_utm_calcml_sale_con_sitio(self):
        # 26/11 tarde: calcml no convierte; el utm queda solo para analytics.
        clics = _leer("app/clics-ml.tsx")
        self.assertIn("new Set([ETIQUETA_META, ...ETIQUETAS_REDES])", clics)
        self.assertNotIn("UTM_CALC", clics)
        self.assertNotIn("etiquetaDeOrigen", clics)

    @unittest.skipUnless(shutil.which("node") and TS.exists(), "hace falta node y frontend/node_modules")
    def test_desde_calculadora_en_node(self):
        js = r"""
const ts = require(process.argv[1]);
const src = require('fs').readFileSync(process.argv[2], 'utf8');
const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', 'require', 'process', out)(m, m.exports, require, { env: {} });
const f = m.exports.desdeCalculadora;
process.stdout.write(JSON.stringify([
  f('https://cazadordeofertas.com.ar/black-friday'),
  f('https://cazadordeofertas.com.ar/hoy?x=1'),
  f('https://cazadordeofertas.com.ar/black-friday#rubros-bf'),
  m.exports.UTM_CALC,
]));
"""
        out = subprocess.run(["node", "-e", js, str(TS), str(FRONT / "lib" / "afiliado.ts")],
                             capture_output=True, text=True, check=True, timeout=60).stdout
        a, b, c, utm = json.loads(out)
        self.assertEqual(utm, "calcml")
        self.assertEqual(a, "https://cazadordeofertas.com.ar/black-friday?utm_source=calcml&utm_medium=calculadora")
        self.assertEqual(b, "https://cazadordeofertas.com.ar/hoy?x=1&utm_source=calcml&utm_medium=calculadora")
        self.assertEqual(c, "https://cazadordeofertas.com.ar/black-friday?utm_source=calcml&utm_medium=calculadora#rubros-bf")


class TestGuiasNuevas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = _leer("lib/guias-bf-2026.ts")
        cls.landings = _leer("lib/black-friday-landings.ts")
        cls.catalogo = {p["id_ml"]: p for p in json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]}
        cls.guias = {}
        for parte in re.split(r"\n  \{\n    slug: '", cls.src)[1:]:
            cls.guias[parte.split("'", 1)[0]] = parte.split("\n  },\n")[0]

    def test_registradas_y_con_su_landing(self):
        mapa = _leer("lib/bf-guias.ts")
        llms = _leer("app/llms.txt/route.ts")
        for slug, landing in GUIAS_NUEVAS.items():
            self.assertIn(slug, self.guias)
            self.assertIn(f"'{slug}': '{landing}'", mapa)
            self.assertIn(f"landing: '{landing}'", self.guias[slug])
            self.assertIn(f"/guias/{slug})", llms)
            self.assertIn(f"href: '/guias/{slug}'", self.landings)  # ida y vuelta
            self.assertIn(f"'{slug}'", self.src.split("PUBLICADAS_26_11")[1])

    def test_productos_reales_y_copy(self):
        for slug in GUIAS_NUEVAS:
            b = self.guias[slug]
            ids = re.findall(r"id: '(MLAU?\d+)'", b)
            self.assertGreaterEqual(len(ids), 5, slug)
            for i in ids:
                p = self.catalogo.get(i)
                if p is None:
                    continue  # el bot poda a los 14 días
                self.assertNotRegex(p["titulo"], EXCLUIDAS, f"{slug}: {i}")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
            self.assertNotRegex(_sin_comentarios(b), EXCLUIDAS, slug)
            self.assertNotRegex(_sin_comentarios(b), SIN_DESCUENTOS, slug)
            self.assertNotRegex(b, r"\$\s*\d", slug)  # precios solo desde el catálogo

    def test_no_duplican_slugs(self):
        todas = "".join(_leer(f"lib/{f}") for f in ("guias.ts", "guias-long-tail.ts", "guias-tecno.ts",
                                                     "guias-bf-2026.ts", "guias-ticket-alto.ts", "guias-equipos.ts"))
        for slug in GUIAS_NUEVAS:
            self.assertEqual(todas.count(f"slug: '{slug}'"), 1, slug)


if __name__ == "__main__":
    unittest.main()
