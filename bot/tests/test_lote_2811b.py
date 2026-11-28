"""Lote 28/11 (pos Black Friday, camino a Navidad):

- textoModoBF pasa a pasado «El Black Friday 2026 (en Argentina) es el viernes 27 de noviembre»
  (respuesta corta de las guías BF: notebooks, TV 50", tablets, smartwatch…).
- Bloques destacados sin marcas excluidas: regalos de ticket alto (/regalos-navidad) y
  recomendado/más barato/franja alta/en su mínimo de /mejor/[slug].
- /mejor/[slug]: sin el banner «Black Friday es el viernes 27/11», con link a Navidad y cruce de rubros.
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
HAY_NODE = bool(shutil.which("node")) and TS.exists()

_NODE = r"""
const ts = require(process.argv[1]);
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', 'require', js)(m, m.exports, require);
const textos = JSON.parse(process.argv[3]);
const out = {};
for (const modo of ['previa', 'hoy', 'ultimas', 'termino']) out[modo] = textos.map(t => m.exports.textoModoBF(t, modo));
process.stdout.write(JSON.stringify(out));
"""


def leer(rel):
    return (FRONT / rel).read_text(encoding="utf-8")


def respuestas_guias_bf():
    src = leer("lib/guias-bf-2026.ts")
    return [r for r in re.findall(r"'([^']*Black Friday 2026 en Argentina es el viernes 27 de noviembre\.)'", src)]


@unittest.skipUnless(HAY_NODE, "hace falta node y frontend/node_modules/typescript")
class TextoModoBF(unittest.TestCase):
    def setUp(self):
        self.textos = respuestas_guias_bf() + [
            "El Black Friday 2026 es el viernes 27 de noviembre. Muchas tiendas suben el precio.",
        ]
        r = subprocess.run(
            ["node", "-e", _NODE, str(TS), str(FRONT / "lib" / "cybermonday.ts"), json.dumps(self.textos)],
            capture_output=True, text=True, check=True,
        )
        self.out = json.loads(r.stdout)

    def test_hay_guias_para_probar(self):
        self.assertGreaterEqual(len(self.textos), 4)

    def test_previa_sin_cambios(self):
        self.assertEqual(self.out["previa"], self.textos)

    def test_hoy(self):
        for t in self.out["hoy"]:
            self.assertIn("es hoy, viernes 27 de noviembre", t)

    def test_despues_en_pasado(self):
        for modo in ("ultimas", "termino"):
            for t in self.out[modo]:
                self.assertNotIn("es el viernes 27", t)
                self.assertIn("fue el viernes 27 de noviembre", t)
        self.assertIn("El Black Friday 2026 en Argentina fue el viernes 27 de noviembre.", self.out["termino"][0])


class DestacadosSinMarcasExcluidas(unittest.TestCase):
    def test_regalos_ticket_alto_filtra(self):
        src = leer("lib/regalos-ticket-alto.ts")
        self.assertIn("MARCAS_EXCLUIDAS_CTA.test(p.titulo)", src)

    def test_mejor_destacados_filtran(self):
        src = leer("lib/presupuesto.ts")
        self.assertIn("!MARCAS_EXCLUIDAS_CTA.test(e.titulo)", src)
        self.assertIn("enMinimo: marcas.filter", src)
        self.assertIn("sinExcluidas", src)

    def test_regex_cubre_las_marcas(self):
        src = leer("lib/cta-destacados.ts")
        rx = re.search(r"MARCAS_EXCLUIDAS_CTA = /(.+)/i", src).group(1)
        for n in ["Notebook Hp Omen 17", "Hp Victus 15", "Asus Vivobook S16", "HP OmniBook 3", "Aire BGH Silent"]:
            self.assertRegex(n.lower(), rx)
        for n in ["Lenovo IdeaPad Slim 3", "Asus TUF A15", "Acer Nitro V16"]:
            self.assertNotRegex(n.lower(), rx)


class MejorSinBannerBF(unittest.TestCase):
    def setUp(self):
        self.src = leer("app/mejor/[slug]/page.tsx")

    def test_sin_banner_viejo(self):
        self.assertNotIn("es el viernes 27/11", self.src)

    def test_navidad_y_cruce(self):
        self.assertIn("<EnlaceNavidad", self.src)
        self.assertIn("cruzados.map", self.src)
        self.assertIn("Navidad ${anio}", self.src)

    def test_intro_comparativas_por_modo(self):
        self.assertIn("textoModoBF(c.intro, modoBF())", leer("app/mejores/[slug]/page.tsx"))


if __name__ == "__main__":
    unittest.main()
