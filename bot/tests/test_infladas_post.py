import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import infladas_post as ip  # noqa: E402

CASO = {"titulo": "Hidrolavadora Trent 1600 psi con accesorios", "descuento_anunciado": 40,
        "precio_hoy": 120000, "minimo_registrado": 90000, "minimo_fecha": "2026-09-10",
        "diferencia_pct": 25}


class TestInfladasPost(unittest.TestCase):
    def test_no_publica_datos_viejos_ni_vacios(self):
        self.assertEqual(ip.elegir({"fecha": "2026-09-01", "items": [CASO]}, date(2026, 9, 27)), [])
        self.assertEqual(ip.elegir({"fecha": "2026-09-27", "items": []}, date(2026, 9, 27)), [])
        self.assertEqual(ip.elegir({"items": [CASO]}, date(2026, 9, 27)), [])

    def test_toma_hasta_tres(self):
        casos = ip.elegir({"fecha": "2026-09-26", "items": [CASO] * 5}, date(2026, 9, 27))
        self.assertEqual(len(casos), 3)

    def test_textos(self):
        tg = ip.texto_telegram([CASO])
        self.assertIn("10/09", tg)
        self.assertIn("/descuentos-inflados", tg)
        self.assertNotIn("matt_", tg)
        th = ip.texto_threads([dict(CASO, titulo="x" * 60)] * 3)
        self.assertLessEqual(len(th), 500)
        self.assertTrue(th)


if __name__ == "__main__":
    unittest.main()
