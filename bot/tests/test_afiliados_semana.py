"""Tests de la sección "Ganancia por etiqueta" del reporte semanal (CSV del panel de ML)."""

import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import weekly_report as wr  # noqa: E402

CAB = "etiqueta,clics,unidades,ganancia\n"


class TestAfiliados(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = Path(self.tmp.name)
        for attr, val in (("AFILIADOS_DIR", self.dir),
                          ("AFILIADOS_SEMANA_PATH", self.dir / "afiliados_semana.csv")):
            p = mock.patch.object(wr, attr, val)
            p.start()
            self.addCleanup(p.stop)
        self.addCleanup(self.tmp.cleanup)

    def test_historico_real_se_lee(self):
        real = Path(wr.BASE_DIR) / "state" / "afiliados_2026-09-28.csv"
        d = wr.leer_afiliados(real)
        self.assertEqual(d["web"], {"clics": 267, "unidades": 27, "ganancia": 574519})
        self.assertEqual(set(d), {"web", "extension", "herramientas", "instagram", "threads"})

    def test_tolera_formato_pesos(self):
        f = self.dir / "x.csv"
        f.write_text(CAB + 'web,"1.267",27,"$574.519"\n', encoding="utf-8")
        self.assertEqual(wr.leer_afiliados(f)["web"],
                         {"clics": 1267, "unidades": 27, "ganancia": 574519})

    def test_sin_csv_explica_como_cargarlo(self):
        txt = wr.bloque_afiliados()
        self.assertIn("Ganancia por etiqueta", txt)
        self.assertIn("afiliados_semana.csv", txt)
        self.assertIn("etiqueta,clics,unidades,ganancia", txt)

    def test_ranking_variacion_y_conversion(self):
        (self.dir / "afiliados_2026-09-28.csv").write_text(
            CAB + "web,267,27,574519\ninstagram,20,0,0\n", encoding="utf-8")
        (self.dir / "afiliados_semana.csv").write_text(
            CAB + "instagram,40,2,30000\nweb,300,30,600000\nthreads,10,0,0\n", encoding="utf-8")
        with mock.patch.object(wr, "afiliados_anterior",
                               return_value=self.dir / "afiliados_2026-09-28.csv"):
            txt = wr.bloque_afiliados()
        lines = txt.splitlines()
        self.assertTrue(lines[1].startswith("  1. web: $600.000 (↑$25.481 vs sem. ant.)"))
        self.assertIn("conv 10.0%", lines[1])
        self.assertTrue(lines[2].startswith("  2. instagram: $30.000 (↑$30.000"))
        self.assertIn("40 clics (↑20 vs sem. ant.)", lines[2])
        self.assertIn("conv 5.0%", lines[2])
        self.assertIn("3. threads", lines[3])
        self.assertIn("conv 0.0%", lines[3])
        self.assertIn("Total: $630.000 (↑$55.481 vs sem. ant.) · 350 clics · 32 u.", txt)

    def test_sin_semana_anterior(self):
        txt = wr.bloque_afiliados({"web": {"clics": 0, "unidades": 0, "ganancia": 0}}, {})
        self.assertIn("conv s/d", txt)
        self.assertIn("sin semana anterior", txt)
        self.assertNotIn("sem. ant.)", txt)

    def test_anterior_elige_ultimo_dated_de_semana_pasada(self):
        for f in ("afiliados_2026-09-21.csv", "afiliados_2026-09-28.csv", "afiliados_2026-10-05.csv"):
            (self.dir / f).write_text(CAB, encoding="utf-8")
        hoy = datetime(2026, 10, 5, 22, tzinfo=timezone.utc)
        self.assertEqual(wr.afiliados_anterior(hoy).name, "afiliados_2026-09-28.csv")

    def test_reporte_incluye_la_seccion(self):
        self.assertIn("Ganancia por etiqueta", wr.build_report([]))


if __name__ == "__main__":
    unittest.main()
