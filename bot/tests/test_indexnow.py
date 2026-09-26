"""Tests de bot/tools/indexnow.py: qué URLs se avisan en cada modo (sin red)."""
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))

import indexnow  # noqa: E402

SITEMAP = """<?xml version="1.0" encoding="UTF-8"?>
<urlset>
<url><loc>https://cazadordeofertas.com.ar</loc><lastmod>2026-09-26T18:31:16.000Z</lastmod></url>
<url><loc>https://cazadordeofertas.com.ar/guias/vieja</loc><lastmod>2026-09-20T00:00:00.000Z</lastmod></url>
<url><loc>https://cazadordeofertas.com.ar/gastronomia</loc><lastmod>2026-09-20T00:00:00.000Z</lastmod></url>
<url><loc>https://www.calculadoraml.com.ar</loc></url>
</urlset>"""
AHORA = datetime(2026, 9, 26, 20, 0, tzinfo=timezone.utc)
HOME = "https://cazadordeofertas.com.ar"
VIEJA = "https://cazadordeofertas.com.ar/guias/vieja"
NUEVA = "https://cazadordeofertas.com.ar/gastronomia"


class TestIndexNow(unittest.TestCase):
    def setUp(self):
        self.urls = indexnow.parse_sitemap(SITEMAP)

    def test_parse_solo_del_dominio_y_con_fecha(self):
        self.assertEqual(set(self.urls), {HOME, VIEJA, NUEVA})
        self.assertEqual(self.urls[HOME], datetime(2026, 9, 26, 18, 31, 16, tzinfo=timezone.utc))

    def test_sin_memoria_manda_todo_una_vez(self):
        self.assertEqual(indexnow.elegir(self.urls, set(), "push", AHORA), sorted(self.urls))

    def test_push_solo_las_nuevas(self):
        self.assertEqual(indexnow.elegir(self.urls, {HOME, VIEJA}, "push", AHORA), [NUEVA])

    def test_push_sin_nuevas_no_manda_nada(self):
        self.assertEqual(indexnow.elegir(self.urls, {HOME, VIEJA, NUEVA}, "push", AHORA), [])

    def test_diario_suma_las_que_cambiaron(self):
        self.assertEqual(indexnow.elegir(self.urls, {HOME, VIEJA}, "diario", AHORA), sorted([HOME, NUEVA]))

    def test_todo(self):
        self.assertEqual(indexnow.elegir(self.urls, {HOME, VIEJA, NUEVA}, "todo", AHORA), sorted(self.urls))


if __name__ == "__main__":
    unittest.main()
