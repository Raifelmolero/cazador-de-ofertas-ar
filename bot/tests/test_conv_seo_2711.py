"""conv-seo-2711 (27/11/2026): bloque post-resultado de las calculadoras y barrido de etiqueta `sitio`.

Fija:
- el bloque post-resultado de la calculadora lleva enlaces internos al sitio de ofertas
  (/mejores, /hoy, /regalos-navidad) con el utm de la calculadora y NUNCA a listados de ML con calcml;
- el resultado de la cuenta sigue primero (el bloque va después del componente de cálculo);
- los clics y links visibles dentro del sitio de ofertas salen con `sitio` (barrido + evento);
- sin marcas excluidas, % de descuento, tachados, «mínimo histórico» ni cupones en el copy nuevo.
"""
import re
import unittest
from pathlib import Path

FRONT = Path(__file__).resolve().parents[2] / "frontend"
LIB = FRONT / "lib" / "calc-ofertas.ts"
COMP = FRONT / "components" / "CtaOfertaDestacada.tsx"
CLICS = FRONT / "app" / "clics-ml.tsx"
SIN_DESCUENTOS = r"\d+\s*%|cup[oó]n|m[ií]nimo hist|line-through|tachad|precio_anterior|descuento|Estaba"
EXCLUIDAS = r"\b(bgh|hp|omen|victus|omnibook|vivobook|likon)\b"


def _sc(src: str) -> str:
    return re.sub(r"//.*", "", re.sub(r"\{/\*.*?\*/\}|/\*.*?\*/", "", src, flags=re.S))


class TestBloquePostResultado(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lib = _sc(LIB.read_text(encoding="utf-8"))
        cls.comp = _sc(COMP.read_text(encoding="utf-8"))

    def test_enlaces_internos_al_sitio_de_ofertas(self):
        bloque = re.search(r"ENLACES_CALCULADORA[^=]*= \[(.*?)\n\]", self.lib, re.S).group(1)
        for ruta in ("/mejores`", "/hoy`", "/regalos-navidad`"):
            self.assertIn("${DEALS_URL}" + ruta, bloque)
        self.assertNotIn("mercadolibre", bloque)
        self.assertNotIn("matt_word", bloque)
        # el utm de origen se agrega al armar el cuadro de las calculadoras (no el de consumo)
        self.assertIn("ENLACES_CALCULADORA.map(e => ({ ...e, href: desdeCalculadora(e.href) }))", self.lib)
        consumo = self.lib.split("export function ctaConsumo")[1]
        self.assertNotIn("ENLACES_CALCULADORA", consumo)

    def test_componente_pinta_los_enlaces_como_links_internos(self):
        self.assertIn("cta.enlaces", self.comp)
        nav = self.comp.split('aria-label="Seguí mirando"')[1].split("</nav>")[0]
        self.assertNotIn("sponsored", nav)
        self.assertNotIn("target=", nav)

    def test_resultado_primero_en_todas_las_calculadoras(self):
        paginas = {
            "app/calculadora-de-comisiones/page.tsx": "<CalculadoraComisiones",
            "app/calculadora-precio-de-venta/page.tsx": "<CalculadoraPrecioVenta",
            "app/calculadora-envio-gratis/page.tsx": "<CalculadoraEnvioGratis",
            "app/calculadora-cuotas-sin-interes/page.tsx": "<CalculadoraCuotas",
            "app/calculadora/[id]/page.tsx": "<ProfitCalculator",
        }
        for rel, calc in paginas.items():
            src = _sc((FRONT / rel).read_text(encoding="utf-8"))
            self.assertLess(src.index(calc), src.index("<CtaOfertaDestacada"), rel)
            self.assertIn("ctaCalculadora()", src, rel)

    def test_sin_listados_de_ml_con_calcml(self):
        for src in (self.lib, self.comp):
            self.assertNotIn("busquedaML", src)
            self.assertNotIn("listado.mercadolibre", src)
            self.assertNotIn("matt_word=calcml", src)

    def test_copy_nuevo_limpio_y_sin_marcas_excluidas(self):
        for src in (self.lib, self.comp):
            self.assertNotRegex(src, SIN_DESCUENTOS)
        textos = re.findall(r"texto: '([^']+)'", self.lib)
        self.assertGreaterEqual(len(textos), 5)
        for t in textos:
            self.assertNotRegex(t, re.compile(EXCLUIDAS, re.I), t)
        self.assertNotRegex(self.comp, re.compile(EXCLUIDAS, re.I))


class TestEtiquetaSitio(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = _sc(CLICS.read_text(encoding="utf-8"))

    def test_barrido_de_links_visibles_a_sitio(self):
        self.assertIn('a[href*="matt_word="]', self.src)
        self.assertIn("aEtiquetaSitio(a.href, etiqueta)", self.src)
        self.assertIn("new MutationObserver", self.src)
        self.assertIn("mo.disconnect()", self.src)
        # el barrido no mira atributos (evita bucles) y el evento de clic sigue activo
        self.assertNotIn("attributes: true", self.src)
        self.assertIn("document.addEventListener(ev, marcarSitio", self.src)

    def test_sitio_por_defecto_y_calc_solo_en_su_host(self):
        self.assertIn("CALCULADORA.test(window.location.hostname) ? ETIQUETA_CALC : ETIQUETA_SITIO", self.src)
        self.assertNotIn("UTM_CALC", self.src)


if __name__ == "__main__":
    unittest.main()
