"""Lote 2 de ctr-cta (24/11/2026): bloque destacado + title/meta en 4 páginas más de Search
Console, enlazado interno a /black-friday desde las 9 páginas top, Edge 70 Fusion con precio
fresco en la guía de Motorola y `availability` en todos los Offer del JSON-LD.

Mismas reglas que el lote 1 (test_cta_destacados_ctr.py): productos reales del catálogo del
repo, cero BGH/Likon/HP/OMEN/Victus, sin %, tachados, «mínimo histórico» ni cupones.
"""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
LIB = FRONT / "lib" / "cta-destacados.ts"
CATALOGO = FRONT / "data" / "productos_rentables.json"
JSONLD = FRONT / "lib" / "bf-jsonld.ts"
TS = FRONT / "node_modules" / "typescript"

EXCLUIDAS = re.compile(r"\b(bgh|likon|hp|omen|victus)\b", re.I)
SIN_DESCUENTOS = r"\d+\s*%|cup[oó]n|m[ií]nimo hist|line-through|tachad|precio_anterior|descuento"
RUTAS = {
    "/guias/que-cocina-comprar": r"^cocina",
    "/guias/google-tv-roku-tizen-o-webos-cual-conviene": r"smart tv|televisor",
    "/precio-hoy/smart-tv-32-pulgadas": r"(smart tv|televisor).*\b32\b",
    "/precio-hoy/samsung-galaxy-s": r"galaxy s\d\d",
}
TOP_9 = (
    "/guias/samsung-galaxy-a-o-s-cual-conviene",
    "/guias/que-motorola-comprar-moto-g-o-edge",
    "/guias/que-xiaomi-redmi-comprar",
    "/guias/mejor-celular-para-jugar",
    "/precio-hoy/iphone",
    *RUTAS,
)
PRECIO_7 = " desde $1.437.540"


def _catalogo() -> dict:
    items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
    return {p["id_ml"]: p for p in items}


def _bloque(src: str, clave: str) -> str:
    i = src.index(f"'{clave}': {{")
    fin = re.search(r"\n  ('/|// ──|\w)", src[i + 1:])
    return src[i: i + 1 + fin.start()] if fin else src[i:]


def _sin_comentarios(src: str) -> str:
    return re.sub(r"//.*", "", re.sub(r"\{/\*.*?\*/\}", "", src, flags=re.S))


class TestBloquesLote2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lib = LIB.read_text(encoding="utf-8")
        cls.defs = cls.lib[cls.lib.index("export const CTAS_DESTACADOS"): cls.lib.index("/** <title> y meta description")]
        cls.catalogo = _catalogo()

    def test_productos_reales_del_rubro_y_sin_marcas_excluidas(self):
        for ruta, rubro in RUTAS.items():
            b = _bloque(self.defs, ruta)
            ids = re.findall(r"id: '(MLA\d+)'", b)
            self.assertGreaterEqual(len(ids), 3, ruta)
            for i in ids:
                p = self.catalogo.get(i)
                self.assertIsNotNone(p, f"{ruta}: {i} no está en el catálogo")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
                self.assertTrue(p.get("url_imagen"), i)
                self.assertRegex(p["titulo"].lower(), rubro, f"{ruta}: {p['titulo']}")
                self.assertNotRegex(p["titulo"], EXCLUIDAS, i)
                self.assertNotIn("reacondicionado", p["titulo"].lower(), i)
                self.assertNotEqual(i, "MLA80862058")
            for nombre in re.findall(r"nombre: '([^']+)'", b):
                self.assertNotRegex(nombre, EXCLUIDAS)
            self.assertNotRegex(_sin_comentarios(b), SIN_DESCUENTOS, ruta)
            self.assertNotRegex(b, r"precio:\s*\d")
            self.assertRegex(b, r"verMas: \{ href: '/mejores/")

    def test_sistemas_de_tv_cubiertos(self):
        b = _bloque(self.defs, "/guias/google-tv-roku-tizen-o-webos-cual-conviene")
        for s in ("Google TV", "webOS", "Tizen"):
            self.assertIn(s, b)

    def test_edge_70_fusion_con_el_precio_mas_fresco(self):
        b = _bloque(self.defs, "/guias/que-motorola-comprar-moto-g-o-edge")
        ids = re.findall(r"id: '(MLA\d+)'", b)
        edge = [i for i in ids if "edge 70 fusion" in self.catalogo.get(i, {}).get("titulo", "").lower()]
        self.assertEqual(len(edge), 1, edge)
        # Entre las publicaciones nuevas del Edge 70 Fusion del catálogo, ninguna se vio más tarde.
        candidatas = [p for p in self.catalogo.values()
                      if re.search(r"edge 70 fusi[oó]n", p["titulo"].lower())
                      and "caja abierta" not in p["titulo"].lower()
                      and "matt_tool=37267219" in p["url_producto"]]
        mas_nueva = max(p.get("precio_visto") or "" for p in candidatas)
        self.assertEqual(self.catalogo[edge[0]]["precio_visto"], mas_nueva)


class TestSeoLote2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        lib = LIB.read_text(encoding="utf-8")
        cls.seo = lib[lib.index("export const SEO_CTA"): lib.index("const pesosSeo")]
        cls.ph = (FRONT / "app" / "precio-hoy" / "[slug]" / "page.tsx").read_text(encoding="utf-8")

    def _chequear(self, titulos, descs, ruta):
        self.assertGreaterEqual(len(titulos), 3, ruta)
        self.assertLessEqual(len(titulos[-1]), 60, titulos[-1])
        self.assertTrue(any(len(t) <= 60 for t in titulos[:-1]), (ruta, titulos))
        for d in descs:
            self.assertLessEqual(len(d), 155, (ruta, len(d), d))
        self.assertNotRegex(" ".join(titulos + descs), r"m[ií]nimo|\d+\s*%|cup[oó]n")

    def test_guias(self):
        for ruta in ("/guias/que-cocina-comprar", "/guias/google-tv-roku-tizen-o-webos-cual-conviene"):
            b = _bloque(self.seo, ruta)
            titulos = [t.replace("${coma(desde)}", "," + PRECIO_7) for t in re.findall(r"\(\) => [`']([^`']+)[`']", b)]
            desc = re.search(r"descripcion: desde =>\s*`([^`]+)`", b).group(1)
            desc = desc.replace("${hoyEnML(desde)}", f" Hoy{PRECIO_7} en Mercado Libre.")
            self._chequear(titulos, [desc], ruta)
            self.assertIn("2026", titulos[-1], ruta)
        cocina = _bloque(self.seo, "/guias/que-cocina-comprar")
        self.assertIn("comprar", cocina)
        self.assertIn("multigas", cocina)

    def test_precio_hoy_con_black_friday(self):
        for slug in ("smart-tv-32-pulgadas", "samsung-galaxy-s"):
            i = self.ph.index(f"  '{slug}': {{")
            b = self.ph[i: self.ph.index("\n  },", i)]
            rama_bf = b[b.index("? ["): b.index(": [")]
            titulos = [t.replace("${desde}", PRECIO_7) for t in re.findall(r"\(\) => [`']([^`']+)[`']", rama_bf)]
            self.assertTrue(all("Black Friday" in t for t in titulos[::2]), titulos)
            self.assertIn("2026", titulos[-1])
            desc = re.search(r"descripcion: \(desde, n\) =>\s*`([^`]+)`", b).group(1)
            desc = desc.replace("${desde}", "$1.437.540").replace("${ofertas(n)}", "15 ofertas")
            self._chequear(titulos, [desc], slug)
            self.assertIn("avisoBFVigente(getScrapedAt().getTime())", b)

    def test_galaxy_s_solo_nuevos(self):
        ph = (FRONT / "lib" / "preciohoy.ts").read_text(encoding="utf-8")
        linea = next(l for l in ph.splitlines() if "slug: 'samsung-galaxy-s'" in l)
        self.assertIn("excluirTodo: ['reacondicionado', 'usado', '% bateria']", linea)


class TestEnlacesBF(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.lib = (FRONT / "lib" / "bf-enlaces.ts").read_text(encoding="utf-8")
        cls.comp = (FRONT / "components" / "EnlacesBF.tsx").read_text(encoding="utf-8")
        cls.landings = (FRONT / "lib" / "black-friday-landings.ts").read_text(encoding="utf-8")

    def test_las_9_paginas_top_con_landing_existente(self):
        mapa = self.lib[self.lib.index("export const ENLACES_BF_POR_RUTA"):]
        mapa = mapa[: mapa.index("\n}\n")]
        pares = dict(re.findall(r"'(/[^']+)': '(black-friday-[a-z-]+)'", mapa))
        self.assertEqual(set(pares), set(TOP_9))
        for slug in pares.values():
            self.assertIn(f"slug: '{slug}'", self.landings)

    def test_componente_compacto_y_con_todas_las_landings(self):
        self.assertIn('href="/black-friday"', self.comp)
        self.assertIn("LANDINGS_BF", self.comp)
        self.assertIn("href={`/mejores/${l.slug}`}", self.comp)
        # una fila con scroll horizontal: no rompe el ancho en el celular
        self.assertIn("overflow-x-auto", self.comp)
        self.assertIn("shrink-0", self.comp)
        self.assertIn("min-h-11", self.comp)
        self.assertIn("avisoBFVigente()", self.comp)
        self.assertIn("<SoloHastaFinBF>", self.comp)
        self.assertNotRegex(_sin_comentarios(self.comp), r"\d+\s*%|cup[oó]n|precio")

    def test_lo_usan_guias_y_precio_hoy(self):
        guia = (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        ph = (FRONT / "app" / "precio-hoy" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("<EnlacesBF ruta={`/guias/${g.slug}`}", guia)
        self.assertIn("<EnlacesBF ruta={`/precio-hoy/${p.slug}`}", ph)

    def test_home_ya_enlaza_black_friday_y_landings(self):
        hoy = (FRONT / "app" / "hoy" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn('href="/black-friday"', hoy)
        self.assertIn("href={`/mejores/${l.slug}`}", hoy)


# Archivos que emiten Product con Offer/AggregateOffer en el JSON-LD.
ARCHIVOS_LD = (
    "lib/bf-jsonld.ts",
    "app/precio/[slug]/page.tsx",
    "app/precio-hoy/[slug]/page.tsx",
    "app/vs/[slug]/page.tsx",
    "app/mejores/[slug]/page.tsx",
    "app/categoria/[slug]/page.tsx",
    "app/hoy/page.tsx",
)

_NODE = r"""
const ts = require(process.argv[1]);
const fs = require('fs');
const js = ts.transpileModule(fs.readFileSync(process.argv[2], 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', 'require', js)(m, m.exports, require);
const L = m.exports;
process.stdout.write(JSON.stringify({
  con: L.disponibilidadLD(807930), sin: L.disponibilidadLD(null), cero: L.disponibilidadLD(0),
  lista: L.itemListLD('x', 'https://cazadordeofertas.com.ar/x', [
    { nombre: 'A', url: 'https://www.mercadolibre.com.ar/p/MLA1?matt_tool=37267219&matt_word=web', img: null, precio: 807930 },
    { nombre: 'B', url: 'https://www.mercadolibre.com.ar/p/MLA2?matt_tool=37267219&matt_word=web', img: null, precio: null },
  ]),
}));
"""


class TestAvailabilityJsonLd(unittest.TestCase):
    def test_todos_los_offers_tienen_availability(self):
        for rel in ARCHIVOS_LD:
            src = (FRONT / rel).read_text(encoding="utf-8")
            ofertas = [m.start() for m in re.finditer(r"'@type': '(Aggregate)?Offer'", src)]
            self.assertTrue(ofertas, rel)
            for i in ofertas:
                bloque = src[i: src.index("}", i)]
                self.assertIn("availability: disponibilidadLD(", bloque, rel)
                self.assertIn("priceCurrency: 'ARS'", bloque, rel)
            # nada de InStock escrito a mano fuera del helper
            if rel != "lib/bf-jsonld.ts":
                self.assertNotIn("schema.org/InStock", src, rel)
                self.assertIn("import { disponibilidadLD } from '@/lib/bf-jsonld'", src, rel)
        precio = (FRONT / "app" / "precio" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("priceValidUntil:", precio)

    @unittest.skipUnless(shutil.which("node") and TS.exists(), "hace falta node y frontend/node_modules")
    def test_helper_en_node(self):
        out = subprocess.run(["node", "-e", _NODE, str(TS), str(JSONLD)],
                             capture_output=True, text=True, check=True, timeout=60).stdout
        ld = json.loads(out)
        self.assertEqual(ld["con"], "https://schema.org/InStock")
        self.assertEqual(ld["sin"], "https://schema.org/OutOfStock")
        self.assertEqual(ld["cero"], "https://schema.org/OutOfStock")
        con, sin = ld["lista"]["itemListElement"]
        oferta = con["item"]["offers"]
        self.assertEqual(oferta["availability"], "https://schema.org/InStock")
        self.assertEqual(oferta["price"], 807930)
        self.assertEqual(oferta["priceCurrency"], "ARS")
        # sin precio vigente no se emite Offer
        self.assertNotIn("item", sin)


if __name__ == "__main__":
    unittest.main()
