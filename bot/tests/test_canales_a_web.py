"""Canales que pasan a linkear la ficha /precio/<slug> (Trello #03)."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import cazador_bot as bot  # noqa: E402
import shorts  # noqa: E402

DEAL = {"id": "MLA1", "url": "https://www.mercadolibre.com.ar/p/MLA1", "title": "Heladera",
        "discount": 30, "price_prev": 100000, "price_cur": 70000}
PAG = {"MLA1": "heladera-x"}


class TestCanalLink(unittest.TestCase):
    def test_con_ficha_va_a_la_web_con_utm(self):
        for src in ("facebook", "youtube", "whatsapp"):
            url = bot.canal_link(DEAL, "aff", src, src, PAG)
            self.assertIn("/precio/heladera-x?", url)
            self.assertIn(f"utm_source={src}&utm_medium=social", url)

    def test_sin_ficha_sigue_ml(self):
        url = bot.canal_link(DEAL, "aff", "facebook", "facebook", {})
        self.assertEqual(url, bot.affiliate_url(DEAL["url"], "aff", "facebook"))

    def test_wa_kit_usa_web_si_hay_ficha(self):
        txt = bot.wa_kit([DEAL], "aff", "whatsapp", PAG)
        self.assertIn("/precio/heladera-x?utm_source=whatsapp&utm_medium=social", txt)
        self.assertNotIn("mercadolibre.com.ar/p/MLA1", txt)

    def test_wa_kit_sin_paginas_igual_que_antes(self):
        txt = bot.wa_kit([DEAL], "aff", "whatsapp")
        self.assertIn(bot.affiliate_url(DEAL["url"], "aff", "whatsapp"), txt)

    def test_main_usa_canal_link_en_fb_y_youtube(self):
        src = Path(bot.__file__).read_text(encoding="utf-8")
        self.assertIn('canal_link(fb_deal, affiliate_id, tool_fb, "facebook", paginas)', src)
        self.assertIn('"youtube", paginas)', src)

    def test_descripcion_youtube_neutra(self):
        d = shorts.yt_description(DEAL, "https://x/?utm_source=youtube", "https://web/precio/a")
        self.assertIn("Ver la oferta: https://web/precio/a", d)


class TestPinterestFeed(unittest.TestCase):
    def test_feed_lleva_utm_medium(self):
        ts = Path(__file__).resolve().parents[2] / "frontend/app/feed.xml/route.ts"
        self.assertIn("utm_source=pinterest&utm_medium=social", ts.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
