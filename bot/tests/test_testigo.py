import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cazador_bot as bot


def _deal(id_, price, title="Smart TV 55 4K"):
    return {"id": id_, "title": title, "price_cur": price}


def test_registra_min_max_y_dias(tmp_path):
    p = tmp_path / "t.json"
    assert bot.update_testigo([_deal("A", 100)], p, "2026-10-05") == 1
    bot.update_testigo([_deal("A", 90)], p, "2026-10-05")
    bot.update_testigo([_deal("A", 120), _deal("B", 50)], p, "2026-10-06")
    it = json.loads(p.read_text(encoding="utf-8"))["items"]
    assert it["A"] == {"t": "Smart TV 55 4K", "min": 90, "min_ts": "2026-10-05",
                       "max": 120, "dias": 2, "ult": "2026-10-06"}
    assert it["B"]["min"] == 50


def test_fuera_de_la_ventana_no_toca_el_archivo(tmp_path):
    p = tmp_path / "t.json"
    assert bot.update_testigo([_deal("A", 100)], p, "2026-11-02") == 0
    assert bot.update_testigo([_deal("A", 100)], p, "2026-10-01") == 0
    assert not p.exists()


def test_cyber_y_black_friday_llevan_a_su_landing():
    tv = "Smart TV Samsung 55 4K"
    cyber = bot.landing_temporada(tv, "telegram", datetime(2026, 11, 3))
    bf = bot.landing_temporada(tv, "telegram", datetime(2026, 11, 20))
    assert "/cyber-monday" in cyber[1]
    assert "/black-friday" in bf[1]
    assert bot.sello_temporada(tv, datetime(2026, 11, 3)) == ""
