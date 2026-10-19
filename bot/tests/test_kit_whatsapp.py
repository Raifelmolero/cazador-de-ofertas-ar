import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import cazador_bot as cb  # noqa: E402


def _d(i, title, precio=500_000, desc=40, low=False, inflada=False):
    return {"id": f"MLA{i}", "title": title, "price_cur": precio, "price_prev": precio * 2,
            "discount": desc, "hist_low": low, "inflada": inflada, "url": "u"}


class KitWhatsApp(unittest.TestCase):
    def test_lo_mejor_de_casa_una_por_familia(self):
        deals = [
            _d(1, "Hidrolavadora Industrial 130 Bar", low=True),
            _d(2, "Colchón Norden 2 Plazas", low=True),
            _d(3, "Colchón Viggo 2 Plazas", low=True),
            _d(4, "Aire Acondicionado Split Inverter 3000 Frigorias", low=True),
            _d(5, "Smart Tv Samsung 65 Qled", low=False),
            _d(6, "Heladera No Frost Inflada", low=True, inflada=True),
            _d(7, "Licuadora barata", precio=30_000, low=True),
        ]
        kit = cb.elegir_kit_wa(deals, [], set())
        titulos = [d["title"] for d in kit]
        self.assertEqual(len(kit), 3)
        self.assertNotIn("Hidrolavadora Industrial 130 Bar", titulos)
        self.assertNotIn("Heladera No Frost Inflada", titulos)
        self.assertEqual(sum("Colchón" in t for t in titulos), 1)
        self.assertIn("Smart Tv Samsung 65 Qled", titulos)

    def test_no_repite_y_completa_con_respaldo(self):
        deals = [_d(1, "Colchón Norden", low=True)]
        respaldo = [_d(9, "Taladro Percutor"), _d(8, "Ventilador")]
        kit = cb.elegir_kit_wa(deals, respaldo, {"MLA1"})
        self.assertEqual([d["id"] for d in kit], ["MLA9", "MLA8"])

    def test_recent_kit_ids_lee_el_log(self):
        tmp = Path(tempfile.mkdtemp()) / "log.jsonl"
        ahora = datetime.now(timezone.utc).isoformat()
        tmp.write_text("\n".join([
            json.dumps({"ts": ahora, "ch": "whatsapp_kit", "id": "MLA1"}),
            json.dumps({"ts": ahora, "ch": "telegram", "id": "MLA2"}),
            json.dumps({"ts": "2026-01-01T00:00:00+00:00", "ch": "whatsapp_kit", "id": "MLA3"}),
        ]), encoding="utf-8")
        self.assertEqual(cb.recent_kit_ids(path=tmp), {"MLA1"})


if __name__ == "__main__":
    unittest.main()
