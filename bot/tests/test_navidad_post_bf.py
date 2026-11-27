"""Del Black Friday a Navidad (pedido del 27/11/2026).

- lib/navidad-post-bf.ts y lib/temporada.ts se transpilan con el TypeScript del frontend y se corren
  en node con fechas fijas en hora argentina: cuándo termina el BF (domingo 29/11 23:59 ART), cuándo
  la home pasa a Navidad, ventana del link a /regalos-navidad y categoría equivalente de cada landing.
- El resto son chequeos de que las páginas usan esos módulos (cuadro «terminó», links, FAQ de envíos).
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
NAVIDAD = FRONT / "lib" / "navidad-post-bf.ts"
TEMPORADA = FRONT / "lib" / "temporada.ts"
LANDINGS = FRONT / "lib" / "black-friday-landings.ts"
CATEGORIAS = FRONT / "lib" / "categorias.ts"

HAY_NODE = bool(shutil.which("node")) and TS.exists()

# Carga .ts transpilados; los imports relativos («./cybermonday») se resuelven igual.
_NODE = r"""
const ts = require(process.argv[1]);
const fs = require('fs');
const path = require('path');
const cache = {};
function cargar(ruta) {
  if (cache[ruta]) return cache[ruta].exports;
  const src = fs.readFileSync(ruta, 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  cache[ruta] = m;
  const req = (n) => n.startsWith('./') ? cargar(path.join(path.dirname(ruta), n + '.ts')) : require(n);
  new Function('module', 'exports', 'require', js)(m, m.exports, req);
  return m.exports;
}
const N = cargar(process.argv[2]);
const T = cargar(process.argv[3]);
const datos = JSON.parse(process.argv[4]);
const out = {};
out.termino = Object.fromEntries(datos.instantes.map(i => [i, N.terminoBF(new Date(i))]));
out.temporada = Object.fromEntries(datos.instantes.map(i => [i, (T.temporadaActual(new Date(i)) || {}).id || null]));
out.enlace = Object.fromEntries(datos.instantes.map(i => [i, N.enlaceNavidadVigente(new Date(i))]));
out.categorias = N.CATEGORIA_POR_LANDING_BF;
out.sinLanding = N.categoriaEquivalente(undefined) || null;
out.desconocida = N.categoriaEquivalente('black-friday-no-existe') || null;
out.guias = Object.fromEntries(datos.guias.map(g => [g, N.guiaLlevaNavidad(g)]));
out.desc = {
  previa: N.descripcionConNavidad(datos.descripcion, 'previa', 'Notebooks'),
  ultimas: N.descripcionConNavidad(datos.descripcion, 'ultimas', 'Notebooks'),
  sinRubro: N.descripcionConNavidad(datos.descripcion, 'termino'),
  rubros: Object.fromEntries(datos.rubros.map(r => [r, N.descripcionConNavidad(datos.descripcion, 'termino', r)])),
};
out.faq = N.FAQ_ENVIO_NAVIDAD;
out.bajadas = T.TEMPORADAS.map(t => t.titulo + ' ' + t.bajada);
process.stdout.write(JSON.stringify(out));
"""

# instante → (¿terminó el BF?, temporada de la home, ¿link a Navidad?)
INSTANTES = {
    "2026-11-26T23:59:59-03:00": (False, "blackfriday", False),
    "2026-11-27T00:00:00-03:00": (False, "blackfriday", True),
    "2026-11-27T23:59:59-03:00": (False, "blackfriday", True),
    "2026-11-28T00:00:00-03:00": (False, "blackfriday-finde", True),
    "2026-11-29T23:59:59-03:00": (False, "blackfriday-finde", True),
    "2026-11-30T02:59:59Z": (False, "blackfriday-finde", True),  # 23:59:59 del 29 en Argentina
    "2026-11-30T00:00:00-03:00": (True, "navidad", True),
    "2026-11-30T03:00:00Z": (True, "navidad", True),
    "2026-12-24T12:00:00-03:00": (True, "navidad", True),
    "2027-01-06T23:59:59-03:00": (True, "navidad", True),
    "2027-01-07T00:00:00-03:00": (True, None, False),
}

GUIAS = {
    "que-notebook-comprar-black-friday": True,
    "que-celular-comprar-cyber-monday": True,
    "que-smart-tv-comprar-black-friday": True,
    "google-tv-roku-tizen-o-webos-cual-conviene": True,
    "como-saber-si-un-descuento-de-mercado-libre-es-real": False,
    "cuanto-cobra-mercado-libre-por-vender": False,
}

# Description escrita para la previa: en 'termino' se reemplaza entera (no queda «Cyber Monday 2026»).
DESCRIPCION = "Black Friday y Cyber Monday 2026 en Argentina: notebooks elegidas. Black Friday 2026: 27/11."


# Rubros de /categoria/[slug] y páginas de rubro (app/<ruta>/page.tsx) que tienen que existir.
def _rutas_validas():
    cats = set(re.findall(r"^    slug: '([a-z0-9-]+)'", CATEGORIAS.read_text(encoding="utf-8"), re.M))
    return cats


@unittest.skipUnless(HAY_NODE, "hace falta node y frontend/node_modules (npm ci)")
class TestNavidadPostBFEnNode(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        rubros = re.findall(r"rubro: '([^']+)'", LANDINGS.read_text(encoding="utf-8"))
        datos = {"instantes": list(INSTANTES), "guias": list(GUIAS), "descripcion": DESCRIPCION, "rubros": rubros}
        res = subprocess.run(
            ["node", "-e", _NODE, str(TS), str(NAVIDAD), str(TEMPORADA), json.dumps(datos)],
            capture_output=True, text=True, timeout=60,
        )
        if res.returncode != 0:
            raise AssertionError(res.stderr)
        cls.r = json.loads(res.stdout)

    def test_fin_del_black_friday_en_hora_argentina(self):
        for i, (termino, _, _) in INSTANTES.items():
            self.assertEqual(self.r["termino"][i], termino, i)

    def test_home_pasa_a_navidad_despues_del_bf(self):
        for i, (_, temporada, _) in INSTANTES.items():
            self.assertEqual(self.r["temporada"][i], temporada, i)

    def test_ventana_del_link_a_regalos_navidad(self):
        for i, (_, _, enlace) in INSTANTES.items():
            self.assertEqual(self.r["enlace"][i], enlace, i)

    def test_banner_sin_textos_vencidos(self):
        for b in self.r["bajadas"]:
            self.assertNotRegex(b, r"(?i)preventa|16/11|mir[aá] la previa", b)

    def test_cada_landing_bf_tiene_categoria_equivalente_que_existe(self):
        slugs = set(re.findall(r"^    slug: '(black-friday-[a-z0-9-]+)'", LANDINGS.read_text(encoding="utf-8"), re.M))
        self.assertTrue(slugs)
        self.assertEqual(set(self.r["categorias"]), slugs)
        cats = _rutas_validas()
        for slug, d in self.r["categorias"].items():
            href = d["href"]
            if href.startswith("/categoria/"):
                self.assertIn(href.split("/")[2], cats, slug)
            else:
                self.assertTrue((FRONT / "app" / href.strip("/") / "page.tsx").exists(), f"{slug} → {href}")
        self.assertIsNone(self.r["sinLanding"])
        self.assertIsNone(self.r["desconocida"])

    def test_guias_regalables(self):
        for g, esperado in GUIAS.items():
            self.assertEqual(self.r["guias"][g], esperado, g)

    def test_descripcion_con_navidad_solo_al_terminar_y_sin_pasarse(self):
        d = self.r["desc"]
        self.assertEqual(d["previa"], DESCRIPCION)
        self.assertEqual(d["ultimas"], DESCRIPCION)
        self.assertTrue(d["rubros"])
        for rubro, t in list(d["rubros"].items()) + [("", d["sinRubro"])]:
            self.assertLessEqual(len(t), 158, t)
            self.assertIn("Ya pasó el Black Friday 2026", t)
            self.assertIn("regalos de Navidad", t)
            self.assertNotIn("Cyber Monday", t)
            if rubro:
                self.assertIn(rubro[0].lower() + rubro[1:] + " que siguen", t)

    def test_faq_de_envios_sin_prometer_fechas(self):
        self.assertTrue(self.r["faq"])
        todo = " ".join(f["q"] + " " + f["a"] for f in self.r["faq"])
        self.assertIn("revisá la fecha de entrega en la publicación", todo.lower())
        # Ninguna fecha de corte de Mercado Libre inventada: la única fecha es el 24/12 de Navidad.
        self.assertEqual(set(re.findall(r"\d{1,2}/\d{1,2}", todo)), {"24/12"})
        self.assertNotRegex(todo, r"(?i)garantizad|te llega seguro|llega antes del 24")


class TestNavidadEnLasPaginas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        leer = lambda p: (FRONT / p).read_text(encoding="utf-8")
        cls.termino = leer("components/black-friday/TerminoBF.tsx")
        cls.bf = leer("app/black-friday/page.tsx")
        cls.landing = leer("components/black-friday/LandingBF.tsx")
        cls.guia_bf = leer("components/black-friday/GuiaBF.tsx")
        cls.guias = leer("app/guias/[slug]/page.tsx")
        cls.mejores = leer("app/mejores/[slug]/page.tsx")
        cls.hoy = leer("app/hoy/page.tsx")
        cls.regalos = leer("app/regalos-navidad/page.tsx")
        cls.presupuesto = leer("app/regalos-navidad/[presupuesto]/page.tsx")
        cls.temporada = leer("lib/temporada.ts")
        cls.ticket = leer("lib/regalos-ticket-alto.ts")

    def test_cuadro_termino_con_navidad_y_categoria(self):
        self.assertIn("Black Friday terminó — estas siguen con buen precio", self.termino)
        self.assertIn('href="/regalos-navidad"', self.termino)
        self.assertIn("categoriaEquivalente(landing)", self.termino)
        self.assertIn("<TerminoBF modo={modo} landing={l.slug}", self.landing)
        self.assertIn("<TerminoBF modo={modo} landing={g.bf.landing}", self.guia_bf)
        self.assertIn("<TerminoBF modo={modo} landing={landingBF?.slug}", self.guias)

    def test_links_a_regalos_navidad(self):
        for src in (self.bf, self.landing, self.guia_bf, self.guias, self.mejores, self.hoy):
            self.assertIn("<EnlaceNavidad", src)
        self.assertIn("guiaLlevaNavidad(g.slug)", self.guias)

    def test_home_sin_textos_vencidos(self):
        self.assertNotIn("La previa arranca el lunes 16/11", self.hoy)
        self.assertNotIn("Mirá la previa del Black Friday", self.hoy)
        self.assertIn("desde: diaSiguiente(BLACK_FRIDAY.ultimoDia)", self.temporada)

    def test_regalos_con_ticket_alto_y_faq_de_envios(self):
        for src in (self.regalos, self.presupuesto):
            self.assertIn("<RegalosTicketAlto", src)
            self.assertIn("FAQ_ENVIO_NAVIDAD", src)
        self.assertIn("bloquesTicketAlto(4, r.min, r.max)", self.presupuesto)
        # Solo datos del repo: el bloque sale de ofertasDeCategoria, sin precios escritos a mano.
        self.assertIn("ofertasDeCategoria", self.ticket)
        self.assertNotRegex(re.sub(r"//.*", "", self.ticket), r"precio_actual:\s*\d")


if __name__ == "__main__":
    unittest.main()
