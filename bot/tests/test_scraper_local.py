import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import scraper_local as sl  # noqa: E402


class TestCorrida(unittest.TestCase):
    def test_sin_estado_puede(self):
        with tempfile.TemporaryDirectory() as t:
            self.assertTrue(sl.puede_correr(Path(t) / "e.json")[0])

    def test_descansa_tras_bloqueo(self):
        with tempfile.TemporaryDirectory() as t:
            p = Path(t) / "e.json"
            ahora = datetime.now(timezone.utc)
            sl.anotar(p, True, ahora)
            self.assertFalse(sl.puede_correr(p, ahora + timedelta(hours=10))[0])
            self.assertTrue(sl.puede_correr(p, ahora + timedelta(hours=25))[0])

    def test_no_repite_enseguida(self):
        with tempfile.TemporaryDirectory() as t:
            p = Path(t) / "e.json"
            ahora = datetime.now(timezone.utc)
            sl.anotar(p, False, ahora)
            self.assertFalse(sl.puede_correr(p, ahora + timedelta(hours=1))[0])
            self.assertTrue(sl.puede_correr(p, ahora + timedelta(hours=6))[0])


if __name__ == "__main__":
    unittest.main()
