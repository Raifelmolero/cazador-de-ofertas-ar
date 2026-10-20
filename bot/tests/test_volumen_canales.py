"""Volumen por canal (20/10): Facebook 5 por día, Telegram 1 por run."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import cazador_bot as bot  # noqa: E402

BOT = Path(__file__).resolve().parents[1]


def test_facebook_cinco_por_dia_y_nada_fuera_de_horario():
    assert [bot.cuantos_facebook(s) for s in ("midday", "evening", "night")] == [2, 2, 1]
    assert bot.cuantos_facebook("other") == 0


def test_telegram_un_post_por_run():
    assert json.loads((BOT / "config.json").read_text(encoding="utf-8"))["telegram_posts"] == 1
    src = (BOT / "cazador_bot.py").read_text(encoding="utf-8")
    assert 'tg_posts = to_post[: cfg.get("telegram_posts", len(to_post))]' in src


def test_lo_publicado_en_facebook_queda_como_publicado():
    src = (BOT / "cazador_bot.py").read_text(encoding="utf-8")
    i_fb = src.index("for n, fb_deal in enumerate(to_post[:n_fb]")
    i_marca = src.index('state["posted_ids"] = state["posted_ids"] + nuevos_fb')
    assert i_fb < i_marca
