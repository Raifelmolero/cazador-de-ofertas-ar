"""Reglas del 24/11/2026, después de dos reels que salieron mal sin revisión
(HP Core Ultra 9 el 22/11 y Gigabyte A16 el 23/11):

1. El cierre con la web se ve entero >= 3 s y ffmpeg no recorta el final.
2. Sin %, "OFF", "Estaba"/precio tachado, ahorro ni "mínimo histórico" en
   los overlays del reel ni en los captions de IG/FB/Threads.
3. Marcas excluidas de todo canal (HP/OMEN/Victus/Omnibook, BGH/Likon,
   Vivobook), sin confundir HP con caballos de fuerza.
4. El reel no se publica solo en el cron: solo con FORCE_REEL=1 manual.

Corre con unittest y con pytest.
"""
import io
import re
import sys
import tempfile
import unittest
from contextlib import ExitStack
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from PIL import Image, ImageDraw  # noqa: E402

import cazador_bot as bot  # noqa: E402
import reel  # noqa: E402
from marcas import marca_excluida, sin_marcas_excluidas  # noqa: E402

DEAL = {
    "id": "MLA1", "title": "Freidora De Aire Moulinex Easy Fry 4l Negro",
    "discount": 51, "price_prev": 292490, "price_cur": 141990,
    "hist_low": True, "low": True, "img": "https://x/y.jpg",
    "url": "https://www.mercadolibre.com.ar/MLA1",
}
PROHIBIDO = re.compile(r"%|\bOFF\b|estaba|antes|tachad|ahorr|te quedan|m[ií]nimo hist|m[aá]s barato|m[aá]s bajo",
                       re.IGNORECASE)


def _img_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (600, 600), (200, 200, 200)).save(buf, "JPEG")
    return buf.getvalue()


# ------------------------------------------------------------ 1. cierre >= 3 s

class _FakeProc:
    """Popen falso: cuenta los frames que llegan y cuántos son el cierre entero."""

    def __init__(self, cmd, *a, **k):
        self.cmd = cmd
        self.frames = 0
        self.cierre_entero = 0
        self.ultimo_es_cierre = False
        self.returncode = 0
        self.stdin = self

    def write(self, data):
        self.frames += 1
        self.ultimo_es_cierre = data == _CIERRE_BYTES
        if self.ultimo_es_cierre:
            self.cierre_entero += 1

    def close(self):
        pass

    def wait(self):
        return 0


_CIERRE = Image.new("RGB", (reel.W, reel.H), (255, 0, 0))
_CIERRE_BYTES = _CIERRE.tobytes()
_OTRA = Image.new("RGB", (reel.W, reel.H), (0, 255, 0))


class TestCierreReel(unittest.TestCase):
    def _render(self, fn):
        procs = []

        def popen(cmd, *a, **k):
            procs.append(_FakeProc(cmd))
            return procs[-1]

        with ExitStack() as st:
            st.enter_context(mock.patch.object(reel.subprocess, "Popen", side_effect=popen))
            st.enter_context(mock.patch.object(reel, "_scene_close_v2", return_value=_CIERRE))
            for nombre in ("_scene_hook", "_scene_producto", "_scene_precio",
                           "_scene_hook_v2", "_scene_main_v2"):
                st.enter_context(mock.patch.object(reel, nombre, return_value=_OTRA))
            with tempfile.TemporaryDirectory() as tmp:  # ffmpeg es falso: no se escribe nada
                fn(DEAL, _img_bytes(), Path(tmp) / "reel.mp4")
        return procs[0]

    def _chequear(self, proc, total):
        self.assertEqual(proc.frames, round(total * reel.FPS))
        # la web a pantalla completa (sin fundido) por lo menos 3 s...
        self.assertGreaterEqual(proc.cierre_entero, 3 * reel.FPS)
        # ...y es lo último que se ve: sin fundido a negro ni corte al final
        self.assertTrue(proc.ultimo_es_cierre)
        # ffmpeg no recorta: sin -shortest y con la cantidad exacta de frames
        self.assertNotIn("-shortest", proc.cmd)
        self.assertIn("-frames:v", proc.cmd)
        self.assertEqual(proc.cmd[proc.cmd.index("-frames:v") + 1], str(proc.frames))

    def test_v2_cierre_de_3_segundos_enteros(self):
        self.assertGreaterEqual(reel.DUR_CLOSE_V2, 3.0)
        self.assertGreaterEqual(reel.DUR_CLOSE_V2 - reel.FADE_V2, 3.0)
        total = reel.DUR_HOOK_V2 + reel.DUR_MAIN_V2 + reel.DUR_CLOSE_V2
        self._chequear(self._render(reel.render_reel_v2), total)

    def test_v1_tiene_escena_de_cierre_de_3_segundos(self):
        self.assertGreaterEqual(reel.DUR_CLOSE - reel.FADE, 3.0)
        total = reel.DUR_HOOK + reel.DUR_PROD + reel.DUR_PRICE + reel.DUR_CLOSE
        self._chequear(self._render(reel.render_reel), total)

    def test_el_audio_dura_lo_mismo_que_el_video(self):
        # el audio se corta con -t a la duración exacta y el fade termina ahí:
        # nunca puede acortar el video
        cmd = reel._ffmpeg_cmd(Path("x.mp4"), 300, fade_audio=1.0)
        i = cmd.index("-t")
        self.assertEqual(cmd[i + 1], "10.000")
        self.assertLess(i, cmd.index("-map"))  # opción de entrada del audio
        af = [cmd[j + 1] for j, c in enumerate(cmd) if c == "-af"]
        for filtro in af:
            st = float(re.search(r"st=([\d.]+)", filtro).group(1))
            d = float(re.search(r"d=([\d.]+)", filtro).group(1))
            self.assertAlmostEqual(st + d, 10.0, places=2)


# ---------------------------------------------- 2. sin % ni "Estaba" en reel

class TestOverlaysSinDescuento(unittest.TestCase):
    def _textos(self, escena, *args):
        dibujados = []
        original = ImageDraw.ImageDraw.text

        def espia(self_d, xy, text, *a, **k):
            dibujados.append(str(text))
            return original(self_d, xy, text, *a, **k)

        with mock.patch.object(ImageDraw.ImageDraw, "text", espia):
            for t in (0.0, 0.5, 1.2, 2.0):
                escena(*args, t)
        return dibujados

    def _sin_prohibidos(self, textos):
        for txt in textos:
            self.assertIsNone(PROHIBIDO.search(txt), f"texto prohibido en el reel: {txt!r}")

    def test_v1_sin_badges_ni_precio_anterior(self):
        card = reel._make_card(_img_bytes())
        thumb = card.resize((520, 520))
        textos = (self._textos(reel._scene_hook, DEAL)
                  + self._textos(reel._scene_producto, DEAL, card)
                  + self._textos(reel._scene_precio, DEAL, thumb))
        self._sin_prohibidos(textos)
        self.assertIn(reel._fmt(DEAL["price_cur"]), textos)        # precio de hoy
        self.assertNotIn(reel._fmt(DEAL["price_prev"]), " ".join(textos))

    def test_v2_sin_badges_ni_precio_anterior(self):
        hero = reel._hero_crop(_img_bytes(), 600)
        textos = (self._textos(reel._scene_hook_v2, DEAL, hero)
                  + self._textos(reel._scene_main_v2, DEAL, hero))
        self._sin_prohibidos(textos)
        self.assertIn(reel._fmt(DEAL["price_cur"]), textos)
        self.assertNotIn(reel._fmt(DEAL["price_prev"]), " ".join(textos))

    def test_cierre_lleva_la_web(self):
        textos = self._textos(reel._scene_close_v2, DEAL)
        self._sin_prohibidos(textos)
        self.assertIn("cazadordeofertas.com.ar/ig", textos)


class TestCaptionsSinDescuento(unittest.TestCase):
    LINK = "https://cazadordeofertas.com.ar/precio/x?utm_source=threads"

    def _ok(self, cap):
        sin_hashtags = re.sub(r"#\w+", "", cap)  # #ahorro/#descuentos no son un descuento
        self.assertIsNone(PROHIBIDO.search(sin_hashtags), cap)
        self.assertNotIn(bot.fmt_price(DEAL["price_prev"]), cap)
        self.assertNotIn(bot.fmt_price(DEAL["price_prev"] - DEAL["price_cur"]), cap)
        self.assertNotIn("<s>", cap)
        self.assertIn(bot.fmt_price(DEAL["price_cur"]), cap)

    def test_ig_caption(self):
        for _ in range(10):  # ganchos al azar
            self._ok(bot.ig_caption(dict(DEAL)))

    def test_threads_y_facebook(self):
        for _ in range(10):
            self._ok(bot.th_caption(dict(DEAL), self.LINK))
            self._ok(bot.th_text_caption(dict(DEAL), self.LINK))
            self._ok(bot.fb_caption(dict(DEAL), self.LINK))

    def test_threads_version_corta(self):
        d = {**DEAL, "title": "X" * 200}
        self._ok(bot.th_caption(d, self.LINK + "&" + "y" * 400))
        self._ok(bot.th_text_caption(d, self.LINK + "&" + "y" * 450))

    def test_kits_de_instagram(self):
        self._ok(bot.story_kit(dict(DEAL), "123", "instagram", {}))
        with mock.patch.object(bot, "tg_call") as tg:
            bot.send_ig_kit("tok", "1", dict(DEAL), self.LINK, dry=False)
        self._ok(tg.call_args.args[2]["text"].split("2️⃣")[1].split("3️⃣")[0])

    def test_shorts(self):
        import shorts
        for cap in (shorts.yt_title(DEAL), shorts.tiktok_caption(DEAL)):
            self.assertNotIn("%", cap)
            self.assertNotIn("OFF", cap)


# ------------------------------------------------------- 3. marcas excluidas

class TestMarcasExcluidas(unittest.TestCase):
    def test_marcas(self):
        for t in ("Notebook HP 15 Core i5", "Notebook Hp Victus 15", "HP OMEN Transcend 14",
                  "Omnibook X Flip", "Impresora hp DeskJet", "Victus Gaming 16",
                  "Asus Vivobook Go 15", "Smart TV BGH 50", "Lavarropas Likon 6 kg",
                  "Notebook HP Core Ultra 9", "Hewlett Packard Laserjet", "Monitor (HP) 24"):
            self.assertTrue(marca_excluida(t), t)

    def test_hp_de_caballos_de_fuerza_no_cuenta(self):
        for t in ("Compresor 7.5 Hp 100 Litros", "Motor 1/2 HP Monofásico", "Bomba 1hp Periférica",
                  "Compresor 2,5 HP", "Motobomba 3 Hp", "Motor 2 CV/HP", "Gigabyte A16 Notebook",
                  "Heladera Samsung", "Chopper hpx"):
            self.assertFalse(marca_excluida(t), t)

    def test_filtra_lista(self):
        lote = [{"title": "Notebook HP 15"}, {"title": "Compresor 7.5 Hp"}, {"title": "Asus Vivobook"}]
        self.assertEqual(sin_marcas_excluidas(lote), [{"title": "Compresor 7.5 Hp"}])

    def test_main_no_publica_marcas_excluidas_en_ningun_canal(self):
        titulos = ["Notebook HP Core Ultra 9", "Smart TV BGH 55", "Compresor 7.5 Hp 50 Litros",
                   "Asus Vivobook 15", "Heladera Samsung No Frost"]
        llamadas = _correr_main("night", titulos, extra_env={"FORCE_REEL": "1",
                                                             "GITHUB_EVENT_NAME": "workflow_dispatch"})
        publicados = [c.args[2]["title"] for c in llamadas["post_deal"].call_args_list]
        publicados += [c.args[0]["title"] for c in llamadas["publish_reel"].call_args_list]
        publicados += [c.args[0]["title"] for c in llamadas["publish_facebook"].call_args_list]
        publicados += [c.args[0]["title"] for c in llamadas["publish_threads"].call_args_list]
        kit = [d["title"] for c in llamadas["wa_kit"].call_args_list for d in c.args[0]]
        self.assertTrue(publicados)
        for t in publicados + kit:
            self.assertFalse(marca_excluida(t), t)
        self.assertIn("Compresor 7.5 Hp 50 Litros", publicados + kit)


# ------------------------------------------------- 4. reel sin auto-publicar

def _correr_main(slot, titulos, extra_env=None):
    deals = [{**DEAL, "id": f"MLA{i}", "title": t, "url": f"https://www.mercadolibre.com.ar/MLA{i}",
              "hist_low": False, "inflada": False} for i, t in enumerate(titulos)]
    mocks = {}
    with ExitStack() as st:
        for nombre in ("write_site_data", "update_seguimiento", "save_price_history", "update_testigo",
                       "log_scan", "save_state", "alert_admin", "write_infladas",
                       "annotate_price_history", "log_post", "publish_reel", "publish_facebook",
                       "publish_threads", "ig_publish", "publish_story", "send_story_kit",
                       "send_ig_kit", "aviso_reponer_manuales"):
            mocks[nombre] = st.enter_context(mock.patch.object(bot, nombre, return_value=None))
        mocks["publish_reel"].return_value = (None, False)
        mocks["update_testigo"].return_value = 0
        mocks["wa_kit"] = st.enter_context(mock.patch.object(bot, "wa_kit", return_value="kit"))
        st.enter_context(mock.patch.object(bot, "fetch_deals", return_value=deals))
        st.enter_context(mock.patch.object(bot, "recent_title_keys", return_value=set()))
        st.enter_context(mock.patch.object(bot, "recent_kit_ids", return_value=set()))
        st.enter_context(mock.patch.object(bot, "categorias_recientes_ig", return_value=[]))
        st.enter_context(mock.patch.object(bot, "load_price_history", return_value={}))
        st.enter_context(mock.patch.object(bot, "load_state", return_value={"posted_ids": []}))
        st.enter_context(mock.patch.object(bot, "load_config", return_value={
            "channel": "@c", "admin_chat": "1", "max_posts": len(titulos), "min_discount": 1,
            "min_price": 1}))
        mocks["post_deal"] = st.enter_context(mock.patch.object(bot, "post_deal", return_value=True))
        st.enter_context(mock.patch.object(bot, "run_slot", return_value=slot))
        st.enter_context(mock.patch.object(bot.time, "sleep"))
        env = {"DRY_RUN": "1", "SKIP_SITE_DATA": "1", "IG_USER_ID": "1", "IG_ACCESS_TOKEN": "t",
               "THREADS_USER_ID": "1", "THREADS_ACCESS_TOKEN": "t", "FB_PAGE_ID": "1",
               "FB_PAGE_ACCESS_TOKEN": "t", "FORCE_REEL": "0", "GITHUB_EVENT_NAME": "schedule",
               **(extra_env or {})}
        st.enter_context(mock.patch.dict("os.environ", env))
        st.enter_context(mock.patch("builtins.print"))
        assert bot.main() == 0
    return mocks


class TestReelSinAutoPublicar(unittest.TestCase):
    TITULOS = ["Heladera Samsung No Frost", "Lavarropas Drean 8 kg"]

    def test_cron_de_la_noche_no_publica_el_reel(self):
        m = _correr_main("night", self.TITULOS)
        m["publish_reel"].assert_not_called()
        # el resto de la franja night sigue igual
        self.assertTrue(m["post_deal"].called)
        self.assertTrue(m["publish_threads"].called)
        self.assertTrue(m["wa_kit"].called)

    def test_cron_no_publica_el_reel_aunque_quede_force_reel(self):
        m = _correr_main("night", self.TITULOS, {"FORCE_REEL": "1", "GITHUB_EVENT_NAME": "schedule"})
        m["publish_reel"].assert_not_called()

    def test_sin_force_reel_en_dispatch_tampoco(self):
        m = _correr_main("night", self.TITULOS, {"FORCE_REEL": "0",
                                                 "GITHUB_EVENT_NAME": "workflow_dispatch"})
        m["publish_reel"].assert_not_called()

    def test_disparo_manual_explicito_si_publica(self):
        m = _correr_main("midday", self.TITULOS, {"FORCE_REEL": "1",
                                                  "GITHUB_EVENT_NAME": "workflow_dispatch"})
        m["publish_reel"].assert_called_once()

    def test_publish_reel_sigue_existiendo(self):
        self.assertTrue(callable(bot.publish_reel))


if __name__ == "__main__":
    unittest.main()
