"""Tests del reporte semanal: que cada canal se llame por su nombre y que el
reporte incluya a Facebook y el pedido de la captura del panel de ML."""

import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import weekly_report as wr  # noqa: E402


def entry(ch: str, id_: str = "MLA1") -> dict:
    return {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "ch": ch, "id": id_, "title": "Producto", "discount": 40, "price": 50000,
        "low": False, "excl": False,
    }


class TestBuildReport(unittest.TestCase):
    def test_los_canales_reel_y_facebook_salen_con_su_nombre(self):
        rep = wr.build_report([entry("reel", "A"), entry("facebook", "B")])
        self.assertIn("IG reels: 1", rep)
        self.assertIn("Facebook: 1", rep)
        self.assertNotIn("reel:", rep)

    def test_incluye_seguidores_de_facebook_con_la_variacion(self):
        rep = wr.build_report([entry("telegram")], {"fb": 30}, {"fb": 25})
        self.assertIn("Facebook: 30 (+5 vs sem. pasada)", rep)

    def test_facebook_sin_dato_dice_sin_dato_pero_no_rompe(self):
        rep = wr.build_report([entry("telegram")], {"tg": 2}, {})
        self.assertIn("Facebook: s/d", rep)

    def test_pide_la_captura_del_panel_de_ml_por_canal(self):
        rep = wr.build_report([entry("telegram")])
        self.assertIn("Panel de afiliados ML", rep)
        self.assertIn("facebook", rep)


if __name__ == "__main__":
    unittest.main()
