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
import unittest.mock
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

    def test_deja_en_la_oferta_el_minimo_previo_antes_de_pisarlo(self):
        # Después de anotar, el historial ya tiene el precio de hoy: la
        # evidencia de por qué quedó inflada tiene que viajar en la oferta.
        d = self.deal(800)
        hist = {"MLA1": {"min": 1000, "min_ts": "2026-08-01", "first_ts": "2026-07-20",
                         "last": 1000, "last_ts": hace(1)}}
        bot.annotate_price_history([d], hist)
        self.assertEqual(hist["MLA1"]["min"], 800)  # el historial ya se actualizó
        self.assertEqual(d["hist_min_prev"], 1000)
        self.assertEqual(d["hist_min_prev_ts"], "2026-08-01")
        self.assertEqual(d["hist_first_ts"], "2026-07-20")

    def test_producto_nuevo_no_tiene_minimo_previo(self):
        d = self.deal(1000)
        bot.annotate_price_history([d], {})
        self.assertNotIn("hist_min_prev", d)


class TestInfladas(unittest.TestCase):
    """Muestra de infladas para /descuentos-inflados: dato real, sin afiliado."""

    AHORA = datetime(2026, 9, 26, 18, 30, tzinfo=timezone.utc)

    @staticmethod
    def deal(id_, precio, prev=None):
        return {
            "id": id_, "title": f"Producto {id_}",
            "url": f"https://www.mercadolibre.com.ar/producto/p/{id_}",
            "img": f"https://http2.mlstatic.com/D_{id_}.webp",
            "price_cur": precio, "price_prev": prev or precio * 2, "discount": 50,
        }

    def anotado(self, id_, precio, minimo, prev=None, min_ts="2026-09-01", first_ts="2026-07-20"):
        """Oferta pasada por annotate_price_history con un historial previo."""
        d = self.deal(id_, precio, prev)
        hist = {id_: {"min": minimo, "min_ts": min_ts, "first_ts": first_ts,
                      "last": minimo, "last_ts": "2026-09-25"}}
        bot.annotate_price_history([d], hist)
        return d

    def test_arma_el_caso_con_el_minimo_previo_y_sus_fechas(self):
        d = self.anotado("MLA1", 100000, 80000, prev=150000, min_ts="2026-09-02", first_ts="2026-07-19")
        data = bot.build_infladas([d], now=self.AHORA)
        self.assertEqual(data["fecha"], "2026-09-26")
        self.assertEqual(data["actualizado"], "2026-09-26T18:30:00+00:00")
        self.assertEqual(data["infladas_detectadas"], 1)
        self.assertEqual(data["items"], [{
            "id": "MLA1",
            "titulo": "Producto MLA1",
            "url": "https://www.mercadolibre.com.ar/producto/p/MLA1",
            "img": "https://http2.mlstatic.com/D_MLA1.webp",
            "precio_hoy": 100000,
            "precio_tachado": 150000,
            "descuento_anunciado": 50,
            "minimo_registrado": 80000,
            "minimo_fecha": "2026-09-02",
            "visto_desde": "2026-07-19",
            "diferencia_pct": 20,
        }])

    def test_solo_entran_las_infladas(self):
        inflada = self.anotado("MLA1", 100000, 80000)
        real = self.anotado("MLA2", 100000, 99000)   # <5% de diferencia
        nueva = self.deal("MLA3", 100000)
        bot.annotate_price_history([nueva], {})
        data = bot.build_infladas([inflada, real, nueva], now=self.AHORA)
        self.assertEqual([c["id"] for c in data["items"]], ["MLA1"])
        self.assertEqual(data["infladas_detectadas"], 1)

    def test_ordena_por_diferencia_relativa_y_recorta(self):
        deals = [self.anotado(f"MLA{i}", 100000, 100000 - i * 2000) for i in range(3, 20)]
        data = bot.build_infladas(deals, limit=12, now=self.AHORA)
        self.assertEqual(len(data["items"]), 12)
        self.assertEqual(data["items"][0]["id"], "MLA19")  # estuvo 38% más barato
        difs = [c["diferencia_pct"] for c in data["items"]]
        self.assertEqual(difs, sorted(difs, reverse=True))
        self.assertEqual(data["infladas_detectadas"], 17)

    def test_la_diferencia_es_relativa_no_absoluta(self):
        # $1.000.000 → visto a $900.000 (10%) pierde contra $50.000 → $35.000 (30%)
        caro = self.anotado("MLA1", 1000000, 900000)
        barato = self.anotado("MLA2", 50000, 35000)
        data = bot.build_infladas([caro, barato], now=self.AHORA)
        self.assertEqual([c["id"] for c in data["items"]], ["MLA2", "MLA1"])

    def test_la_url_va_sin_parametros_de_afiliado(self):
        d = self.anotado("MLA1", 100000, 80000)
        d["url"] = "https://www.mercadolibre.com.ar/x/p/MLA1?matt_word=web&matt_tool=37267219#foto"
        caso = bot.build_infladas([d], now=self.AHORA)["items"][0]
        self.assertEqual(caso["url"], "https://www.mercadolibre.com.ar/x/p/MLA1")
        self.assertNotIn("matt_", json.dumps(caso))

    def test_descarta_minimos_de_menos_de_la_mitad_del_precio(self):
        # Mismo código con un precio 10 veces menor: otra variante o un error
        # de lectura, no se publica como caso (pero cuenta como detectada).
        raro = self.anotado("MLA1", 380000, 26841)
        normal = self.anotado("MLA2", 100000, 80000)
        data = bot.build_infladas([raro, normal], now=self.AHORA)
        self.assertEqual([c["id"] for c in data["items"]], ["MLA2"])
        self.assertEqual(data["infladas_detectadas"], 2)

    def test_sin_infladas_escribe_lista_vacia_valida(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "data" / "infladas.json"
            with mock.patch("builtins.print"):
                bot.write_infladas([], p, now=self.AHORA)
            data = json.loads(p.read_text(encoding="utf-8"))
        self.assertEqual(data, {"actualizado": "2026-09-26T18:30:00+00:00", "fecha": "2026-09-26",
                                "infladas_detectadas": 0, "items": []})

    def test_write_infladas_escribe_el_archivo(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "infladas.json"
            with mock.patch("builtins.print"):
                bot.write_infladas([self.anotado("MLA1", 100000, 80000)], p, now=self.AHORA)
            data = json.loads(p.read_text(encoding="utf-8"))
        self.assertEqual(data["items"][0]["minimo_registrado"], 80000)

    def test_el_archivo_commiteado_es_valido(self):
        # El workflow hace `git add frontend/data/infladas.json`: si no
        # existe, el paso de commit falla. Y el build de Next lo lee.
        data = json.loads(bot.INFLADAS_PATH.read_text(encoding="utf-8"))
        self.assertIsInstance(data["items"], list)
        self.assertIn("fecha", data)

    def test_una_falla_al_escribir_no_frena_la_corrida(self):
        from contextlib import ExitStack
        with ExitStack() as st:
            escribir = st.enter_context(
                mock.patch.object(bot, "write_infladas", side_effect=OSError("disco lleno")))
            for nombre in ("write_site_data", "update_seguimiento", "save_price_history",
                           "log_scan", "save_state", "alert_admin"):
                st.enter_context(mock.patch.object(bot, nombre))
            st.enter_context(mock.patch.object(bot, "fetch_deals", return_value=[self.deal("MLA1", 100000)]))
            st.enter_context(mock.patch.object(bot, "load_price_history", return_value={}))
            st.enter_context(mock.patch.object(bot, "load_state", return_value={"posted_ids": []}))
            st.enter_context(mock.patch.object(bot, "post_deal", return_value=False))
            st.enter_context(mock.patch.object(bot, "run_slot", return_value="other"))
            st.enter_context(mock.patch.dict("os.environ", {"DRY_RUN": "1", "SKIP_SITE_DATA": "0"}))
            st.enter_context(mock.patch("builtins.print"))
            self.assertEqual(bot.main(), 0)
            escribir.assert_called_once()


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

    def test_margenes_sin_costo_fijo_sobre_el_umbral(self):
        # 50.000: cargo de referencia 14,69% = 7.345; 6 cuotas +13,40% = 6.700.
        data = self.escribir([self.deal("MLA1", 50000)])
        item = data["items"][0]
        self.assertEqual(item["costo_envio_base_ars"], 0.0)
        self.assertEqual(item["margen_neto_clasico_ars"], 42655.0)
        self.assertEqual(item["margen_neto_premium_ars"], 35955.0)

    def test_costo_fijo_por_debajo_del_umbral(self):
        # 20.000: cargo 2.938 + costo fijo 2.740 (tramo $15.000-$23.999).
        data = self.escribir([self.deal("MLA1", 20000)])
        item = data["items"][0]
        self.assertEqual(item["costo_envio_base_ars"], 2740.0)
        self.assertEqual(item["margen_neto_clasico_ars"], 14322.0)

    def test_el_umbral_de_costo_fijo_es_inclusivo(self):
        data = self.escribir([self.deal("MLA1", int(bot.UMBRAL_COSTO_FIJO_ARS))])
        self.assertEqual(data["items"][0]["costo_envio_base_ars"], 0.0)
        data = self.escribir([self.deal("MLA1", 32999)])
        self.assertEqual(data["items"][0]["costo_envio_base_ars"], 3320.0)

    def test_exporta_el_minimo_registrado_y_desde_cuando(self):
        hist = {"MLA1": {"min": 45000, "min_ts": "2026-09-01", "first_ts": "2026-08-10",
                         "last": 50000, "last_ts": "2026-09-23"}}
        with tempfile.TemporaryDirectory() as tmp:
            destino = Path(tmp) / "productos.json"
            with mock.patch.object(bot, "SITE_DATA_PATH", destino):
                bot.write_site_data([self.deal("MLA1", 50000), self.deal("MLA2", 40000)],
                                    "general", None, hist)
            items = json.loads(destino.read_text(encoding="utf-8"))["items"]
        self.assertEqual(items[0]["precio_minimo_registrado"], 45000)
        self.assertEqual(items[0]["seguimiento_desde"], "2026-08-10")
        self.assertIsNone(items[1]["precio_minimo_registrado"])  # sin historia

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


class TestIgCaption(unittest.TestCase):
    """El caption de IG: el link de la bio es el único camino clickeable."""

    DEAL = {"title": "Producto de Prueba", "price_prev": 100000, "price_cur": 50000,
            "discount": 50, "hist_low": False}

    def test_el_link_de_la_bio_va_antes_que_telegram(self):
        # En IG los links del caption no son clickeables: la bio es lo único
        # que puede terminar en una compra, así que va primero.
        cap = bot.ig_caption(self.DEAL)
        self.assertLess(cap.index("cazadordeofertas.com.ar/ig"), cap.index("Telegram"))

    def test_menciona_el_dominio_propio(self):
        self.assertIn("cazadordeofertas.com.ar", bot.ig_caption(self.DEAL))

    def test_el_handle_de_telegram_no_lleva_arroba(self):
        # En IG cualquier "@algo" es una mención clickeable a un perfil de
        # Instagram, no a Telegram — y existe una cuenta de IG homónima que
        # no tiene nada que ver. Con arroba, el link termina ahí en vez de
        # en el canal real.
        cap = bot.ig_caption(self.DEAL)
        self.assertIn("t.me/cazadordeofertasar", cap)
        self.assertNotIn("@cazadordeofertasar", cap)

    def test_el_badge_de_minimo_historico_aparece_solo_cuando_corresponde(self):
        sin = bot.ig_caption({**self.DEAL, "hist_low": False})
        con = bot.ig_caption({**self.DEAL, "hist_low": True})
        self.assertNotIn("MÍNIMO HISTÓRICO", sin)
        self.assertIn("MÍNIMO HISTÓRICO", con)

    def test_muestra_los_dos_precios_y_el_ahorro(self):
        # Precios que dan un ahorro distinto de ambos, para que las tres
        # aserciones sean independientes.
        cap = bot.ig_caption({**self.DEAL, "price_prev": 100000, "price_cur": 70000})
        self.assertIn(bot.fmt_price(100000), cap)  # estaba
        self.assertIn(bot.fmt_price(70000), cap)   # hoy
        self.assertIn(bot.fmt_price(30000), cap)   # ahorro


class TestFbCaption(unittest.TestCase):
    """El caption de Facebook: a diferencia de IG, el link va clickeable directo."""

    DEAL = {"title": "Producto de Prueba", "price_prev": 100000, "price_cur": 50000,
            "discount": 50, "hist_low": False}
    LINK = "https://mercadolibre.com.ar/producto-p123?matt_word=facebook&matt_tool=37267219"

    def test_el_link_va_clickeable_en_el_texto(self):
        self.assertIn(self.LINK, bot.fb_caption(self.DEAL, self.LINK))

    def test_menciona_el_dominio_propio_y_telegram(self):
        cap = bot.fb_caption(self.DEAL, self.LINK)
        self.assertIn("cazadordeofertas.com.ar", cap)
        self.assertIn("t.me/cazadordeofertasar", cap)

    def test_el_badge_de_minimo_historico_aparece_solo_cuando_corresponde(self):
        sin = bot.fb_caption({**self.DEAL, "hist_low": False}, self.LINK)
        con = bot.fb_caption({**self.DEAL, "hist_low": True}, self.LINK)
        self.assertNotIn("MÍNIMO HISTÓRICO", sin)
        self.assertIn("MÍNIMO HISTÓRICO", con)

    def test_muestra_los_dos_precios_y_el_ahorro(self):
        cap = bot.fb_caption({**self.DEAL, "price_prev": 100000, "price_cur": 70000}, self.LINK)
        self.assertIn(bot.fmt_price(100000), cap)
        self.assertIn(bot.fmt_price(70000), cap)
        self.assertIn(bot.fmt_price(30000), cap)


class TestSitioEnLosPosts(unittest.TestCase):
    """Todos los canales tienen que ofrecer también el sitio propio, sin sacar
    el link directo de afiliado (que tiene un paso menos hasta la compra)."""

    DEAL = {"title": "Producto de Prueba", "price_prev": 100000, "price_cur": 50000,
            "discount": 50, "hist_low": False, "img": None}
    LINK = "https://mercadolibre.com.ar/producto-p123?matt_word=threads&matt_tool=37267219"

    def test_site_url_lleva_utm_source_del_canal(self):
        self.assertEqual(
            bot.site_url("telegram"),
            "https://cazadordeofertas.com.ar/?utm_source=telegram",
        )

    def test_threads_mantiene_el_link_directo_y_suma_el_sitio(self):
        cap = bot.th_caption(self.DEAL, self.LINK)
        self.assertIn(self.LINK, cap)
        self.assertIn("cazadordeofertas.com.ar", cap)

    def test_threads_no_pasa_los_500_caracteres_ni_con_titulo_largo(self):
        deal = {**self.DEAL, "title": "X" * 200}
        link = self.LINK + "&extra=" + "y" * 120
        cap = bot.th_caption(deal, link)
        self.assertLessEqual(len(cap), 500)
        self.assertIn(link, cap)
        self.assertIn("cazadordeofertas.com.ar", cap)

    def test_telegram_tiene_boton_de_oferta_y_boton_del_sitio(self):
        enviados = []
        with mock.patch.object(
            bot, "tg_call", side_effect=lambda t, m, p: enviados.append(p) or {}
        ):
            bot.post_deal("tok", "@canal", self.DEAL, self.LINK, dry=False)
        filas = enviados[0]["reply_markup"]["inline_keyboard"]
        urls = [b["url"] for fila in filas for b in fila]
        self.assertEqual(urls[0], self.LINK)
        self.assertIn("https://cazadordeofertas.com.ar/?utm_source=telegram", urls)


class TestComisionEstimada(unittest.TestCase):
    """Ranking pesado por categoría de comisión (ver CATEGORY_COMMISSION_WEIGHT)."""

    def test_embalaje_pesa_mas_que_electronica_de_ticket_bajo(self):
        self.assertGreater(
            bot.comision_estimada("Cinta De Embalar Transparente 48mm X 90m"),
            bot.comision_estimada("Mouse Inalambrico Logitech M170"),
        )

    def test_electrodomestico_pesa_mas_que_default(self):
        self.assertGreater(
            bot.comision_estimada("Freidora De Aire Philco 5l Digital"),
            bot.comision_estimada("Producto Genérico Sin Categoría Reconocible"),
        )

    def test_gastronomia_industrial_pesa_lo_mismo_que_embalaje(self):
        freidora = bot.comision_estimada("Freidora Industrial Doble Daewoo Inox 20lt")
        self.assertEqual(freidora, 1.8)
        self.assertGreater(freidora, bot.comision_estimada("Freidora De Aire Philco 5l"))

    def test_sin_match_devuelve_peso_neutro(self):
        self.assertEqual(bot.comision_estimada("Algo Que No Matchea Nada En Particular"), 1.0)

    def test_herramientas_electricas_pesa_lo_mismo_que_embalaje(self):
        taladro = bot.comision_estimada("Set 166 Piezas Taladro Percutor Y Atornillador Inalambrico")
        self.assertEqual(taladro, 1.8)

    def test_colchon_pesa_lo_mismo_que_embalaje(self):
        colchon = bot.comision_estimada("Colchon 1 Plaza 80cm x 190cm Espuma Alta Densidad")
        self.assertEqual(colchon, 1.8)

    def test_climatizacion_pesa_mas_que_default(self):
        self.assertGreater(
            bot.comision_estimada("Aire Acondicionado Split Surrey Inverter Wifi 9000 Btu"),
            bot.comision_estimada("Producto Genérico Sin Categoría Reconocible"),
        )

    def test_no_distingue_mayusculas(self):
        self.assertEqual(
            bot.comision_estimada("CERRADURA INTELIGENTE HUELLA DIGITAL"),
            bot.comision_estimada("cerradura inteligente huella digital"),
        )


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


class TestRunSlot(unittest.TestCase):
    """Los crons de Actions llegan atrasados: el slot no puede depender de la
    hora exacta."""

    def test_horas_nominales(self):
        self.assertEqual(bot.run_slot(15), "midday")
        self.assertEqual(bot.run_slot(20), "evening")
        self.assertEqual(bot.run_slot(0), "night")

    def test_horas_con_atraso_real(self):
        # Observadas en septiembre: mediodía ~18:xx, tarde 23:02, noche 03:xx
        self.assertEqual(bot.run_slot(18), "midday")
        self.assertEqual(bot.run_slot(23), "evening")
        self.assertEqual(bot.run_slot(3), "night")

    def test_todas_las_horas_de_los_runs_caen_en_un_slot(self):
        for h in (15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4):
            self.assertNotEqual(bot.run_slot(h), "other", h)

    def test_horas_fuera_de_los_runs(self):
        for h in range(5, 15):
            self.assertEqual(bot.run_slot(h), "other", h)


class TestSelectSiteDeals(unittest.TestCase):
    """Qué ofertas del scrape de 20 páginas llegan a la web."""

    @staticmethod
    def deal(id_, title="Producto genérico", discount=30, hist_low=False, inflada=False,
             price=100000):
        return {"id": id_, "title": title, "discount": discount, "price_cur": price,
                "hist_low": hist_low, "inflada": inflada}

    def test_los_prioritarios_se_recortan_por_ganancia_esperada(self):
        # Con las páginas por categoría hay cientos de prioritarios: entran los
        # que más plata dejan, no los primeros que aparecieron.
        baratos = [self.deal(f"T{i}", "Taladro percutor", price=50000) for i in range(3)]
        caro = self.deal("T9", "Taladro percutor", price=900000)
        with unittest.mock.patch.object(bot, "SITE_PRIORITARIO_LIMIT", 2):
            ids = [d["id"] for d in bot.select_site_deals(baratos + [caro], limit=0)]
        self.assertIn("T9", ids)
        self.assertEqual(len(ids), 2)

    def test_las_de_comision_alta_entran_siempre(self):
        genericos = [self.deal(f"G{i}", discount=60) for i in range(5)]
        aire = self.deal("A1", "Aire Acondicionado Split 3000 Frigorías", discount=10)
        ids = [d["id"] for d in bot.select_site_deals(genericos + [aire], limit=2)]
        self.assertIn("A1", ids)
        self.assertEqual(len(ids), 3)

    def test_el_resto_se_recorta_por_minimo_y_descuento(self):
        deals = [self.deal("G1", discount=20), self.deal("G2", discount=50),
                 self.deal("G3", discount=10, hist_low=True)]
        ids = [d["id"] for d in bot.select_site_deals(deals, limit=2)]
        self.assertEqual(ids, ["G2", "G3"])  # orden original del scrape

    def test_las_infladas_no_van_a_la_web(self):
        deals = [self.deal("C1", "Colchón 2 plazas", inflada=True), self.deal("G1")]
        ids = [d["id"] for d in bot.select_site_deals(deals)]
        self.assertEqual(ids, ["G1"])


if __name__ == "__main__":
    unittest.main()


class TestGananciaEsperada(unittest.TestCase):
    def test_ticket_alto_le_gana_al_descuento_alto_barato(self):
        aire = {"title": "Aire Acondicionado Split Inverter", "price_cur": 800000, "discount": 20}
        juguete = {"title": "Juego Encastre Didactico", "price_cur": 8000, "discount": 60, "hist_low": True}
        self.assertGreater(bot.ganancia_esperada(aire), bot.ganancia_esperada(juguete))

    def test_relampago_suma(self):
        base = {"title": "Neumatico 175/65 R14", "price_cur": 100000}
        self.assertGreater(bot.ganancia_esperada({**base, "relampago": True}), bot.ganancia_esperada(base))
        self.assertEqual(bot.comision_estimada(base["title"]), 1.4)


class TestTemporadas(unittest.TestCase):
    def test_dia_de_la_madre(self):
        oct10 = datetime(2026, 10, 10)
        self.assertEqual(bot.temporada_boost("Perfume Carolina Herrera 100ml", oct10), 1.5)
        self.assertEqual(bot.temporada_boost("Perfume Carolina Herrera 100ml", datetime(2026, 4, 1)), 1.0)

    def test_verano_cruza_fin_de_anio(self):
        # Piletas y aires: pico de calor (1.45); el resto del verano, 1.3.
        self.assertEqual(bot.temporada_boost("Pileta estructural 3x2", datetime(2027, 1, 15)), 1.45)
        self.assertEqual(bot.temporada_boost("Parrilla de hierro", datetime(2027, 1, 15)), 1.3)
        self.assertEqual(bot.temporada_boost("Pileta estructural 3x2", datetime(2027, 2, 20)), 1.3)


class TestGananciaPorComision(unittest.TestCase):
    def test_aire_le_gana_a_celular_mas_caro(self):
        aire = {"title": "Aire Acondicionado Split Inverter 3000 Frig", "price_cur": 880000}
        cel = {"title": "Apple iPhone 16e 512 Gb", "price_cur": 1700000, "relampago": True}
        self.assertGreater(bot.ganancia_esperada(aire), bot.ganancia_esperada(cel))


class TestSeguimiento(unittest.TestCase):
    def test_abre_pagina_solo_ticket_alto_y_acumula_serie(self):
        aire = {"id": "MLA1", "title": "Aire Acondicionado Split Inverter", "url": "https://x/p/MLA1",
                "price_prev": 1000000, "price_cur": 800000, "discount": 20, "img": None}
        barato = {"id": "MLA2", "title": "Juego Encastre", "url": "https://x/p/MLA2",
                  "price_prev": 10000, "price_cur": 8000, "discount": 20, "img": None}
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "seg.json"
            bot.update_seguimiento([aire, barato], {}, "aff", p, today="2026-09-24")
            data = bot.update_seguimiento([{**aire, "price_cur": 750000}], {}, "aff", p, today="2026-09-25")
        self.assertEqual(list(data["items"]), ["MLA1"])
        self.assertEqual(data["items"]["MLA1"]["serie"], [["2026-09-24", 800000], ["2026-09-25", 750000]])
        self.assertTrue(data["items"]["MLA1"]["slug"].startswith("aire-acondicionado-split"))

    def test_borra_los_que_no_vemos_hace_60_dias(self):
        aire = {"id": "MLA1", "title": "Aire Acondicionado Split", "url": "u",
                "price_prev": 1000000, "price_cur": 800000, "discount": 20, "img": None}
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "seg.json"
            bot.update_seguimiento([aire], {}, "aff", p, today="2026-07-01")
            data = bot.update_seguimiento([], {}, "aff", p, today="2026-09-24")
        self.assertEqual(data["items"], {})


    def test_al_recortar_quedan_las_de_mas_historial(self):
        def aire(i):
            return {"id": f"MLA{i}", "title": f"Aire Acondicionado Split {i}", "url": "u",
                    "price_prev": 1000000, "price_cur": 800000, "discount": 20, "img": None}
        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(bot, "SEGUIMIENTO_MAX_ITEMS", 2):
            p = Path(tmp) / "seg.json"
            bot.update_seguimiento([aire(1)], {}, "aff", p, today="2026-09-23")
            bot.update_seguimiento([aire(1), aire(2)], {}, "aff", p, today="2026-09-24")
            data = bot.update_seguimiento([aire(3), aire(2), aire(1)], {}, "aff", p, today="2026-09-25")
        # MLA3 es nueva (1 punto): sale ella, no las que Google ya conoce
        self.assertEqual(sorted(data["items"]), ["MLA1", "MLA2"])


class TestSelloTemporada(unittest.TestCase):
    OCT = datetime(2026, 10, 5)
    NOV = datetime(2026, 11, 10)

    def test_regalo_madre_en_ventana(self):
        self.assertIn("Día de la Madre", bot.sello_temporada("Perfume Carolina Herrera 100ml", self.OCT))

    def test_fuera_de_ventana_sin_sello(self):
        self.assertEqual(bot.sello_temporada("Perfume Carolina Herrera 100ml", self.NOV), "")

    def test_no_matchea_dentro_de_otra_palabra(self):
        self.assertEqual(bot.sello_temporada("Kit Faros Led Auto H4", self.OCT), "")
        self.assertEqual(bot.temporada_boost("Kit Faros Led Auto H4", self.OCT), 1.0)

    def test_primavera_no_tiene_sello(self):
        self.assertEqual(bot.sello_temporada("Ventilador de pie 20 pulgadas", self.OCT), "")

    def test_deal_sin_temporada_no_lleva_sello(self):
        deal = {"title": "Ventilador de pie 20 pulgadas", "price_prev": 50000,
                "price_cur": 40000, "discount": 20, "img": None}
        deal["sello_temporada"] = bot.sello_temporada(deal["title"], self.OCT).lstrip("🎁🎄 ").upper()
        self.assertEqual(deal["sello_temporada"], "")

    def test_deal_con_temporada_lleva_sello_en_mayusculas_sin_emoji(self):
        deal = {"title": "Cafetera Nespresso Original", "price_prev": 200000,
                "price_cur": 150000, "discount": 25, "img": None}
        hoy = datetime(2026, 10, 10)
        deal["sello_temporada"] = bot.sello_temporada(deal["title"], hoy).lstrip("🎁🎄 ").upper()
        self.assertEqual(deal["sello_temporada"], "IDEA DE REGALO PARA EL DÍA DE LA MADRE")

    def test_caption_telegram_incluye_sello(self):
        deal = {"title": "Cafetera Nespresso", "price_prev": 200000, "price_cur": 150000,
                "discount": 25, "img": None}
        with mock.patch.object(bot, "sello_temporada", return_value="🎁 Idea de regalo para el Día de la Madre"):
            self.assertIn("Día de la Madre", bot.deal_caption(deal, "https://x"))
            self.assertTrue(bot.ig_caption(deal).startswith("🎁 IDEA DE REGALO"))


class TestDiaDeLaMadreTicketAlto(unittest.TestCase):
    OCT = datetime(2026, 10, 5)

    def test_colchon_sommier_gazebo_son_regalo(self):
        for t in ("Colchón Piero 2 plazas 140x190", "Sommier Cannon Queen", "Gazebo 3x3 Acero"):
            self.assertIn("Día de la Madre", bot.sello_temporada(t, self.OCT), t)

    def test_landing_madre_en_ventana(self):
        lt = bot.landing_temporada("Perfume Carolina Herrera 100ml", "telegram", self.OCT)
        self.assertIsNotNone(lt)
        self.assertIn("/dia-de-la-madre?utm_source=telegram", lt[1])
        self.assertIsNone(bot.landing_temporada("Kit Faros Led", "telegram", self.OCT))
        self.assertIsNone(bot.landing_temporada("Perfume X", "telegram", datetime(2026, 11, 10)))

    def test_ticket_alto_de_regalo_suma_plus(self):
        base = {"title": "Colchón Piero 2 plazas", "price_cur": 370000, "hist_low": False}
        with mock.patch.object(bot, "sello_temporada", return_value="🎁 x"),                 mock.patch.object(bot, "temporada_boost", return_value=1.5):
            alto = bot.ganancia_esperada(base)
            bajo = bot.ganancia_esperada({**base, "price_cur": 70000})
        self.assertAlmostEqual(alto / bajo, 370000 / 70000 * bot.REGALO_TICKET_ALTO_BOOST)

    def test_boton_telegram_va_a_la_landing(self):
        deal = {"title": "Perfume Carolina Herrera", "price_prev": 200000, "price_cur": 150000,
                "discount": 25, "img": None}
        with mock.patch.object(bot, "landing_temporada", return_value=("🎁 Más regalos", "https://x/dia-de-la-madre")),                 mock.patch.object(bot, "tg_call") as tg:
            bot.post_deal("t", "c", deal, "https://ml", dry=False)
        kb = str(tg.call_args)
        self.assertIn("dia-de-la-madre", kb)


class TestWaKit(unittest.TestCase):
    def test_arma_tres_ofertas_con_link_whatsapp(self):
        deals = [
            {"title": f"Producto {i}", "discount": 30, "price_prev": 100000,
             "price_cur": 70000, "url": f"https://ml.com/p/MLA{i}"}
            for i in range(5)
        ]
        txt = bot.wa_kit(deals, "aff", "whatsapp")
        self.assertEqual(txt.count("matt_word=whatsapp"), 3)
        self.assertIn("utm_source=whatsapp", txt)
        self.assertIn("afiliado", txt)
        self.assertNotIn("Producto 3", txt)



class TestVerificadorCTA(unittest.TestCase):
    def test_threads_lleva_al_verificador_sin_pasar_500(self):
        d = {"price_prev": 500000, "price_cur": 350000, "discount": 30,
             "title": "Aire acondicionado split inverter 3000 frigorías", "hist_low": False}
        t = bot.th_caption(d, "https://mercadolibre.com.ar/MLA-123456789")
        self.assertIn("es real", t)
        self.assertLessEqual(len(t), 500)

    def test_url_del_verificador(self):
        self.assertTrue(bot.verificador_url("telegram").endswith("#verificador"))


class TestMencionWhatsApp(unittest.TestCase):
    """El canal de WhatsApp se menciona sobrio: 1 post de TG por día y el
    post de texto de Threads, sin pasarse de los límites de caracteres."""

    DEAL = {"id": "MLA1", "title": "Producto de Prueba", "price_prev": 100000,
            "price_cur": 50000, "discount": 50, "hist_low": False,
            "url": "https://www.mercadolibre.com.ar/MLA1", "img": ""}
    LINK = "https://mercadolibre.com.ar/MLA-1?matt_word=telegram&matt_tool=37267219"

    def test_la_url_es_una_constante_con_el_canal(self):
        self.assertTrue(bot.WHATSAPP_CHANNEL_URL.startswith("https://whatsapp.com/channel/"))

    def test_telegram_sin_flag_no_menciona_whatsapp(self):
        self.assertNotIn("WhatsApp", bot.deal_caption(self.DEAL, self.LINK))

    def test_telegram_con_flag_cierra_con_la_linea(self):
        cap = bot.deal_caption(self.DEAL, self.LINK, whatsapp=True)
        self.assertTrue(cap.endswith(
            bot.WA_CTA.format(url=bot.WHATSAPP_CHANNEL_URL)))

    def test_telegram_no_la_agrega_si_se_pasa_de_1024(self):
        largo = {**self.DEAL, "title": "x" * 900}
        cap = bot.deal_caption(largo, self.LINK, whatsapp=True)
        self.assertNotIn("WhatsApp", cap)
        self.assertEqual(cap, bot.deal_caption(largo, self.LINK))

    def test_el_largo_de_telegram_ignora_los_tags_html(self):
        self.assertEqual(bot.tg_visible_len("<b>ab</b> &amp;"), 4)
        self.assertEqual(bot.tg_visible_len("🔥"), 2)  # UTF-16

    def test_threads_texto_cierra_con_la_linea_sin_pasar_500(self):
        cap = bot.th_text_caption(self.DEAL, self.LINK)
        self.assertIn(bot.WHATSAPP_CHANNEL_URL, cap)
        self.assertLessEqual(len(cap), 500)

    def test_threads_texto_no_la_agrega_si_se_pasa_de_500(self):
        link_largo = "https://mercadolibre.com.ar/" + "a" * 420
        cap = bot.th_text_caption(self.DEAL, link_largo)
        self.assertNotIn("WhatsApp", cap)

    def test_threads_con_placa_no_menciona_whatsapp(self):
        self.assertNotIn("WhatsApp", bot.th_caption(self.DEAL, self.LINK))

    def test_instagram_no_menciona_whatsapp(self):
        self.assertNotIn("WhatsApp", bot.ig_caption(self.DEAL))

    def test_override_por_env_var(self):
        import importlib
        try:
            with mock.patch.dict("os.environ", {"WHATSAPP_CHANNEL_URL": "https://wa.example/x"}):
                self.assertEqual(importlib.reload(bot).WHATSAPP_CHANNEL_URL,
                                 "https://wa.example/x")
        finally:
            importlib.reload(bot)  # vuelve al valor por defecto para el resto

    def correr_main(self, slot, n=3):
        from contextlib import ExitStack
        deals = [{**self.DEAL, "id": f"MLA{i}", "title": f"Producto distinto {i}", "url": f"https://www.mercadolibre.com.ar/MLA{i}",
                  "inflada": False} for i in range(n)]
        with ExitStack() as st:
            for nombre in ("write_site_data", "update_seguimiento", "save_price_history",
                           "log_scan", "save_state", "alert_admin", "write_infladas",
                           "annotate_price_history", "log_post", "publish_reel"):
                st.enter_context(mock.patch.object(bot, nombre))
            st.enter_context(mock.patch.object(bot, "fetch_deals", return_value=deals))
            st.enter_context(mock.patch.object(bot, "recent_title_keys", return_value=set()))
            st.enter_context(mock.patch.object(bot, "load_price_history", return_value={}))
            st.enter_context(mock.patch.object(bot, "load_state", return_value={"posted_ids": []}))
            st.enter_context(mock.patch.object(bot, "load_config", return_value={
                "channel": "@c", "admin_chat": "1", "max_posts": n}))
            post = st.enter_context(mock.patch.object(bot, "post_deal", return_value=True))
            st.enter_context(mock.patch.object(bot, "run_slot", return_value=slot))
            st.enter_context(mock.patch.object(bot.time, "sleep"))
            st.enter_context(mock.patch.dict("os.environ", {
                "DRY_RUN": "1", "SKIP_SITE_DATA": "1", "IG_USER_ID": "",
                "THREADS_USER_ID": "", "FB_PAGE_ID": ""}))
            st.enter_context(mock.patch("builtins.print"))
            self.assertEqual(bot.main(), 0)
        return [c.kwargs.get("whatsapp", False) for c in post.call_args_list]

    def test_de_noche_solo_el_ultimo_post_de_telegram_la_lleva(self):
        self.assertEqual(self.correr_main("night"), [False, False, True])

    def test_en_los_otros_slots_ningun_post_de_telegram_la_lleva(self):
        for slot in ("midday", "evening", "other"):
            self.assertEqual(self.correr_main(slot), [False, False, False], slot)


class TestTemporadaReyes(unittest.TestCase):
    def _d(self, y, m, d):
        return datetime(y, m, d, 12, tzinfo=timezone.utc)

    def test_dentro_de_ventana(self):
        for fecha in (self._d(2026, 12, 25), self._d(2027, 1, 1), self._d(2027, 1, 6)):
            self.assertEqual(bot.sello_temporada("LEGO City Camión", fecha), "👑 Idea de regalo para Reyes")
            self.assertEqual(bot.temporada_boost("Muñeca Barbie", fecha), 1.4)

    def test_fuera_de_ventana(self):
        self.assertEqual(bot.sello_temporada("Muñeca Barbie", self._d(2027, 1, 7)), "")
        self.assertEqual(bot.temporada_boost("Muñeca Barbie", self._d(2027, 1, 7)), 1.0)
        # 24/12 sigue siendo Navidad, no Reyes
        self.assertEqual(bot.sello_temporada("LEGO City", self._d(2026, 12, 24)), "🎄 Idea de regalo para Navidad")
        self.assertEqual(bot.temporada_boost("Muñeca Barbie", self._d(2026, 12, 24)), 1.0)

    def test_en_ventana_cruza_anio(self):
        self.assertTrue(bot._en_ventana(self._d(2027, 1, 3), (12, 25), (1, 6)))
        self.assertFalse(bot._en_ventana(self._d(2027, 6, 3), (12, 25), (1, 6)))


# ---- Instagram/Threads mandan a la web, no directo a ML ----

def test_web_deal_url_ficha_existente(tmp_path):
    import json as _json
    from cazador_bot import paginas_existentes, web_deal_url
    p = tmp_path / "seg.json"
    p.write_text(_json.dumps({"items": {"MLA1": {"slug": "tv-55-mla1"}}}), encoding="utf-8")
    pag = paginas_existentes(p)
    assert web_deal_url({"id": "MLA1"}, "threads", pag) == (
        "https://cazadordeofertas.com.ar/precio/tv-55-mla1?utm_source=threads&utm_medium=social")


def test_web_deal_url_sin_ficha_va_a_hoy(tmp_path):
    from cazador_bot import paginas_existentes, web_deal_url
    assert paginas_existentes(tmp_path / "no.json") == {}
    url = web_deal_url({"id": "MLA9"}, "instagram", {})
    assert url == "https://cazadordeofertas.com.ar/hoy?utm_source=instagram&utm_medium=social"
    assert "mercadolibre" not in url


def test_web_deal_url_sin_ficha_va_a_su_comparativa():
    from cazador_bot import web_deal_url
    url = web_deal_url({"id": "MLA9", "title": "Notebook Lenovo IdeaPad 15"}, "telegram", {})
    assert url == ("https://cazadordeofertas.com.ar/mejores/mejores-notebooks"
                   "?utm_source=telegram&utm_medium=social")
    assert "/mejores/mejores-colchones?" in web_deal_url({"id": "X", "title": "Colchón Piero 2 Plazas"}, "ig", {})
    assert "/mejores/mejores-celulares?" in web_deal_url({"id": "X", "title": "Smartphone Moto G"}, "ig", {})
    # accesorios y fichas existentes no cambian
    assert "/hoy?" in web_deal_url({"id": "X", "title": "Funda Para Celular"}, "ig", {})
    assert "/precio/nb-mla1?" in web_deal_url({"id": "MLA1", "title": "Notebook HP"}, "ig", {"MLA1": "nb-mla1"})


def test_th_caption_con_link_web():
    from cazador_bot import th_caption, th_text_caption, web_deal_url
    d = {"id": "MLA1", "title": "Smart TV 55", "price_prev": 1000000,
         "price_cur": 700000, "discount": 30}
    link = web_deal_url(d, "threads", {"MLA1": "smart-tv-55-mla1"})
    for cap in (th_caption(d, link), th_text_caption(d, link)):
        assert link in cap and "mercadolibre" not in cap and len(cap) <= 500


class TestTelegramAWeb(unittest.TestCase):
    DEAL = {"id": "MLA1", "url": "https://www.mercadolibre.com.ar/p/MLA1",
            "title": "Aire acondicionado split 3000 frigorías"}

    def test_con_ficha_va_a_la_web_y_ml_queda_secundario(self):
        link, ml = bot.telegram_links(self.DEAL, "aff", "telegram", {"MLA1": "aire-split"})
        self.assertEqual(
            link, f"https://{bot.SITE_DOMAIN}/precio/aire-split?utm_source=telegram&utm_medium=social")
        self.assertIn("matt_word=telegram", ml)
        kb = bot.tg_keyboard(self.DEAL, link, ml)["inline_keyboard"]
        self.assertEqual(kb[0][0]["url"], link)
        self.assertEqual(kb[1][0]["url"], ml)

    def test_sin_ficha_sigue_ml_directo(self):
        link, ml = bot.telegram_links(self.DEAL, "aff", "telegram", {})
        self.assertIsNone(ml)
        self.assertIn("matt_word=telegram", link)
        self.assertEqual(bot.tg_keyboard(self.DEAL, link)["inline_keyboard"][0][0]["url"], link)

    def test_exclusiva_del_canal_no_manda_a_la_web(self):
        deal = dict(self.DEAL, canal_exclusiva=True)
        link, ml = bot.telegram_links(deal, "aff", "telegram", {"MLA1": "aire-split"})
        self.assertIsNone(ml)
        self.assertNotIn(bot.SITE_DOMAIN, link)

    def test_seleccion_prioriza_ganancia_esperada(self):
        chico = {"title": "Juguete", "price_cur": 15000}
        grande = {"title": "Aire acondicionado split", "price_cur": 800000}
        orden = sorted([chico, grande], key=bot.ganancia_esperada, reverse=True)
        self.assertIs(orden[0], grande)


def test_ig_caption_ticket_alto_lleva_direccion_corta_a_comparativa():
    d = {"title": "Notebook Acer Aspire Go 15", "discount": 38, "price_prev": 2373000, "price_cur": 1471299}
    assert "cazadordeofertas.com.ar/notebooks" in bot.ig_caption(d)
    d["title"] = "Freidora de aire Philco"
    assert "Compará más" not in bot.ig_caption(d)


def test_aires_van_a_su_comparativa_con_direccion_corta():
    d = {"title": "Aire Acondicionado Philco Inverter", "discount": 40, "price_prev": 1999999, "price_cur": 1199999}
    assert bot.comparativa_de(d["title"]) == "/mejores/mejores-aires-acondicionados"
    assert "cazadordeofertas.com.ar/aires" in bot.ig_caption(d)


def test_smart_tv_va_a_su_comparativa_con_direccion_corta():
    d = {"title": "Smart Tv Samsung 50 Uhd 4k", "discount": 20, "price_prev": 917999, "price_cur": 733999}
    assert bot.comparativa_de(d["title"]) == "/mejores/mejores-smart-tv"
    assert "cazadordeofertas.com.ar/tv" in bot.ig_caption(d)


def test_lavarropas_y_heladeras_van_a_su_comparativa():
    base = {"discount": 30, "price_prev": 1000000, "price_cur": 700000}
    assert "cazadordeofertas.com.ar/lavarropas" in bot.ig_caption({**base, "title": "Lavarropas Drean Next 8kg"})
    assert "cazadordeofertas.com.ar/heladeras" in bot.ig_caption({**base, "title": "Heladera No Frost Samsung"})


def test_ig_caption_landing_con_direccion_corta(monkeypatch):
    monkeypatch.setattr(bot, "landing_temporada", lambda t, s: ("🎁 Más regalos", "https://cazadordeofertas.com.ar/dia-de-la-madre?utm_source=instagram"))
    cap = bot.ig_caption({"title": "Perfume", "discount": 30, "price_prev": 100000, "price_cur": 70000})
    assert "cazadordeofertas.com.ar/madre\n" in cap
