import json
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import cazador_bot as cb  # noqa: E402


def _archivo(fechas):
    items = [{"id": f"MLA{i}", "title": "x", "url": "u", "price_prev": 200,
              "price_cur": 100, "discount": 50, "agregada": f}
             for i, f in enumerate(fechas)]
    tmp = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False)
    json.dump({"items": items}, tmp)
    tmp.close()
    return Path(tmp.name)


class AvisoManuales(unittest.TestCase):
    def test_sin_aviso_si_sobran(self):
        p = _archivo(["2026-10-19"] * 120)
        self.assertIsNone(cb.aviso_reponer_manuales(p, date(2026, 10, 19)))

    def test_aviso_si_vencen_en_2_dias(self):
        p = _archivo(["2026-10-15"] * 100 + ["2026-10-19"] * 30)
        txt = cb.aviso_reponer_manuales(p, date(2026, 10, 21))
        self.assertIn("130 vigentes", txt)
        self.assertIn("quedan 30", txt)

    def test_aviso_si_quedan_pocas(self):
        p = _archivo(["2026-10-19"] * 10)
        self.assertIsNotNone(cb.aviso_reponer_manuales(p, date(2026, 10, 19)))


if __name__ == "__main__":
    unittest.main()


class ArreglarTildes(unittest.TestCase):
    def test_mojibake(self):
        sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
        from oferta_manual import arreglar_tildes
        self.assertEqual(arreglar_tildes("ColchÃ³n SueÃ±o"), "Colchón Sueño")
        self.assertEqual(arreglar_tildes("Colchón Sueño"), "Colchón Sueño")
