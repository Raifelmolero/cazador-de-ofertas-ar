import json
import sys
import unittest
from collections import Counter
from datetime import date, datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import parte_diario as pd  # noqa: E402


class TestParteDiario(unittest.TestCase):
    def test_cuenta_solo_ultimas_24h(self):
        ahora = datetime(2026, 11, 4, 11, 0, tzinfo=timezone.utc)
        lineas = [
            json.dumps({"ts": "2026-11-04T04:00:00+00:00", "ch": "telegram"}),
            json.dumps({"ts": "2026-11-04T05:00:00+00:00", "ch": "telegram"}),
            json.dumps({"ts": "2026-11-02T05:00:00+00:00", "ch": "instagram"}),
            "basura",
        ]
        self.assertEqual(pd.posts_ultimas_24h(lineas, ahora), Counter({"telegram": 2}))

    def test_prioridad_de_la_tarea(self):
        self.assertIn("Cargar ofertas", pd.tarea_sugerida(10, ["Bot"], [{"number": 1, "title": "x"}]))
        self.assertIn("Bot", pd.tarea_sugerida(900, ["Bot"], []))
        self.assertIn("1 solo build", pd.tarea_sugerida(900, [], [{"number": 1, "title": "x"}]))
        self.assertIn("orden", pd.tarea_sugerida(900, [], []))

    def test_parte_completo(self):
        t = pd.armar_parte(date(2026, 11, 4), 900, Counter({"telegram": 3}), [],
                           [{"number": 65, "title": "SEO"}])
        self.assertTrue(t.startswith("☀️ Parte del 4/11"))
        self.assertIn("#65 SEO", t)
        self.assertIn(pd.TERMOMETRO, t)

    def test_sin_posts_avisa(self):
        self.assertIn("nada ⚠️", pd.armar_parte(date(2026, 11, 4), 900, Counter(), [], []))


if __name__ == "__main__":
    unittest.main()
