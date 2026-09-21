"""Tests de shorts.py: títulos, y que sin credenciales no haga nada ni toque la red."""

import os
import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import shorts  # noqa: E402

DEAL = {"title": "Freidora Industrial Doble Daewoo Inox 20lt " * 4, "discount": 40, "price_cur": 1000}


class TestTextos(unittest.TestCase):
    def test_titulo_youtube_cabe_y_termina_en_shorts(self):
        t = shorts.yt_title(DEAL)
        self.assertLessEqual(len(t), 100)
        self.assertTrue(t.endswith("#Shorts"))

    def test_caption_tiktok_cabe(self):
        self.assertLessEqual(len(shorts.tiktok_caption(DEAL)), 150)

    def test_descripcion_incluye_links_y_aviso_de_afiliado(self):
        d = shorts.yt_description(DEAL, "https://site", "https://ml")
        self.assertIn("https://site", d)
        self.assertIn("https://ml", d)
        self.assertIn("comisión", d)


class TestCrossPost(unittest.TestCase):
    def test_sin_credenciales_no_hace_nada(self):
        with mock.patch.dict(os.environ, {}, clear=True), \
                mock.patch.object(shorts, "_request") as req:
            self.assertEqual(shorts.cross_post(Path("x.mp4"), DEAL, "s", {"youtube": "m"}), [])
            req.assert_not_called()

    def test_dry_run_no_toca_la_red(self):
        env = {"YT_CLIENT_ID": "a", "YT_CLIENT_SECRET": "b", "YT_REFRESH_TOKEN": "c",
               "TIKTOK_CLIENT_KEY": "a", "TIKTOK_CLIENT_SECRET": "b", "TIKTOK_REFRESH_TOKEN": "c"}
        with mock.patch.dict(os.environ, env, clear=True), \
                mock.patch.object(shorts, "_request") as req:
            out = shorts.cross_post(Path("x.mp4"), DEAL, "s", {"youtube": "m"}, dry=True)
            self.assertEqual(len(out), 2)
            req.assert_not_called()

    def test_una_falla_se_informa_y_no_lanza(self):
        env = {"YT_CLIENT_ID": "a", "YT_CLIENT_SECRET": "b", "YT_REFRESH_TOKEN": "c"}
        with mock.patch.dict(os.environ, env, clear=True), \
                mock.patch.object(shorts, "_request", side_effect=RuntimeError("boom")):
            out = shorts.cross_post(Path("x.mp4"), DEAL, "s", {"youtube": "m"})
            self.assertEqual(len(out), 1)
            self.assertIn("falló", out[0])


class TestSubidaYouTube(unittest.TestCase):
    def test_flujo_resumable_devuelve_url_del_short(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            v = Path(d) / "r.mp4"
            v.write_bytes(b"0123")
            calls = []

            def fake(url, data, headers, method="POST", timeout=120):
                calls.append((url, method))
                if method == "POST":
                    return b"{}", {"Location": "https://upload/session"}
                return b'{"id": "abc123"}', {}

            with mock.patch.object(shorts, "_request", side_effect=fake):
                url = shorts.upload_youtube_short(v, DEAL, "s", "m", "tok")
            self.assertEqual(url, "https://youtube.com/shorts/abc123")
            self.assertEqual(calls[1], ("https://upload/session", "PUT"))


if __name__ == "__main__":
    unittest.main()
