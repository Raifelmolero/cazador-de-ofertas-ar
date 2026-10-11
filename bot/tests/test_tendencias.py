import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import tendencias  # noqa: E402


class TestTendencias(unittest.TestCase):
    def test_intercala_y_no_repite(self):
        r = tendencias.juntar([["a", "b", "c"], ["B", "d"], ["e"]])
        self.assertEqual([x.lower() for x in r].count("b"), 1)
        self.assertEqual(r[:3], ["a", "B", "e"])

    def test_pocas_keywords_no_arma(self):
        self.assertIsNone(tendencias.armar([["a", "b"]]))

    def test_arma_estructura(self):
        kws = [[f"kw{i}" for i in range(15)]]
        d = tendencias.armar(kws, datetime(2026, 10, 11, tzinfo=timezone.utc))
        self.assertEqual(len(d["items"]), 15)
        self.assertTrue(d["actualizado"].startswith("2026-10-11"))


if __name__ == "__main__":
    unittest.main()
