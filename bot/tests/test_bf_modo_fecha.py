"""Black Friday por fecha (pedido del 26/11/2026): modo previa / hoy / últimas horas / terminó.

- lib/cybermonday.ts (modoBF y textos por modo) se transpila con el TypeScript del frontend y se
  corre en node con fechas fijas en hora argentina.
- lib/bf-enlaces.ts (landing BF del rubro de cada /mejores, /precio-hoy y /guias) igual.
- lib/cta-destacados.ts (cuadro de destacados: exclusión de BGH, Likon, HP, OMEN y Victus) se corre
  con un stub de lib/black-friday-landings (no hace falta el catálogo para probar el filtro).
- El resto son chequeos de que las páginas usan esos módulos (title/H1/hero/JSON-LD, ISR).
"""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
TS = FRONT / "node_modules" / "typescript"
CYBER = FRONT / "lib" / "cybermonday.ts"
ENLACES = FRONT / "lib" / "bf-enlaces.ts"
CTA = FRONT / "lib" / "cta-destacados.ts"
LANDINGS = FRONT / "lib" / "black-friday-landings.ts"
GUIAS = FRONT / "lib" / "guias.ts"
CATALOGO = FRONT / "data" / "productos_rentables.json"

HAY_NODE = bool(shutil.which("node")) and TS.exists()

# Carga un .ts transpilado; `@/lib/black-friday-landings` se reemplaza por un stub mínimo.
_NODE = r"""
const ts = require(process.argv[1]);
const fs = require('fs');
function cargar(ruta) {
  const src = fs.readFileSync(ruta, 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  const req = (n) => n === '@/lib/black-friday-landings'
    ? { productosDeItems: (items) => items.map(it => ({ ...it, url: 'https://www.mercadolibre.com.ar/p/' + it.id + '?matt_tool=37267219&matt_word=web', img: null, precio: null, visto: null })) }
    : require(n);
  new Function('module', 'exports', 'require', js)(m, m.exports, req);
  return m.exports;
}
const C = cargar(process.argv[2]);
const E = cargar(process.argv[3]);
const D = cargar(process.argv[4]);
const datos = JSON.parse(process.argv[5]);
const MODOS = ['previa', 'hoy', 'ultimas', 'termino'];
const out = {};
out.modos = Object.fromEntries(datos.instantes.map(i => [i, C.modoBF(new Date(i))]));
out.landings = datos.landings.map(l => Object.fromEntries(MODOS.map(m => [m, {
  h1: C.textoModoBF(l.h1, m),
  titulo: C.tituloLandingModoBF(l.h1, l.titulo, m),
  descripcion: C.textoModoBF(l.descripcion, m),
}])));
out.guiasBF = datos.guiasBF.map(t => Object.fromEntries(MODOS.map(m => [m, C.tituloModoBF(t, m, 60)])));
out.cyber = datos.cyber.map(g => Object.fromEntries(MODOS.map(m => [m, {
  titulo: C.textoModoBF(C.aBlackFridayTrasCyber(C.eventosModoBF(g.titulo, m)), m),
  respuesta: C.textoModoBF(C.aBlackFridayTrasCyber(C.eventosModoBF(g.respuestaCorta, m)), m),
}])));
out.pagina = C.PAGINA_BF;
out.etiquetas = C.ETIQUETA_MODO_BF;
out.destacadosTitulo = C.DESTACADOS_MODO_BF;
out.rutas = Object.fromEntries(datos.rutas.map(r => [r, (E.destinoBF(r) || {}).slug || null]));
out.cyberLanding = E.GUIA_CYBER_A_LANDING_BF;
out.excluidos = Object.fromEntries(datos.nombres.map(n => [n, D.excluidoDeCta({ id: 'MLA1', nombre: n })]));
out.excluidoPorId = D.excluidoDeCta({ id: 'MLA80862058', nombre: 'Aire split frío/calor 3000 frigorías' });
out.destacados = D.destacadosLandingBF(datos.productos).map(p => p.id);
process.stdout.write(JSON.stringify(out));
"""

INSTANTES = {
    "2026-11-26T12:00:00-03:00": "previa",
    "2026-11-26T23:59:59-03:00": "previa",
    "2026-11-27T02:59:59Z": "previa",  # 23:59:59 del 26 en Argentina: todavía previa
    "2026-11-27T00:00:00-03:00": "hoy",
    "2026-11-27T03:00:00Z": "hoy",
    "2026-11-27T23:59:59-03:00": "hoy",
    "2026-11-28T00:00:00-03:00": "ultimas",
    "2026-11-29T23:59:59-03:00": "ultimas",
    "2026-11-30T02:59:59Z": "ultimas",  # 23:59:59 del 29 en Argentina
    "2026-11-30T00:00:00-03:00": "termino",
    "2026-12-15T12:00:00-03:00": "termino",
}

RUTAS = {
    # las 10 de siempre (AVISO_BF_POR_RUTA)
    "/mejores/mejores-notebooks": "black-friday-notebooks",
    "/precio-hoy/iphone": "black-friday-celulares",
    "/mejor/aires-acondicionados": "black-friday-aires-acondicionados",
    # por palabras del slug (26/11/2026)
    "/mejores/mejores-heladeras": "black-friday-heladeras",
    "/guias/que-freidora-de-aire-comprar": "black-friday-freidoras-de-aire",
    "/mejores/mejores-auriculares": "black-friday-auriculares",
    "/precio-hoy/samsung-galaxy-tab": "black-friday-tablets",
    "/guias/que-smartwatch-comprar": "black-friday-smartwatch",
    "/precio-hoy/smart-tv-32-pulgadas": "black-friday-smart-tv",
    "/guias/google-tv-roku-tizen-o-webos-cual-conviene": "black-friday-smart-tv",
    "/guias/que-celular-comprar-cyber-monday": "black-friday-celulares",
    "/guias/conviene-comprar-aire-acondicionado-cyber-monday": "black-friday-aires-acondicionados",
    "/guias/que-lavarropas-comprar-cyber-monday": "black-friday-lavarropas",
    "/guias/que-motorola-comprar-moto-g-o-edge": "black-friday-celulares-baratos",
    "/precio-hoy/notebook-gamer": "black-friday-notebooks",
    "/mejores/mejores-monitores": "black-friday-gaming",
    # sin bloque
    "/mejores/black-friday-celulares": None,  # la landing misma
    "/guias/como-saber-si-un-descuento-de-mercado-libre-es-real": None,
    "/hoy": None,
}

NOMBRES_EXCLUIDOS = ["BGH Silent Air 3000", "Aire Likon 2600", "Notebook HP 15", "Notebook Omen 16", "HP Victus 15"]
NOMBRES_OK = ["Lenovo IdeaPad Slim 3", "Samsung Galaxy A56", "Philips XL Series"]

# Frases que en hoy/últimas/terminó dirían que el Black Friday todavía no empezó.
FUTURO = re.compile(r"(?i)\bfalta|todav[ií]a no|vamos a|empieza|pr[oó]ximo evento|pr[oó]ximos eventos|para el black friday 2026")


def _landings():
    src = LANDINGS.read_text(encoding="utf-8")
    out = []
    for parte in re.split(r"\n  \{\n    slug: '", src)[1:]:
        out.append({
            "slug": parte.split("'", 1)[0],
            "h1": re.search(r"h1: '([^']+)'", parte).group(1),
            "titulo": re.search(r"titulo: '([^']+)'", parte).group(1),
            "descripcion": re.search(r"descripcion:\s*'([^']+)'", parte).group(1),
        })
    return out


def _guia(slug):
    src = GUIAS.read_text(encoding="utf-8")
    bloque = src.split(f"slug: '{slug}'", 1)[1]
    return {
        "titulo": re.search(r"titulo: '([^']+)'", bloque).group(1),
        "respuestaCorta": re.search(r"respuestaCorta:\s*'([^']+)'", bloque).group(1),
    }


def _seo_titulos_bf():
    src = (FRONT / "lib" / "guias-bf-2026.ts").read_text(encoding="utf-8")
    return re.findall(r"seoTitulo: '([^']+)'", src)


@unittest.skipUnless(HAY_NODE, "hace falta node y frontend/node_modules (npm ci)")
class TestModoBFEnNode(unittest.TestCase):
    CYBER_SLUGS = (
        "conviene-comprar-aire-acondicionado-cyber-monday",
        "que-lavarropas-comprar-cyber-monday",
        "que-celular-comprar-cyber-monday",
    )

    @classmethod
    def setUpClass(cls):
        cls.landings = _landings()
        productos = [{"id": f"MLA{i}", "nombre": n} for i, n in enumerate(NOMBRES_EXCLUIDOS[:2] + NOMBRES_OK + ["Asus TUF"])]
        datos = {
            "instantes": list(INSTANTES),
            "landings": cls.landings,
            "guiasBF": _seo_titulos_bf(),
            "cyber": [_guia(s) for s in cls.CYBER_SLUGS],
            "rutas": list(RUTAS),
            "nombres": NOMBRES_EXCLUIDOS + NOMBRES_OK,
            "productos": productos,
        }
        res = subprocess.run(
            ["node", "-e", _NODE, str(TS), str(CYBER), str(ENLACES), str(CTA), json.dumps(datos)],
            capture_output=True, text=True, timeout=60,
        )
        if res.returncode != 0:
            raise AssertionError(res.stderr)
        cls.r = json.loads(res.stdout)

    def test_modo_por_fecha_en_hora_argentina(self):
        for instante, esperado in INSTANTES.items():
            self.assertEqual(self.r["modos"][instante], esperado, instante)

    def test_landings_titulo_h1_y_descripcion_por_modo(self):
        for l, r in zip(self.landings, self.r["landings"]):
            self.assertEqual(r["previa"]["titulo"], l["titulo"], l["slug"])  # la previa no cambia
            self.assertEqual(r["previa"]["h1"], l["h1"], l["slug"])
            for modo in ("hoy", "ultimas", "termino"):
                t, h = r[modo]["titulo"], r[modo]["h1"]
                self.assertLessEqual(len(t), 65, f"{l['slug']} {modo}: {t}")
                self.assertIn("Black Friday", t, l["slug"])
                self.assertNotRegex(h, FUTURO, f"{l['slug']} {modo}: {h}")
                self.assertNotIn("(viernes 27/11)", r[modo]["descripcion"], l["slug"])
            self.assertIn("de hoy", r["hoy"]["h1"], l["slug"])
            self.assertIn("últimas horas", r["ultimas"]["h1"], l["slug"])
            self.assertIn("después del Black Friday 2026", r["termino"]["h1"], l["slug"])

    def test_titulos_de_guias_bf_entran(self):
        for r in self.r["guiasBF"]:
            for modo, t in r.items():
                self.assertLessEqual(len(t), 60, f"{modo}: {t}")
            self.assertNotRegex(r["termino"], r"(?i)\ben Black Friday 2026\b|\bpara el Black Friday\b")

    def test_guias_cyber_hablan_del_black_friday_segun_el_dia(self):
        for slug, r in zip(self.CYBER_SLUGS, self.r["cyber"]):
            for modo, v in r.items():
                self.assertIn("Black Friday", v["titulo"], f"{slug} {modo}")
                self.assertNotIn("Cyber Monday", v["titulo"] + v["respuesta"], f"{slug} {modo}")
                self.assertNotIn("de la CACE fue", v["respuesta"], f"{slug} {modo}")
                self.assertNotIn("2 al 4 de noviembre", v["respuesta"], f"{slug} {modo}")
                if modo != "previa":
                    self.assertNotRegex(v["titulo"] + " " + v["respuesta"], FUTURO, f"{slug} {modo}")
            self.assertIn("de hoy", r["hoy"]["titulo"], slug)
            self.assertIn("después del Black Friday 2026", r["termino"]["titulo"], slug)

    def test_pagina_black_friday(self):
        p = self.r["pagina"]
        self.assertEqual(set(p), {"previa", "hoy", "ultimas", "termino"})
        for modo, t in p.items():
            self.assertLessEqual(len(t["titulo"]), 65, modo)
            self.assertLessEqual(len(t["descripcion"]), 158, modo)
            self.assertIn("Black Friday", t["titulo"], modo)
        for modo in ("hoy", "ultimas", "termino"):
            todo = " ".join(p[modo].values()) + " " + self.r["etiquetas"][modo] + " " + self.r["destacadosTitulo"][modo]
            self.assertNotRegex(todo, FUTURO, modo)
        self.assertIn("HOY", p["hoy"]["titulo"])
        self.assertIn("últimas horas", p["ultimas"]["titulo"])
        self.assertIn("Terminó", p["termino"]["titulo"])

    def test_landing_bf_del_rubro_por_ruta(self):
        for ruta, esperado in RUTAS.items():
            self.assertEqual(self.r["rutas"][ruta], esperado, ruta)
        slugs = {l["slug"] for l in self.landings}
        for slug in self.r["cyberLanding"].values():
            self.assertIn(slug, slugs)
        guias = GUIAS.read_text(encoding="utf-8")
        for slug in self.r["cyberLanding"]:
            self.assertIn(f"slug: '{slug}'", guias)

    def test_exclusion_de_marcas_en_destacados(self):
        for n in NOMBRES_EXCLUIDOS:
            self.assertTrue(self.r["excluidos"][n], n)
        for n in NOMBRES_OK:
            self.assertFalse(self.r["excluidos"][n], n)
        self.assertTrue(self.r["excluidoPorId"])  # MLA80862058, Likon sin la marca en el título
        # destacadosLandingBF: saca BGH y Likon y se queda con los 3 primeros que quedan.
        self.assertEqual(self.r["destacados"], ["MLA2", "MLA3", "MLA4"])


class TestModoBFEnLasPaginas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        leer = lambda p: (FRONT / p).read_text(encoding="utf-8")
        cls.bf = leer("app/black-friday/page.tsx")
        cls.mejores = leer("app/mejores/[slug]/page.tsx")
        cls.guias = leer("app/guias/[slug]/page.tsx")
        cls.precio_hoy = leer("app/precio-hoy/[slug]/page.tsx")
        cls.landing = leer("components/black-friday/LandingBF.tsx")
        cls.guia_bf = leer("components/black-friday/GuiaBF.tsx")
        cls.aviso = leer("components/AvisoBFRubro.tsx")
        cls.termino = leer("components/black-friday/TerminoBF.tsx")
        cls.cta = leer("components/CtaOfertaDestacada.tsx")
        cls.partes = leer("components/PartesTarjeta.tsx")
        cls.lib_cta = leer("lib/cta-destacados.ts")

    def test_isr_en_las_paginas_que_dependen_de_la_fecha(self):
        # 27/11 (ahorro Vercel): TTL largo; igual se vuelve a evaluar el modo al menos cada 6-12 h.
        for src, ttl in ((self.bf, 43200), (self.mejores, 21600), (self.guias, 43200), (self.precio_hoy, 21600)):
            self.assertIn(f"export const revalidate = {ttl}", src)

    def test_title_h1_hero_y_jsonld_usan_el_modo(self):
        self.assertIn("PAGINA_BF[modoBF()]", self.bf)
        self.assertIn("textos.h1", self.bf)
        self.assertIn("itemListLD(textos.h1, URL, destacado.productos)", self.bf)
        self.assertIn("tituloLandingModoBF(bfl.h1, bfl.titulo, modo)", self.mejores)
        self.assertIn("textoModoBF(bfl.descripcion, modo)", self.mejores)
        self.assertIn("const h1 = textoModoBF(l.h1, modo)", self.landing)
        self.assertIn("itemListLD(h1, url, productos)", self.landing)
        self.assertIn("ETIQUETA_MODO_BF[modo]", self.landing)
        self.assertIn("ETIQUETA_MODO_BF[modo]", self.guia_bf)
        self.assertIn("guiaConModoBF", self.guias)
        self.assertIn("eventosModoBF", self.guias)
        for src in (self.bf, self.landing, self.guia_bf, self.guias):
            self.assertIn("<TerminoBF modo={modo}", src)

    def test_termino_lleva_a_ofertas_vigentes(self):
        self.assertIn("modo !== 'termino'", self.termino)
        self.assertIn("href={DEALS_URL}", self.termino)
        self.assertIn("Ver las ofertas vigentes de hoy", self.termino)
        self.assertIn("min-h-12", self.termino)

    def test_destacados_arriba_de_todo_en_black_friday(self):
        h1 = self.bf.index("</h1>")
        cuadro = self.bf.index("<CtaOfertaDestacada cta={destacado}")
        self.assertLess(h1, cuadro)
        # Antes del cuadro no hay otra grilla de productos (el top con porcentajes va debajo del hero).
        self.assertGreater(self.bf.index("<TopConcurso"), cuadro)
        self.assertGreater(self.bf.index("<CajaQueConviene"), cuadro)
        self.assertIn("ctaDestacado('/black-friday')", self.bf)
        self.assertIn("DESTACADOS_MODO_BF[modo]", self.bf)

    def test_destacados_arriba_de_todo_en_las_landings(self):
        self.assertIn("destacadosLandingBF(productos)", self.landing)
        self.assertIn("productosBF(l).filter(p => !excluidoDeCta(p))", self.landing)
        hero = self.landing.split("data-seccion={`bf_${l.slug}_hero`}")[1]
        self.assertLess(hero.index("bf_${l.slug}_destacados"), hero.index("<RespuestaCorta"))
        self.assertIn("<OtrosDestacados", hero)

    def test_botones_48px_amarillos_y_sin_descuentos(self):
        boton_ml = re.search(r"export const BOTON_ML =\s*'([^']+)'", self.partes).group(1)
        boton_hero = re.search(r"export const BOTON_HERO =\s*'([^']+)'", self.landing).group(1)
        for b in (boton_ml, boton_hero):
            self.assertIn("min-h-12", b)  # 48 px
            self.assertIn("bg-[#FACC15]", b)
        self.assertIn("BOTON_ML", self.cta)
        otros = self.landing.split("export function OtrosDestacados(")[1].split("\nexport ")[0]
        self.assertIn("className={BOTON_HERO}", otros)
        self.assertIn("href={p.url}", otros)
        for src in (self.cta, otros, self.termino):
            sin_comentarios = re.sub(r"//.*", "", src).lower()
            self.assertNotRegex(sin_comentarios, r"\d+\s*%|descuento_pct|precio_anterior|line-through|m[ií]nimo hist|cup[oó]n")

    def test_cuadro_de_black_friday_sin_marcas_excluidas(self):
        bloque = self.lib_cta.split("'/black-friday': {")[1].split("\n  },")[0]
        self.assertNotRegex(re.sub(r"//.*", "", bloque), r"(?i)\b(bgh|likon|hp|omen|victus)\b")
        catalogo = {p["id_ml"]: p for p in json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]}
        for i in re.findall(r"id: '(MLA\d+)'", bloque):
            p = catalogo.get(i)
            if p:  # el bot poda a los 14 días: el cuadro saltea los que ya no están
                self.assertNotRegex(p["titulo"], r"(?i)\b(bgh|likon|hp|omen|victus)\b", i)
        self.assertIn("bgh|likon|hp|omen|victus", self.lib_cta)

    def test_guias_cyber_con_links_a_black_friday_y_su_landing(self):
        self.assertIn("GUIA_CYBER_A_LANDING_BF[g.slug]", self.guias)
        self.assertIn('href="/black-friday"', self.guias)
        self.assertIn("Todo el Black Friday 2026", self.guias)

    def test_aviso_por_rubro_sigue_el_modo(self):
        self.assertIn("modoBF()", self.aviso)
        self.assertIn('href="/black-friday"', self.aviso)
        self.assertIn("Black Friday HOY", self.aviso)
        self.assertIn("landingBFPorSlug(ruta)", (FRONT / "lib" / "bf-enlaces.ts").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
