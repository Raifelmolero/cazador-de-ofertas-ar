"""Fuga calcml (25/11/2026): 791 clics y 0 ventas por semana desde calculadoraml.com.ar.

Causa: el botón grande de las calculadoras de vendedores iba a mercadolibre.com.ar/ofertas
(un listado, no un producto) y el bloque BF de debajo no mostraba precio. Ahora las
calculadoras usan el mismo cuadro de oferta destacada que las páginas que venden
(components/CtaOfertaDestacada): producto concreto, precio vigente y link de afiliado del
catálogo. La etiqueta calcml la sigue poniendo app/clics-ml.tsx.

Fija:
- ninguna calculadora manda a un listado/búsqueda de ML;
- el cuadro sale de lib/calc-ofertas.ts y está debajo del resultado;
- productos reales del catálogo, con link /p/MLA de afiliado, foto y precio visto hace <= 7 días;
- sin BGH, HP, OMEN, Victus, Omnibook, Vivobook, Likon ni el Noblex de $634.500;
- sin %, tachados, «mínimo histórico» ni cupones;
- (26/11 tarde) el cuadro de las calculadoras va a páginas internas, no a ML; calcml no se propaga al sitio.
"""
import datetime
import json
import re
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
LIB = FRONT / "lib" / "calc-ofertas.ts"
COMP = FRONT / "components" / "CtaOfertaDestacada.tsx"
LANDINGS = FRONT / "lib" / "black-friday-landings.ts"
CATALOGO = FRONT / "data" / "productos_rentables.json"
CLICS = FRONT / "app" / "clics-ml.tsx"

EXCLUIDAS = re.compile(r"\b(bgh|hp|omen|victus|omnibook|vivobook|likon)\b", re.I)
LIKON_ID = "MLA80862058"
DIAS_PRECIO_VIEJO = 7
SIN_DESCUENTOS = r"\d+\s*%|cup[oó]n|m[ií]nimo hist|line-through|tachad|precio_anterior|descuento|Estaba"

CALCULADORAS = (
    "app/calculadora-de-comisiones/page.tsx",
    "app/calculadora-precio-de-venta/page.tsx",
    "app/calculadora-envio-gratis/page.tsx",
    "app/calculadora-cuotas-sin-interes/page.tsx",
)
# (archivo, componente de la calculadora que tiene que ir antes del cuadro)
DEBAJO_DE = {
    "app/calculadora-de-comisiones/page.tsx": "<CalculadoraComisiones",
    "app/calculadora-precio-de-venta/page.tsx": "<CalculadoraPrecioVenta",
    "app/calculadora-envio-gratis/page.tsx": "<CalculadoraEnvioGratis",
    "app/calculadora-cuotas-sin-interes/page.tsx": "<CalculadoraCuotas",
    "app/calculadora/[id]/page.tsx": "<ProfitCalculator",
}


def _leer(rel: str) -> str:
    return (FRONT / rel).read_text(encoding="utf-8")


def _sin_comentarios(src: str) -> str:
    return re.sub(r"//.*", "", re.sub(r"\{/\*.*?\*/\}", "", src, flags=re.S))


def _bloques() -> dict:
    src = LANDINGS.read_text(encoding="utf-8")
    out = {}
    marcas = list(re.finditer(r"slug: '(black-friday-[a-z-]+)'", src))
    for i, m in enumerate(marcas):
        fin = marcas[i + 1].start() if i + 1 < len(marcas) else len(src)
        out[m.group(1)] = src[m.end():fin]
    return out


def _rubros(lib: str, nombre: str) -> list:
    cuerpo = re.search(nombre + r" = \[([^\]]+)\]", lib).group(1)
    return re.findall(r"'(black-friday-[a-z-]+)'", cuerpo)


class TestSinListados(unittest.TestCase):
    def test_calculadoras_sin_listado_ni_busqueda_de_ml(self):
        for f in CALCULADORAS + ("app/calculadora/[id]/page.tsx", "app/page.tsx"):
            src = _sin_comentarios(_leer(f))
            self.assertNotIn("ML_OFERTAS", src, f)
            self.assertNotIn("busquedaML", src, f)
            self.assertNotIn("mercadolibre.com.ar/ofertas", src, f)
            self.assertNotIn("listado.mercadolibre", src, f)
        self.assertFalse((FRONT / "lib" / "ctacalc.ts").exists())
        self.assertFalse((FRONT / "components" / "OfertasCalculadora.tsx").exists())

    def test_cuadro_destacado_debajo_de_cada_calculadora(self):
        for f, calc in DEBAJO_DE.items():
            src = _leer(f)
            self.assertIn("import CtaOfertaDestacada from '@/components/CtaOfertaDestacada'", src, f)
            self.assertIn("<CtaOfertaDestacada cta={ctaCalculadora()}", src, f)
            self.assertLess(src.index(calc), src.index("<CtaOfertaDestacada"), f)
        self.assertIn("<CtaOfertaDestacada cta={ctaCalculadora()}", _leer("app/page.tsx"))
        consumo = _leer("app/calculadora-consumo-electrico/page.tsx")
        self.assertIn("<CtaOfertaDestacada cta={ctaConsumo()}", consumo)
        self.assertLess(consumo.index("<CalculadoraConsumo"), consumo.index("<CtaOfertaDestacada"))

    def test_ficha_sin_boton_grande_a_la_publicacion_analizada(self):
        src = _leer("app/calculadora/[id]/page.tsx")
        i = src.index("href={sinAfiliado(producto.url_producto)}")
        self.assertNotIn("bg-yellow-400", src[i:i + 600])


class TestReglasDelCuadro(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lib = LIB.read_text(encoding="utf-8")
        cls.comp = COMP.read_text(encoding="utf-8")

    def test_precio_vigente_y_mismo_componente_que_sitio(self):
        # Solo productos con precio mostrable (visto hace <= 7 días): el cuadro siempre muestra precio.
        self.assertIn("x.precio !== null", self.lib)
        self.assertIn("productosBF(l, hoy)", self.lib)
        self.assertIn("{p.precio !== null && (", self.comp)
        self.assertIn("pesos(p.precio)", self.comp)

    def test_marcas_excluidas(self):
        for marca in ("bgh", "hp", "omen", "victus", "omnibook", "vivobook", "likon"):
            self.assertRegex(self.lib, r"MARCAS_EXCLUIDAS_CALC = /\\b\([^)]*\b" + marca + r"\b")
        self.assertIn("634_500", self.lib)
        self.assertIn("noblex", self.lib)
        self.assertIn("excluidoDeCta(p)", self.lib)

    def test_copy_sin_descuentos_ni_cupones(self):
        self.assertNotRegex(_sin_comentarios(self.comp), SIN_DESCUENTOS)
        navidad = (FRONT / "lib" / "navidad-post-bf.ts").read_text(encoding="utf-8").split("export function rutaVerMas")[1].split("\n}\n")[0]
        titulos = (
            re.findall(r"titulo: '([^']+)'", self.lib)
            + re.findall(r"texto: '([^']+)'", self.lib)
            + re.findall(r"texto: '([^']+)'", navidad)
        )
        self.assertGreaterEqual(len(titulos), 4)
        for t in titulos:
            self.assertNotRegex(t, SIN_DESCUENTOS, t)

    def test_cuadro_de_la_calculadora_no_manda_a_ml(self):
        # 26/11: calcml = 68 % de los clics y 0 ventas. El cuadro de las calculadoras va a páginas
        # internas del sitio de ofertas; el de `sitio` / consumo sigue yendo a la publicación de ML.
        lib = _sin_comentarios(self.lib)
        self.assertIn("evento: 'calcml_oferta_boton'", self.lib)
        self.assertNotIn("matt_word", lib)
        self.assertNotIn("p.url", lib)
        # 27/11: el destino sale de la agenda por fecha (lib/navidad-post-bf), no queda fijo en BF:
        # lo que pasa en cada fecha lo prueba test_navidad_post_bf.py en node.
        self.assertIn("rutaDestinoCalculadora(esNotebook)", lib)
        self.assertIn("rutaVerMas()", lib)
        self.assertNotIn("/black-friday'", lib)
        self.assertNotIn("/mejores/black-friday-notebooks", lib)
        self.assertIn("destinoCalculadora,", lib)
        ctaconsumo = lib.split("export function ctaConsumo")[1]
        self.assertNotIn("destinoCalculadora", ctaconsumo)
        self.assertIn("cta.destinoInterno ? (", self.comp)
        # Rama por defecto (sitio): sigue yendo a la publicación con link de afiliado.
        self.assertIn("href={p.url}", self.comp)
        self.assertIn('rel="sponsored nofollow noopener"', self.comp)
        self.assertIn("data-evento={cta.evento}", self.comp)

    def test_links_chicos_de_analisis_sin_afiliado(self):
        for f in ("components/ProductCard.tsx", "app/calculadora/[id]/page.tsx"):
            src = _leer(f)
            self.assertIn("href={sinAfiliado(producto.url_producto)}", src, f)
            self.assertNotIn("href={producto.url_producto}", src, f)
            self.assertNotIn("sponsored", _sin_comentarios(src), f)
        afiliado = _leer("lib/afiliado.ts")
        self.assertIn("searchParams.delete('matt_word')", afiliado)
        self.assertIn("searchParams.delete('matt_tool')", afiliado)

    def test_clics_ml_no_reescribe_a_calcml_en_el_sitio_de_ofertas(self):
        clics = _sin_comentarios(CLICS.read_text(encoding="utf-8"))
        self.assertNotIn("UTM_CALC", clics)
        self.assertNotIn("etiquetaDeOrigen", clics)
        self.assertIn("new Set([ETIQUETA_META, ...ETIQUETAS_REDES])", clics)
        # calcml solo en el hostname de la calculadora (sin links de afiliado salientes)
        self.assertIn("CALCULADORA.test(window.location.hostname) ? ETIQUETA_CALC : ETIQUETA_SITIO", clics)


class TestProductosReales(unittest.TestCase):
    """Simula lib/calc-ofertas.ts con los datos del repo (hoy = el precio visto más nuevo del catálogo)."""

    @classmethod
    def setUpClass(cls):
        cls.lib = LIB.read_text(encoding="utf-8")
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}
        cls.hoy = max(datetime.date.fromisoformat(p["precio_visto"][:10]) for p in items if p.get("precio_visto"))
        cls.bloques = _bloques()

    def _elegidos(self, rubros, filtro=lambda p, nombre: True, maximo=3):
        out = []
        for slug in rubros:
            self.assertIn(slug, self.bloques, slug)
            for i, nombre, detalle in re.findall(r"id: '(MLA\d+)', nombre: '([^']+)'(?:, detalle: '([^']*)')?", self.bloques[slug]):
                p = self.catalogo.get(i)
                if not p or not p.get("url_imagen") or i == LIKON_ID or i in {x["id_ml"] for x in out}:
                    continue
                if EXCLUIDAS.search(p["titulo"]) or EXCLUIDAS.search(nombre):
                    continue
                if "noblex" in nombre.lower() and p["precio_actual"] == 634500:
                    continue
                visto = p.get("precio_visto")
                if not visto or (self.hoy - datetime.date.fromisoformat(visto[:10])).days > DIAS_PRECIO_VIEJO:
                    continue
                if not filtro(p, nombre + " " + detalle):
                    continue
                out.append(p)
                break
            if len(out) >= maximo:
                break
        return out

    def _verificar(self, elegidos):
        self.assertEqual(len(elegidos), 3)
        for p in elegidos:
            url = p["url_producto"]
            self.assertRegex(url, r"^https://www\.mercadolibre\.com\.ar/.+/p/MLA\d+\?", p["id_ml"])
            self.assertIn("matt_tool=37267219", url)
            self.assertRegex(url, r"matt_word=[a-z]+")
            self.assertGreater(p["precio_actual"], 0)

    def test_calculadoras_3_productos_vigentes(self):
        self._verificar(self._elegidos(_rubros(self.lib, "RUBROS_CALC")))

    def test_consumo_3_equipos_de_bajo_consumo(self):
        bajo = re.compile(r"inverter|no ?frost|lavarropas|lavasecarropas|ecobubble|carga frontal|heladera|split", re.I)
        elegidos = self._elegidos(
            _rubros(self.lib, "RUBROS_CONSUMO"),
            filtro=lambda p, texto: bool(bajo.search(texto)),
        )
        self._verificar(elegidos)


if __name__ == "__main__":
    unittest.main()
