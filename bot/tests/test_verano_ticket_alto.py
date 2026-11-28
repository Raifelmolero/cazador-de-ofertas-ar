"""Expansión verano ticket alto (27/11/2026).

Las 5 comparativas de verano (/mejores/[slug], lib/verano-ticket-alto.ts) suman un cuadro amarillo
(#FACC15, components/CtaOfertaDestacada) arriba de todo, con producto concreto + precio + botón a la
ficha /precio/[slug] del sitio. Fija:
- las 5 landings existen en lib/comparativas.ts y no hay rutas nuevas bajo app/mejores/;
- sin BGH (ni las demás marcas de los cuadros) y sin usados;
- el botón va a /precio/..., nunca a un listado de ML ni a /ofertas;
- regla de /mejor: menos de 3 vigentes → se completa con «Último precio registrado»; menos de 3 → no se publica;
- los clics a ML desde el sitio salen con la etiqueta `sitio` (app/clics-ml.tsx); nada de calcml;
- enlaces internos desde las calculadoras de frigorías y consumo, /regalos-navidad y la home;
- title ≤ 60 y description sin precios; las 5 en el sitemap (indexables).
"""
import datetime
import json
import re
import unicodedata
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
VERANO = FRONT / "lib" / "verano-ticket-alto.ts"
CTA = FRONT / "lib" / "cta-destacados.ts"
COMP = FRONT / "components" / "CtaOfertaDestacada.tsx"
ENLACES = FRONT / "components" / "EnlacesVerano.tsx"
PAGINA = FRONT / "app" / "mejores" / "[slug]" / "page.tsx"
COMPARATIVAS = FRONT / "lib" / "comparativas.ts"
CONTENIDO = FRONT / "lib" / "comparativas-contenido.ts"
SITEMAP = FRONT / "app" / "sitemap.ts"
CLICS = FRONT / "app" / "clics-ml.tsx"
AFILIADO = FRONT / "lib" / "afiliado.ts"
SEGUIMIENTO_TS = FRONT / "lib" / "seguimiento.ts"
CATALOGO = FRONT / "data" / "productos_rentables.json"
SEGUIMIENTO = FRONT / "data" / "seguimiento.json"

ESPERADAS = [
    "mejores-aires-acondicionados",
    "mejores-heladeras",
    "mejores-colchones",
    "mejores-piletas",
    "mejores-muebles-de-jardin",
]
EXCLUIDAS = re.compile(r"\b(bgh|likon|hp|omen|victus|omnibook|vivobook)\b", re.I)
DIAS_PRECIO_VIEJO = 7


def _leer(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def _sin_comentarios(src: str) -> str:
    return re.sub(r"//.*", "", re.sub(r"\{/\*.*?\*/\}", "", src, flags=re.S))


def _norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def _slugs_verano(src: str) -> list:
    bloque = src.split("export const LANDINGS_VERANO", 1)[1].split("export const getLandingVerano", 1)[0]
    return re.findall(r"slug: '([a-z0-9-]+)'", bloque)


class TestLandings(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = _leer(VERANO)

    def test_cinco_landings_que_ya_existen(self):
        self.assertEqual(sorted(_slugs_verano(self.src)), sorted(ESPERADAS))
        comparativas = _leer(COMPARATIVAS)
        for slug in ESPERADAS:
            self.assertIn(f"slug: '{slug}'", comparativas, slug)

    def test_sin_rutas_nuevas(self):
        nombres = {p.name for p in (FRONT / "app" / "mejores").iterdir()}
        self.assertEqual(nombres, {"[slug]", "page.tsx"})

    def test_seo_de_temporada(self):
        titulos = re.findall(r"seoTitulo: '([^']+)'", self.src)
        descripciones = re.findall(r"seoDescripcion:\s*'([^']+)'", self.src)
        self.assertEqual(len(titulos), 5)
        self.assertEqual(len(descripciones), 5)
        for t in titulos:
            self.assertLessEqual(len(t), 60, t)
            self.assertNotRegex(t, r"\$|%")
        for d in descripciones:
            self.assertLessEqual(len(d), 160, d)
            self.assertNotRegex(d, r"\$|\d+\s*%|descuento")
        pagina = _leer(PAGINA)
        self.assertIn("verano?.seoTitulo ??", pagina)
        self.assertIn("verano?.seoDescripcion ??", pagina)

    def test_en_el_sitemap(self):
        self.assertIn("COMPARATIVAS.filter(indexable)", _leer(SITEMAP))
        comparativas = _leer(COMPARATIVAS)
        perennes = comparativas.split("const PERENNES = new Set([", 1)[1].split("])", 1)[0]
        contenido = _leer(CONTENIDO)
        for slug in ESPERADAS:
            self.assertTrue(f"'{slug}'" in perennes or f"  '{slug}': {{" in contenido, slug)


class TestCuadro(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = _leer(VERANO)
        cls.codigo = _sin_comentarios(cls.src)

    def test_excluye_bgh(self):
        self.assertIn("MARCAS_EXCLUIDAS_CTA.test(titulo)", self.codigo)
        self.assertIn("IDS_EXCLUIDOS_CTA.has(id)", self.codigo)
        regex = re.search(r"export const MARCAS_EXCLUIDAS_CTA = /(.+)/i", _leer(CTA)).group(1)
        self.assertIn("bgh", regex)
        # catálogo y fichas pasan por la misma exclusión
        self.assertEqual(self.codigo.count("excluidoVerano(l, "), 2)

    def test_boton_a_la_ficha_precio_y_no_a_listados(self):
        self.assertIn("destinoInterno: p => `/precio/${", self.codigo)
        for prohibido in ("listado.mercadolibre", "busquedaML", "'/ofertas", "mercadolibre.com.ar/ofertas", "matt_word", "calcml"):
            self.assertNotIn(prohibido, self.codigo, prohibido)
        comp = _sin_comentarios(_leer(COMP))
        # rama interna: sin target ni link de afiliado, con el texto propio del cuadro
        interno = comp.split("cta.destinoInterno ? (", 1)[1].split(") : (", 1)[0]
        self.assertIn("href={cta.destinoInterno(p)}", interno)
        self.assertNotIn("sponsored", interno)
        self.assertIn("cta.textoBoton ?? 'Ver ofertas →'", interno)

    def test_estilo_amarillo_de_marca(self):
        comp = _leer(COMP)
        self.assertIn("border-[#FACC15]/50", comp)
        self.assertIn("text-[#FACC15]", comp)

    def test_regla_de_mejor(self):
        self.assertIn("Último precio registrado", self.codigo)
        self.assertIn("if (elegidos.length < MAX_DESTACADOS) return null", self.codigo)
        self.assertIn("d <= DIAS_PRECIO_VIEJO", self.codigo)
        # vigentes del más caro al más barato; los rotulados, los más recientes primero
        self.assertIn("vigentes.sort((a, b) => b.precio - a.precio", self.codigo)
        self.assertIn("viejos.sort((a, b) => b.fecha.localeCompare(a.fecha)", self.codigo)
        self.assertIn("cta.rotulos?.[p.id]", _leer(COMP))

    def test_pagina_muestra_el_cuadro_arriba(self):
        pagina = _sin_comentarios(_leer(PAGINA))
        self.assertIn("cuadroVerano(c.slug)", pagina)
        i_cuadro = pagina.index("<CtaOfertaDestacada cta={cuadro}")
        self.assertLess(pagina.index("<h1"), i_cuadro)
        self.assertLess(i_cuadro, pagina.index("{c.intro}"))
        self.assertIn('id="comparativa"', pagina)


class TestEtiquetaSitio(unittest.TestCase):
    def test_clics_del_sitio_salen_con_sitio(self):
        self.assertIn("export const ETIQUETA_SITIO = 'sitio'", _leer(AFILIADO))
        clics = _sin_comentarios(_leer(CLICS))
        self.assertIn("aEtiquetaSitio(a.href, etiqueta)", clics)
        self.assertIn("CALCULADORA.test(window.location.hostname) ? ETIQUETA_CALC : ETIQUETA_SITIO", clics)
        # las fichas /precio usan los links del seguimiento con `web`, que clics-ml pasa a `sitio`
        self.assertIn("replaceAll('matt_word=repo', 'matt_word=web')", _leer(SEGUIMIENTO_TS))

    def test_enlaces_de_verano_son_internos(self):
        enlaces = _sin_comentarios(_leer(ENLACES))
        self.assertIn("href={`/mejores/${l.slug}`}", enlaces)
        self.assertNotIn("mercadolibre", enlaces)
        self.assertNotIn("matt_word", enlaces)
        self.assertNotIn("utm_source", enlaces)


class TestEnlacesInternos(unittest.TestCase):
    def test_calculadora_frigorias_a_aires(self):
        src = _leer(FRONT / "app" / "calculadora-frigorias" / "page.tsx")
        i = src.index("<CalculadoraFrigorias")
        bloque = src[i:src.index("Cómo calculamos")]
        self.assertIn('href="/mejores/mejores-aires-acondicionados"', bloque)

    def test_calculadora_consumo_a_aires_heladeras_ventiladores(self):
        src = _leer(FRONT / "app" / "calculadora-consumo-electrico" / "page.tsx")
        bloque = src.split('data-seccion="consumo_verano"', 1)[1].split("</nav>", 1)[0]
        for slug in ("mejores-aires-acondicionados", "mejores-heladeras", "mejores-ventiladores"):
            self.assertIn(f"/mejores/{slug}", bloque)
        self.assertNotIn("mercadolibre", bloque)

    def test_regalos_y_home(self):
        for rel in ("app/regalos-navidad/page.tsx", "app/hoy/page.tsx"):
            src = _leer(FRONT / rel)
            self.assertIn("import EnlacesVerano from '@/components/EnlacesVerano'", src, rel)
            self.assertIn("<EnlacesVerano", src, rel)


class TestDatosDelRepo(unittest.TestCase):
    """Con los datos del repo (hoy = el precio visto más nuevo del catálogo): heladeras y colchones
    tienen al menos 3 fichas vigentes sin BGH, y ninguna de las elegidas sería BGH."""

    @classmethod
    def setUpClass(cls):
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.items = items
        cls.hoy = max(datetime.date.fromisoformat(p["precio_visto"][:10]) for p in items if p.get("precio_visto"))
        cls.fichas = json.loads(SEGUIMIENTO.read_text(encoding="utf-8"))["items"]

    def _vigentes(self, empieza, fuera=()):
        out = []
        for p in self.items:
            t = _norm(p["titulo"])
            if not t.startswith(empieza) or p["id_ml"] not in self.fichas:
                continue
            if any(f in t for f in fuera) or EXCLUIDAS.search(p["titulo"]):
                continue
            visto = p.get("precio_visto")
            if not visto or (self.hoy - datetime.date.fromisoformat(visto[:10])).days > DIAS_PRECIO_VIEJO:
                continue
            if not p.get("precio_actual") or p["precio_actual"] <= 0:
                continue
            out.append(p)
        return sorted(out, key=lambda p: -p["precio_actual"])

    def test_heladeras_con_3_fichas_vigentes(self):
        elegidas = self._vigentes("heladera", ("frigobar", "portatil", "12v", "bajo mesada"))[:3]
        self.assertEqual(len(elegidas), 3)
        for p in elegidas:
            self.assertNotRegex(p["titulo"], EXCLUIDAS)
            self.assertTrue(self.fichas[p["id_ml"]]["slug"])

    def test_colchones_con_3_fichas_vigentes(self):
        fuera = ("inflable", "electrico", "protector", "cubre", "cuna", "colchoneta", "antiescaras")
        self.assertGreaterEqual(len(self._vigentes("colchon", fuera)), 3)

    def test_bgh_existe_en_los_datos_y_queda_afuera(self):
        # Hay una heladera BGH con ficha: si la exclusión se rompe, entraría al cuadro.
        bgh = [i for i, s in self.fichas.items() if "bgh" in s["slug"]]
        self.assertTrue(bgh)
        elegidas = {p["id_ml"] for p in self._vigentes("heladera")}
        self.assertFalse(elegidas & set(bgh))


if __name__ == "__main__":
    unittest.main()
