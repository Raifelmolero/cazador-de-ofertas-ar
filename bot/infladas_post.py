"""
Post semanal "descuentos truchos": los 3 casos más escandalosos de
frontend/data/infladas.json (ofertas que anuncian descuento pero ya las
registramos más baratas antes), con link a /descuentos-inflados.

Sin links de afiliado: es contenido de confianza, igual que la página.
Publica en Telegram (canal) y Threads (solo texto), best-effort cada uno,
y avisa al admin. Lo dispara infladas_post.yml (domingos) o a mano.
"""

import json
import os
import sys
from datetime import date
from pathlib import Path

from cazador_bot import (
    SITE_DOMAIN,
    alert_admin,
    esc,
    fmt_price,
    load_config,
    publish_threads,
    tg_call,
)

INFLADAS = Path(__file__).resolve().parent.parent / "frontend" / "data" / "infladas.json"
CASOS = 3
MAX_DIAS = 3  # si el archivo es más viejo, no publicamos datos rancios


def pagina(source: str) -> str:
    return f"https://{SITE_DOMAIN}/descuentos-inflados?utm_source={source}&utm_campaign=truchos"


def fecha_corta(iso: str | None) -> str:
    if not iso:
        return ""
    y, m, d = iso[:10].split("-")
    return f"{d}/{m}"


def elegir(data: dict, hoy: date) -> list[dict]:
    """Los casos a publicar, o [] si el archivo está vacío o viejo."""
    try:
        edad = (hoy - date.fromisoformat(data.get("fecha", ""))).days
    except ValueError:
        return []
    if edad > MAX_DIAS:
        return []
    return data.get("items", [])[:CASOS]


def linea(c: dict, html: bool) -> str:
    titulo = c["titulo"]
    if len(titulo) > 60:  # corta en la última palabra entera, sin "| " colgando
        titulo = titulo[:60].rsplit(" ", 1)[0].rstrip(" |-,/") + "…"
    if html:
        titulo = f"<b>{esc(titulo)}</b>"
    cuando = fecha_corta(c.get("minimo_fecha"))
    return (
        f"{titulo}\n"
        f"Anuncia {c['descuento_anunciado']}% OFF → {fmt_price(c['precio_hoy'])}, "
        f"pero el {cuando} lo registramos a {fmt_price(c['minimo_registrado'])} "
        f"({c['diferencia_pct']}% menos)."
    )


def texto_telegram(casos: list[dict]) -> str:
    cuerpo = "\n\n".join(f"{i}. {linea(c, html=True)}" for i, c in enumerate(casos, 1))
    return (
        "🚩 <b>Descuentos truchos de la semana</b>\n\n"
        "Ofertas de Mercado Libre que anuncian descuento, pero ya estuvieron "
        "más baratas antes según nuestro registro de precios:\n\n"
        f"{cuerpo}\n\n"
        "Si te interesa alguno, conviene esperar. La lista completa se actualiza "
        f"todos los días: {pagina('telegram')}"
    )


def texto_threads(casos: list[dict]) -> str:
    """Threads corta en 500 caracteres: se sacan casos hasta que entre."""
    for n in range(len(casos), 0, -1):
        cuerpo = "\n\n".join(f"{i}. {linea(c, html=False)}" for i, c in enumerate(casos[:n], 1))
        t = (
            "🚩 Descuentos truchos de la semana en Mercado Libre:\n\n"
            f"{cuerpo}\n\n"
            f"Lista completa: {SITE_DOMAIN}/descuentos-inflados"
        )
        if len(t) <= 500:
            return t
    return ""


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    casos = elegir(json.loads(INFLADAS.read_text(encoding="utf-8")), date.today())
    if not casos:
        print("[truchos] sin casos recientes: no se publica")
        return 0

    results = []
    msg = texto_telegram(casos)
    if dry:
        print("=" * 60 + "\n[DRY] Telegram\n" + msg)
        results.append("Telegram (dry)")
    elif token:
        try:
            tg_call(token, "sendMessage", {
                "chat_id": cfg["channel"], "text": msg, "parse_mode": "HTML",
                "disable_web_page_preview": False,
            })
            results.append("Telegram ✅")
        except Exception as e:  # noqa: BLE001 — que un canal no frene al otro
            results.append(f"Telegram ❌ {str(e)[:150]}")

    th_user, th_token = os.getenv("THREADS_USER_ID", ""), os.getenv("THREADS_ACCESS_TOKEN", "")
    th = texto_threads(casos)
    if th and (dry or (th_user and th_token)):
        try:
            permalink = publish_threads({}, "", th_user, th_token, dry, caption=th, text_only=True)
            results.append(f"Threads ✅ {permalink}")
        except Exception as e:  # noqa: BLE001
            results.append(f"Threads ❌ {str(e)[:150]}")

    summary = "🚩 Post de descuentos truchos:\n" + "\n".join(results)
    alert_admin(token, cfg["admin_chat"], summary, dry)
    print(summary)
    return 0


if __name__ == "__main__":
    sys.exit(main())
