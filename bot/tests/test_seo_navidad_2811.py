"""SEO de /precio y /regalos-navidad (28/11, marketingskills: titles, schema, enlazado interno)."""
import re
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"


def leer(*partes: str) -> str:
    return (FRONT.joinpath(*partes)).read_text(encoding="utf-8")


class SeoNavidad2811(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.hub = leer("app/regalos-navidad/page.tsx")
        cls.rango = leer("app/regalos-navidad/[presupuesto]/page.tsx")
        cls.precio = leer("app/precio/page.tsx")
        cls.ficha = leer("app/precio/[slug]/page.tsx")
        cls.seo = leer("lib/seo.ts")
        cls.sitemap = leer("app/sitemap.ts")

    def test_helper_no_manda_itemlist_a_ml(self):
        self.assertIn("export function urlInternaPrecio", self.seo)
        self.assertIn("urlInternaPrecio(p.id_ml, historial, URL)", self.hub)
        self.assertIn("urlInternaPrecio(p.id_ml, historial, url)", self.rango)
        self.assertNotRegex(self.hub, r"ItemList[\s\S]{0,400}url: p\.url_producto")
        self.assertNotRegex(self.rango, r"ItemList[\s\S]{0,400}url: p\.url_producto")

    def test_hub_title_y_enlaces_a_guias(self):
        self.assertIn("Regalos de Navidad ${AÑO} en oferta, por presupuesto", self.hub)
        self.assertIn("árboles y combos", self.hub)
        self.assertIn("/guias/que-regalar-en-navidad-segun-presupuesto", self.hub)
        self.assertIn("/guias/que-regalarle-a-un-chico-en-navidad", self.hub)
        self.assertIn('href="/precio"', self.hub)
        self.assertIn("¿Tienen árboles de Navidad", self.hub)
        self.assertIn("¿Qué regalar en Navidad 2026?", self.hub)

    def test_indice_precio_ctr_y_navidad(self):
        self.assertIn("¿el descuento es real?", self.precio)
        self.assertIn("/regalos-navidad", self.precio)
        self.assertIn("arbol-navidad-frondoso-1-80-mt-854-puntas-pe-mla80722855", self.precio)
        self.assertIn("Historial de precios de Mercado Libre", self.precio)
        self.assertNotRegex(self.precio, r"Vivobook|OMEN|Victus|\\bBGH\\b|\\bLikon\\b")

    def test_ficha_breadcrumb_al_indice(self):
        self.assertIn('href="/precio"', self.ficha)
        self.assertIn("${DEALS_URL}/precio", self.ficha)
        self.assertIn("/regalos-navidad", self.ficha)
        self.assertIn("enlaceNavidadVigente", self.ficha)

    def test_sitemap_precio_prioridad(self):
        self.assertRegex(self.sitemap, r"/precio`[^}]+priority: 0\.8")


if __name__ == "__main__":
    unittest.main()
