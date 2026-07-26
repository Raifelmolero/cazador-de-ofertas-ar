"""Tests de la lógica pura del bot: nada de red, nada de git, nada de APIs.

Correr:  python -m unittest discover -s bot/tests -v

Se cubre lo que, si se rompe, cuesta plata o publica algo mal:
el link de afiliado, el filtro de ofertas infladas, los márgenes del sitio,
el parseo de las tarjetas de ML y la retención de media.
"""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import cazador_bot as bot  # noqa: E402


def hace(dias: int) -> str:
    """Fecha ISO de hace N días, en el mismo formato que usa el historial."""
    return (datetime.now(timezone.utc) - timedelta(days=dias)).strftime("%Y-%m-%d")


class TestAffiliateUrl(unittest.TestCase):
    """El link de afiliado: si esto se rompe, no se cobra comisión."""

    URL = "https://www.mercadolibre.com.ar/algo/p/MLA123456"

    def test_agrega_word_y_tool_con_signo_de_pregunta(self):
        r = bot.affiliate_url(self.URL, "general")
        self.assertEqual(r, f"{self.URL}?matt_word=general&matt_tool=37267219")

    def test_usa_ampersand_si_la_url_ya_tiene_query(self):
        r = bot.affiliate_url(f"{self.URL}?a=1", "general")
        self.assertEqual(r, f"{self.URL}?a=1&matt_word=general&matt_tool=37267219")

    def test_la_etiqueta_de_canal_pisa_al_id_general(self):
        for canal in ("telegram", "instagram", "threads", "web"):
            with self.subTest(canal=canal):
                r = bot.affiliate_url(self.URL, "general", canal)
                self.assertIn(f"matt_word={canal}", r)
                self.assertNotIn("matt_word=general", r)

    def test_matt_tool_es_siempre_el_mismo(self):
        # Valor verificado en el linkbuilder de ML; no debe variar por canal.
        for canal in (None, "telegram", "web"):
            with self.subTest(canal=canal):
                self.assertIn("matt_tool=37267219", bot.affiliate_url(self.URL, "x", canal))

    def test_sin_affiliate_id_devuelve_la_url_intacta(self):
        self.assertEqual(bot.affiliate_url(self.URL, ""), self.URL)


class TestPrecios(unittest.TestCase):
    def test_parse_price_saca_los_puntos_de_miles(self):
        self.assertEqual(bot.parse_price("1.234.567"), 1234567)
        self.assertEqual(bot.parse_price("999"), 999)

    def test_fmt_price_usa_punto_como_separador(self):
        self.assertEqual(bot.fmt_price(1234567), "$1.234.567")
        self.assertEqual(bot.fmt_price(999), "$999")

    def test_parse_price_rechaza_basura(self):
        with self.assertRaises(ValueError):
            bot.parse_price("abc")


class TestDaysBetween(unittest.TestCase):
    def test_es_absoluto_sin_importar_el_orden(self):
        self.assertEqual(bot._days_between("2026-07-01", "2026-07-08"), 7)
        self.assertEqual(bot._days_between("2026-07-08", "2026-07-01"), 7)

    def test_mismo_dia_es_cero(self):
        self.assertEqual(bot._days_between("2026-07-08", "2026-07-08"), 0)


class TestAnnotatePriceHistory(unittest.TestCase):
    """Badge de mínimo histórico y descarte de ofertas infladas."""

    @staticmethod
    def deal(price, id_="MLA1"):
        return {"id": id_, "price_cur": price}

    def test_producto_nuevo_no_tiene_badge_ni_es_inflado(self):
        d = self.deal(1000)
        hist = {}
        bot.annotate_price_history([d], hist)
        self.assertFalse(d["hist_low"])
        self.assertFalse(d["inflada"])
        self.assertEqual(hist["MLA1"]["min"], 1000)

    def test_con_historia_suficiente_y_precio_minimo_da_badge(self):
        d = self.deal(1000)
        hist = {"MLA1": {"min": 1000, "min_ts": hace(5), "first_ts": hace(5),
                         "last": 1000, "last_ts": hace(1)}}
        bot.annotate_price_history([d], hist)
        self.assertTrue(d["hist_low"])

    def test_sin_historia_suficiente_no_hay_badge_aunque_sea_el_mas_barato(self):
        # Menos de HIST_MIN_AGE_DAYS: todavía no sabemos si es barato de verdad.
        d = self.deal(500)
        hist = {"MLA1": {"min": 1000, "min_ts": hace(1), "first_ts": hace(1),
                         "last": 1000, "last_ts": hace(1)}}
        bot.annotate_price_history([d], hist)
        self.assertFalse(d["hist_low"])

    def test_visto_5pct_mas_barato_antes_es_inflada(self):
        d = self.deal(1000)
        hist = {"MLA1": {"min": 900, "min_ts": hace(10), "first_ts": hace(10),
                         "last": 900, "last_ts": hace(1)}}
        bot.annotate_price_history([d], hist)
        self.assertTrue(d["inflada"])

    def test_diferencia_menor_al_5pct_no_es_inflada(self):
        d = self.deal(1000)
        hist = {"MLA1": {"min": 960, "min_ts": hace(10), "first_ts": hace(10),
                         "last": 960, "last_ts": hace(1)}}
        bot.annotate_price_history([d], hist)
        self.assertFalse(d["inflada"])

    def test_un_precio_mas_bajo_actualiza_el_minimo(self):
        hoy = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        d = self.deal(800)
        hist = {"MLA1": {"min": 1000, "min_ts": hace(10), "first_ts": hace(10),
                         "last": 1000, "last_ts": hace(1)}}
        bot.annotate_price_history([d], hist)
        self.assertEqual(hist["MLA1"]["min"], 800)
        self.assertEqual(hist["MLA1"]["min_ts"], hoy)

    def test_siempre_registra_el_precio_de_hoy(self):
        hoy = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        d = self.deal(1200)
        hist = {"MLA1": {"min": 1000, "min_ts": hace(10), "first_ts": hace(10),
                         "last": 1000, "last_ts": hace(5)}}
        bot.annotate_price_history([d], hist)
        self.assertEqual(hist["MLA1"]["last"], 1200)
        self.assertEqual(hist["MLA1"]["last_ts"], hoy)
        self.assertEqual(hist["MLA1"]["min"], 1000)  # el mínimo no se toca


class TestWriteSiteData(unittest.TestCase):
    """Márgenes del sitio y qué productos llegan a la web."""

    @staticmethod
    def deal(id_, price, title="Producto"):
        return {"id": id_, "title": title, "url": f"https://www.mercadolibre.com.ar/{id_}",
                "price_prev": price * 2, "price_cur": price, "discount": 50,
                "img": "https://http2.mlstatic.com/x.webp", "hist_low": False}

    def escribir(self, deals, exclusive=None):
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "productos.json"
            with mock.patch.object(bot, "SITE_DATA_PATH", destino):
                bot.write_site_data(deals, "general", exclusive)
            return json.loads(destino.read_text(encoding="utf-8"))

    def test_margenes_con_envio_sobre_el_umbral(self):
        # 50.000: comisión 15% = 7.500, iibb 3% = 1.500, envío 8.000.
        data = self.escribir([self.deal("MLA1", 50000)])
        item = data["items"][0]
        self.assertEqual(item["costo_envio_base_ars"], 8000.0)
        self.assertEqual(item["margen_neto_clasico_ars"], 33000.0)
        self.assertEqual(item["margen_neto_premium_ars"], 25500.0)

    def test_sin_envio_por_debajo_del_umbral(self):
        # 20.000: comisión 3.000, iibb 600, envío 0.
        data = self.escribir([self.deal("MLA1", 20000)])
        item = data["items"][0]
        self.assertEqual(item["costo_envio_base_ars"], 0.0)
        self.assertEqual(item["margen_neto_clasico_ars"], 16400.0)

    def test_el_umbral_de_envio_es_inclusivo(self):
        data = self.escribir([self.deal("MLA1", int(bot.UMBRAL_ENVIO_GRATIS_ARS))])
        self.assertEqual(data["items"][0]["costo_envio_base_ars"], 8000.0)

    def test_las_exclusivas_del_canal_no_van_a_la_web(self):
        deals = [self.deal("MLA1", 50000), self.deal("MLA2", 40000)]
        data = self.escribir(deals, exclusive={"MLA1"})
        ids = [i["id_ml"] for i in data["items"]]
        self.assertEqual(ids, ["MLA2"])

    def test_los_links_de_la_web_llevan_la_etiqueta_web(self):
        data = self.escribir([self.deal("MLA1", 50000)])
        self.assertIn("matt_word=web", data["items"][0]["url_producto"])

    def test_la_metadata_cuenta_los_items_escritos(self):
        data = self.escribir([self.deal("MLA1", 50000), self.deal("MLA2", 40000)])
        self.assertEqual(data["metadata"]["total_items"], 2)
        self.assertEqual(len(data["items"]), 2)


class TestParseCards(unittest.TestCase):
    """El parser de ML: es lo primero que se rompe cuando cambian el HTML."""

    @staticmethod
    def card(id_="MLA11111111", titulo="Producto Uno", prev="100.000",
             cur="50.000", off="50 % OFF"):
        return f"""
        <div class="poly-card__portada">
          <img class="poly-component__picture" src="https://http2.mlstatic.com/D_Q_NP_2X_1-{id_}.webp">
        </div>
        <h3><a class="poly-component__title" href="https://www.mercadolibre.com.ar/prod/p/{id_}?x=1">{titulo}</a></h3>
        <div class="poly-price__container">
          <s class="andes-money-amount andes-money-amount--previous">
            <span class="andes-money-amount__fraction">{prev}</span>
          </s>
          <div class="poly-price__current">
            <span class="andes-money-amount__fraction">{cur}</span>
          </div>
          <span class="poly-price__disc">{off}</span>
        </div>
        """

    def test_parsea_una_tarjeta_completa(self):
        [d] = bot.parse_cards(self.card())
        self.assertEqual(d["id"], "MLA11111111")
        self.assertEqual(d["title"], "Producto Uno")
        self.assertEqual(d["price_prev"], 100000)
        self.assertEqual(d["price_cur"], 50000)
        self.assertEqual(d["discount"], 50)
        self.assertTrue(d["img"].startswith("https://http2.mlstatic.com/"))

    def test_le_saca_el_query_string_a_la_url(self):
        [d] = bot.parse_cards(self.card())
        self.assertEqual(d["url"], "https://www.mercadolibre.com.ar/prod/p/MLA11111111")
        self.assertNotIn("?", d["url"])

    def test_parsea_varias_tarjetas_seguidas(self):
        html = self.card("MLA11111111") + self.card("MLA22222222", "Producto Dos")
        ids = [d["id"] for d in bot.parse_cards(html)]
        self.assertEqual(ids, ["MLA11111111", "MLA22222222"])

    def test_descarta_la_tarjeta_sin_porcentaje_de_descuento(self):
        self.assertEqual(bot.parse_cards(self.card(off="sin descuento")), [])

    def test_descarta_si_el_precio_actual_no_es_menor_al_anterior(self):
        self.assertEqual(bot.parse_cards(self.card(prev="50.000", cur="50.000")), [])
        self.assertEqual(bot.parse_cards(self.card(prev="40.000", cur="50.000")), [])

    def test_html_sin_tarjetas_no_explota(self):
        self.assertEqual(bot.parse_cards("<html><body>nada</body></html>"), [])


class TestPruneOldMedia(unittest.TestCase):
    """Retención de placas/stories/reels ya publicados."""

    @staticmethod
    def nombre_con_fecha(dias_atras: int) -> str:
        return (datetime.now(timezone.utc) - timedelta(days=dias_atras)).strftime("%Y%m%d")

    def test_borra_lo_viejo_y_conserva_lo_reciente(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            casos = {
                f"feed-{self.nombre_con_fecha(0)}-02.jpg": True,
                f"story-{self.nombre_con_fecha(13)}-21.jpg": True,
                f"reel-{self.nombre_con_fecha(14)}-02.mp4": True,   # borde: no se borra
                f"reel-{self.nombre_con_fecha(15)}-02.mp4": False,
                f"feed-{self.nombre_con_fecha(60)}.jpg": False,
            }
            for nombre in casos:
                (d / nombre).write_text("x")

            borrados = bot._prune_old_media(d)

            for nombre, sobrevive in casos.items():
                with self.subTest(nombre=nombre):
                    self.assertEqual((d / nombre).exists(), sobrevive)
            self.assertEqual(borrados, sum(1 for v in casos.values() if not v))

    def test_no_toca_archivos_sin_fecha_en_el_nombre(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            (d / "README.md").write_text("x")
            (d / "logo.png").write_text("x")
            self.assertEqual(bot._prune_old_media(d), 0)
            self.assertTrue((d / "README.md").exists())
            self.assertTrue((d / "logo.png").exists())

    def test_una_fecha_imposible_se_conserva(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            (d / "feed-20261399-02.jpg").write_text("x")
            self.assertEqual(bot._prune_old_media(d), 0)
            self.assertTrue((d / "feed-20261399-02.jpg").exists())

    def test_no_borra_subdirectorios(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            (d / f"sub-{self.nombre_con_fecha(90)}").mkdir()
            self.assertEqual(bot._prune_old_media(d), 0)
            self.assertTrue((d / f"sub-{self.nombre_con_fecha(90)}").is_dir())

    def test_correrlo_dos_veces_no_borra_de_mas(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            (d / f"feed-{self.nombre_con_fecha(60)}.jpg").write_text("x")
            (d / f"feed-{self.nombre_con_fecha(0)}.jpg").write_text("x")
            self.assertEqual(bot._prune_old_media(d), 1)
            self.assertEqual(bot._prune_old_media(d), 0)


if __name__ == "__main__":
    unittest.main()
