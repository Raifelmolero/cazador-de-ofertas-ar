import os
import sys
import tempfile
import unittest
import urllib.error
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import cazador_bot as bot  # noqa: E402
import ml_api  # noqa: E402

ENV = {"ML_CLIENT_ID": "x", "ML_CLIENT_SECRET": "y"}


def http_err(code):
    return urllib.error.HTTPError("u", code, "e", {}, None)


class TestAlerta(unittest.TestCase):
    def test_marcadores(self):
        self.assertTrue(bot.is_blocked_html("...loginType=negative_traffic..."))
        self.assertTrue(bot.is_blocked_html("<a href='/account-verification'>"))
        self.assertFalse(bot.is_blocked_html("<html>poly-card__portada</html>"))

    def test_antispam_12h(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "a.json"
            t0 = datetime(2026, 10, 10, 12, tzinfo=timezone.utc)
            self.assertTrue(bot.should_send_scrape_alert(p, t0))
            self.assertFalse(bot.should_send_scrape_alert(p, t0 + timedelta(hours=3)))
            self.assertTrue(bot.should_send_scrape_alert(p, t0 + timedelta(hours=13)))

    def test_fetch_deals_marca_bloqueo(self):
        with mock.patch.object(bot, "http_get", return_value=b"negative_traffic"), \
             mock.patch.object(bot.time, "sleep"), mock.patch.dict(os.environ, {}, clear=True):
            self.assertEqual(bot.fetch_deals(pages=1), [])
        self.assertTrue(bot.SCRAPE_BLOCKED)


class TestApi(unittest.TestCase):
    def setUp(self):
        ml_api._TOKEN.update(value=None, exp=0)

    def test_sin_credenciales(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            self.assertEqual(ml_api.fetch_deals_api(request=mock.Mock()), [])

    def test_token_401(self):
        with mock.patch.dict(os.environ, ENV, clear=True):
            req = mock.Mock(side_effect=http_err(401))
            self.assertEqual(ml_api.fetch_deals_api(request=req), [])

    def test_highlights_403(self):
        def req(url, data=None, headers=None):
            if "oauth" in url:
                return {"access_token": "t", "expires_in": 21600}
            raise http_err(403)
        with mock.patch.dict(os.environ, ENV, clear=True):
            self.assertEqual(ml_api.fetch_deals_api(["MLA1"], request=req), [])

    def test_flujo_ok(self):
        def req(url, data=None, headers=None):
            if "oauth" in url:
                return {"access_token": "t", "expires_in": 21600}
            if "highlights" in url:
                return {"content": [{"id": "MLA1", "type": "ITEM"}, {"id": "MLA2", "type": "ITEM"}]}
            return [
                {"code": 200, "body": {"id": "MLA1", "title": "TV 50", "price": 600000,
                 "original_price": 800000, "permalink": "https://articulo.mercadolibre.com.ar/MLA-1-tv?x=1",
                 "thumbnail": "http://http2.mlstatic.com/a.jpg"}},
                {"code": 200, "body": {"id": "MLA2", "title": "Sin desc", "price": 10,
                 "original_price": None, "permalink": "https://x/MLA-2"}},
                {"code": 404, "body": {}},
            ]
        with mock.patch.dict(os.environ, ENV, clear=True):
            r = ml_api.fetch_deals_api(["MLA1055"], request=req)
        self.assertEqual(len(r), 1)
        self.assertEqual(set(r[0]), {"id", "title", "url", "price_prev", "price_cur",
                                     "discount", "img", "relampago"})
        self.assertEqual(r[0]["discount"], 25)
        self.assertEqual(r[0]["url"], "https://articulo.mercadolibre.com.ar/MLA-1-tv")

    def test_fetch_deals_usa_api_solo_si_scraping_0(self):
        with mock.patch.object(bot, "http_get", return_value=b"<html></html>"), \
             mock.patch.object(bot.time, "sleep"), \
             mock.patch.dict(os.environ, ENV, clear=True), \
             mock.patch.object(ml_api, "fetch_deals_api", return_value=[{"id": "MLA9"}]) as m:
            self.assertEqual(bot.fetch_deals(pages=1), [{"id": "MLA9"}])
            m.assert_called_once()
