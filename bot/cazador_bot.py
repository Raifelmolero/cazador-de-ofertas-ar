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
                "moneda": "ARS",
                "ventas_estimadas": None,
                "url_producto": affiliate_url(d["url"], affiliate_id),
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

def affiliate_url(url: str, affiliate_id: str) -> str:
    if not affiliate_id:
        return url
    sep = "&" if "?" in url else "?"
    return f"{url}{sep}matt_word={affiliate_id}&matt_tool=37267219"


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
    return (
        f"🔥 <b>{deal['discount']}% OFF</b> — {esc(deal['title'])}\n\n"
        f"❌ Antes: <s>{fmt_price(deal['price_prev'])}</s>\n"
        f"✅ Ahora: <b>{fmt_price(deal['price_cur'])}</b>\n"
        f"💸 Te ahorrás {fmt_price(ahorro)}\n\n"
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
        f"#ofertas #descuentos #mercadolibre #argentina #cazadordeofertas"
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


def ig_call(method: str, path: str, params: dict) -> dict:
    """Llamada a la Instagram API (Instagram Login). Devuelve el JSON parseado."""
    query = urllib.parse.urlencode(params)
    if method == "GET":
        req = urllib.request.Request(f"{IG_GRAPH}/{path}?{query}")
    else:
        req = urllib.request.Request(f"{IG_GRAPH}/{path}", data=query.encode())
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        raise RuntimeError(f"IG API {e.code} en /{path}: {body[:300]}") from e


def ig_image_url(img: str) -> str:
    """Tarjeta de ML (thumbnail .webp) → imagen grande en JPEG (IG exige JPEG)."""
    out = img.replace("D_Q_NP_", "D_NQ_NP_")
    out = re.sub(r"-[A-Z]{1,2}\.webp$", "-F.jpg", out)
    out = re.sub(r"\.webp$", ".jpg", out)
    return out


def ig_caption(deal: dict) -> str:
    ahorro = deal["price_prev"] - deal["price_cur"]
    return (
        f"🔥 ¡{deal['discount']}% OFF! {deal['title'][:80]}\n\n"
        f"❌ Antes: {fmt_price(deal['price_prev'])}\n"
        f"✅ Ahora: {fmt_price(deal['price_cur'])}\n"
        f"💸 Te ahorrás {fmt_price(ahorro)}\n\n"
        f"👉 Link en la bio: esta y todas las ofertas cazadas 🎯\n"
        f"⚡ Stock y precio pueden volar\n\n"
        f"#ofertas #descuentos #mercadolibre #argentina #ahorro "
        f"#cazadordeofertas #ofertasargentina"
    )


def ig_publish(deal: dict, ig_user_id: str, ig_token: str, dry: bool) -> str | None:
    """Publica la oferta en el feed de IG. Devuelve el permalink o None si falló."""
    if not deal.get("img"):
        print("[warn] IG: la oferta no tiene imagen, salteo publicación")
        return None
    caption = ig_caption(deal)
    image_url = ig_image_url(deal["img"])
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
    try:
        info = ig_call(
            "GET", media["id"], {"fields": "permalink", "access_token": ig_token}
        )
        return info.get("permalink") or f"media_id {media['id']}"
    except Exception:  # noqa: BLE001 — el post ya salió; el permalink es cosmético
        return f"media_id {media['id']}"


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

    state = load_state()
    posted = set(state["posted_ids"])

    deals = fetch_deals(pages=cfg.get("pages", 3))
    print(f"[info] {len(deals)} ofertas únicas parseadas")

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
    ]
    candidates.sort(key=lambda d: d["discount"], reverse=True)
    to_post = candidates[: cfg.get("max_posts", 3)]
    print(f"[info] {len(candidates)} candidatas nuevas, publico {len(to_post)}")

    published_ids = []
    for deal in to_post:
        link = affiliate_url(deal["url"], affiliate_id)
        if post_deal(token, cfg["channel"], deal, link, dry):
            published_ids.append(deal["id"])
            time.sleep(2)

    state["posted_ids"] = state["posted_ids"] + published_ids
    save_state(state)

    # Instagram: en el run del mediodía ART (15h UTC) o forzado.
    # Si hay credenciales de la API publica solo; si no (o si falla), manda el kit manual.
    hour_utc = datetime.now(timezone.utc).hour
    if (os.getenv("FORCE_IG_KIT") == "1" or hour_utc in (15, 16, 17)) and to_post:
        best = to_post[0]
        best_link = affiliate_url(best["url"], affiliate_id)
        ig_user_id = os.getenv("IG_USER_ID", "")
        ig_token = os.getenv("IG_ACCESS_TOKEN", "")
        if ig_user_id and ig_token:
            try:
                permalink = ig_publish(best, ig_user_id, ig_token, dry)
                if permalink:
                    alert_admin(
                        token,
                        cfg["admin_chat"],
                        f"✅ Publicado en Instagram: {best['title'][:60]}\n"
                        f"{permalink}\n\n"
                        f"📎 30 seg para sumarlo a tu vidriera de la bio:\n"
                        f"1) Copiá esta URL:\n{best['url']}\n"
                        f"2) Pegala en el Generador:\n"
                        f"https://www.mercadolibre.com.ar/afiliados/linkbuilder#hub\n\n"
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
        else:
            send_ig_kit(token, cfg["admin_chat"], best, best_link, dry)

    print(f"[done] publicadas {len(published_ids)} ofertas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
