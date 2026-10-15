"""
Chequeo diario de salud de los tokens (solo lectura).

Prueba cada credencial con una llamada que NO la rota ni publica nada, y avisa
por Telegram privado al admin si alguna dejó de andar. Así un token vencido se
entera el mismo día y no cuando un canal lleva días sin publicar.

Qué hace con cada una:
  - Telegram, Instagram, Threads, Facebook: GET de identidad (/me, getMe).
  - Mercado Libre: client_credentials con ML_CLIENT_ID/SECRET (valida la app).
    El ML_REFRESH_TOKEN NO se prueba: usarlo lo rota y pisaría al del workflow.
  - YouTube: refresh_token de Google (no rota).
  - TikTok: solo que el secret exista (usar su refresh_token lo rota).

Un secret ausente es "sin configurar" (aviso, no falla). Un secret presente
que la API rechaza es "caído" (falla y alerta).

Lo corre salud_tokens.yml una vez por día. Uso: python bot/salud_tokens.py [--dry]
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

ADMIN_CHAT = "8701191351"
TIMEOUT = 20

OK, CAIDO, SIN_CONFIG = "ok", "caido", "sin_config"


def http_json(url: str, data: dict | None = None) -> tuple[int, dict]:
    """GET (o POST form si hay data). Devuelve (status, json); nunca levanta."""
    body = urllib.parse.urlencode(data).encode() if data is not None else None
    req = urllib.request.Request(url, data=body)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            raw, status = r.read(), r.status
    except urllib.error.HTTPError as e:
        raw, status = e.read(), e.code
    except Exception as e:  # noqa: BLE001
        return 0, {"error": type(e).__name__}
    try:
        return status, json.loads(raw or b"{}")
    except ValueError:
        return status, {}


def _q(**kw) -> str:
    return urllib.parse.urlencode(kw)


def chequeos(env, http=http_json) -> list[tuple[str, str, str]]:
    """Lista de (nombre, estado, detalle). `env` es un dict (os.environ en prod)."""
    out: list[tuple[str, str, str]] = []

    def get(k: str) -> str:
        return (env.get(k) or "").strip()

    def probar(nombre, url, data=None, ok=lambda s, j: s == 200 and "error" not in j):
        s, j = http(url, data)
        if ok(s, j):
            out.append((nombre, OK, ""))
        else:
            err = j.get("error")
            if isinstance(err, dict):
                err = err.get("message") or err.get("code")
            out.append((nombre, CAIDO, f"HTTP {s}" + (f" ({err})" if err else "")))

    def falta(nombre, *claves):
        faltan = [c for c in claves if not get(c)]
        if faltan:
            out.append((nombre, SIN_CONFIG, "falta " + ", ".join(faltan)))
            return True
        return False

    if not falta("Telegram", "TELEGRAM_BOT_TOKEN"):
        probar("Telegram", f"https://api.telegram.org/bot{get('TELEGRAM_BOT_TOKEN')}/getMe",
               ok=lambda s, j: s == 200 and j.get("ok") is True)

    if not falta("Instagram", "IG_ACCESS_TOKEN"):
        probar("Instagram", "https://graph.instagram.com/me?" + _q(fields="id", access_token=get("IG_ACCESS_TOKEN")))

    if not falta("Threads", "THREADS_ACCESS_TOKEN"):
        probar("Threads", "https://graph.threads.net/me?" + _q(fields="id", access_token=get("THREADS_ACCESS_TOKEN")))

    if not falta("Facebook", "FB_PAGE_ACCESS_TOKEN"):
        probar("Facebook", "https://graph.facebook.com/me?" + _q(fields="id", access_token=get("FB_PAGE_ACCESS_TOKEN")))

    if not falta("MercadoLibre app", "ML_CLIENT_ID", "ML_CLIENT_SECRET"):
        probar("MercadoLibre app", "https://api.mercadolibre.com/oauth/token",
               data={"grant_type": "client_credentials", "client_id": get("ML_CLIENT_ID"),
                     "client_secret": get("ML_CLIENT_SECRET")},
               ok=lambda s, j: s == 200 and bool(j.get("access_token")))

    # El refresh_token de ML rota al usarse: solo se verifica que exista.
    out.append(("MercadoLibre usuario", OK if get("ML_REFRESH_TOKEN") else SIN_CONFIG,
                "" if get("ML_REFRESH_TOKEN") else "falta ML_REFRESH_TOKEN"))

    if not falta("YouTube", "YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"):
        probar("YouTube", "https://oauth2.googleapis.com/token",
               data={"grant_type": "refresh_token", "client_id": get("YT_CLIENT_ID"),
                     "client_secret": get("YT_CLIENT_SECRET"), "refresh_token": get("YT_REFRESH_TOKEN")},
               ok=lambda s, j: s == 200 and bool(j.get("access_token")))

    # TikTok rota el refresh_token: solo presencia.
    if not falta("TikTok", "TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"):
        out.append(("TikTok", OK, "solo presencia (su refresh_token rota al usarse)"))

    return out


def resumen(res: list[tuple[str, str, str]]) -> str:
    iconos = {OK: "🟢", CAIDO: "🔴", SIN_CONFIG: "⚪"}
    return "\n".join(f"{iconos[e]} {n}" + (f": {d}" if d else "") for n, e, d in res)


def main(argv=None, env=None, http=http_json, notificar=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    env = os.environ if env is None else env
    dry = "--dry" in argv
    res = chequeos(env, http)
    print(resumen(res))
    caidos = [r for r in res if r[1] == CAIDO]
    if not caidos:
        return 0
    texto = ("🔴 Salud de tokens: hay credenciales que dejaron de andar.\n" + resumen(caidos)
             + "\nRegenerarlas y actualizar el secret en GitHub.")
    if dry:
        print("[DRY] " + texto)
    else:
        token = (env.get("TELEGRAM_BOT_TOKEN") or "").strip()
        if token:
            enviar = notificar or (lambda t: http(
                f"https://api.telegram.org/bot{token}/sendMessage", {"chat_id": ADMIN_CHAT, "text": t}))
            enviar(texto)
    return 1


if __name__ == "__main__":
    sys.exit(main())
