import os
import sys
import json
import tempfile
import unittest
import urllib.error
import urllib.parse
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
             mock.patch.object(bot, "SCRAPED_SNAPSHOT_PATH", Path("/no/existe.json")), \
             mock.patch.dict(os.environ, ENV, clear=True), \
             mock.patch.object(ml_api, "fetch_deals_api", return_value=[{"id": f"MLA{i}", "discount": 30} for i in range(25)]) as m:
            self.assertEqual(len(bot.fetch_deals(pages=1)), 25)
            m.assert_called_once()


# ---------------------------------------------------------------- plan C: catálogo

def _item(item_id, price, **extra):
    d = {"item_id": item_id, "price": price, "currency_id": "ARS", "condition": "new",
         "seller_id": 99, "shipping": {"free_shipping": False}}
    d.update(extra)
    return d


class FakeML:
    """Respuestas mockeadas de los endpoints de catálogo. Registra los paths."""

    def __init__(self, trends=None, search=None, items=None, productos=None, fail=None):
        self.trends = trends or {}
        self.search = search or {}
        self.items = items or {}
        self.productos = productos or {}
        self.fail = fail or {}     # prefijo de path → código HTTP
        self.paths: list[str] = []

    def __call__(self, url, data=None, headers=None):
        if "oauth" in url:
            return {"access_token": "tok-secreto-123", "expires_in": 21600}
        path = url.replace(ml_api.API, "")
        self.paths.append(path)
        for pref, code in self.fail.items():
            if path.startswith(pref):
                raise http_err(code)
        if path.startswith("/trends/MLA/"):
            return self.trends.get(path.rsplit("/", 1)[1], [])
        if path.startswith("/products/search"):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(path).query)["q"][0]
            return {"keywords": q, "paging": {}, "results": self.search.get(q, [])}
        if path.startswith("/products/") and path.endswith("/items"):
            pid = path.split("/")[2]
            return {"paging": {}, "results": self.items.get(pid, []), "experiments": []}
        if path.startswith("/products/"):
            return self.productos.get(path.split("/")[2], {})
        raise http_err(404)


class TestCatalogo(unittest.TestCase):
    def setUp(self):
        ml_api._TOKEN.update(value=None, exp=0)
        p = mock.patch.object(ml_api.time, "sleep")
        p.start()
        self.addCleanup(p.stop)

    def correr(self, fake, cats=("MLA1055",), **kw):
        with mock.patch.dict(os.environ, ENV, clear=True):
            return ml_api.fetch_deals_api(list(cats), request=fake, **kw)

    def fake_basico(self, **kw):
        return FakeML(
            trends={"MLA1055": [{"keyword": "iphone 15", "url": "u"}, {"keyword": "samsung a55"}]},
            search={
                "iphone 15": [{"id": "MLA100001", "name": "Apple iPhone 15 128 Gb", "status": "active",
                               "pictures": [{"url": "http://http2.mlstatic.com/D_1.jpg"}]}],
                "samsung a55": [{"id": "MLA100002", "name": "Samsung Galaxy A55", "status": "active"}],
            },
            items={
                "MLA100001": [
                    _item("MLA9001", 1200000, original_price=1500000, deal_ids=["MLA1"],
                          permalink="https://articulo.mercadolibre.com.ar/MLA-9001-iphone?x=1#y"),
                    _item("MLA9002", 1100000, original_price=1500000, condition="used"),
                    _item("MLA9003", 1250000, original_price=1500000),
                ],
                "MLA100002": [_item("MLA9010", 500000, shipping={"free_shipping": True})],
            }, **kw)

    def test_flujo_ok_con_y_sin_precio_anterior(self):
        r = self.correr(self.fake_basico())
        por_id = {d["id"]: d for d in r}
        self.assertEqual(set(por_id), {"MLA100001", "MLA100002"})
        a = por_id["MLA100001"]
        # formato de parse_cards / item_to_deal (+ extras opcionales)
        self.assertTrue({"id", "title", "url", "price_prev", "price_cur", "discount",
                         "img", "relampago"} <= set(a))
        self.assertEqual((a["price_cur"], a["price_prev"], a["discount"]), (1200000, 1500000, 20))
        self.assertEqual(a["url"], "https://articulo.mercadolibre.com.ar/MLA-9001-iphone")
        self.assertEqual(a["img"], "https://http2.mlstatic.com/D_1.jpg")
        self.assertTrue(a["relampago"])
        self.assertEqual(a["title"], "Apple iPhone 15 128 Gb")
        b = por_id["MLA100002"]
        # sin original_price: NO se inventa descuento
        self.assertEqual((b["price_cur"], b["price_prev"], b["discount"]), (500000, 500000, 0))
        self.assertFalse(b["relampago"])
        self.assertTrue(b["envio_gratis"])
        self.assertEqual(b["url"], "https://www.mercadolibre.com.ar/p/MLA100002")  # sin permalink
        self.assertIsNone(b["img"])
        # los que traen descuento real van primero
        self.assertEqual(r[0]["id"], "MLA100001")

    def test_usa_el_mejor_precio_de_items_nuevos(self):
        # el item usado de 1.100.000 no cuenta; gana el nuevo de 1.200.000 (no el de 1.250.000)
        r = self.correr(self.fake_basico())
        self.assertEqual(next(d for d in r if d["id"] == "MLA100001")["price_cur"], 1200000)

    def test_completa_nombre_desde_la_ficha_si_falta(self):
        fake = FakeML(
            trends={"MLA1055": ["tv 50"]},
            search={"tv 50": [{"id": "MLA200001"}]},
            items={"MLA200001": [_item("MLA9100", 400000)]},
            productos={"MLA200001": {"id": "MLA200001", "name": "Smart TV 50",
                                     "permalink": "http://www.mercadolibre.com.ar/smart-tv/p/MLA200001",
                                     "pictures": [{"secure_url": "https://http2.mlstatic.com/D_9.jpg"}]}})
        r = self.correr(fake)
        self.assertEqual(len(r), 1)
        self.assertEqual(r[0]["title"], "Smart TV 50")
        self.assertEqual(r[0]["url"], "https://www.mercadolibre.com.ar/smart-tv/p/MLA200001")
        self.assertEqual(r[0]["img"], "https://http2.mlstatic.com/D_9.jpg")

    def test_cae_al_catalogo_cuando_highlights_da_403(self):
        fake = self.fake_basico(fail={"/highlights": 403, "/items": 403})
        r = self.correr(fake)
        self.assertEqual(len(r), 2)
        self.assertTrue(any(p.startswith("/trends/MLA/MLA1055") for p in fake.paths))

    def test_highlights_primero_si_anda_y_no_toca_el_catalogo(self):
        class F(FakeML):
            def __call__(s, url, data=None, headers=None):
                if "highlights" in url:
                    s.paths.append(url)
                    return {"content": [{"id": "MLA1", "type": "ITEM"}]}
                if "/items?ids=" in url:
                    return [{"code": 200, "body": {"id": "MLA1", "title": "TV", "price": 60,
                             "original_price": 100, "permalink": "https://x/MLA-1"}}]
                return super().__call__(url, data, headers)
        fake = F()
        r = self.correr(fake)
        self.assertEqual([d["id"] for d in r], ["MLA1"])
        self.assertFalse(any("/trends" in p or "/products" in p for p in fake.paths))

    def test_todo_403_devuelve_vacio_y_corta_rapido(self):
        fake = FakeML(fail={"/highlights": 403, "/items": 403, "/trends": 403, "/products": 403})
        r = self.correr(fake, cats=[f"MLA{i}" for i in range(1000, 1020)])
        self.assertEqual(r, [])
        # 1 de highlights + FALLOS_SEGUIDOS_MAX de catálogo, no 20 trends
        self.assertLessEqual(len(fake.paths), 1 + ml_api.FALLOS_SEGUIDOS_MAX)

    def test_respeta_el_presupuesto_de_llamadas(self):
        n = 60
        fake = FakeML(
            trends={"MLA1055": ["kw"]},
            search={"kw": [{"id": f"MLA3{i:05d}", "name": f"P{i}"} for i in range(n)]},
            items={f"MLA3{i:05d}": [_item(f"MLA8{i:05d}", 1000 + i)] for i in range(n)})
        with mock.patch("builtins.print"):
            r = ml_api.fetch_deals_catalogo("tok", ["MLA1055"], 100, fake, max_llamadas=12)
        self.assertEqual(len(fake.paths), 12)
        self.assertEqual(len(r), 10)  # 12 - 1 trends - 1 búsqueda

    def test_limit(self):
        n = 8
        fake = FakeML(
            trends={"MLA1055": ["kw"]},
            search={"kw": [{"id": f"MLA3{i:05d}", "name": f"P{i}"} for i in range(n)]},
            items={f"MLA3{i:05d}": [_item(f"MLA8{i:05d}", 1000 + i)] for i in range(n)})
        with mock.patch.dict(os.environ, ENV, clear=True):
            r = ml_api.fetch_deals_api(["MLA1055"], limit=3, request=fake)
        self.assertEqual(len(r), 3)

    def test_no_loguea_el_token(self):
        import io
        from contextlib import redirect_stdout
        buf = io.StringIO()
        with redirect_stdout(buf):
            self.correr(self.fake_basico(fail={"/highlights": 403}))
            ml_api._TOKEN.update(value=None, exp=0)
            self.correr(FakeML(fail={"/trends": 403, "/highlights": 403}))
        self.assertNotIn("tok-secreto-123", buf.getvalue())

    def test_filtros_del_bot_dejan_afuera_los_sin_descuento(self):
        r = self.correr(self.fake_basico())
        pasan = [d for d in r if d["discount"] >= 25]
        self.assertEqual(pasan, [])  # 20% y 0%: ninguno llega al min_discount de 25


class TestCatalogoPiezas(unittest.TestCase):
    def test_precios(self):
        f = ml_api._precios_item
        self.assertEqual(f({"price": 100, "original_price": 150}), (100.0, 150.0))
        self.assertEqual(f({"price": 100}), (100.0, None))
        self.assertEqual(f({"price": 100, "original_price": 100}), (100.0, None))
        self.assertEqual(f({"price": 100, "original_price": 90}), (100.0, None))
        self.assertEqual(f({"price": 100, "original_price": 900}), (100.0, None))  # 89% OFF: basura
        self.assertEqual(f({"price": "250.5"}), (250.5, None))
        self.assertEqual(f({"price": {"amount": 300, "currency_id": "ARS"}}), (300.0, None))
        self.assertEqual(f({"price": 100, "sale_price": {"amount": 80, "regular_amount": 100}}),
                         (80.0, 100.0))
        self.assertEqual(f({"sale_price": {"amount": 80}}), (80.0, None))
        self.assertEqual(f({}), (None, None))
        self.assertEqual(f({"price": 0}), (None, None))
        self.assertEqual(f({"price": True}), (None, None))

    def test_keywords(self):
        k = ml_api._keywords
        self.assertEqual(k([{"keyword": "a b"}, "c d", {"keyword": "A B"}, {}, 5, "x"]), ["a b", "c d"])
        self.assertEqual(k({"results": [{"keyword": "heladera"}]}), ["heladera"])
        self.assertEqual(k(None), [])
        self.assertEqual(k({"error": "x"}), [])

    def test_item_to_deal_catalogo_tolera_faltantes(self):
        f = ml_api.item_catalogo_to_deal
        self.assertIsNone(f({"id": "MLA100001"}, _item("MLA1", 100)))             # sin nombre
        self.assertIsNone(f({"id": "xyz", "name": "N"}, _item("MLA1", 100)))       # id raro
        self.assertIsNone(f({"id": "MLA100001", "name": "N"}, {"item_id": "MLA1"}))  # sin precio
        d = f({"id": "MLA100001", "name": "N"}, {"price": 100})
        self.assertEqual((d["price_cur"], d["discount"]), (100, 0))
        self.assertIsNone(d["envio_gratis"])
        self.assertIsNone(d["seller_id"])
        # permalink de otro dominio no se usa
        d = f({"id": "MLA100001", "name": "N", "permalink": "https://evil.example/x"},
              {"price": 100, "permalink": "https://evil.example/y"})
        self.assertEqual(d["url"], "https://www.mercadolibre.com.ar/p/MLA100001")

    def test_mejor_item_desempata_por_envio_gratis(self):
        a = _item("A", 100)
        b = _item("B", 100, shipping={"free_shipping": True})
        self.assertEqual(ml_api._mejor_item([a, b])["item_id"], "B")
        self.assertIsNone(ml_api._mejor_item([_item("U", 1, condition="used"), "basura", None]))
        self.assertIsNone(ml_api._mejor_item([_item("D", 1, currency_id="USD")]))


class TestWriteSiteDataCatalogo(unittest.TestCase):
    def test_sin_descuento_no_exporta_tachado_ni_porcentaje(self):
        deal = {"id": "MLA100001", "title": "Producto", "url": "https://www.mercadolibre.com.ar/p/MLA100001",
                "price_prev": 50000, "price_cur": 50000, "discount": 0, "img": None,
                "relampago": False, "hist_low": False}
        real = dict(deal, id="MLA100002", price_prev=100000, discount=50)
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "p.json"
            with mock.patch.object(bot, "SITE_DATA_PATH", destino), mock.patch("builtins.print"):
                bot.write_site_data([deal, real], "general")
            items = json.loads(destino.read_text(encoding="utf-8"))["items"]
        self.assertIsNone(items[0]["precio_anterior"])
        self.assertIsNone(items[0]["descuento_pct"])
        self.assertEqual((items[1]["precio_anterior"], items[1]["descuento_pct"]), (100000, 50))


class TestGuardaFuenteApi(unittest.TestCase):
    def test_descarta_api_con_pocas_ofertas_con_descuento(self):
        with mock.patch.object(bot, "http_get", return_value=b"<html></html>"),              mock.patch.object(bot.time, "sleep"),              mock.patch.object(bot, "SCRAPED_SNAPSHOT_PATH", Path("/no/existe.json")), \
             mock.patch.dict(os.environ, ENV, clear=True),              mock.patch.object(ml_api, "fetch_deals_api",
                               return_value=[{"id": "MLA9", "discount": 0}]):
            self.assertEqual(bot.fetch_deals(pages=1), [])


class TestSnapshotLocal(unittest.TestCase):
    def _escribir(self, tmp, horas, n):
        import json
        from datetime import datetime, timedelta, timezone
        ts = datetime.now(timezone.utc) - timedelta(hours=horas)
        pth = Path(tmp) / "scraped.json"
        pth.write_text(json.dumps({"scraped_at": ts.isoformat(),
                                   "deals": [{"id": f"MLA{i}", "discount": 20} for i in range(n)]}),
                       encoding="utf-8")
        return pth

    def test_usa_snapshot_fresco(self):
        import tempfile
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(len(bot.load_scraped_snapshot(self._escribir(tmp, 2, 30))), 30)

    def test_descarta_viejo_o_chico(self):
        import tempfile
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(bot.load_scraped_snapshot(self._escribir(tmp, 30, 30)), [])
            self.assertEqual(bot.load_scraped_snapshot(self._escribir(tmp, 1, 5)), [])

    def test_sin_archivo(self):
        self.assertEqual(bot.load_scraped_snapshot(Path("/no/existe.json")), [])
