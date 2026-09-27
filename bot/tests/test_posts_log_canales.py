"""Tests del registro de YouTube Shorts, kits de WhatsApp y posts de texto
manuales en posts_log.jsonl, y de cómo los cuenta el reporte semanal."""

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import cazador_bot as bot  # noqa: E402
import texto_post  # noqa: E402
import weekly_report as wr  # noqa: E402

DEAL = {"id": "MLA9", "title": "Taladro", "discount": 40, "price_cur": 50000}


class _LogTmp(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / "posts_log.jsonl"
        p = mock.patch.object(bot, "POSTS_LOG_PATH", self.path)
        p.start()
        self.addCleanup(p.stop)
        self.addCleanup(self.tmp.cleanup)

    def entries(self):
        if not self.path.exists():
            return []
        return [json.loads(x) for x in self.path.read_text(encoding="utf-8").splitlines()]


class TestYoutube(_LogTmp):
    def test_short_subido_se_registra_como_canal_youtube(self):
        bot.log_shorts(DEAL, ["▶️ YouTube Short: https://youtu.be/x", "🎵 TikTok enviado"])
        e = self.entries()
        self.assertEqual([x["ch"] for x in e], ["youtube"])
        self.assertEqual(e[0]["id"], "MLA9")

    def test_dry_o_fallo_no_registra(self):
        bot.log_shorts(DEAL, ["[DRY] YouTube Short"])
        bot.log_shorts(DEAL, ["⚠️ YouTube Short falló: x"])
        bot.log_shorts(DEAL, [])
        self.assertEqual(self.entries(), [])


class TestTextoPost(_LogTmp):
    def run_main(self, env):
        base = {"TEXTO": "Nueva guía", "TELEGRAM_BOT_TOKEN": "t"}
        with mock.patch.dict(os.environ, {**base, **env}, clear=False), \
                mock.patch.object(texto_post, "load_config",
                                  return_value={"channel": "@c", "admin_chat": "1"}), \
                mock.patch.object(texto_post, "tg_call", return_value={"result": {"message_id": 1}}), \
                mock.patch.object(texto_post, "publish_threads", return_value="https://th/p"), \
                mock.patch.object(texto_post, "alert_admin"):
            texto_post.main()

    def test_registra_threads_y_telegram(self):
        self.run_main({"DRY_RUN": "0", "TELEGRAM": "1", "THREADS": "1", "FIJAR": "0"})
        e = self.entries()
        self.assertEqual(sorted(x["ch"] for x in e), ["texto_telegram", "texto_threads"])
        self.assertTrue(all(x["id"].startswith("texto-") for x in e))
        self.assertEqual(e[0]["title"], "Nueva guía")

    def test_dry_run_no_registra(self):
        self.run_main({"DRY_RUN": "1", "TELEGRAM": "1", "THREADS": "1", "FIJAR": "0"})
        self.assertEqual(self.entries(), [])


class TestWhatsappKit(unittest.TestCase):
    def test_bloque_del_kit_registra_una_entrada_por_oferta(self):
        src = Path(bot.__file__).read_text(encoding="utf-8")
        i = src.index("wa_kit(to_post, affiliate_id, tool_wa)")
        bloque = src[i:i + 300]
        self.assertIn("if not dry", bloque)
        self.assertIn('log_post(d, "whatsapp_kit")', bloque)


class TestReporte(unittest.TestCase):
    def e(self, ch, id_="A", price=50000):
        return {"ts": "2026-09-27T00:00:00+00:00", "ch": ch, "id": id_, "title": "Producto",
                "discount": 40, "price": price, "low": False, "excl": False}

    def test_cuenta_canales_nuevos_y_los_saca_de_sin_registro(self):
        rep = wr.build_report([self.e("telegram"), self.e("youtube"), self.e("whatsapp_kit"),
                               self.e("texto_threads", "texto-1", 0)])
        self.assertIn("YouTube Shorts: 1", rep)
        self.assertIn("Kits de WhatsApp: 1", rep)
        self.assertIn("Threads (post manual): 1", rep)
        self.assertNotIn("Sin registro en el repo", rep)

    def test_sin_datos_siguen_en_sin_registro(self):
        rep = wr.build_report([self.e("telegram"), self.e("youtube")])
        self.assertIn("Sin registro en el repo", rep)
        self.assertIn("kits de WhatsApp", rep)
        self.assertNotIn("YouTube Shorts (salen", rep)

    def test_posts_de_texto_no_cuentan_como_ofertas(self):
        st = wr.week_stats([self.e("telegram", "A"), self.e("texto_telegram", "texto-1", 0)])
        self.assertEqual(st["unicas"], 1)
        self.assertEqual(st["ticket"], 50000)
        self.assertEqual(st["canales"]["texto_telegram"], 1)


if __name__ == "__main__":
    unittest.main()
