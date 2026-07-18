"""
Reporte semanal por Telegram — resume la actividad de los últimos 7 días.

Corre los domingos a la noche (weekly_report.yml). Lee bot/state/posts_log.jsonl
(que el bot escribe en cada publicación) y manda al admin:
  - publicaciones por canal
  - las 3 mejores ofertas de la semana (por % OFF)
  - recordatorios de las tareas manuales que mueven la aguja
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone

from cazador_bot import POSTS_LOG_PATH, alert_admin, fmt_price, load_config

CH_LABELS = {
    "telegram": "Telegram",
    "ig": "IG feed",
    "story": "IG stories",
    "threads": "Threads",
    "threads_texto": "Threads (texto)",
}


def load_week() -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    entries = []
    try:
        with open(POSTS_LOG_PATH, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    e = json.loads(line)
                    if datetime.fromisoformat(e["ts"]) >= cutoff:
                        entries.append(e)
                except (json.JSONDecodeError, KeyError, ValueError):
                    continue
    except FileNotFoundError:
        pass
    return entries


def build_report(entries: list[dict]) -> str:
    if not entries:
        return (
            "📊 REPORTE SEMANAL\n\n"
            "Sin publicaciones registradas esta semana (el log arranca a acumular "
            "desde que se activó — la semana que viene ya hay datos completos)."
        )

    counts: dict[str, int] = {}
    for e in entries:
        counts[e["ch"]] = counts.get(e["ch"], 0) + 1
    lines = [f"  • {CH_LABELS.get(ch, ch)}: {n}" for ch, n in sorted(counts.items())]

    best: dict[str, dict] = {}
    for e in entries:
        if e["id"] not in best or e["discount"] > best[e["id"]]["discount"]:
            best[e["id"]] = e
    top3 = sorted(best.values(), key=lambda e: e["discount"], reverse=True)[:3]
    top_lines = [
        f"  {i}. {e['discount']}% OFF — {e['title'][:55]} ({fmt_price(e['price'])})"
        for i, e in enumerate(top3, 1)
    ]

    return (
        "📊 REPORTE SEMANAL\n\n"
        f"Publicaciones ({len(entries)} total):\n" + "\n".join(lines) + "\n\n"
        "🏆 Top de la semana:\n" + "\n".join(top_lines) + "\n\n"
        "✅ Checklist de 10 min:\n"
        "  1. Panel de afiliados ML: ¿cuántos clics/comisiones por canal?\n"
        "  2. IG Insights: ¿qué post tuvo más alcance y guardados?\n"
        "  3. ¿Hiciste stories con sticker esta semana? (2-3 recomendadas)\n"
        "  4. Vidriera de la bio: ¿están las ofertas de la semana cargadas?"
    )


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    report = build_report(load_week())
    alert_admin(token, cfg["admin_chat"], report, dry)
    print(report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
