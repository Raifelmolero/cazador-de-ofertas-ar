import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import oficina  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]


class Oficina(unittest.TestCase):
    def test_analisis_ventana_semanal(self):
        self.assertEqual(oficina.analisis()["ventana_horas"], 192)

    def test_marketing_cuenta_todos_los_guias(self):
        todos = oficina._slugs_guias()
        solo_base = oficina._slugs(ROOT / "frontend" / "lib" / "guias.ts")
        self.assertGreater(len(todos), len(solo_base))
        m = oficina.marketing(datetime.now(timezone.utc))
        self.assertEqual(m["metricas"][0]["valor"], len(todos))

    def test_marketing_con_slugs_tiene_ultima_actividad(self):
        self.assertTrue(oficina._slugs_guias())
        self.assertIsNotNone(oficina.marketing(datetime.now(timezone.utc))["ultima_actividad"])

    def test_marketing_conserva_fecha_previa_si_no_cambia(self):
        total = len(oficina._slugs_guias()) + len(oficina._slugs(ROOT / "frontend" / "lib" / "comparativas.ts"))
        previo = {"ultima_actividad": "2026-11-01T00:00:00+00:00",
                  "metricas": [{"valor": total}]}
        with mock.patch.object(oficina, "_marketing_previo", return_value=previo):
            m = oficina.marketing(datetime.now(timezone.utc))
        self.assertEqual(m["ultima_actividad"], "2026-11-01T00:00:00+00:00")

    def test_guardia_honesta(self):
        g = oficina.guardia()
        self.assertTrue(g["automatico"])
        self.assertIn("2 h", g["frecuencia"])
        self.assertIsNone(g["ultima_actividad"])  # no hay log: no se inventa
        self.assertGreaterEqual(g["ventana_horas"], 4)

    def test_guardia_en_el_json(self):
        with tempfile.TemporaryDirectory() as t, mock.patch.object(oficina, "OUT", Path(t) / "o.json"):
            oficina.main()
            ids = [d["id"] for d in json.loads((Path(t) / "o.json").read_text(encoding="utf-8"))["departamentos"]]
        self.assertIn("guardia", ids)


class Robots(unittest.TestCase):
    def test_robots_bloquea_oficina(self):
        src = (ROOT / "frontend" / "app" / "robots.ts").read_text(encoding="utf-8")
        # Los grupos con user-agent propio ignoran la regla '*', así que
        # todas las reglas tienen que bloquear /oficina.
        reglas = [ln for ln in src.splitlines() if "userAgent:" in ln]
        self.assertGreaterEqual(len(reglas), 2)
        for ln in reglas:
            self.assertIn("disallow: '/oficina'", ln, msg=ln)



class PanelDecision(unittest.TestCase):
    def test_panel_json_honesto(self):
        d = json.loads((ROOT / "frontend" / "data" / "oficina-panel.json").read_text(encoding="utf-8"))
        self.assertEqual(d["metas"], {"semana": 2000000, "mes": 10000000})
        for k in ("semana", "mes"):  # fechas ISO, sin etiquetas escritas a mano
            self.assertRegex(d[k]["desde"], r"^\d{4}-\d{2}-\d{2}$")
            self.assertNotIn("rango", d[k])
        self.assertIsNone(d["cupos"]["vercel"]["pct_semana"])  # sin dato real: null, no inventado
        self.assertEqual(len(d["equipo"]["agentes"]) + 1, 5)
        self.assertEqual(d["equipo"]["aparte"], ["Vida Personal", "Asesor Financiero"])

if __name__ == "__main__":
    unittest.main()
