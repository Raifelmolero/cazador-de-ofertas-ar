import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cazador_bot as bot


def test_title_key_ignora_mayusculas_y_signos():
    assert bot.title_key("Soldadora Mig 200amp 4 En 1!") == bot.title_key("soldadora  mig 200AMP 4 en 1")


def test_recent_title_keys_solo_ultimos_dias(tmp_path):
    p = tmp_path / "log.jsonl"
    ahora = datetime.now(timezone.utc)
    viejo = (ahora - timedelta(days=30)).isoformat()
    p.write_text(
        json.dumps({"ts": ahora.isoformat(), "title": "Soldadora Mig"}) + "\n"
        + json.dumps({"ts": viejo, "title": "Colchon Viejo"}) + "\n",
        encoding="utf-8",
    )
    k = bot.recent_title_keys(14, p)
    assert bot.title_key("Soldadora Mig") in k
    assert bot.title_key("Colchon Viejo") not in k
