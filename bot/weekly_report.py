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

from cazador_bot import (
    BASE_DIR,
    POSTS_LOG_PATH,
    SCAN_LOG_PATH,
    THREADS_GRAPH,
    alert_admin,
    fmt_price,
    ig_call,
    load_config,
    tg_call,
)

METRICS_LOG_PATH = BASE_DIR / "state" / "metrics_log.jsonl"

CH_LABELS = {
    "telegram": "Telegram",
    "ig": "IG feed",
    "story": "IG stories",
    "threads": "Threads",
    "threads_texto": "Threads (texto)",
}


def collect_metrics(cfg: dict) -> dict:
    """Junta seguidores/miembros vía las APIs que el bot ya tiene. Best-effort."""
    m = {"ts": datetime.now(timezone.utc).isoformat(timespec="seconds")}

    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if token:
        try:
            m["tg"] = tg_call(token, "getChatMemberCount", {"chat_id": cfg["channel"]})["result"]
        except Exception as e:  # noqa: BLE001
            print(f"[warn] miembros de Telegram: {e}")

    ig_user_id = os.getenv("IG_USER_ID", "")
    ig_token = os.getenv("IG_ACCESS_TOKEN", "")
    if ig_user_id and ig_token:
        try:
            r = ig_call("GET", ig_user_id, {"fields": "followers_count", "access_token": ig_token})
            m["ig"] = r.get("followers_count")
        except Exception as e:  # noqa: BLE001
            print(f"[warn] seguidores de IG: {e}")

    th_id = os.getenv("THREADS_USER_ID", "")
    th_token = os.getenv("THREADS_ACCESS_TOKEN", "")
    if th_id and th_token:
        try:
            r = ig_call(
                "GET", f"{th_id}/threads_insights",
                {"metric": "followers_count", "access_token": th_token},
                base=THREADS_GRAPH,
            )
            m["th"] = r["data"][0]["total_value"]["value"]
        except Exception as e:  # noqa: BLE001 — requiere el permiso threads_manage_insights
            print(f"[warn] seguidores de Threads (¿falta permiso de insights?): {e}")

    return m


def load_prev_metrics() -> dict:
    try:
        with open(METRICS_LOG_PATH, encoding="utf-8") as f:
            lines = [ln for ln in f.read().splitlines() if ln.strip()]
        return json.loads(lines[-1]) if lines else {}
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_metrics(m: dict) -> None:
    METRICS_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(m, ensure_ascii=False) + "\n")


def fmt_metric(label: str, cur, prev) -> str:
    if cur is None:
        return f"  • {label}: s/d"
    delta = ""
    if isinstance(prev, int):
        diff = cur - prev
        delta = f" ({'+' if diff >= 0 else ''}{diff} vs sem. pasada)"
    return f"  • {label}: {cur}{delta}"


def _load_jsonl_week(path) -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    entries = []
    try:
        with open(path, encoding="utf-8") as f:
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


def load_week() -> list[dict]:
    return _load_jsonl_week(POSTS_LOG_PATH)


def load_scans_week() -> list[dict]:
    return _load_jsonl_week(SCAN_LOG_PATH)


def build_report(
    entries: list[dict],
    metrics: dict | None = None,
    prev: dict | None = None,
    scans: list[dict] | None = None,
) -> str:
    metrics = metrics or {}
    prev = prev or {}
    scans = scans or []
    metrics_block = ""
    if any(k in metrics for k in ("tg", "ig", "th")):
        metrics_block = (
            "📈 Cuentas:\n"
            + fmt_metric("Telegram", metrics.get("tg"), prev.get("tg")) + "\n"
            + fmt_metric("Instagram", metrics.get("ig"), prev.get("ig")) + "\n"
            + fmt_metric("Threads", metrics.get("th"), prev.get("th")) + "\n\n"
        )

    scan_block = ""
    if scans:
        scanned = sum(s.get("scanned", 0) for s in scans)
        infladas = sum(s.get("infladas", 0) for s in scans)
        lows_pub = sum(1 for e in entries if e.get("low"))
        scan_block = (
            "🎯 Cacería de la semana:\n"
            f"  • {scanned} ofertas escaneadas en {len(scans)} corridas\n"
            f"  • {infladas} descartadas por descuento inflado 🚫\n"
            f"  • {lows_pub} publicaciones en mínimo histórico 📉\n\n"
        )

    if not entries:
        return (
            "📊 REPORTE SEMANAL\n\n" + metrics_block + scan_block +
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
        + (" 📉" if e.get("low") else "")
        for i, e in enumerate(top3, 1)
    ]

    return (
        "📊 REPORTE SEMANAL\n\n" + metrics_block + scan_block +
        f"Publicaciones ({len(entries)} total):\n" + "\n".join(lines) + "\n\n"
        "🏆 Top de la semana:\n" + "\n".join(top_lines) + "\n\n"
        "✅ Checklist de 10 min:\n"
        "  1. Panel de afiliados ML: ¿cuántos clics/comisiones por canal? (mandá captura al chat de Claude)\n"
        "  2. IG Insights: ¿qué post tuvo más alcance y guardados?\n"
        "  3. ¿Hiciste stories con sticker esta semana? (2-3 recomendadas)\n"
        "  4. ¿El link de la bio apunta a la página de ofertas? (se actualiza sola)"
    )


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    metrics = collect_metrics(cfg)
    prev = load_prev_metrics()
    report = build_report(load_week(), metrics, prev, load_scans_week())
    if not dry and any(k in metrics for k in ("tg", "ig", "th")):
        save_metrics(metrics)
    alert_admin(token, cfg["admin_chat"], report, dry)
    print(report)
    return 0


if __name__ == "__main__":
    sys.exit(main())
