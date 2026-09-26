"""Arma frontend/data/oficina.json: el estado de cada "departamento" de la
oficina de agentes (tarjeta #21 de Trello), para la página /oficina.

Solo lee lo que los agentes ya dejan en el repo (logs del bot, informes en
docs/, guías y comparativas del sitio): no llama a ninguna API ni gasta
tokens. Corre al final de cada corrida del bot (deals_bot.yml) y a mano con
`python bot/tools/oficina.py`.
"""

from __future__ import annotations

import json
import re
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STATE = ROOT / "bot" / "state"
OUT = ROOT / "frontend" / "data" / "oficina.json"

CANALES = {
    "telegram": "Telegram", "ig": "Instagram", "feed": "Instagram", "story": "Historias IG",
    "reel": "Reels IG", "threads": "Threads", "threads_texto": "Threads",
    "facebook": "Facebook", "youtube": "YouTube", "tiktok": "TikTok",
}


def _tail_jsonl(path: Path, n: int) -> list[dict]:
    """Últimas n líneas de un .jsonl sin cargar el archivo entero en memoria
    de más (los logs crecen todos los días)."""
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").splitlines()[-n:]
    out = []
    for line in lines:
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def _parse_ts(ts: str) -> datetime:
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


def _informes(carpeta: Path) -> list[dict]:
    """Informes de un departamento: archivos o carpetas con fecha AAAA-MM-DD."""
    if not carpeta.exists():
        return []
    items = []
    for p in carpeta.iterdir():
        m = re.match(r"(\d{4}-\d{2}-\d{2})-(.+?)(\.md)?$", p.name)
        if not m:
            continue
        items.append({"fecha": m.group(1), "titulo": m.group(2).replace("-", " ")})
    return sorted(items, key=lambda i: i["fecha"], reverse=True)


def _slugs(archivo: Path) -> list[str]:
    if not archivo.exists():
        return []
    return re.findall(r"^\s{4}slug: '([^']+)'", archivo.read_text(encoding="utf-8"), re.M)


def publicacion(ahora: datetime) -> dict:
    posts = _tail_jsonl(STATE / "posts_log.jsonl", 400)
    ult_24 = [p for p in posts if ahora - _parse_ts(p["ts"]) <= timedelta(hours=24)]
    por_canal = Counter(CANALES.get(p.get("ch", ""), p.get("ch", "?")) for p in ult_24)
    ultimo = posts[-1] if posts else None
    scans = _tail_jsonl(STATE / "scan_log.jsonl", 1)
    return {
        "id": "publicacion",
        "nombre": "Publicación",
        "emoji": "📤",
        "descripcion": "Busca ofertas en Mercado Libre y las publica en todas las redes.",
        "automatico": True,
        "frecuencia": "3 veces por día",
        "ultima_actividad": ultimo["ts"] if ultimo else None,
        "agentes": [
            {
                "nombre": "Cazador (bot)",
                "tarea": f"Revisó {scans[-1].get('scanned', '?')} productos en la última corrida"
                if scans else "Sin corridas registradas",
            },
        ],
        "metricas": [{"label": k, "valor": v} for k, v in por_canal.most_common()],
        "metricas_titulo": "Publicaciones en las últimas 24 h",
        "ultimo_trabajo": ultimo["title"] if ultimo else None,
    }


def investigacion() -> dict:
    informes = _informes(ROOT / "docs" / "nichos")
    return {
        "id": "investigacion",
        "nombre": "Investigación de nichos",
        "emoji": "🔎",
        "descripcion": "Encuentra rubros de comisión alta con demanda y poca competencia.",
        "automatico": False,
        "frecuencia": "A demanda",
        "ultima_actividad": informes[0]["fecha"] if informes else None,
        "agentes": [{"nombre": "investigador-nichos", "tarea": "Informe de nicho"}],
        "metricas": [{"label": "Informes", "valor": len(informes)}],
        "entregas": informes[:5],
    }


def marketing() -> dict:
    guias = _slugs(ROOT / "frontend" / "lib" / "guias.ts")
    comps = _slugs(ROOT / "frontend" / "lib" / "comparativas.ts")
    return {
        "id": "marketing",
        "nombre": "Marketing / SEO",
        "emoji": "📣",
        "descripcion": "Escribe guías y comparativas para traer tráfico de Google y de las IA.",
        "automatico": False,
        "frecuencia": "A demanda",
        "ultima_actividad": None,
        "agentes": [{"nombre": "marketing-seo", "tarea": "Guías y comparativas del sitio"}],
        "metricas": [
            {"label": "Guías publicadas", "valor": len(guias)},
            {"label": "Comparativas", "valor": len(comps)},
        ],
        "entregas": [{"fecha": "", "titulo": s.replace("-", " ")} for s in (guias[-3:] + comps[-2:])[::-1]],
    }


def diseno() -> dict:
    entregas = _informes(ROOT / "docs" / "diseno")
    return {
        "id": "diseno",
        "nombre": "Diseño",
        "emoji": "🎨",
        "descripcion": "Mejora placas, historias y reels. Propone y vos aprobás.",
        "automatico": False,
        "frecuencia": "A demanda",
        "ultima_actividad": entregas[0]["fecha"] if entregas else None,
        "agentes": [{"nombre": "diseno", "tarea": "Rediseño de reel (v2)"}],
        "metricas": [{"label": "Propuestas", "valor": len(entregas)}],
        "entregas": entregas[:5],
    }


def analisis() -> dict:
    m = _tail_jsonl(STATE / "metrics_log.jsonl", 2)
    ult = m[-1] if m else {}
    prev = m[-2] if len(m) > 1 else {}
    nombres = {"ig": "Seguidores IG", "th": "Seguidores Threads", "tg": "Suscriptores TG", "fb": "Seguidores FB"}
    metricas = []
    for k, label in nombres.items():
        if k in ult:
            delta = ult[k] - prev.get(k, ult[k])
            metricas.append({"label": label, "valor": ult[k], "delta": delta})
    return {
        "id": "analisis",
        "nombre": "Análisis",
        "emoji": "📊",
        "descripcion": "Mide qué genera plata y qué no. Reporte todos los domingos.",
        "automatico": True,
        "frecuencia": "Semanal (domingo)",
        "ultima_actividad": ult.get("ts"),
        "agentes": [{"nombre": "Reporte semanal", "tarea": "Métricas y cacería de la semana"}],
        "metricas": metricas,
        "metricas_titulo": "Última medición (vs. la anterior)",
    }


def auditoria() -> dict:
    return {
        "id": "auditoria",
        "nombre": "Auditoría",
        "emoji": "🛡️",
        "descripcion": "Revisa tests, links rotos y errores todos los días.",
        "automatico": False,
        "frecuencia": "Próximamente",
        "ultima_actividad": None,
        "agentes": [],
        "metricas": [],
        "proximamente": True,
    }


def main() -> None:
    ahora = datetime.now(timezone.utc)
    data = {
        "generado": ahora.isoformat(timespec="seconds"),
        "departamentos": [
            publicacion(ahora), investigacion(), marketing(), diseno(), analisis(), auditoria(),
        ],
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"oficina.json: {len(data['departamentos'])} departamentos")


if __name__ == "__main__":
    main()
