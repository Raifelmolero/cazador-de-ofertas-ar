"""Parte diario al admin por Telegram (fase 1 del Director de agentes,
ver docs/PLAN-DIRECTOR-AGENTES.md).

Un solo mensaje a las 8:00 con lo que Raifel necesita para decidir desde el
celular: ofertas vigentes, publicaciones de las últimas 24 h, workflows que
fallaron, PRs esperando su OK y la tarea sugerida del día. Solo lee: no
publica nada público ni toca ML (los números del panel de afiliados salen del
navegador de Raifel y quedan en el Termómetro).

  python bot/parte_diario.py          → manda el parte
  python bot/parte_diario.py --dry    → lo imprime sin mandarlo
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cazador_bot import load_manual_deals  # noqa: E402
from salud_tokens import ADMIN_CHAT, http_json  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
POSTS_LOG = RAIZ / "bot" / "state" / "posts_log.jsonl"
REPO = os.environ.get("GITHUB_REPOSITORY", "Raifelmolero/cazador-de-ofertas-ar")
TERMOMETRO = "https://claude.ai/artifact/Pwf59D1cfAkctGjFMggPqH"
PISO_OFERTAS = 300  # debajo de esto el sitio queda flaco y bajan los clics


def posts_ultimas_24h(lineas: list[str], ahora: datetime) -> Counter:
    desde = ahora - timedelta(hours=24)
    c: Counter = Counter()
    for ln in lineas:
        try:
            p = json.loads(ln)
            if datetime.fromisoformat(p["ts"]) >= desde:
                c[p.get("ch", "?")] += 1
        except (ValueError, KeyError, TypeError):
            continue
    return c


def tarea_sugerida(vigentes: int, fallidos: list[str], prs: list[dict]) -> str:
    """Una sola recomendación, la de más impacto en la plata primero."""
    if vigentes < PISO_OFERTAS:
        return f"Cargar ofertas con la extensión: hay {vigentes} y el piso es {PISO_OFERTAS}."
    if fallidos:
        return f"Revisar «{fallidos[0]}», que falló."
    if prs:
        return f"Darle OK al lote de PRs ({len(prs)} abiertos) para mergear en 1 solo build."
    return "Todo en orden: seguir sumando guías de temporada al próximo lote."


def armar_parte(hoy: date, vigentes: int, posts: Counter, fallidos: list[str], prs: list[dict]) -> str:
    l = [f"☀️ Parte del {hoy.day}/{hoy.month}", ""]
    l.append(f"🛒 Ofertas vigentes en la web: {vigentes}")
    if posts:
        l.append("📣 Publicado (24 h): " + ", ".join(f"{k} {v}" for k, v in sorted(posts.items())))
    else:
        l.append("📣 Publicado (24 h): nada ⚠️")
    if fallidos:
        l.append("🔴 Fallaron: " + ", ".join(fallidos))
    else:
        l.append("🟢 Bot y deploys sin fallas")
    if prs:
        l.append(f"📝 PRs esperando tu OK: " + ", ".join(f"#{p['number']} {p['title']}" for p in prs))
    l += ["", "👉 Hoy: " + tarea_sugerida(vigentes, fallidos, prs), f"📊 Plata: {TERMOMETRO}"]
    return "\n".join(l)


def _gh(path: str, token: str):
    req = urllib.request.Request(f"https://api.github.com/repos/{REPO}/{path}", headers={
        "Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)


def datos_github(token: str, ahora: datetime) -> tuple[list[str], list[dict]]:
    if not token:
        return [], []
    desde = (ahora - timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%SZ")
    runs = _gh(f"actions/runs?per_page=100&created=%3E{desde}", token).get("workflow_runs", [])
    ultima: dict[str, dict] = {}
    for r in runs:  # vienen de la más nueva a la más vieja: si se recuperó, no avisa
        if r.get("event") != "dynamic" and r.get("status") == "completed":
            ultima.setdefault(r["name"], r)
    fallidos = sorted(n for n, r in ultima.items() if r.get("conclusion") == "failure")
    prs = [{"number": p["number"], "title": p["title"]}
           for p in _gh("pulls?state=open&per_page=20", token) if not p["user"]["login"].startswith("dependabot")]
    return fallidos, prs


def main(argv=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    ahora = datetime.now(timezone.utc)
    hoy = (ahora - timedelta(hours=3)).date()
    vigentes = len(load_manual_deals())
    try:
        lineas = POSTS_LOG.read_text(encoding="utf-8").splitlines()
    except OSError:
        lineas = []
    fallidos, prs = datos_github(os.environ.get("GITHUB_TOKEN", ""), ahora)
    texto = armar_parte(hoy, vigentes, posts_ultimas_24h(lineas, ahora), fallidos, prs)
    print(texto)
    token = (os.environ.get("TELEGRAM_BOT_TOKEN") or "").strip()
    if "--dry" not in argv and token:
        http_json(f"https://api.telegram.org/bot{token}/sendMessage", {"chat_id": ADMIN_CHAT, "text": texto})
    return 0


if __name__ == "__main__":
    sys.exit(main())
