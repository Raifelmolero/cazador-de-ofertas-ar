"""Auditoría semanal del sitio: respuesta HTTP, canonical, noindex, datos
estructurados (JSON-LD) y cabeceras de seguridad. Solo lee cazadordeofertas.com.ar
(no toca Mercado Libre) y manda un resumen PRIVADO al admin por Telegram. No publica nada.

Uso: python bot/tools/auditoria_semanal.py [--dry]
"""
from __future__ import annotations

import json
import os
import random
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITIO = "https://cazadordeofertas.com.ar"
UA = "Mozilla/5.0 (CazadorAuditoriaSemanal)"
MUESTRA = 80
CLAVE = ["/", "/hoy", "/guias", "/cyber-monday", "/black-friday", "/dia-de-la-madre", "/aliexpress"]
CABECERAS = ["strict-transport-security", "x-content-type-options", "x-frame-options",
             "referrer-policy", "permissions-policy"]


def get(url: str) -> tuple[int, dict, str]:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status, {k.lower(): v for k, v in r.headers.items()}, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, {}, ""
    except Exception:  # noqa: BLE001
        return 0, {}, ""


def urls_sitemap() -> list[str]:
    _, _, xml = get(f"{SITIO}/sitemap.xml")
    return re.findall(r"<loc>([^<]+)</loc>", xml)


def revisar(url: str) -> list[str]:
    st, _, html = get(url)
    if st != 200:
        return [f"HTTP {st}"]
    problemas = []
    if re.search(r'<meta[^>]+name="robots"[^>]+noindex', html, re.I):
        problemas.append("noindex")
    m = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', html, re.I)
    if not m:
        problemas.append("sin canonical")
    elif not m.group(1).startswith(SITIO):
        problemas.append("canonical a otro dominio")
    if "application/ld+json" not in html:
        problemas.append("sin JSON-LD")
    return problemas


def main() -> None:
    dry = "--dry" in sys.argv
    urls = urls_sitemap()
    muestra = [SITIO + p for p in CLAVE] + random.sample(urls, min(MUESTRA, len(urls)))
    fallas: dict[str, list[str]] = {}
    for u in muestra:
        p = revisar(u)
        if p:
            fallas[u] = p
    _, headers, _ = get(SITIO + "/")
    faltan = [h for h in CABECERAS if h not in headers]

    lineas = [f"🔎 Auditoría semanal del sitio",
              f"URLs en sitemap: {len(urls)} · revisadas: {len(muestra)} · con problemas: {len(fallas)}"]
    for u, p in list(fallas.items())[:8]:
        lineas.append(f"• {u.replace(SITIO, '') or '/'}: {', '.join(p)}")
    if len(fallas) > 8:
        lineas.append(f"… y {len(fallas) - 8} más")
    lineas.append("Cabeceras de seguridad: " + ("OK" if not faltan else "faltan " + ", ".join(faltan)))
    texto = "\n".join(lineas)
    sys.stdout.buffer.write((texto + chr(10)).encode("utf-8"))
    if dry:
        return
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    admin = json.loads((ROOT / "bot" / "config.json").read_text(encoding="utf-8"))["admin_chat"]
    if not token:
        print("[warn] sin TELEGRAM_BOT_TOKEN: no se envía")
        return
    data = json.dumps({"chat_id": admin, "text": texto}).encode()
    req = urllib.request.Request(f"https://api.telegram.org/bot{token}/sendMessage", data=data,
                                 headers={"Content-Type": "application/json"})
    urllib.request.urlopen(req, timeout=20).read()


if __name__ == "__main__":
    main()
