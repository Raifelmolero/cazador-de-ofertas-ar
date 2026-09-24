"""
Cazador de Ofertas AR — bot de canal de Telegram con afiliados de Mercado Libre.

Corre en GitHub Actions (cron). Sin dependencias externas: solo stdlib.

Flujo:
  1. Descarga las páginas de https://www.mercadolibre.com.ar/ofertas
  2. Parsea las tarjetas de producto (título, precios, % OFF, imagen, link)
  3. Filtra por descuento/precio mínimo y descarta lo ya publicado
  4. Inyecta el ID de afiliado (matt_tool) en cada link
  5. Publica las mejores ofertas en el canal de Telegram con botón de compra
  6. Una vez por día manda al chat privado del admin el "kit IG" listo para pegar

Env vars:
  TELEGRAM_BOT_TOKEN  (secreto, requerido para publicar)
  ML_AFFILIATE_ID     (secreto; si falta, los links salen sin tracking)
  IG_USER_ID          (secreto; ID numérico de la cuenta de Instagram)
  IG_ACCESS_TOKEN     (secreto; token de Instagram API with Instagram Login)
  THREADS_USER_ID     (secreto; ID numérico de la cuenta de Threads)
  THREADS_ACCESS_TOKEN (secreto; token de la Threads API)
  FB_PAGE_ID          (secreto; ID numérico de la página de Facebook)
  FB_PAGE_ACCESS_TOKEN (secreto; token de página de la Facebook Graph API)
  DRY_RUN=1           (imprime en vez de publicar)
  FORCE_IG_KIT=1      (fuerza la publicación/kit de IG sin importar la hora)
"""

import json
import os
import random
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from html import unescape
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CONFIG_PATH = BASE_DIR / "config.json"
STATE_PATH = BASE_DIR / "state" / "posted_ids.json"
POSTS_LOG_PATH = BASE_DIR / "state" / "posts_log.jsonl"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)

OFERTAS_URL = "https://www.mercadolibre.com.ar/ofertas?page={page}"
# Ofertas relámpago: tienen cuenta regresiva (urgencia real, la pone ML) y el
# listado está lleno de ticket alto (celulares, TV, aires).
RELAMPAGO_URL = (
    "https://www.mercadolibre.com.ar/ofertas"
    "?container_id=MLA779357-1&promotion_type=lightning&page={page}"
)

# Días que se conserva la media (placas, stories, reels) antes de borrarla.
MEDIA_RETENTION_DAYS = 14


# ---------------------------------------------------------------- utilidades

def load_config() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return json.load(f)


def load_state() -> dict:
    try:
        with open(STATE_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"posted_ids": []}


def save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    state["posted_ids"] = state["posted_ids"][-600:]
    if "exclusive_ids" in state:
        state["exclusive_ids"] = state["exclusive_ids"][-300:]
    state["updated_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=1)


def log_post(deal: dict, channel: str) -> None:
    """Registra una publicación en el log semanal (jsonl, un evento por línea)."""
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "ch": channel,
        "id": deal["id"],
        "title": deal["title"][:80],
        "discount": deal["discount"],
        "price": deal["price_cur"],
        "low": bool(deal.get("hist_low")),
        "excl": bool(deal.get("canal_exclusiva")),
    }
    POSTS_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(POSTS_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


SCAN_LOG_PATH = BASE_DIR / "state" / "scan_log.jsonl"


def log_scan(scanned: int, minimos: int, infladas: int) -> None:
    """Registra el resumen de cada corrida (alimenta el reporte semanal)."""
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "scanned": scanned,
        "minimos": minimos,
        "infladas": infladas,
    }
    SCAN_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(SCAN_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def http_get(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept-Language": "es-AR,es;q=0.9"}
    )
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        return resp.read()


def parse_price(fraction: str) -> int:
    return int(fraction.replace(".", ""))


def fmt_price(n: int) -> str:
    return f"${n:,.0f}".replace(",", ".")


# ---------------------------------------------------------------- scraping

def fetch_deals(pages: int = 3, relampago_pages: int = 0) -> list[dict]:
    """Baja y parsea las páginas de ofertas (y las de ofertas relámpago)."""
    deals, seen = [], set()
    urls = [(OFERTAS_URL, p) for p in range(1, pages + 1)]
    urls += [(RELAMPAGO_URL, p) for p in range(1, relampago_pages + 1)]
    for base, page in urls:
        try:
            html = http_get(base.format(page=page)).decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001 — red hostil, seguimos con lo que haya
            print(f"[warn] página {page} falló: {e}")
            continue
        page_deals = parse_cards(html)
        for d in page_deals:
            if base is RELAMPAGO_URL:
                d["relampago"] = True
            if d["id"] not in seen:
                seen.add(d["id"])
                deals.append(d)
        print(f"[info] página {page}: {len(page_deals)} tarjetas válidas")
        time.sleep(random.uniform(1.5, 3.0))
    return deals


def parse_cards(html: str) -> list[dict]:
    """Cada tarjeta arranca en poly-card__portada (imagen) y sigue con el contenido."""
    starts = [m.start() for m in re.finditer(r"poly-card__portada", html)]
    cards = [
        html[s : starts[i + 1] if i + 1 < len(starts) else s + 8000]
        for i, s in enumerate(starts)
    ]
    out = []
    for c in cards:
        title = re.search(r"poly-component__title[^>]*>([^<]{5,150})", c)
        href = re.search(r'href="(https://www\.mercadolibre\.com\.ar/[^"]+)"', c)
        prev = re.search(
            r"andes-money-amount--previous.*?fraction[^>]*>([\d.]+)", c, re.S
        )
        cur = re.search(r"poly-price__current.*?fraction[^>]*>([\d.]+)", c, re.S)
        off = re.search(r"(\d{1,2})\s*%\s*OFF", c)
        img = re.search(
            r'poly-component__picture"[^>]*src="(https://http2\.mlstatic\.com/[^"]+)"', c
        )
        if not img:
            img = re.search(
                r'<img[^>]*src="(https://http2\.mlstatic\.com/D_[^"]+)"', c
            )
        if not (title and href and prev and cur and off):
            continue
        url = href.group(1)
        mla = re.search(r"MLA-?(\d{6,13})", url)
        deal_id = f"MLA{mla.group(1)}" if mla else f"T{abs(hash(title.group(1)))}"
        try:
            price_prev = parse_price(prev.group(1))
            price_cur = parse_price(cur.group(1))
        except ValueError:
            continue
        if price_cur >= price_prev:
            continue
        out.append(
            {
                # La tarjeta trae el contador de ML → oferta relámpago.
                "relampago": "highlight-countdown" in c,
                "id": deal_id,
                "title": unescape(title.group(1)).strip(),
                "url": url.split("?")[0].split("#")[0],
                "price_prev": price_prev,
                "price_cur": price_cur,
                "discount": int(off.group(1)),
                "img": img.group(1) if img else None,
            }
        )
    return out


# ---------------------------------------------------------------- historial de precios

PRICE_HISTORY_PATH = BASE_DIR / "state" / "price_history.json"
HIST_MIN_AGE_DAYS = 3        # historia mínima antes de declarar "precio más bajo"
HIST_INFLATED_MARGIN = 0.95  # lo vimos ≥5% más barato → el descuento está inflado
HIST_MAX_ITEMS = 6000


def load_price_history() -> dict:
    try:
        with open(PRICE_HISTORY_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_price_history(history: dict) -> None:
    if len(history) > HIST_MAX_ITEMS:
        keep = sorted(history.items(), key=lambda kv: kv[1]["last_ts"], reverse=True)
        history = dict(keep[:HIST_MAX_ITEMS])
    PRICE_HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(PRICE_HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, separators=(",", ":"))


def _days_between(a: str, b: str) -> int:
    return abs((datetime.fromisoformat(b) - datetime.fromisoformat(a)).days)


def annotate_price_history(deals: list[dict], history: dict) -> None:
    """Cruza cada oferta con la historia previa y registra los precios de hoy.

    hist_low: hay ≥ HIST_MIN_AGE_DAYS de historia del producto y el precio de
    hoy es el más bajo que vimos (habilita el badge en las captions).
    inflada: lo vimos ≥5% más barato antes — el descuento contra price_prev
    no es real y la oferta se descarta del ranking.
    """
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    for d in deals:
        price = d["price_cur"]
        h = history.get(d["id"])
        if h:
            d["hist_low"] = (
                _days_between(h["first_ts"], today) >= HIST_MIN_AGE_DAYS
                and price <= h["min"]
            )
            d["inflada"] = h["min"] < price * HIST_INFLATED_MARGIN
            if price < h["min"]:
                h["min"], h["min_ts"] = price, today
            h["last"], h["last_ts"] = price, today
        else:
            d["hist_low"] = False
            d["inflada"] = False
            history[d["id"]] = {
                "min": price, "min_ts": today,
                "first_ts": today,
                "last": price, "last_ts": today,
            }


# ---------------------------------------------------------------- sitio web

# Réplica exacta de scraper/calculator.py — márgenes para revendedores.
COMISION_CLASICA_PCT = 0.15
COMISION_PREMIUM_PCT = 0.30
RETENCION_IIBB_PCT = 0.03
COSTO_ENVIO_BASE_ARS = 8000.0
UMBRAL_ENVIO_GRATIS_ARS = 30000.0

SITE_DATA_PATH = BASE_DIR.parent / "frontend" / "data" / "productos_rentables.json"

# El bot lee las 20 páginas de /ofertas (~700 productos) para encontrar los de
# ticket alto (aires, colchones, herramientas), que en las 3 primeras casi no
# aparecen. A la web van TODOS los de categoría con peso (alimentan las
# páginas /categoria/*) más los mejores N del resto, para que /hoy no se
# vuelva una lista de 700 tarjetas ni el build genere 700 calculadoras.
SITE_GENERAL_LIMIT = 150


def _prioritario(d: dict) -> bool:
    """Siempre va a la web: comisión alta, fecha comercial vigente o relámpago."""
    return (
        comision_estimada(d["title"]) > 1.0
        or temporada_boost(d["title"]) > 1.0
        or bool(d.get("relampago"))
    )


def select_site_deals(deals: list[dict], limit: int = SITE_GENERAL_LIMIT) -> list[dict]:
    """Ofertas que van a la web: sin infladas, todas las de categoría con
    peso de comisión y los `limit` mejores del resto (mínimos históricos
    primero, después % OFF). Conserva el orden original del scrape."""
    reales = [d for d in deals if not d.get("inflada")]
    resto = [d for d in reales if not _prioritario(d)]
    resto.sort(key=lambda d: (bool(d.get("hist_low")), d["discount"]), reverse=True)
    elegidos = {d["id"] for d in resto[:limit]}
    elegidos.update(d["id"] for d in reales if _prioritario(d))
    return [d for d in reales if d["id"] in elegidos]


def write_site_data(deals: list[dict], affiliate_id: str,
                    exclusive_ids: set[str] | None = None,
                    history: dict | None = None) -> None:
    """Actualiza el JSON de CalculadoraML con las ofertas del día.

    Las ofertas exclusivas del canal de Telegram se excluyen de la web para
    que el "SOLO EN EL CANAL" sea verdad — es el gancho para sumar miembros.
    """
    exclusive_ids = exclusive_ids or set()
    history = history or {}
    word_web = os.getenv("ML_WORD_WEB", "web")
    items = []
    for d in deals:
        if d["id"] in exclusive_ids:
            continue
        precio = float(d["price_cur"])
        envio = COSTO_ENVIO_BASE_ARS if precio >= UMBRAL_ENVIO_GRATIS_ARS else 0.0
        iibb = precio * RETENCION_IIBB_PCT
        margen_clasico = precio - precio * COMISION_CLASICA_PCT - iibb - envio
        margen_premium = precio - precio * COMISION_PREMIUM_PCT - iibb - envio
        if margen_clasico <= 0:
            continue
        items.append(
            {
                "id_ml": d["id"],
                "titulo": d["title"],
                "categoria_principal": "ofertas del día",
                "precio_actual": round(precio, 2),
                "precio_anterior": d["price_prev"],
                "descuento_pct": d["discount"],
                "minimo_historico": bool(d.get("hist_low")),
                "relampago": bool(d.get("relampago")),
                # Ganancia esperada relativa (precio × peso de comisión): la
                # web ordena por esto para mostrar primero el ticket alto.
                "prioridad": round(ganancia_esperada(d)),
                # Dato propio para la web (tabla "precios de referencia"):
                # el mínimo que registramos y desde cuándo seguimos el precio.
                "precio_minimo_registrado": history.get(d["id"], {}).get("min"),
                "seguimiento_desde": history.get(d["id"], {}).get("first_ts"),
                "moneda": "ARS",
                "ventas_estimadas": None,
                "url_producto": affiliate_url(d["url"], affiliate_id, word_web),
                "url_imagen": d["img"],
                "comision_clasica_pct": COMISION_CLASICA_PCT,
                "comision_premium_pct": COMISION_PREMIUM_PCT,
                "retencion_iibb_pct": RETENCION_IIBB_PCT,
                "costo_envio_base_ars": envio,
                "margen_neto_clasico_ars": round(margen_clasico, 2),
                "margen_neto_premium_ars": round(margen_premium, 2),
            }
        )
    payload = {
        "metadata": {
            "scraped_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "fuente": "mercadolibre.com.ar/ofertas",
            "total_items": len(items),
        },
        "items": items,
    }
    SITE_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(SITE_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1)
    print(f"[info] sitio: {len(items)} productos escritos en {SITE_DATA_PATH.name}")


# ---------------------------------------------------------------- afiliados

def affiliate_url(url: str, affiliate_id: str, word: str | None = None) -> str:
    """Link con tracking. En ML la etiqueta de atribución va en matt_word
    (verificado en el linkbuilder: matt_word=telegram/instagram/threads);
    matt_tool es fijo. Sin etiqueta específica usa la general (affiliate_id)."""
    if not affiliate_id:
        return url
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}matt_word={word or affiliate_id}&matt_tool=37267219"


def run_slot(hour_utc: int) -> str:
    """En cuál de los 3 runs diarios estamos: 'midday', 'evening' o 'night'.

    Los crons de GitHub Actions llegan atrasados por horas (el de las 15 UTC
    arranca ~18:xx, el de las 00 ~03:xx), así que se usan ventanas anchas que
    no se pisan en vez de la hora exacta."""
    if 15 <= hour_utc <= 19:
        return "midday"
    if 20 <= hour_utc <= 23:
        return "evening"
    if 0 <= hour_utc <= 4:
        return "night"
    return "other"


SITE_DOMAIN = "cazadordeofertas.com.ar"


def site_url(source: str) -> str:
    """Link al sitio propio con utm_source, para ver desde qué canal llega la
    gente en Clarity (Telegram no manda referrer desde su app)."""
    return f"https://{SITE_DOMAIN}/?utm_source={source}"


# ---------------------------------------------------------------- telegram

def tg_call(token: str, method: str, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/{method}",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def deal_caption(deal: dict, link: str) -> str:
    ahorro = deal["price_prev"] - deal["price_cur"]
    # Sello de exclusiva: la razón para estar en el canal y no solo en IG/web.
    exclusiva = (
        "🔒 <b>SOLO EN EL CANAL</b> — esta no la publicamos ni en Instagram ni en la web\n\n"
        if deal.get("canal_exclusiva")
        else ""
    )
    badge = (
        "📉 <b>El precio más bajo que registramos</b>\n"
        if deal.get("hist_low")
        else ""
    )
    relampago = (
        "⚡ <b>OFERTA RELÁMPAGO</b> — dura pocas horas o hasta agotar stock\n\n"
        if deal.get("relampago")
        else ""
    )
    return (
        f"{exclusiva}{relampago}"
        f"🔥 <b>{deal['discount']}% OFF</b> — {esc(deal['title'])}\n\n"
        f"❌ Antes: <s>{fmt_price(deal['price_prev'])}</s>\n"
        f"✅ Ahora: <b>{fmt_price(deal['price_cur'])}</b>\n"
        f"💸 Te ahorrás {fmt_price(ahorro)}\n"
        f"{badge}\n"
        f"🛒 {link}"
    )


def post_deal(token: str, channel: str, deal: dict, link: str, dry: bool) -> bool:
    caption = deal_caption(deal, link)
    keyboard = {
        "inline_keyboard": [
            [{"text": "🛒 Ver oferta en ML", "url": link}],
            [{"text": "🔎 Más ofertas en el sitio", "url": site_url("telegram")}],
        ]
    }
    if dry:
        print("=" * 60)
        print(f"[DRY] canal {channel} | img={bool(deal['img'])}")
        print(caption)
        return True
    try:
        if deal["img"]:
            tg_call(
                token,
                "sendPhoto",
                {
                    "chat_id": channel,
                    "photo": deal["img"],
                    "caption": caption,
                    "parse_mode": "HTML",
                    "reply_markup": keyboard,
                },
            )
        else:
            tg_call(
                token,
                "sendMessage",
                {
                    "chat_id": channel,
                    "text": caption,
                    "parse_mode": "HTML",
                    "reply_markup": keyboard,
                },
            )
        return True
    except Exception as e:  # noqa: BLE001
        print(f"[error] no pude publicar {deal['id']}: {e}")
        return False


def send_ig_kit(token: str, admin: str, deal: dict, link: str, dry: bool) -> None:
    """Manda al admin el pack listo para publicar en Instagram (2 min de trabajo)."""
    caption_ig = (
        f"🔥 ¡{deal['discount']}% OFF en {deal['title'][:60]}!\n"
        f"De {fmt_price(deal['price_prev'])} a {fmt_price(deal['price_cur'])} 😱\n"
        f"Stock y precio pueden volar 🏃\n"
        f"👉 Link en historias y en el canal de Telegram (bio)\n\n"
        f"{ig_hashtags()}"
    )
    msg = (
        f"📸 <b>KIT INSTAGRAM DE HOY</b>\n\n"
        f"1️⃣ Imagen del producto:\n{deal['img'] or '(sin imagen)'}\n\n"
        f"2️⃣ Caption para el post/story (tocá para copiar):\n"
        f"<code>{esc(caption_ig)}</code>\n\n"
        f"3️⃣ Link de afiliado para el sticker de la story:\n{link}\n\n"
        f"⏱ 2 minutos: story con la imagen + sticker de link. Listo."
    )
    if dry:
        print("=" * 60)
        print(f"[DRY] IG kit → {admin}\n{msg}")
        return
    try:
        tg_call(
            token,
            "sendMessage",
            {"chat_id": admin, "text": msg, "parse_mode": "HTML",
             "disable_web_page_preview": True},
        )
    except Exception as e:  # noqa: BLE001
        print(f"[warn] IG kit no enviado: {e}")


def alert_admin(token: str, admin: str, text: str, dry: bool) -> None:
    if dry:
        print(f"[DRY] alerta admin: {text}")
        return
    try:
        tg_call(token, "sendMessage", {"chat_id": admin, "text": text})
    except Exception as e:  # noqa: BLE001
        print(f"[warn] alerta no enviada: {e}")


# ---------------------------------------------------------------- instagram

IG_GRAPH = "https://graph.instagram.com/v23.0"
THREADS_GRAPH = "https://graph.threads.net/v1.0"
FB_GRAPH = "https://graph.facebook.com/v23.0"


def ig_call(method: str, path: str, params: dict, base: str = IG_GRAPH) -> dict:
    """Llamada a la Instagram/Threads API. Devuelve el JSON parseado."""
    query = urllib.parse.urlencode(params)
    if method == "GET":
        req = urllib.request.Request(f"{base}/{path}?{query}")
    else:
        req = urllib.request.Request(f"{base}/{path}", data=query.encode())
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"API {e.code} en /{path}: {body[:300]}") from e


def ig_image_url(img: str) -> str:
    """Tarjeta de ML (thumbnail .webp) → imagen grande en JPEG (IG exige JPEG)."""
    out = img.replace("D_Q_NP_", "D_NQ_NP_")
    out = re.sub(r"-[A-Z]{1,2}\.webp$", "-F.jpg", out)
    out = re.sub(r"\.webp$", ".jpg", out)
    return out


# Ganchos rotativos para que los posts no salgan siempre con el mismo formato.
IG_HOOKS = [
    "🚨 ALERTA DE PRECIO",
    "🎯 CAZADA DEL DÍA",
    "🔥 OFERTA REAL, CERO HUMO",
    "⚡ BAJÓN DE PRECIO",
    "👀 ESTO NO DURA NADA",
]

TH_HOOKS = [
    "🚨 Alerta de precio:",
    "🎯 Cazada del día:",
    "🔥 Encontré esto y tuve que compartirlo:",
    "⚡ Bajó de verdad, no es humo:",
    "👀 Ojo con esto antes de que vuelva a subir:",
]

# Pool de hashtags: cada post lleva una mezcla distinta — hashtags idénticos
# en todos los posts son señal de contenido repetitivo para el filtro de IG.
IG_HASHTAG_POOL = [
    "#ofertas", "#descuentos", "#mercadolibre", "#argentina", "#ahorro",
    "#ofertasargentina", "#promos", "#ofertasdeldia", "#preciosbajos",
    "#compras", "#descuentosargentina", "#ahorrar",
]


def ig_hashtags(n: int = 6) -> str:
    return " ".join(["#cazadordeofertas"] + random.sample(IG_HASHTAG_POOL, n - 1))


# Destacados que el dueño ya armó a mano en el perfil de IG. Es solo una
# sugerencia para la alerta de Telegram — no hay API de Meta para destacados,
# así que el paso de arrastrar la story sigue siendo 100% manual.
DESTACADO_KEYWORDS = {
    "Tecnología": ["smart tv", "auricular", "notebook", "celular", "smartphone",
                   "tablet", "parlante", "bocina", "cámara", "camara", "airpods",
                   "mouse", "teclado", "monitor", "impresora", "router"],
    "Hogar": ["aire acondicionado", "colchón", "colchon", "sommier", "lavarropas",
              "secarropas", "heladera", "microondas", "cafetera", "pava",
              "aspiradora", "ventilador", "licuadora", "freidora", "plancha"],
    "Herramientas": ["taladro", "amoladora", "compresor", "soldadora", "sierra",
                      "atornillador", "hidrolavadora", "generador"],
    "Deportes": ["bicicleta", "cinta", "mancuerna", "pesa", "gimnasio", "spinning",
                 "bici", "pelota", "running"],
    "Salud": ["tensiómetro", "tensiometro", "termómetro", "termometro", "masajeador",
              "báscula", "bascula", "balanza"],
    "Cuidado Personal": ["afeitadora", "secador", "planchita", "depiladora",
                          "cepillo eléctrico", "cepillo electrico"],
    "Invierno": ["calefactor", "estufa", "frazada", "manta"],
}


def sugerir_destacado(title: str) -> str | None:
    t = title.lower()
    for destacado, keywords in DESTACADO_KEYWORDS.items():
        if any(k in t for k in keywords):
            return destacado
    return None


# Actualización 2026-09-21 (panel, 180 días): Gastronomía y Hotelería también
# paga 15% — se agregó al tramo alto.
# Actualización 2026-09-23 (panel, 30 días 24/ago-22/sep): el mes lo hicieron
# ventas de Climatización ($52k, 1 unidad, 7%), Herramientas Eléctricas ($28k,
# 15%) y Camas/Colchones ($25k, 15%) — categorías que hasta ahora no tenían
# peso propio y competían en igualdad con cualquier producto sin señal. Se
# agregan acá. El patrón se repite: pocas ventas de ticket alto en categorías
# de comisión alta valen más que muchos clics en productos baratos.
# Pesos de comisión estimada por categoría. El scraper de /ofertas no trae la
# categoría real de ML (pedirla individual por producto son ~100 requests
# extra por corrida, riesgo de baneo de IP — ver CLAUDE.md). Se aproxima por
# palabras clave del título, mismo patrón que sugerir_destacado().
#
# Los pesos salen del panel de afiliados (2026-06 a 2026-09, retribución real
# por categoría vendida): Embalaje y Logística / Gastronomía y Hotelería /
# Herramientas Eléctricas / Camas y Colchones 15%, Climatización / Pequeños
# Electrodomésticos y Monitores 7%, Seguridad para el Hogar / Materiales de
# Obra / Pinturería / Camping / Librería 4%, Accesorios para Cámaras /
# Periféricos / Tablets 2%. Es una muestra chica (~26 ventas) — no es la tabla
# oficial de comisiones de ML, es la mejor aproximación que tenemos con datos
# reales. Ajustable acá mismo si el patrón cambia con más ventas.
#
# No reemplaza al %OFF ni al mínimo histórico como criterio principal (una
# oferta mala sigue sin publicarse) — solo desempata a favor de la categoría
# que más comisión paga cuando hay varias candidatas parejas.
CATEGORY_COMMISSION_WEIGHT: list[tuple[float, list[str]]] = [
    (1.8, [  # Embalaje y Logística ~15%
        "caja de embalaje", "cinta de embalar", "film stretch", "sunchos",
        "bolsa doypack", "precinto", "papel burbuja", "rollo de embalaje",
        "cinta adhesiva", "etiqueta autoadhesiva", "zuncho",
    ]),
    (1.8, [  # Gastronomía y Hotelería ~15% (freidora industrial: $23.8k de un pedido)
        "freidora industrial", "freidora doble", "horno industrial",
        "cocina industrial", "horno pizzero", "amasadora", "cortadora de fiambre",
        "exhibidora", "plancha industrial", "procesadora industrial",
        "cafetera industrial", "mesa de acero inoxidable", "campana industrial",
    ]),
    (1.8, [  # Herramientas Eléctricas ~15% (taladro+atornillador: $28.4k de un pedido)
        "taladro", "atornillador", "amoladora", "esmeril angular", "lijadora",
        "rotomartillo", "sierra circular", "sierra caladora", "soldadora",
        "compresor de aire", "motosierra", "desmalezadora", "bordeadora",
        "hidrolavadora",
    ]),
    (1.8, [  # Camas, Colchones y Accesorios ~15% (colchón: $24.8k de un pedido)
        "colchon", "colchón", "sommier", "sommiers",
    ]),
    (1.4, [  # Climatización ~7% (aire acondicionado split: $52k de un pedido)
        "aire acondicionado", "acondicionado split", "split frio calor",
        "split frío calor", "split inverter",
    ]),
    (1.4, [  # Pequeños Electrodomésticos / Monitores y Accesorios ~7%
        "monitor", "freidora de aire", "cafetera", "pava eléctrica",
        "pava electrica", "licuadora", "batidora", "aspiradora", "plancha",
        "ventilador", "heladera", "microondas", "extractor",
    ]),
    (1.4, [  # Accesorios para Vehículos (ESTIMADO, sin ventas aún: validar
        # en el panel de afiliados → Categorías y ajustar el peso).
        "neumatico", "neumático", "cubierta rodado", "llanta", "amortiguador",
        "pastillas de freno", "kit de distribucion", "kit de distribución",
        "bateria para auto", "batería para auto", "bateria 12v", "batería 12v",
        "estereo", "estéreo", "autoestereo", "stereo para auto",
        "camara de retroceso", "cámara de retroceso", "cubre asiento",
        "portaequipaje", "barras de techo", "arrancador", "booster",
        "compresor 12v", "optica", "óptica", "faro led", "cubre volante",
        "alfombra para auto", "cera para auto", "lustradora",
    ]),
    (1.4, [  # Televisores 7% (smart TV: $28.3k de un pedido) y línea blanca
        # grande (estimado igual que heladera). Tienen página /categoria/*.
        "smart tv", "televisor", "google tv", "lavarropas", "lavasecarropas",
        "secarropas", "lavavajillas", "freezer", "termotanque", "calefon", "calefón",
    ]),
    (1.15, [  # Seguridad / Materiales de obra / Pinturería / Camping / Librería ~4%
        "cerradura", "alarma", "sensor de", "cámara de seguridad",
        "camara de seguridad", "candado", "pintura", "látex", "latex",
        "esmalte sintético", "esmalte sintetico", "membrana", "pastina",
        "cemento", "revoque", "hidrófugo", "hidrofugo", "carpa", "reposera",
        "mochila de camping", "libro", "cuaderno", "anotador",
    ]),
]


def comision_estimada(title: str) -> float:
    """Peso relativo (no la comisión real) para desempatar el ranking a favor
    de categorías que históricamente pagaron más. 1.0 = categoría sin señal
    (electrónica de ticket alto tipo cámaras/tablets/periféricos, ~2%, o
    cualquier producto que no matchea ninguna keyword)."""
    t = title.lower()
    for weight, keywords in CATEGORY_COMMISSION_WEIGHT:
        if any(k in t for k in keywords):
            return weight
    return 1.0


# Fechas comerciales de Argentina: en cada ventana, los rubros que la gente
# sale a comprar pesan más. (mes, día) inclusivo. El Día de la Madre es el
# 3er domingo de octubre; la ventana cubre las 3 semanas previas de compra.
TEMPORADAS: list[tuple[tuple[int, int], tuple[int, int], float, list[str]]] = [
    ((9, 25), (10, 19), 1.5, [  # Día de la Madre (18/10/2026)
        "perfume", "secador de pelo", "planchita", "alisadora", "rizador",
        "smartwatch", "reloj", "cartera", "bata", "masajeador", "cafetera",
        "freidora de aire", "robot aspiradora", "aspiradora robot", "batidora",
        "licuadora", "mixer", "maquina de coser", "máquina de coser",
        "auriculares", "celular", "tablet", "anteojos de sol", "set de cuidado",
        "depiladora", "joya", "aros", "colgante", "pulsera",
    ]),
    ((9, 21), (2, 28), 1.3, [  # Primavera-verano: calor y aire libre
        "aire acondicionado", "ventilador", "pileta", "piscina", "reposera",
        "parrilla", "heladera portatil", "heladera portátil", "conservadora",
        "bicicleta", "carpa", "sombrilla", "climatizador",
    ]),
    ((11, 1), (12, 2), 1.3, [  # Black Friday / Cyber Monday: ticket alto
        "smart tv", "notebook", "celular", "consola", "playstation",
        "lavarropas", "heladera", "monitor",
    ]),
    ((12, 1), (12, 24), 1.4, [  # Navidad
        "consola", "playstation", "nintendo", "bicicleta", "monopatin",
        "monopatín", "auriculares", "smartwatch", "perfume", "parlante",
        "lego", "tablet",
    ]),
    ((6, 1), (6, 21), 1.5, [  # Día del Padre (3er domingo de junio)
        "taladro", "atornillador", "parrilla", "smartwatch", "reloj",
        "perfume", "herramienta", "cafetera", "afeitadora", "barbero",
    ]),
    ((7, 25), (8, 17), 1.4, [  # Día de las Infancias (3er domingo de agosto)
        "bicicleta", "monopatin", "monopatín", "consola", "lego", "tablet",
    ]),
]


def _en_ventana(hoy: datetime, desde: tuple[int, int], hasta: tuple[int, int]) -> bool:
    md = (hoy.month, hoy.day)
    if desde <= hasta:
        return desde <= md <= hasta
    return md >= desde or md <= hasta  # cruza fin de año


def temporada_boost(title: str, hoy: datetime | None = None) -> float:
    """Multiplicador por fecha comercial vigente (1.0 si no aplica)."""
    hoy = hoy or datetime.now(timezone.utc) - timedelta(hours=3)
    t = title.lower()
    boost = 1.0
    for desde, hasta, peso, keywords in TEMPORADAS:
        if _en_ventana(hoy, desde, hasta) and any(k in t for k in keywords):
            boost = max(boost, peso)
    return boost


def ganancia_esperada(deal: dict) -> float:
    """Pesos que deja una venta, en relativo: precio × peso de comisión.
    Una venta de un aire de $800k deja ~100 veces más que un juguete de $8k,
    así que el ticket manda. Mínimo histórico y relámpago suman un plus
    porque convierten más (precio verificado / urgencia real de ML)."""
    score = (
        deal["price_cur"]
        * comision_estimada(deal["title"])
        * temporada_boost(deal["title"])
    )
    if deal.get("hist_low"):
        score *= 1.3
    if deal.get("relampago"):
        score *= 1.2
    return score


def ig_caption(deal: dict) -> str:
    ahorro = deal["price_prev"] - deal["price_cur"]
    hook = (
        "⚡ OFERTA RELÁMPAGO: dura pocas horas"
        if deal.get("relampago")
        else "📉 MÍNIMO HISTÓRICO" if deal.get("hist_low") else random.choice(IG_HOOKS)
    )
    badge = (
        "📉 Nunca lo registramos más barato que hoy\n"
        if deal.get("hist_low")
        else ""
    )
    return (
        f"{hook}\n\n"
        f"{deal['discount']}% OFF en {deal['title'][:80]}\n\n"
        f"❌ Estaba: {fmt_price(deal['price_prev'])}\n"
        f"✅ Hoy: {fmt_price(deal['price_cur'])}\n"
        f"💸 Te quedan {fmt_price(ahorro)} en el bolsillo\n"
        f"{badge}\n"
        # El link de la bio va primero y solo: en IG los links del caption no
        # son clickeables, así que es el único camino que puede terminar en una
        # compra. Telegram queda al final, en una línea.
        f"🛒 ¿Lo querés? Tocá el link de mi bio → cazadordeofertas.com.ar y lo "
        f"comprás desde ahí.\n\n"
        f"💾 Guardá este post si lo estás pensando.\n"
        f"📤 Mandáselo a quien lo estaba buscando.\n\n"
        f"⏳ En ML los precios cambian sin aviso: cuando vuelve a subir, no avisan.\n\n"
        # Sin @: en IG cualquier "@algo" es una mención clickeable a un perfil
        # de Instagram (si existe una cuenta con ese nombre, va ahí, no a
        # Telegram) — pasó de verdad con una cuenta random homónima.
        f"📲 Más ofertas por día (y algunas exclusivas) en mi Telegram: "
        f"t.me/cazadordeofertasar\n\n"
        f"{ig_hashtags()}"
    )


# Posts de solo texto para Threads (el algoritmo premia lo conversacional).
TH_CONVO = [
    "¿{price} por esto está bien o espero? 🤔\n\n{title}\nHoy con {discount}% OFF.\n\n🛒 {link}\n\nYo digo que estos precios no suelen repetirse, pero se aceptan opiniones.",
    "Debate: {title} a {price} ({discount}% OFF).\n\n¿Se compra o se espera al Black Friday? 👀\n\n🛒 {link}",
    "Si estabas esperando una señal para comprar {title}, es esta:\n\n{discount}% OFF → {price}.\n\n🛒 {link}",
    "Regla del cazador: cuando algo que querías baja {discount}%, no se duda.\n\n{title} → {price}\n\n🛒 {link}",
]


def th_text_caption(deal: dict, link: str) -> str:
    """Post conversacional de solo texto para Threads (máx 500 chars)."""
    caption = random.choice(TH_CONVO).format(
        title=deal["title"][:60],
        price=fmt_price(deal["price_cur"]),
        discount=deal["discount"],
        link=link,
    )
    if deal.get("hist_low"):
        caption = "📉 Mínimo histórico según nuestro registro.\n\n" + caption
    if len(caption) > 500:
        caption = (
            f"{deal['discount']}% OFF en {deal['title'][:60]} → "
            f"{fmt_price(deal['price_cur'])}\n\n🛒 {link}"
        )
    return caption


def th_caption(deal: dict, link: str) -> str:
    """Caption para Threads: a diferencia de IG, el link va clickeable directo en el texto.

    Threads corta en 500 caracteres — si el link es largo, va la versión corta.
    """
    ahorro = deal["price_prev"] - deal["price_cur"]
    hook = (
        "📉 Mínimo histórico:" if deal.get("hist_low") else random.choice(TH_HOOKS)
    )
    remate = (
        "📉 Nunca lo registramos más barato que hoy."
        if deal.get("hist_low")
        else "⏳ En ML el precio cambia sin aviso: si lo venías esperando, es ahora."
    )
    caption = (
        f"{hook} {deal['discount']}% OFF en {deal['title'][:70]}\n\n"
        f"Estaba {fmt_price(deal['price_prev'])} → hoy {fmt_price(deal['price_cur'])}.\n"
        f"Son {fmt_price(ahorro)} que quedan en tu bolsillo 💸\n\n"
        f"🛒 {link}\n\n"
        f"{remate}\n\n"
        f"🔎 Más ofertas: {SITE_DOMAIN}"
    )
    if len(caption) > 500:
        caption = (
            f"{hook} {deal['discount']}% OFF en {deal['title'][:60]}\n\n"
            f"De {fmt_price(deal['price_prev'])} a {fmt_price(deal['price_cur'])} 💸\n\n"
            f"🛒 {link}\n\n"
            f"🔎 {SITE_DOMAIN}"
        )
    return caption


def fb_caption(deal: dict, link: str) -> str:
    """Caption para Facebook: igual que Threads, el link va clickeable directo
    en el texto — a diferencia de Instagram. Facebook no tiene el límite de
    500 caracteres de Threads, así que no hace falta versión corta."""
    ahorro = deal["price_prev"] - deal["price_cur"]
    hook = (
        "📉 MÍNIMO HISTÓRICO:" if deal.get("hist_low") else random.choice(TH_HOOKS)
    )
    remate = (
        "📉 Nunca lo registramos más barato que hoy."
        if deal.get("hist_low")
        else "⏳ En ML el precio cambia sin aviso: si lo venías esperando, es ahora."
    )
    return (
        f"{hook} {deal['discount']}% OFF en {deal['title'][:90]}\n\n"
        f"❌ Estaba: {fmt_price(deal['price_prev'])}\n"
        f"✅ Hoy: {fmt_price(deal['price_cur'])}\n"
        f"💸 Te quedan {fmt_price(ahorro)} en el bolsillo\n\n"
        f"🛒 Comprá acá: {link}\n\n"
        f"{remate}\n\n"
        f"Más ofertas todos los días en cazadordeofertas.com.ar y en nuestro "
        f"canal de Telegram: t.me/cazadordeofertasar"
    )


def prepare_placa(deal: dict, dry: bool, tag: str = "") -> str | None:
    """Genera la placa 4:5, la sube al repo y devuelve su URL pública (o None)."""
    if not deal.get("img"):
        return None
    try:
        from story import render_feed  # requiere Pillow

        req = urllib.request.Request(
            ig_image_url(deal["img"]), headers={"User-Agent": UA}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            image_bytes = resp.read()
        suffix = f"-{tag}" if tag else ""
        # Con hora: hay varias corridas por día y cada una publica un producto
        # distinto — sin la hora, la segunda pisaría el archivo de la primera.
        fname = f"feed-{datetime.now(timezone.utc).strftime('%Y%m%d-%H')}{suffix}.jpg"
        out = BASE_DIR / "feed" / fname
        render_feed(deal, image_bytes, out)
        if dry:
            print(f"[DRY] placa renderizada en {out}")
            return None
        if _git_push_file(out, "bot: placa del día [skip ci]"):
            repo = os.getenv("GITHUB_REPOSITORY", "Raifelmolero/cazador-de-ofertas-ar")
            time.sleep(5)
            return f"https://raw.githubusercontent.com/{repo}/main/bot/feed/{fname}"
    except Exception as e:  # noqa: BLE001 — la placa es opcional, la foto no
        print(f"[warn] placa falló: {e}")
    return None


def ig_publish(deal: dict, ig_user_id: str, ig_token: str, dry: bool,
               caption: str | None = None, tag: str = "") -> str | None:
    """Publica la oferta en el feed de IG. Devuelve el permalink o None si falló."""
    if not deal.get("img"):
        print("[warn] IG: la oferta no tiene imagen, salteo publicación")
        return None
    caption = caption or ig_caption(deal)
    # placa diseñada 4:5 (best-effort); si falla va la foto del producto
    image_url = prepare_placa(deal, dry, tag=tag) or ig_image_url(deal["img"])

    if dry:
        print("=" * 60)
        print(f"[DRY] IG publish → {image_url}\n{caption}")
        return "https://instagram.com/DRY_RUN"

    container = ig_call(
        "POST",
        f"{ig_user_id}/media",
        {"image_url": image_url, "caption": caption, "access_token": ig_token},
    )
    container_id = container["id"]

    # esperar a que el container esté listo (imágenes: casi inmediato)
    for _ in range(10):
        status = ig_call(
            "GET", container_id, {"fields": "status_code", "access_token": ig_token}
        )
        if status.get("status_code") == "FINISHED":
            break
        if status.get("status_code") == "ERROR":
            raise RuntimeError(f"IG container en ERROR: {status}")
        time.sleep(5)

    media = ig_call(
        "POST",
        f"{ig_user_id}/media_publish",
        {"creation_id": container_id, "access_token": ig_token},
    )

    # primer comentario propio con CTA (best-effort; requiere permiso de comentarios)
    try:
        ig_call(
            "POST",
            f"{media['id']}/comments",
            # Sin @: ver el comentario del caption sobre por qué (mención de IG
            # secuestra el link hacia otro perfil, no hacia Telegram).
            {"message": "📲 ¿Querés verlas apenas las encuentro, antes que en el feed? "
                        "Canal de Telegram: t.me/cazadordeofertasar. El link también está en mi bio ⚡",
             "access_token": ig_token},
        )
    except Exception as e:  # noqa: BLE001 — el post ya salió; el comentario es un plus
        print(f"[warn] primer comentario falló: {e}")

    try:
        info = ig_call(
            "GET", media["id"], {"fields": "permalink", "access_token": ig_token}
        )
        return info.get("permalink") or f"media_id {media['id']}"
    except Exception:  # noqa: BLE001 — el post ya salió; el permalink es cosmético
        return f"media_id {media['id']}"


def publish_reel(deal: dict, ig_user_id: str, ig_token: str, dry: bool) -> tuple[str | None, bool]:
    """Genera el reel del día (bot/reel.py) y lo publica como REELS en IG.

    También republica el mismo video como story (best-effort). Devuelve
    (permalink del reel o None, si la story del reel salió).
    Requiere ffmpeg en el runner.
    """
    if not deal.get("img"):
        print("[warn] Reel: la oferta no tiene imagen, salteo")
        return None, False
    from reel import render_reel  # requiere Pillow + ffmpeg

    req = urllib.request.Request(ig_image_url(deal["img"]), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        image_bytes = resp.read()

    fname = f"reel-{datetime.now(timezone.utc).strftime('%Y%m%d-%H')}.mp4"
    out = BASE_DIR / "reels" / fname
    render_reel(deal, image_bytes, out)
    deal["_reel_path"] = str(out)  # lo usa shorts.cross_post (YouTube/TikTok)
    if dry:
        print(f"[DRY] reel renderizado en {out}")
        return None, False

    if not _git_push_file(out, "bot: reel del día [skip ci]"):
        return None, False
    repo = os.getenv("GITHUB_REPOSITORY", "Raifelmolero/cazador-de-ofertas-ar")
    time.sleep(5)
    video_url = f"https://raw.githubusercontent.com/{repo}/main/bot/reels/{fname}"

    container = ig_call(
        "POST",
        f"{ig_user_id}/media",
        {
            "media_type": "REELS",
            "video_url": video_url,
            "caption": ig_caption(deal),
            "share_to_feed": "true",
            "access_token": ig_token,
        },
    )
    container_id = container["id"]

    # el procesamiento de video tarda más que el de imágenes: hasta ~5 min
    for _ in range(30):
        status = ig_call(
            "GET", container_id, {"fields": "status_code", "access_token": ig_token}
        )
        if status.get("status_code") == "FINISHED":
            break
        if status.get("status_code") == "ERROR":
            raise RuntimeError(f"Reel container en ERROR: {status}")
        time.sleep(10)
    else:
        raise RuntimeError("Reel: timeout esperando el procesamiento del video")

    media = ig_call(
        "POST",
        f"{ig_user_id}/media_publish",
        {"creation_id": container_id, "access_token": ig_token},
    )

    story_ok = False
    try:
        story_container = ig_call(
            "POST",
            f"{ig_user_id}/media",
            {"media_type": "STORIES", "video_url": video_url, "access_token": ig_token},
        )
        story_id = story_container["id"]
        for _ in range(30):
            status = ig_call(
                "GET", story_id, {"fields": "status_code", "access_token": ig_token}
            )
            if status.get("status_code") == "FINISHED":
                break
            if status.get("status_code") == "ERROR":
                raise RuntimeError(f"Story del reel en ERROR: {status}")
            time.sleep(10)
        else:
            raise RuntimeError("Story del reel: timeout esperando el procesamiento")
        ig_call(
            "POST",
            f"{ig_user_id}/media_publish",
            {"creation_id": story_id, "access_token": ig_token},
        )
        story_ok = True
    except Exception as e:  # noqa: BLE001 — el reel ya salió; la story es un plus
        print(f"[warn] story del reel falló: {e}")

    try:
        info = ig_call(
            "GET", media["id"], {"fields": "permalink", "access_token": ig_token}
        )
        return info.get("permalink") or f"media_id {media['id']}", story_ok
    except Exception:  # noqa: BLE001 — el reel ya salió; el permalink es cosmético
        return f"media_id {media['id']}", story_ok


def publish_threads(deal: dict, link: str, threads_user_id: str, threads_token: str, dry: bool,
                    caption: str | None = None, tag: str = "th",
                    text_only: bool = False) -> str | None:
    """Publica la oferta en Threads con el link de afiliado clickeable. Devuelve el permalink o None."""
    if text_only:
        caption = caption or th_text_caption(deal, link)
        image_url = None
    else:
        caption = caption or th_caption(deal, link)
        image_url = prepare_placa(deal, dry, tag=tag) or (ig_image_url(deal["img"]) if deal.get("img") else None)

    if dry:
        print("=" * 60)
        print(f"[DRY] Threads publish → {image_url}\n{caption}")
        return "https://threads.net/DRY_RUN"

    params = {"text": caption, "access_token": threads_token}
    if image_url:
        params["media_type"] = "IMAGE"
        params["image_url"] = image_url
    else:
        params["media_type"] = "TEXT"

    container = ig_call(
        "POST", f"{threads_user_id}/threads", params, base=THREADS_GRAPH
    )
    container_id = container["id"]

    for _ in range(10):
        status = ig_call(
            "GET",
            container_id,
            {"fields": "status", "access_token": threads_token},
            base=THREADS_GRAPH,
        )
        if status.get("status") == "FINISHED":
            break
        if status.get("status") == "ERROR":
            raise RuntimeError(f"Threads container en ERROR: {status}")
        time.sleep(5)

    media = ig_call(
        "POST",
        f"{threads_user_id}/threads_publish",
        {"creation_id": container_id, "access_token": threads_token},
        base=THREADS_GRAPH,
    )
    try:
        info = ig_call(
            "GET",
            media["id"],
            {"fields": "permalink", "access_token": threads_token},
            base=THREADS_GRAPH,
        )
        return info.get("permalink") or f"media_id {media['id']}"
    except Exception:  # noqa: BLE001 — el post ya salió; el permalink es cosmético
        return f"media_id {media['id']}"


def publish_facebook(deal: dict, link: str, page_id: str, page_token: str, dry: bool,
                     caption: str | None = None, tag: str = "fb") -> str | None:
    """Publica la oferta en la página de Facebook con el link de afiliado
    clickeable directo en el texto. Devuelve el permalink o None si falló.

    A diferencia de IG/Threads, la API de páginas de Facebook publica una
    foto en un solo POST (sin contenedor + polling): /{page_id}/photos con
    la imagen y el caption ya la deja publicada.
    """
    caption = caption or fb_caption(deal, link)
    image_url = prepare_placa(deal, dry, tag=tag) or (ig_image_url(deal["img"]) if deal.get("img") else None)

    if dry:
        print("=" * 60)
        print(f"[DRY] Facebook publish → {image_url}\n{caption}")
        return "https://facebook.com/DRY_RUN"

    if not image_url:
        print("[warn] Facebook: la oferta no tiene imagen, salteo publicación")
        return None

    post = ig_call(
        "POST",
        f"{page_id}/photos",
        {"url": image_url, "caption": caption, "access_token": page_token},
        base=FB_GRAPH,
    )
    post_id = post.get("post_id") or post.get("id")
    if not post_id:
        return None
    try:
        info = ig_call(
            "GET", post_id, {"fields": "permalink_url", "access_token": page_token},
            base=FB_GRAPH,
        )
        return info.get("permalink_url") or f"post_id {post_id}"
    except Exception:  # noqa: BLE001 — el post ya salió; el permalink es cosmético
        return f"post_id {post_id}"


def _prune_old_media(directory: Path, keep_days: int = MEDIA_RETENTION_DAYS) -> int:
    """Borra la media que IG/Threads ya consumió, y devuelve cuántos archivos sacó.

    Las APIs descargan el archivo al crear el contenedor y después sirven su
    propia copia, así que la URL de raw.githubusercontent solo hace falta unos
    minutos; guardar dos semanas es margen de sobra. Sin esto el árbol crece
    ~1,5 MB por día para siempre y cada corrida se lo baja entero.

    La fecha sale del nombre (feed-20260726-02.jpg) y no del mtime: en el runner
    todos los archivos quedan con la fecha del checkout. Nombre que no matchea,
    nombre que no se toca.
    """
    limite = (datetime.now(timezone.utc) - timedelta(days=keep_days)).date()
    borrados = 0
    for archivo in sorted(directory.glob("*")):
        if not archivo.is_file():
            continue
        m = re.search(r"(\d{8})", archivo.name)
        if not m:
            continue
        try:
            fecha = datetime.strptime(m.group(1), "%Y%m%d").date()
        except ValueError:
            continue
        if fecha < limite:
            archivo.unlink()
            borrados += 1
    return borrados


def _git_push_file(path: Path, message: str) -> bool:
    """Commitea y pushea un archivo desde el runner (usa las credenciales del checkout)."""
    import subprocess

    repo_root = BASE_DIR.parent
    ident = [
        "-c", "user.name=github-actions[bot]",
        "-c", "user.email=github-actions[bot]@users.noreply.github.com",
    ]
    try:
        borrados = _prune_old_media(path.parent)
        if borrados:
            print(f"[info] limpieza: {borrados} archivo(s) viejo(s) de {path.parent.name}")
        # -A sobre el directorio para que las bajas de la limpieza viajen en el
        # mismo commit que el archivo nuevo.
        subprocess.run(
            ["git", "-C", str(repo_root), "add", "-A", str(path.parent)], check=True
        )
        staged = subprocess.run(
            ["git", "-C", str(repo_root), "diff", "--cached", "--quiet"]
        )
        if staged.returncode == 0:
            return True  # el archivo ya está en el repo sin cambios
        subprocess.run(
            ["git", "-C", str(repo_root), *ident, "commit", "-m", message], check=True
        )
        subprocess.run(
            ["git", "-C", str(repo_root), "-c", "rebase.autoStash=true",
             "pull", "--rebase", "origin", "main"],
            check=True,
        )
        subprocess.run(["git", "-C", str(repo_root), "push", "origin", "main"], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"[warn] git push falló: {e}")
        return False


def publish_story(deal: dict, ig_user_id: str, ig_token: str, dry: bool) -> bool:
    """Genera la placa 9:16 y la publica como story. Best-effort: nunca frena el bot."""
    if not deal.get("img"):
        return False
    try:
        from story import render_story  # requiere Pillow (instalado en el workflow)
    except ImportError:
        print("[warn] Pillow no disponible — salteo la story")
        return False

    req = urllib.request.Request(
        ig_image_url(deal["img"]), headers={"User-Agent": UA}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        image_bytes = resp.read()

    fname = f"story-{datetime.now(timezone.utc).strftime('%Y%m%d-%H')}.jpg"
    out = BASE_DIR / "stories" / fname
    render_story(deal, image_bytes, out)
    if dry:
        print(f"[DRY] story renderizada en {out}")
        return True

    if not _git_push_file(out, "bot: placa de story del día [skip ci]"):
        return False
    repo = os.getenv("GITHUB_REPOSITORY", "Raifelmolero/cazador-de-ofertas-ar")
    public_url = f"https://raw.githubusercontent.com/{repo}/main/bot/stories/{fname}"
    time.sleep(5)  # margen para que raw.githubusercontent sirva el archivo

    container = ig_call(
        "POST",
        f"{ig_user_id}/media",
        {"media_type": "STORIES", "image_url": public_url, "access_token": ig_token},
    )
    for _ in range(10):
        status = ig_call(
            "GET", container["id"], {"fields": "status_code", "access_token": ig_token}
        )
        if status.get("status_code") == "FINISHED":
            break
        if status.get("status_code") == "ERROR":
            raise RuntimeError(f"IG story container en ERROR: {status}")
        time.sleep(5)
    ig_call(
        "POST",
        f"{ig_user_id}/media_publish",
        {"creation_id": container["id"], "access_token": ig_token},
    )
    return True


# ---------------------------------------------------------------- main

def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    cfg = load_config()
    if os.getenv("CHANNEL_OVERRIDE"):
        cfg["channel"] = os.getenv("CHANNEL_OVERRIDE")
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    affiliate_id = os.getenv("ML_AFFILIATE_ID", "")
    dry = os.getenv("DRY_RUN", "0") == "1"

    if not token and not dry:
        print("[fatal] falta TELEGRAM_BOT_TOKEN")
        return 1
    if not affiliate_id:
        print("[warn] ML_AFFILIATE_ID vacío — links sin tracking de afiliado")

    # Etiquetas de atribución por canal (creadas en el Administrador de
    # etiquetas del panel de afiliados con estos nombres exactos).
    tool_tg = os.getenv("ML_WORD_TELEGRAM", "telegram")
    tool_ig = os.getenv("ML_WORD_IG", "instagram")
    tool_th = os.getenv("ML_WORD_THREADS", "threads")
    tool_fb = os.getenv("ML_WORD_FACEBOOK", "facebook")

    state = load_state()
    posted = set(state["posted_ids"])

    deals = fetch_deals(
        pages=cfg.get("pages", 3), relampago_pages=cfg.get("relampago_pages", 0)
    )
    print(f"[info] {len(deals)} ofertas únicas parseadas")

    history = load_price_history()
    annotate_price_history(deals, history)
    save_price_history(history)
    n_low = sum(d["hist_low"] for d in deals)
    n_inf = sum(d["inflada"] for d in deals)
    print(f"[info] historial: {len(history)} productos | {n_low} en mínimo | {n_inf} infladas")
    if deals:
        log_scan(len(deals), n_low, n_inf)

    if len(deals) < 5:
        alert_admin(
            token,
            cfg["admin_chat"],
            "⚠️ Cazador: el scraper trajo menos de 5 ofertas. Revisar si ML cambió el HTML.",
            dry,
        )

    candidates = [
        d
        for d in deals
        if d["discount"] >= cfg.get("min_discount", 25)
        and d["price_cur"] >= cfg.get("min_price", 10000)
        and d["id"] not in posted
        and not d["inflada"]
    ]
    # Ganancia esperada primero (ticket × comisión, con plus por mínimo
    # histórico y relámpago): pocas ventas grandes valen más que muchas chicas.
    candidates.sort(key=ganancia_esperada, reverse=True)
    to_post = candidates[: cfg.get("max_posts", 5)]

    # Las últimas ofertas del lote quedan EXCLUSIVAS del canal: no salen ni en
    # IG (que siempre usa to_post[0], el producto estrella) ni en la web. Es el
    # motivo concreto para sumarse al canal. Se persisten para que sigan fuera
    # de la web en corridas futuras (si no, reaparecerían al día siguiente).
    n_excl = min(cfg.get("exclusive_posts", 0), max(0, len(to_post) - 1))
    for d in to_post[len(to_post) - n_excl:] if n_excl else []:
        d["canal_exclusiva"] = True  # marca para el caption y el filtro de la web
    exclusive_ids = set(state.get("exclusive_ids", []))
    exclusive_ids.update(d["id"] for d in to_post if d.get("canal_exclusiva"))
    state["exclusive_ids"] = list(exclusive_ids)
    print(
        f"[info] {len(candidates)} candidatas nuevas, publico {len(to_post)} "
        f"({n_excl} exclusivas del canal)"
    )

    if deals and os.getenv("SKIP_SITE_DATA") != "1":
        write_site_data(select_site_deals(deals), affiliate_id, exclusive_ids, history)

    published_ids = []
    for deal in to_post:
        link = affiliate_url(deal["url"], affiliate_id, tool_tg)
        if post_deal(token, cfg["channel"], deal, link, dry):
            published_ids.append(deal["id"])
            log_post(deal, "telegram")
            time.sleep(2)

    state["posted_ids"] = state["posted_ids"] + published_ids
    save_state(state)

    hour_utc = datetime.now(timezone.utc).hour

    # Instagram: post de feed + story en los runs de mediodía y tarde
    # (12/17hs ART). El run de la noche (21hs ART) publica el reel en vez
    # del feed — ver bloque de abajo. Si hay credenciales de la API publica
    # solo; si no (o si falla), manda el kit manual.
    slot = run_slot(hour_utc)
    ig_slot = slot in ("midday", "evening")
    if (os.getenv("FORCE_IG_KIT") == "1" or ig_slot) and to_post:
        best = to_post[0]
        best_link = affiliate_url(best["url"], affiliate_id, tool_ig)
        ig_user_id = os.getenv("IG_USER_ID", "")
        ig_token = os.getenv("IG_ACCESS_TOKEN", "")
        if ig_user_id and ig_token:
            try:
                permalink = ig_publish(best, ig_user_id, ig_token, dry)
                if permalink:
                    log_post(best, "ig")
                    alert_admin(
                        token,
                        cfg["admin_chat"],
                        f"✅ Publicado en Instagram: {best['title'][:60]}\n"
                        f"{permalink}\n\n"
                        f"🌐 La página de la bio ya tiene esta oferta "
                        f"(cazadordeofertas.com.ar se actualiza sola).\n\n"
                        f"💡 Tip: story con sticker de link directo al producto:\n"
                        f"{best_link}",
                        dry,
                    )
                else:
                    send_ig_kit(token, cfg["admin_chat"], best, best_link, dry)
            except Exception as e:  # noqa: BLE001 — IG caído no frena el bot
                print(f"[error] IG publish falló: {e}")
                alert_admin(
                    token,
                    cfg["admin_chat"],
                    f"⚠️ No pude publicar en Instagram ({str(e)[:150]}). "
                    f"Te mando el kit manual.",
                    dry,
                )
                send_ig_kit(token, cfg["admin_chat"], best, best_link, dry)
            try:
                if publish_story(best, ig_user_id, ig_token, dry):
                    log_post(best, "story")
                    destacado = sugerir_destacado(best["title"])
                    msg = "📱 Story del día publicada ✅"
                    if destacado:
                        msg += f"\n💡 Destacado sugerido: {destacado}"
                    alert_admin(token, cfg["admin_chat"], msg, dry)
            except Exception as e:  # noqa: BLE001 — la story es best-effort
                print(f"[warn] story falló: {e}")
                alert_admin(
                    token,
                    cfg["admin_chat"],
                    f"⚠️ La story de hoy no salió ({str(e)[:120]}). El post del feed sí está OK.",
                    dry,
                )
        else:
            send_ig_kit(token, cfg["admin_chat"], best, best_link, dry)

    # Reel diario: reemplaza el post de feed en el run de la noche (21hs ART
    # = 0-2 UTC), para no sumar volumen total sobre el feed. FORCE_REEL=1
    # lo fuerza en cualquier horario (test manual vía workflow_dispatch).
    if (os.getenv("FORCE_REEL") == "1" or slot == "night") and to_post:
        r_deal = to_post[0]
        r_user_id = os.getenv("IG_USER_ID", "")
        r_token = os.getenv("IG_ACCESS_TOKEN", "")
        if r_user_id and r_token:
            try:
                permalink, story_ok = publish_reel(r_deal, r_user_id, r_token, dry)
                if permalink:
                    log_post(r_deal, "reel")
                    msg = f"🎬 Reel publicado ✅\n{permalink}"
                    if story_ok:
                        log_post(r_deal, "story")
                        msg += "\n📱 También salió como story."
                        destacado = sugerir_destacado(r_deal["title"])
                        if destacado:
                            msg += f"\n💡 Destacado sugerido: {destacado}"
                    try:  # YouTube Shorts / TikTok: solo con credenciales cargadas
                        import shorts
                        extra = shorts.cross_post(
                            Path(r_deal["_reel_path"]), r_deal, site_url("youtube"),
                            {"youtube": affiliate_url(
                                r_deal["url"], affiliate_id,
                                os.getenv("ML_WORD_YOUTUBE", "youtube"))},
                            dry,
                        )
                        if extra:
                            msg += "\n" + "\n".join(extra)
                    except Exception as e:  # noqa: BLE001 — jamás frena el resto
                        print(f"[warn] cross-post de shorts: {e}")
                    alert_admin(token, cfg["admin_chat"], msg, dry)
            except Exception as e:  # noqa: BLE001 — experimental, jamás frena el resto
                print(f"[error] reel falló: {e}")
                alert_admin(
                    token, cfg["admin_chat"], f"⚠️ El reel no salió ({str(e)[:150]}).", dry
                )

    # Threads: 3/día reutilizando los runs existentes.
    #   mediodía (15-17 UTC) y noche (0-2 UTC): post con placa
    #   tarde (20-22 UTC): post de solo texto conversacional (el algoritmo lo premia)
    # Best-effort total: nunca frena Telegram/IG, si falla solo avisa al admin.
    th_text_mode = slot == "evening" and os.getenv("FORCE_THREADS") != "1"
    if (os.getenv("FORCE_THREADS") == "1" or slot != "other") and to_post:
        threads_user_id = os.getenv("THREADS_USER_ID", "")
        threads_token = os.getenv("THREADS_ACCESS_TOKEN", "")
        if threads_user_id and threads_token:
            th_deal = to_post[0]
            th_link = affiliate_url(th_deal["url"], affiliate_id, tool_th)
            try:
                permalink = publish_threads(
                    th_deal, th_link, threads_user_id, threads_token, dry,
                    text_only=th_text_mode,
                )
                if permalink:
                    log_post(th_deal, "threads_texto" if th_text_mode else "threads")
                    alert_admin(
                        token,
                        cfg["admin_chat"],
                        f"🧵 Publicado en Threads: {th_deal['title'][:60]}\n{permalink}",
                        dry,
                    )
            except Exception as e:  # noqa: BLE001 — Threads caído no frena el bot
                print(f"[warn] Threads publish falló: {e}")
                alert_admin(
                    token,
                    cfg["admin_chat"],
                    f"⚠️ No pude publicar en Threads ({str(e)[:150]}).",
                    dry,
                )

    # Facebook: mismo horario que el post de feed de IG (15-17-20-21-22 UTC),
    # siempre el producto estrella (to_post[0]). Best-effort total: nunca
    # frena Telegram/IG/Threads, si falla solo avisa al admin. Sin secrets
    # seteados (mientras no exista la página) esto no hace nada, no hace
    # falta un flag de gateo aparte — FORCE_FACEBOOK es solo para testear.
    if (os.getenv("FORCE_FACEBOOK") == "1" or ig_slot) and to_post:
        fb_page_id = os.getenv("FB_PAGE_ID", "")
        fb_page_token = os.getenv("FB_PAGE_ACCESS_TOKEN", "")
        if fb_page_id and fb_page_token:
            fb_deal = to_post[0]
            fb_link = affiliate_url(fb_deal["url"], affiliate_id, tool_fb)
            try:
                permalink = publish_facebook(fb_deal, fb_link, fb_page_id, fb_page_token, dry)
                if permalink:
                    log_post(fb_deal, "facebook")
                    alert_admin(
                        token,
                        cfg["admin_chat"],
                        f"📘 Publicado en Facebook: {fb_deal['title'][:60]}\n{permalink}",
                        dry,
                    )
            except Exception as e:  # noqa: BLE001 — Facebook caído no frena el bot
                print(f"[warn] Facebook publish falló: {e}")
                alert_admin(
                    token,
                    cfg["admin_chat"],
                    f"⚠️ No pude publicar en Facebook ({str(e)[:150]}).",
                    dry,
                )

    print(f"[done] publicadas {len(published_ids)} ofertas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
