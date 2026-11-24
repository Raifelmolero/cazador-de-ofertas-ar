"""Lote ctr-cta del 24/11/2026: bloques CTA en las páginas de Search Console con muchas
impresiones y pocos clics, titles/metas por CTR y las 2 fichas /precio de herramientas.

Fija las reglas del pedido:
- productos solo del catálogo del repo (data/productos_rentables.json), con link de afiliado;
- cero BGH, Likon (MLA80862058), HP, OMEN y Victus en los bloques nuevos;
- sin % de descuento, precios tachados, «mínimo histórico» ni cupones en los bloques;
- botón de 48 px, #FACC15 y texto negro;
- herramientas: datos e historial reales del repo (nada inventado).
"""
import json
import re
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
LIB = FRONT / "lib" / "cta-destacados.ts"
COMP = FRONT / "components" / "CtaOfertaDestacada.tsx"
CALC_LIB = FRONT / "lib" / "calc-ofertas.ts"
CALC_COMP = FRONT / "components" / "OfertasCalculadora.tsx"
LANDINGS = FRONT / "lib" / "black-friday-landings.ts"
MANUALES = FRONT / "lib" / "seguidos-manuales.ts"
CATALOGO = FRONT / "data" / "productos_rentables.json"
HISTORIAL = RAIZ / "bot" / "state" / "price_history.json"
OFERTAS_MANUALES = RAIZ / "bot" / "state" / "ofertas_manuales.json"

EXCLUIDAS = re.compile(r"\b(bgh|likon|hp|omen|victus)\b", re.I)
LIKON_ID = "MLA80862058"
RUTAS = (
    "/guias/samsung-galaxy-a-o-s-cual-conviene",
    "/guias/que-motorola-comprar-moto-g-o-edge",
    "/guias/que-xiaomi-redmi-comprar",
    "/guias/mejor-celular-para-jugar",
    "/precio-hoy/iphone",
)
GUIAS_SEO = RUTAS[:4]
SIN_DESCUENTOS = r"\d+\s*%|cup[oó]n|m[ií]nimo hist|line-through|tachad|precio_anterior|descuento"


def _catalogo() -> dict:
    items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
    return {p["id_ml"]: p for p in items}


def _bloque(src: str, clave: str) -> str:
    """Texto de la entrada `'clave': {` hasta la siguiente entrada de primer nivel."""
    i = src.index(f"'{clave}': {{")
    fin = re.search(r"\n  '/", src[i + 1:])
    return src[i: i + 1 + fin.start()] if fin else src[i:]


def _sin_comentarios(src: str) -> str:
    return re.sub(r"//.*", "", re.sub(r"\{/\*.*?\*/\}", "", src, flags=re.S))


class TestBloquesCta(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lib = LIB.read_text(encoding="utf-8")
        cls.comp = COMP.read_text(encoding="utf-8")
        cls.catalogo = _catalogo()
        defs = cls.lib[cls.lib.index("export const CTAS_DESTACADOS"): cls.lib.index("/** <title> y meta description")]
        cls.defs = defs

    def test_estan_las_cinco_rutas_de_gsc(self):
        for r in RUTAS:
            self.assertIn(f"'{r}': {{", self.defs, r)
            # la ruta existe en el código con ese slug exacto
            slug = r.rsplit("/", 1)[1]
            fuentes = "".join(
                p.read_text(encoding="utf-8")
                for p in (FRONT / "lib").glob("*.ts")
                if p.name.startswith(("guias", "preciohoy"))
            )
            self.assertRegex(fuentes, rf"""["']?slug["']?: ["']{re.escape(slug)}["']""", r)

    def test_productos_reales_con_afiliado_y_del_rubro(self):
        rubro = {
            RUTAS[0]: r"samsung galaxy",
            RUTAS[1]: r"moto",
            RUTAS[2]: r"xiaomi|redmi",
            RUTAS[3]: r"samsung|moto|xiaomi|redmi",
            RUTAS[4]: r"iphone",
        }
        for r in RUTAS:
            ids = re.findall(r"id: '(MLA\d+)'", _bloque(self.defs, r))
            self.assertGreaterEqual(len(ids), 3, r)
            for i in ids:
                p = self.catalogo.get(i)
                self.assertIsNotNone(p, f"{r}: {i} no está en el catálogo del repo")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
                self.assertTrue(p.get("url_imagen"), i)
                self.assertRegex(p["titulo"].lower(), rubro[r], f"{r}: {i} {p['titulo']}")
                self.assertNotIn("reacondicionado", p["titulo"].lower(), i)

    def test_cero_marcas_excluidas(self):
        for i in re.findall(r"id: '(MLA\d+)'", self.defs):
            self.assertNotEqual(i, LIKON_ID)
            self.assertNotRegex(self.catalogo[i]["titulo"], EXCLUIDAS, i)
        for nombre in re.findall(r"nombre: '([^']+)'", self.defs):
            self.assertNotRegex(nombre, EXCLUIDAS)
        # y el filtro de código existe por si alguien carga una por error
        self.assertIn("likon", self.lib)
        self.assertIn(LIKON_ID, self.lib)
        self.assertIn("productosDeItems(def.items", self.lib)

    def test_sin_descuentos_tachados_minimos_ni_cupones(self):
        self.assertNotRegex(_sin_comentarios(self.comp), SIN_DESCUENTOS)
        self.assertNotRegex(_sin_comentarios(self.defs), SIN_DESCUENTOS)

    def test_boton_48px_amarillo_texto_negro_y_tracking(self):
        partes = (FRONT / "components" / "PartesTarjeta.tsx").read_text(encoding="utf-8")
        boton = re.search(r"export const BOTON_ML =\s*'([^']+)'", partes).group(1)
        for clase in ("min-h-12", "bg-[#FACC15]", "text-black"):
            self.assertIn(clase, boton)
        self.assertIn("${BOTON_ML}", self.comp)
        self.assertIn('rel="sponsored nofollow noopener"', self.comp)
        self.assertIn("data-evento={cta.evento}", self.comp)
        self.assertIn("data-seccion={cta.seccion}", self.comp)
        self.assertNotIn("logo.png", self.comp)

    def test_precio_solo_del_catalogo_y_fresco(self):
        # El precio no se escribe a mano: sale de productosDeItems (precioMostrable, 7 días).
        self.assertNotRegex(self.defs, r"precio:\s*\d")
        self.assertIn("p.precio !== null", self.comp)
        self.assertIn("UltVerificacion", self.comp)

    def test_guias_y_precio_hoy_lo_usan_arriba(self):
        guia = (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("ctaDestacado(`/guias/${g.slug}`)", guia)
        cuerpo = guia[guia.index("export default async function GuiaPage"):]
        self.assertLess(cuerpo.index("<h1"), cuerpo.index("<CtaOfertaDestacada"))
        self.assertLess(cuerpo.index("<CtaOfertaDestacada"), cuerpo.index("RESPUESTA CORTA"))
        ph = (FRONT / "app" / "precio-hoy" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("ctaDestacado(`/precio-hoy/${p.slug}`)", ph)
        cuerpo = ph[ph.index("export default async function PrecioHoyPage"):]
        # Above the fold: justo debajo del H1, antes de los recuadros de precio.
        self.assertLess(cuerpo.index("<h1"), cuerpo.index("<CtaOfertaDestacada"))
        self.assertLess(cuerpo.index("<CtaOfertaDestacada"), cuerpo.index('data-seccion="preciohoy_minimo"'))


class TestTitlesYMetas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lib = LIB.read_text(encoding="utf-8")
        cls.seo = cls.lib[cls.lib.index("export const SEO_CTA"): cls.lib.index("const pesosSeo")]

    def _formatos(self, ruta: str) -> tuple[list[str], str]:
        b = _bloque(self.seo, ruta)
        titulos = re.findall(r"\(\) => [`']([^`']+)[`']", b)
        desc = re.search(r"descripcion: desde =>\s*`([^`]+)`", b).group(1)
        return titulos, desc

    def test_guias_con_seo_y_entran_en_google(self):
        precio_largo = " desde $2.999.999"
        for r in GUIAS_SEO:
            titulos, desc = self._formatos(r)
            self.assertGreaterEqual(len(titulos), 3, r)
            # El último formato (sin precio) siempre entra en 60.
            self.assertLessEqual(len(titulos[-1]), 60, titulos[-1])
            self.assertIn("2026", titulos[-1], r)
            # con precio: al menos un formato entra con un precio de 7 cifras
            con = [t.replace("${coma(desde)}", "," + precio_largo) for t in titulos[:-1]]
            self.assertTrue(any(len(t) <= 60 for t in con), (r, con))
            d = desc.replace("${hoyEnML(desde)}", f" Hoy{precio_largo} en Mercado Libre.")
            d = re.sub(r"\$\{desde \? ` Hoy\$\{desde\}\.` : ''\}", f" Hoy{precio_largo}.", d)
            self.assertLessEqual(len(d), 158, (r, len(d), d))
            self.assertNotRegex(d + " ".join(titulos), r"m[ií]nimo|\d+\s*%|cup[oó]n")

    def test_jugar_recupera_la_consulta_exacta(self):
        titulos, _ = self._formatos("/guias/mejor-celular-para-jugar")
        for t in titulos:
            self.assertTrue(t.startswith("Mejor celular para jugar"), t)

    def test_samsung_nombra_galaxy_a_y_s(self):
        titulos, _ = self._formatos("/guias/samsung-galaxy-a-o-s-cual-conviene")
        for t in titulos:
            self.assertRegex(t, r"Galaxy A o (Galaxy )?S")

    def test_la_pagina_aplica_el_seo(self):
        guia = (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        meta = guia[guia.index("export async function generateMetadata"): guia.index("export default async function")]
        self.assertIn("SEO_CTA[`/guias/${g.slug}`]", meta)
        self.assertIn("desdeCta(ctaDestacado(", meta)
        # pisa al seoTitulo estático (va después)
        self.assertLess(meta.index("if (g.seoTitulo)"), meta.index("SEO_CTA["))

    def test_iphone_sin_reacondicionados_y_meta(self):
        ph = (FRONT / "lib" / "preciohoy.ts").read_text(encoding="utf-8")
        linea = next(l for l in ph.splitlines() if "slug: 'iphone'" in l)
        self.assertIn("excluirTodo: ['reacondicionado', 'usado', '% bateria']", linea)
        self.assertIn("(p.excluirTodo ?? []).some(x => t.includes(x))", ph)
        pagina = (FRONT / "app" / "precio-hoy" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        bloque = pagina[pagina.index("  iphone: {"): pagina.index("'smart-tv-32-pulgadas': {")]
        self.assertIn("Black Friday", bloque)
        self.assertIn("iPhone nuevo", bloque)
        d = re.search(r"`(Cuánto sale un iPhone nuevo[^`]+)`", bloque).group(1)
        d = d.replace("${desde}", "$2.999.999").replace("${ofertas(n)}", "15 ofertas")
        self.assertLessEqual(len(d), 158, d)

    def test_calculadora_consumo(self):
        src = (FRONT / "app" / "calculadora-consumo-electrico" / "page.tsx").read_text(encoding="utf-8")
        titulo = re.search(r"const TITULO = '([^']+)'", src).group(1)
        desc = re.search(r"const DESCRIPCION =\s*'([^']+)'", src).group(1)
        self.assertLessEqual(len(titulo), 60)
        self.assertIn("cuánto gasta", titulo)
        self.assertLessEqual(len(desc), 158)
        self.assertNotRegex(desc, r"m[ií]nimo|\d+\s*%|cup[oó]n")


class TestCalculadoraConsumo(unittest.TestCase):
    """Espeja el bloque BF de la calculadora de comisiones (OfertasCalculadora)."""

    @classmethod
    def setUpClass(cls):
        cls.lib = CALC_LIB.read_text(encoding="utf-8")
        cls.comp = CALC_COMP.read_text(encoding="utf-8")
        cls.pagina = (FRONT / "app" / "calculadora-consumo-electrico" / "page.tsx").read_text(encoding="utf-8")
        cls.catalogo = _catalogo()
        cls.landings = LANDINGS.read_text(encoding="utf-8")

    def test_rubros_eficientes_con_producto_real(self):
        rubros = re.search(r"RUBROS_CONSUMO = \[([^\]]+)\]", self.lib).group(1)
        slugs = re.findall(r"'(black-friday-[a-z-]+)'", rubros)
        self.assertIn("black-friday-aires-acondicionados", slugs)
        self.assertIn("black-friday-heladeras", slugs)
        for slug in slugs:
            i = self.landings.index(f"slug: '{slug}'")
            bloque = self.landings[i: self.landings.index("\n  },\n", i)]
            ids = re.findall(r"id: '(MLA\d+)'", bloque)
            ok = [x for x in ids if x in self.catalogo and self.catalogo[x].get("url_imagen")
                  and not EXCLUIDAS.search(self.catalogo[x]["titulo"]) and x != LIKON_ID]
            self.assertTrue(ok, slug)
            # El primero con foto (el que se muestra) es del rubro de bajo consumo.
            self.assertRegex(self.catalogo[ok[0]]["titulo"].lower(), r"inverter|lavarropas|no frost", slug)

    def test_cero_bgh_ni_likon(self):
        self.assertIn("MARCAS_PROHIBIDAS.test(x.nombre)", self.lib)
        self.assertIn("likon", self.lib)
        self.assertIn(LIKON_ID, self.lib)

    def test_en_la_pagina_debajo_de_la_calculadora(self):
        self.assertIn("ofertas={ofertasConsumo()}", self.pagina)
        self.assertIn('evento="consumo_oferta_boton"', self.pagina)
        self.assertLess(self.pagina.index("<CalculadoraConsumo"), self.pagina.index("<OfertasCalculadora"))

    def test_boton_48px_marca_y_sin_precios(self):
        self.assertIn("min-h-[48px]", self.comp)
        self.assertIn("bg-[#FACC15]", self.comp)
        self.assertIn("text-black", self.comp)
        self.assertNotRegex(_sin_comentarios(self.comp), r"\d+\s*%|cup[oó]n|m[ií]nimo hist|line-through|p\.precio")


class TestHerramientasPrecio(unittest.TestCase):
    """Las 2 herramientas confirmadas: /precio con datos del repo y enlazadas."""

    SKUS = {
        "MLA25570995": "martillo-demoledor-900w-8-5-joules-lusqtoff-maletin-color-mla25570995",
        "MLA42782167": "llave-impacto-inalambrica-20v-1-2-pulgadas-pektra-brushless-mla42782167",
    }

    @classmethod
    def setUpClass(cls):
        cls.src = MANUALES.read_text(encoding="utf-8")
        cls.catalogo = _catalogo()
        cls.hist = json.loads(HISTORIAL.read_text(encoding="utf-8"))
        man = json.loads(OFERTAS_MANUALES.read_text(encoding="utf-8"))
        lista = man if isinstance(man, list) else next(v for v in man.values() if isinstance(v, (list, dict)))
        cls.manuales = {x["id"]: x for x in (lista.values() if isinstance(lista, dict) else lista) if isinstance(x, dict) and "id" in x}

    def _entrada(self, i: str) -> str:
        a = self.src.index(f"id: '{i}'")
        return self.src[a: self.src.index("\n  },", a)]

    def test_solo_las_dos_confirmadas(self):
        self.assertEqual(sorted(re.findall(r"id: '(MLA\d+)'", self.src)), sorted(self.SKUS))
        self.assertNotIn("MLA46509422", self.src)  # el taladro, no
        self.assertNotRegex(self.src, r"(?i)dogo|werkon")

    def test_slug_y_datos_del_catalogo(self):
        import sys
        sys.path.insert(0, str(RAIZ / "bot"))
        from cazador_bot import slug_producto
        for i, slug in self.SKUS.items():
            e = self._entrada(i)
            p = self.catalogo[i]
            self.assertEqual(slug_producto(p["titulo"], i), slug)
            self.assertIn(f"slug: '{slug}'", e)
            self.assertIn(f"titulo: '{p['titulo']}'", e)
            self.assertIn(f"img: '{p['url_imagen']}'", e)
            base = p["url_producto"].split("?")[0]
            self.assertIn(f"url: '{base}?matt_word=web&matt_tool=37267219'", e)

    def test_serie_y_minimo_salen_del_historial(self):
        for i in self.SKUS:
            e = self._entrada(i)
            h = self.hist[i]
            serie = [(d, int(v)) for d, v in re.findall(r"\['(\d{4}-\d{2}-\d{2})', (\d+)\]", e)]
            self.assertGreaterEqual(len(serie), 2, i)
            self.assertEqual(serie[-1], (h["last_ts"], int(h["last"])), i)
            self.assertIn(f"min: {int(h['min'])},", e)
            self.assertIn(f"ultimo_visto: '{h['last_ts']}'", e)
            # cada punto es un precio visto en algún dato del repo
            vistos = {(h["min_ts"], int(h["min"])), (h["last_ts"], int(h["last"]))}
            m = self.manuales.get(i)
            if m:
                vistos.add((m["agregada"][:10], int(m["price_cur"])))
            testigo = json.loads((RAIZ / "bot" / "state" / "precio_testigo_2026.json").read_text(encoding="utf-8"))
            t = testigo.get(i) or (testigo.get("items") or {}).get(i)
            if t:
                vistos.add((t["min_ts"], int(t["min"])))
            for punto in serie:
                self.assertIn(punto, vistos, (i, punto))

    def test_seo_limpio(self):
        for t in re.findall(r"seoTitulo: '([^']+)'", self.src):
            self.assertLessEqual(len(t), 60, t)
            self.assertIn("precio hoy", t)
        for d in re.findall(r"seoDescripcion:\s*'([^']+)'", self.src):
            # la página le suma « Último precio visto: $XXX.XXX el dd/mm/aaaa.» (45)
            self.assertLessEqual(len(d) + 45, 158, d)
            self.assertNotRegex(d, r"m[ií]nimo|\d+\s*%|cup[oó]n")
        pagina = (FRONT / "app" / "precio" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("seoManual(s.id)", pagina)

    def test_no_pisa_al_bot_y_vence_a_60_dias(self):
        seg = (FRONT / "lib" / "seguimiento.ts").read_text(encoding="utf-8")
        self.assertIn("seguidosManualesVivos(raw.actualizado", seg)
        self.assertIn("!idsDelBot.has(s.id)", self.src)
        self.assertIn("DIAS_VIGENCIA_MANUAL = 60", self.src)

    def test_enlazadas_desde_categoria_landing_y_guia(self):
        cats = (FRONT / "lib" / "categorias.ts").read_text(encoding="utf-8")
        i = cats.index("slug: 'herramientas-electricas'")
        bloque = cats[i: cats.index("excluir:", i)]
        for k in ("'martillo demoledor'", "'llave de impacto'"):
            self.assertIn(k, bloque)
        landings = (FRONT / "lib" / "landings.ts").read_text(encoding="utf-8")
        i = landings.index("slug: 'herramientas-electricas-en-oferta'")
        l = landings[i: landings.index("\n  },\n", i)]
        self.assertIn("martillo demoledor|llave (de )?impacto", l)
        guias = (FRONT / "lib" / "guias.ts").read_text(encoding="utf-8")
        i = guias.index("slug: 'herramientas-electricas-cyber-monday-black-friday'")
        g = guias[i: guias.index("\n  },\n", i)]
        for slug in self.SKUS.values():
            self.assertIn(f"/precio/{slug}", l)
            self.assertIn(f"/precio/{slug}", g)


if __name__ == "__main__":
    unittest.main()
