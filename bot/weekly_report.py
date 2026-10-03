"""
Reporte semanal por Telegram — resume la actividad de los últimos 7 días.

Corre los domingos a la noche (weekly_report.yml). Lee bot/state/posts_log.jsonl
(que el bot escribe en cada publicación) y manda al admin:
  - publicaciones por canal, ofertas únicas, % en mínimo histórico, ticket
    promedio y top 5 categorías, comparando con la semana anterior (↑/↓)
  - las 3 mejores ofertas de la semana (por % OFF)
  - recordatorios de las tareas manuales que mueven la aguja
  - "Para completar a mano": las etiquetas (matt_word) a mirar en el panel de
    afiliados de ML — el repo NO tiene clics ni ventas por canal
Si no entra en un mensaje de Telegram (4096 caracteres) se parte en varios.
"""

import csv
import json
import os
import re
import sys
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path

from cazador_bot import (
    BASE_DIR,
    FB_GRAPH,
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
NICHOS_TS_PATH = BASE_DIR.parent / "frontend" / "lib" / "nichos.ts"
TG_MAX = 4096
AFILIADOS_DIR = BASE_DIR / "state"
AFILIADOS_SEMANA_PATH = AFILIADOS_DIR / "afiliados_semana.csv"

CH_LABELS = {
    "telegram": "Telegram",
    "ig": "IG feed",
    "story": "IG stories",
    "reel": "IG reels",
    "threads": "Threads",
    "threads_texto": "Threads (texto)",
    "facebook": "Facebook",
    "youtube": "YouTube Shorts",
    "whatsapp_kit": "Kits de WhatsApp",
    "texto_threads": "Threads (post manual)",
    "texto_telegram": "Telegram (post manual)",
}

# Canales que no son ofertas de ML (posts de texto): cuentan por canal pero no
# entran en ofertas únicas, % mínimo histórico, ticket ni categorías.
CANALES_SIN_OFERTA = {"texto_threads", "texto_telegram"}

# Canales que el bot NO registra en posts_log.jsonl: se aclara en vez de poner 0.
SIN_REGISTRO = {
    "youtube": "YouTube Shorts (salen con cada reel)",
    "whatsapp_kit": "kits de WhatsApp (se pegan a mano)",
    ("texto_threads", "texto_telegram"): "posts de texto manuales (texto_post.yml)",
}


def sin_registro(*semanas: list[dict]) -> list[str]:
    """Etiquetas de los canales sin ninguna entrada en las semanas dadas (el log
    de esos canales arrancó después: se aclara en vez de mostrar 0)."""
    vistos = {e.get("ch") for sem in semanas for e in (sem or [])}
    out = []
    for chs, label in SIN_REGISTRO.items():
        chs = chs if isinstance(chs, tuple) else (chs,)
        if not vistos.intersection(chs):
            out.append(label)
    return out

# Categoría por palabras del título: el log no guarda la categoría de ML y
# productos_rentables.json trae todo como "ofertas del día". Gana la primera.
CATEGORIAS_REPORTE: list[tuple[str, list[str]]] = [
    ("Colchones", ["colchon", "sommier"]),
    ("Herramientas", ["taladro", "atornillador", "amoladora", "lijadora", "rotomartillo",
                      "sierra", "soldadora", "compresor", "motosierra", "desmalezadora",
                      "bordeadora", "hidrolavadora", "llave de impacto", "herramienta"]),
    ("Gastronomía", ["industrial", "horno pizzero", "amasadora", "cortadora de fiambre"]),
    ("Climatización", ["aire acondicionado", "split", "calefactor", "estufa", "caloventor"]),
    ("TV y línea blanca", ["smart tv", "televisor", "google tv", "lavarropas", "secarropas",
                           "lavavajillas", "heladera", "freezer", "termotanque", "calefon",
                           "cocina", "anafe", "microondas"]),
    ("Pequeños electro", ["freidora", "cafetera", "pava", "licuadora", "batidora",
                          "aspiradora", "plancha", "ventilador", "extractor", "tostadora"]),
    ("Vehículos", ["neumatico", "cubierta", "llanta", "amortiguador", "bateria 12v",
                   "estereo", "para auto", "moto"]),
    ("Tecno y gamer", ["celular", "smartphone", "notebook", "monitor", "auricular",
                       "parlante", "tablet", "joystick", "consola", "playstation",
                       "teclado", "mouse", "smartwatch", "gamer"]),
    ("Bebés", ["bebe", "cochecito", "panal", "butaca"]),
    ("Hogar y muebles", ["silla", "mesa", "sillon", "placard", "reposera", "rack",
                         "escritorio", "almohada", "sabana", "organizador"]),
    ("Deportes y aire libre", ["bicicleta", "cinta de correr", "pesas", "carpa",
                               "camping", "termo", "conservadora"]),
]


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

    fb_id = os.getenv("FB_PAGE_ID", "")
    fb_token = os.getenv("FB_PAGE_ACCESS_TOKEN", "")
    if fb_id and fb_token:
        try:
            r = ig_call(
                "GET", fb_id,
                {"fields": "followers_count", "access_token": fb_token},
                base=FB_GRAPH,
            )
            m["fb"] = r.get("followers_count")
        except Exception as e:  # noqa: BLE001
            print(f"[warn] seguidores de Facebook: {e}")

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


def _load_jsonl_since(path, days: int = 7) -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
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


def _load_jsonl_week(path) -> list[dict]:
    return _load_jsonl_since(path, 7)


def load_week() -> list[dict]:
    return _load_jsonl_week(POSTS_LOG_PATH)


def load_prev_week() -> list[dict]:
    """Publicaciones de la semana anterior (hace 14 a 7 días)."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=7)
    return [e for e in _load_jsonl_since(POSTS_LOG_PATH, 14)
            if datetime.fromisoformat(e["ts"]) < cutoff]


def load_scans_week() -> list[dict]:
    return _load_jsonl_week(SCAN_LOG_PATH)


# ---------------------------------------------------------------- números

def _norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def categoria(title: str) -> str:
    t = _norm(title)
    for nombre, palabras in CATEGORIAS_REPORTE:
        if any(p in t for p in palabras):
            return nombre
    return "Otras"


def week_stats(entries: list[dict]) -> dict:
    """Números de una semana: publicaciones por canal y, sobre ofertas únicas
    (por id), % en mínimo histórico, ticket promedio y top 5 categorías."""
    canales: dict[str, int] = {}
    unicas: dict[str, dict] = {}
    for e in entries:
        canales[e["ch"]] = canales.get(e["ch"], 0) + 1
        if e["ch"] in CANALES_SIN_OFERTA:
            continue
        unicas.setdefault(e["id"], e)
    n = len(unicas)
    cats: dict[str, int] = {}
    for e in unicas.values():
        c = categoria(e.get("title", ""))
        cats[c] = cats.get(c, 0) + 1
    precios = [e["price"] for e in unicas.values() if e.get("price")]
    lows = sum(1 for e in unicas.values() if e.get("low"))
    return {
        "total": len(entries),
        "canales": canales,
        "unicas": n,
        "pct_low": round(100 * lows / n) if n else 0,
        "ticket": round(sum(precios) / len(precios)) if precios else 0,
        "cats": sorted(cats.items(), key=lambda kv: (-kv[1], kv[0]))[:5],
    }


def flecha(cur, prev, unidad: str = "", precio: bool = False) -> str:
    """' (↑3 vs sem. ant.)'. Vacío si no hay semana anterior para comparar."""
    if prev is None:
        return ""
    diff = cur - prev
    if diff == 0:
        return " (= sem. ant.)"
    val = fmt_price(abs(diff)) if precio else f"{abs(diff)}{unidad}"
    return f" ({'↑' if diff > 0 else '↓'}{val} vs sem. ant.)"


def etiquetas_ml() -> list[str]:
    """matt_word del proyecto: canales del bot, web, alertas y nichos del sitio."""
    tags = [
        os.getenv("ML_WORD_TELEGRAM", "telegram"), os.getenv("ML_WORD_IG", "instagram"),
        os.getenv("ML_WORD_THREADS", "threads"), os.getenv("ML_WORD_FACEBOOK", "facebook"),
        os.getenv("ML_WORD_WHATSAPP", "whatsapp"), os.getenv("ML_WORD_YOUTUBE", "youtube"),
        os.getenv("ML_WORD_WEB", "web"), "alertas",
    ]
    try:
        tags += re.findall(r"etiqueta:\s*'([a-z0-9_-]+)'",
                           NICHOS_TS_PATH.read_text(encoding="utf-8"))
    except OSError:
        pass
    return list(dict.fromkeys(tags))


def split_telegram(texto: str, limite: int = TG_MAX) -> list[str]:
    """Parte el texto en mensajes <= limite, cortando entre bloques (\\n\\n)."""
    if len(texto) <= limite:
        return [texto]
    partes: list[str] = []
    actual = ""
    for bloque in texto.split("\n\n"):
        cand = f"{actual}\n\n{bloque}" if actual else bloque
        if len(cand) <= limite:
            actual = cand
            continue
        if actual:
            partes.append(actual)
        while len(bloque) > limite:
            partes.append(bloque[:limite])
            bloque = bloque[limite:]
        actual = bloque
    if actual:
        partes.append(actual)
    return partes


def bloque_manual() -> str:
    return (
        "✍️ Para completar a mano (panel de afiliados ML, últimos 7 días):\n"
        "El repo no tiene clics ni ventas: anotá cada etiqueta (matt_word) y comparalas.\n"
        + "\n".join(f"  • {t}: __ clics / __ ventas / $__" for t in etiquetas_ml())
    )


def leer_afiliados(path) -> dict[str, dict]:
    """CSV etiqueta,clics,unidades,ganancia -> {etiqueta: {clics, unidades, ganancia}}.
    Tolera "$" y separadores de miles con punto; ignora decimales."""
    out: dict[str, dict] = {}
    try:
        with open(path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                tag = (row.get("etiqueta") or "").strip()
                if not tag:
                    continue
                num = {}
                for k in ("clics", "unidades", "ganancia"):
                    v = re.sub(r"[^\d-]", "", (row.get(k) or "").split(",")[0])
                    num[k] = int(v) if v not in ("", "-") else 0
                out[tag] = num
    except (OSError, csv.Error, ValueError):
        return {}
    return out


def afiliados_anterior(hoy: datetime | None = None):
    """Último afiliados_AAAA-MM-DD.csv con fecha de al menos 4 días antes de hoy
    (la semana anterior), o None."""
    hoy = hoy or datetime.now(timezone.utc)
    limite = (hoy - timedelta(days=4)).strftime("%Y-%m-%d")
    cands = sorted(p for p in AFILIADOS_DIR.glob("afiliados_????-??-??.csv")
                   if p.stem[len("afiliados_"):] <= limite)
    return cands[-1] if cands else None


def _conv(unidades: int, clics: int) -> str:
    return f"{unidades / clics * 100:.1f}%" if clics else "s/d"


def bloque_afiliados(actual: dict | None = None, anterior: dict | None = None) -> str:
    """Ranking de ganancia por etiqueta desde afiliados_semana.csv, con variación
    vs la semana anterior (último afiliados_AAAA-MM-DD.csv) y conversión clics→unidades."""
    titulo = "💰 Ganancia por etiqueta (completar desde el panel de ML):\n"
    if actual is None:
        actual = leer_afiliados(AFILIADOS_SEMANA_PATH) if AFILIADOS_SEMANA_PATH.exists() else {}
        if anterior is None:
            prev_path = afiliados_anterior()
            anterior = leer_afiliados(prev_path) if prev_path else {}
    anterior = anterior or {}
    if not actual:
        return titulo + (
            "  Sin datos. Cargá bot/state/afiliados_semana.csv con la cabecera\n"
            "  etiqueta,clics,unidades,ganancia y una fila por etiqueta (panel de\n"
            "  afiliados ML, últimos 7 días; ganancia en pesos sin puntos), ej.:\n"
            "  web,267,27,574519\n"
            "  Al cerrar la semana copialo como afiliados_AAAA-MM-DD.csv (fecha del\n"
            "  domingo) para que el reporte siguiente compare contra él."
        )
    lines = []
    tot = {"clics": 0, "unidades": 0, "ganancia": 0}
    ranking = sorted(actual.items(),
                     key=lambda kv: (kv[1]["ganancia"], kv[1]["unidades"], kv[1]["clics"]),
                     reverse=True)
    for i, (tag, d) in enumerate(ranking, 1):
        for k in tot:
            tot[k] += d[k]
        old = anterior.get(tag) if anterior else None
        if anterior and old is None:
            old = {"clics": 0, "unidades": 0, "ganancia": 0}
        lines.append(
            f"  {i}. {tag}: {fmt_price(d['ganancia'])}"
            f"{flecha(d['ganancia'], old['ganancia'] if old else None, precio=True)}"
            f" · {d['clics']} clics{flecha(d['clics'], old['clics'] if old else None)}"
            f" · {d['unidades']} u. · conv {_conv(d['unidades'], d['clics'])}"
        )
    prev_g = sum(d["ganancia"] for d in anterior.values()) if anterior else None
    lines.append(
        f"  Total: {fmt_price(tot['ganancia'])}{flecha(tot['ganancia'], prev_g, precio=True)}"
        f" · {tot['clics']} clics · {tot['unidades']} u. · conv {_conv(tot['unidades'], tot['clics'])}"
    )
    if not anterior:
        lines.append("  (sin semana anterior para comparar)")
    return titulo + "\n".join(lines)


def build_report(
    entries: list[dict],
    metrics: dict | None = None,
    prev: dict | None = None,
    scans: list[dict] | None = None,
    prev_entries: list[dict] | None = None,
) -> str:
    metrics = metrics or {}
    prev = prev or {}
    scans = scans or []
    metrics_block = ""
    if any(k in metrics for k in ("tg", "ig", "th", "fb")):
        metrics_block = (
            "📈 Cuentas:\n"
            + fmt_metric("Telegram", metrics.get("tg"), prev.get("tg")) + "\n"
            + fmt_metric("Instagram", metrics.get("ig"), prev.get("ig")) + "\n"
            + fmt_metric("Threads", metrics.get("th"), prev.get("th")) + "\n"
            + fmt_metric("Facebook", metrics.get("fb"), prev.get("fb")) + "\n\n"
        )

    scan_block = ""
    if scans:
        scanned = sum(s.get("scanned", 0) for s in scans)
        infladas = sum(s.get("infladas", 0) for s in scans)
        lows_pub = sum(1 for e in entries if e.get("low"))
        excl_pub = sum(1 for e in entries if e.get("ch") == "telegram" and e.get("excl"))
        scan_block = (
            "🎯 Cacería de la semana:\n"
            f"  • {scanned} ofertas escaneadas en {len(scans)} corridas\n"
            f"  • {infladas} descartadas por descuento inflado 🚫\n"
            f"  • {lows_pub} publicaciones en mínimo histórico 📉\n"
            f"  • {excl_pub} exclusivas solo del canal 🔒\n\n"
        )

    if not entries:
        return (
            "📊 REPORTE SEMANAL\n\n" + metrics_block + scan_block +
            "Sin publicaciones registradas esta semana (el log arranca a acumular "
            "desde que se activó — la semana que viene ya hay datos completos).\n\n"
            + bloque_manual() + "\n\n" + bloque_afiliados()
        )

    st = week_stats(entries)
    ps = week_stats(prev_entries) if prev_entries else None

    def ant(k):
        return ps[k] if ps else None

    orden = list(CH_LABELS) + sorted(c for c in st["canales"] if c not in CH_LABELS)
    lines = []
    for ch in orden:
        cur = st["canales"].get(ch, 0)
        old = ps["canales"].get(ch, 0) if ps else None
        if cur or old:
            lines.append(f"  • {CH_LABELS.get(ch, ch)}: {cur}{flecha(cur, old)}")
    faltan = sin_registro(entries, prev_entries)
    if faltan:
        lines.append("  • Sin registro en el repo: " + "; ".join(faltan))

    resumen = (
        "📦 Lo publicado:\n"
        f"  • Ofertas únicas: {st['unicas']}{flecha(st['unicas'], ant('unicas'))}\n"
        f"  • En mínimo histórico: {st['pct_low']}%"
        f"{flecha(st['pct_low'], ant('pct_low'), ' pts')}\n"
        f"  • Ticket promedio: {fmt_price(st['ticket'])}"
        f"{flecha(st['ticket'], ant('ticket'), precio=True)}\n"
        "  • Top 5 categorías (según el título): "
        + ", ".join(f"{c} {n}" for c, n in st["cats"]) + "\n\n"
    )

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
        f"Publicaciones: {st['total']} en total{flecha(st['total'], ant('total'))}\n"
        + "\n".join(lines) + "\n\n" + resumen +
        "🏆 Top de la semana:\n" + "\n".join(top_lines) + "\n\n"
        "✅ Checklist de 10 min:\n"
        "  1. Panel de afiliados ML → pestaña Redes, últimos 7 días: mandá captura "
        "al chat de Claude (clics, unidades y ganancia por canal: web, instagram, "
        "threads, telegram, facebook)\n"
        "  2. IG Insights: ¿qué post tuvo más alcance y guardados?\n"
        "  3. ¿Hiciste stories con sticker esta semana? (2-3 recomendadas)\n"
        "  4. Clarity: ¿cuántas visitas tuvo el sitio y de dónde vinieron?\n\n"
        + bloque_manual() + "\n\n" + bloque_afiliados()
    )


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    metrics = collect_metrics(cfg)
    prev = load_prev_metrics()
    report = build_report(load_week(), metrics, prev, load_scans_week(), load_prev_week())
    if not dry and any(k in metrics for k in ("tg", "ig", "th", "fb")):
        save_metrics(metrics)
    partes = split_telegram(report, TG_MAX - 12)  # deja lugar al "(1/2)"
    for i, parte in enumerate(partes, 1):
        if len(partes) > 1:
            parte = f"({i}/{len(partes)})\n{parte}"
        alert_admin(token, cfg["admin_chat"], parte, dry)
        if not dry:
            print(parte)
    enviar_placa_caceria(token, cfg["admin_chat"], dry)
    return 0


def enviar_placa_caceria(token: str, admin: str, dry: bool) -> None:
    """Manda al admin la placa "Cacería de la semana" (tools/caceria_semana.py)
    como archivo, lista para el post del domingo. Best-effort."""
    try:
        sys.path.insert(0, str(Path(__file__).resolve().parent / "tools"))
        import caceria_semana  # requiere Pillow
        items = caceria_semana.top_semana(caceria_semana.cargar())
        if not items:
            return
        out = caceria_semana.render(items, Path(__file__).resolve().parent / "stories" / "caceria-semana.jpg")
        if dry:
            print(f"[DRY] placa cacería en {out}")
            return
        import urllib.request
        import uuid
        limite = uuid.uuid4().hex
        caption = ("🎯 Cacería de la semana lista para el post del domingo. "
                   "Subila con el caption: las 5 mejores con precio verificado, link en la bio.")
        crlf = chr(13) + chr(10)
        cab = 'Content-Disposition: form-data; name="{}"'
        partes = [
            f"--{limite}{crlf}{cab.format('chat_id')}{crlf}{crlf}{admin}{crlf}".encode(),
            f"--{limite}{crlf}{cab.format('caption')}{crlf}{crlf}{caption}{crlf}".encode(),
            (f"--{limite}{crlf}{cab.format('document')}; filename=\"caceria-semana.jpg\"{crlf}"
             f"Content-Type: image/jpeg{crlf}{crlf}").encode(),
            out.read_bytes(),
            f"{crlf}--{limite}--{crlf}".encode(),
        ]
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{token}/sendDocument", data=b"".join(partes),
            headers={"Content-Type": f"multipart/form-data; boundary={limite}"},
        )
        urllib.request.urlopen(req, timeout=60).read()
    except Exception as e:  # noqa: BLE001 — la placa nunca frena el reporte
        print(f"[warn] placa de la cacería no enviada: {e}")


if __name__ == "__main__":
    sys.exit(main())
