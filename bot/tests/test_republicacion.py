"""Re-publicación de ofertas manuales vigentes con enfriamiento."""
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cazador_bot as bot

AHORA = datetime(2026, 10, 15, 12, 0, tzinfo=timezone.utc)


def log(tmp_path, eventos):
    p = tmp_path / "posts_log.jsonl"
    p.write_text("\n".join(json.dumps(e) for e in eventos), encoding="utf-8")
    return p


def ev(id_, horas_atras, ch="telegram"):
    return {"ts": (AHORA - timedelta(hours=horas_atras)).isoformat(timespec="seconds"), "ch": ch, "id": id_}


def deal(id_, **kw):
    return {"id": id_, "manual": True, "inflada": False, "discount": 30, "price_cur": 1, "title": id_, **kw}


def test_vuelve_recien_pasado_el_enfriamiento(tmp_path):
    p = log(tmp_path, [ev("A", 47), ev("B", 49)])
    out = bot.republicables([deal("A"), deal("B")], {}, {"A", "B"}, p, AHORA)
    assert [d["id"] for d in out] == ["B"] and out[0]["republicada"]


def test_la_mas_vieja_va_primero(tmp_path):
    p = log(tmp_path, [ev("A", 60), ev("B", 100), ev("C", 72)])
    out = bot.republicables([deal("A"), deal("B"), deal("C")], {}, {"A", "B", "C"}, p, AHORA)
    assert [d["id"] for d in out] == ["B", "C", "A"]


def test_tope_de_apariciones(tmp_path):
    p = log(tmp_path, [ev("A", 200), ev("A", 120), ev("A", 60)])   # ya salió 3 veces
    assert bot.republicables([deal("A")], {}, {"A"}, p, AHORA) == []


def test_no_republica_infladas_escaneadas_ni_nunca_publicadas(tmp_path):
    p = log(tmp_path, [ev("A", 60), ev("B", 60), ev("C", 60)])
    deals = [deal("A", inflada=True), deal("B", manual=False), deal("D")]
    assert bot.republicables(deals, {}, {"A", "B", "C", "D"}, p, AHORA) == []   # D nunca salió en Telegram


def test_solo_cuenta_telegram(tmp_path):
    p = log(tmp_path, [ev("A", 60, ch="ig"), ev("A", 1, ch="story")])
    assert bot.republicables([deal("A")], {}, {"A"}, p, AHORA) == []


def test_sin_log_no_hay_nada(tmp_path):
    assert bot.republicables([deal("A")], {}, {"A"}, tmp_path / "no.json", AHORA) == []
