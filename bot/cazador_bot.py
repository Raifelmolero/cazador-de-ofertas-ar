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
from datetime import datetime, timezone
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

def fetch_deals(pages: int = 3) -> list[dict]:
    """Baja y parsea las páginas de ofertas. Devuelve lista de deals."""
    deals, seen = [], set()
    for page in range(1, pages + 1):
        try:
            html = http_get(OFERTAS_URL.format(page=page)).decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001 — red hostil, seguimos con lo que haya
            print(f"[warn] página {page} falló: {e}")
            continue
        page_deals = parse_cards(html)
        for d in page_deals:
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


def write_site_data(deals: list[dict], affiliate_id: str) -> None:
    """Actualiza el JSON de CalculadoraML con las ofertas del día."""
    word_web = os.getenv("ML_WORD_WEB", "web")
    items = []
    for d in deals:
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
    badge = (
        "📉 <b>El precio más bajo que registramos</b>\n"
        if deal.get("hist_low")
        else ""
    )
    return (
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
        "inline_keyboard": [[{"text": "🛒 Ver oferta en ML", "url": link}]]
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


def ig_caption(deal: dict) -> str:
    ahorro = deal["price_prev"] - deal["price_cur"]
    hook = "📉 MÍNIMO HISTÓRICO" if deal.get("hist_low") else random.choice(IG_HOOKS)
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
        f"🛒 ¿Lo querés? Tocá el link de mi bio → cazadordeofertas.com.ar y lo ves ahí.\n"
        f"💾 Guardá este post si lo estás pensando.\n"
        f"📤 Mandáselo a quien lo estaba buscando.\n\n"
        f"⏳ En ML los precios cambian sin aviso: cuando vuelve a subir, no avisan.\n"
        f"📲 Por eso tengo un canal de Telegram (@cazadordeofertasar) donde mando "
        f"las ofertas apenas las encuentro, antes que acá.\n\n"
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
        f"{remate}"
    )
    if len(caption) > 500:
        caption = (
            f"{hook} {deal['discount']}% OFF en {deal['title'][:60]}\n\n"
            f"De {fmt_price(deal['price_prev'])} a {fmt_price(deal['price_cur'])} 💸\n\n"
            f"🛒 {link}"
        )
    return caption


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
            {"message": "🛒 Lo conseguís tocando el link de mi bio → cazadordeofertas.com.ar ⚡",
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


def publish_reel(deal: dict, ig_user_id: str, ig_token: str, dry: bool) -> str | None:
    """Genera el reel del día (bot/reel.py) y lo publica como REELS en IG.

    Experimental: solo corre con FORCE_REEL=1 (workflow_dispatch) hasta que
    el dueño apruebe el formato. Requiere ffmpeg en el runner.
    """
    if not deal.get("img"):
        print("[warn] Reel: la oferta no tiene imagen, salteo")
        return None
    from reel import render_reel  # requiere Pillow + ffmpeg

    req = urllib.request.Request(ig_image_url(deal["img"]), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        image_bytes = resp.read()

    fname = f"reel-{datetime.now(timezone.utc).strftime('%Y%m%d-%H')}.mp4"
    out = BASE_DIR / "reels" / fname
    render_reel(deal, image_bytes, out)
    if dry:
        print(f"[DRY] reel renderizado en {out}")
        return None

    if not _git_push_file(out, "bot: reel del día [skip ci]"):
        return None
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
    try:
        info = ig_call(
            "GET", media["id"], {"fields": "permalink", "access_token": ig_token}
        )
        return info.get("permalink") or f"media_id {media['id']}"
    except Exception:  # noqa: BLE001 — el reel ya salió; el permalink es cosmético
        return f"media_id {media['id']}"


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


def _git_push_file(path: Path, message: str) -> bool:
    """Commitea y pushea un archivo desde el runner (usa las credenciales del checkout)."""
    import subprocess

    repo_root = BASE_DIR.parent
    ident = [
        "-c", "user.name=github-actions[bot]",
        "-c", "user.email=github-actions[bot]@users.noreply.github.com",
    ]
    try:
        subprocess.run(["git", "-C", str(repo_root), "add", str(path)], check=True)
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

    state = load_state()
    posted = set(state["posted_ids"])

    deals = fetch_deals(pages=cfg.get("pages", 3))
    print(f"[info] {len(deals)} ofertas únicas parseadas")

    history = load_price_history()
    annotate_price_history(deals, history)
    save_price_history(history)
    n_low = sum(d["hist_low"] for d in deals)
    n_inf = sum(d["inflada"] for d in deals)
    print(f"[info] historial: {len(history)} productos | {n_low} en mínimo | {n_inf} infladas")
    if deals:
        log_scan(len(deals), n_low, n_inf)

    if deals and os.getenv("SKIP_SITE_DATA") != "1":
        write_site_data(deals, affiliate_id)

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
    # mínimos históricos primero, después por % OFF
    candidates.sort(key=lambda d: (d["hist_low"], d["discount"]), reverse=True)
    to_post = candidates[: cfg.get("max_posts", 3)]
    print(f"[info] {len(candidates)} candidatas nuevas, publico {len(to_post)}")

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
    ig_hours = (15, 16, 17, 20, 21, 22)
    if (os.getenv("FORCE_IG_KIT") == "1" or hour_utc in ig_hours) and to_post:
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
                    alert_admin(token, cfg["admin_chat"], "📱 Story del día publicada ✅", dry)
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
    reel_hours = (0, 1, 2)
    if (os.getenv("FORCE_REEL") == "1" or hour_utc in reel_hours) and to_post:
        r_deal = to_post[0]
        r_user_id = os.getenv("IG_USER_ID", "")
        r_token = os.getenv("IG_ACCESS_TOKEN", "")
        if r_user_id and r_token:
            try:
                permalink = publish_reel(r_deal, r_user_id, r_token, dry)
                if permalink:
                    log_post(r_deal, "reel")
                    alert_admin(
                        token, cfg["admin_chat"], f"🎬 Reel publicado ✅\n{permalink}", dry
                    )
            except Exception as e:  # noqa: BLE001 — experimental, jamás frena el resto
                print(f"[error] reel falló: {e}")
                alert_admin(
                    token, cfg["admin_chat"], f"⚠️ El reel no salió ({str(e)[:150]}).", dry
                )

    # Threads: 3/día reutilizando los runs existentes.
    #   mediodía (15-17 UTC) y noche (0-2 UTC): post con placa
    #   tarde (20-22 UTC): post de solo texto conversacional (el algoritmo lo premia)
    # Best-effort total: nunca frena Telegram/IG, si falla solo avisa al admin.
    th_text_mode = hour_utc in (20, 21, 22) and os.getenv("FORCE_THREADS") != "1"
    th_hours = (15, 16, 17, 20, 21, 22, 0, 1, 2)
    if (os.getenv("FORCE_THREADS") == "1" or hour_utc in th_hours) and to_post:
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

    print(f"[done] publicadas {len(published_ids)} ofertas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
