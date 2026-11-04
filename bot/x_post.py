"""Publicador de X (@cazaofertazas): un tuit por corrida con un producto que está
en el precio más bajo que registramos, con link a su ficha /precio del sitio
(la tarjeta de X toma la imagen OG de la página). Ver docs/PLAN-DIRECTOR-AGENTES.md.

Usa la API oficial (POST /2/tweets, OAuth 1.0a) con los secrets X_API_KEY,
X_API_SECRET, X_ACCESS_TOKEN y X_ACCESS_SECRET. Sin claves, o con --dry, solo
imprime el tuit. No repite un producto en 7 días (lo anota en posts_log, canal «x»).
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SEGUIMIENTO = RAIZ / "frontend" / "data" / "seguimiento.json"
POSTS_LOG = RAIZ / "bot" / "state" / "posts_log.jsonl"
URL_TWEET = "https://api.x.com/2/tweets"
SITIO = "https://cazadordeofertas.com.ar"
DIAS_SIN_REPETIR = 7
MIN_DIAS_HISTORIA = 3
MIN_DESCUENTO = 15


def elegir(items: dict, hoy: date, ya: set[str]) -> dict | None:
    """El producto visto hoy, en su mínimo registrado con al menos 3 días de
    historia, con el mayor ahorro en pesos frente al precio de lista."""
    mejores = []
    for mla, it in items.items():
        serie = it.get("serie") or []
        if mla in ya or it.get("ultimo_visto") != hoy.isoformat() or len(serie) < MIN_DIAS_HISTORIA:
            continue
        # Se compara contra el precio más alto que vimos nosotros, no contra el
        # tachado de ML (puede estar inflado: es justo lo que denunciamos).
        precio, lista = serie[-1][1], max(p for _, p in serie)
        if precio > it.get("min", precio) or precio >= lista:
            continue
        desc = round(100 * (lista - precio) / lista)
        if desc < MIN_DESCUENTO:
            continue
        mejores.append((lista - precio, mla, it, precio, lista, desc))
    if not mejores:
        return None
    _, mla, it, precio, lista, desc = max(mejores, key=lambda m: m[0])
    return {"id": mla, "titulo": it["titulo"], "slug": it["slug"], "precio": precio, "lista": lista,
            "desc": desc, "dias": len(it["serie"])}


def pesos(n: int) -> str:
    return "$" + f"{n:,}".replace(",", ".")


def texto_tuit(p: dict) -> str:
    titulo = p["titulo"] if len(p["titulo"]) <= 90 else p["titulo"][:87].rstrip() + "…"
    return (f"📉 Precio más bajo que registramos en {p['dias']} días de seguimiento\n\n"
            f"{titulo}\n{pesos(p['precio'])} (lo vimos a {pesos(p['lista'])}: -{p['desc']} % real)\n\n"
            f"Historial y link 👉 {SITIO}/precio/{p['slug']}?utm_source=x")


def ya_publicados(lineas: list[str], ahora: datetime) -> set[str]:
    desde = ahora - timedelta(days=DIAS_SIN_REPETIR)
    out = set()
    for ln in lineas:
        try:
            p = json.loads(ln)
            if p.get("ch") == "x" and datetime.fromisoformat(p["ts"]) >= desde:
                out.add(p["id"])
        except (ValueError, KeyError, TypeError):
            continue
    return out


def _pct(s) -> str:
    return urllib.parse.quote(str(s), safe="~-._")


def oauth1_header(method: str, url: str, creds: dict) -> str:
    oauth = {
        "oauth_consumer_key": creds["api_key"], "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1", "oauth_timestamp": str(int(time.time())),
        "oauth_token": creds["access_token"], "oauth_version": "1.0",
    }
    param_str = "&".join(f"{_pct(k)}={_pct(v)}" for k, v in sorted(oauth.items()))
    base = "&".join([method.upper(), _pct(url), _pct(param_str)])
    clave = f"{_pct(creds['api_secret'])}&{_pct(creds['access_secret'])}"
    oauth["oauth_signature"] = base64.b64encode(hmac.new(clave.encode(), base.encode(), hashlib.sha1).digest()).decode()
    return "OAuth " + ", ".join(f'{_pct(k)}="{_pct(v)}"' for k, v in sorted(oauth.items()))


def publicar(texto: str, creds: dict) -> str:
    req = urllib.request.Request(URL_TWEET, data=json.dumps({"text": texto}).encode(), headers={
        "Authorization": oauth1_header("POST", URL_TWEET, creds), "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return str(json.load(r)["data"]["id"])


def main(argv=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    ahora = datetime.now(timezone.utc)
    hoy = (ahora - timedelta(hours=3)).date()
    items = json.loads(SEGUIMIENTO.read_text(encoding="utf-8"))["items"]
    try:
        lineas = POSTS_LOG.read_text(encoding="utf-8").splitlines()
    except OSError:
        lineas = []
    p = elegir(items, hoy, ya_publicados(lineas, ahora))
    if not p:
        print("Hoy no hay ningún producto en mínimo histórico para tuitear.")
        return 0
    texto = texto_tuit(p)
    print(texto)
    nombres = {"api_key": "X_API_KEY", "api_secret": "X_API_SECRET",
               "access_token": "X_ACCESS_TOKEN", "access_secret": "X_ACCESS_SECRET"}
    creds = {k: (os.environ.get(v) or "").strip() for k, v in nombres.items()}
    if "--dry" in argv or not all(creds.values()):
        print("[ensayo] No se publicó (falta --publicar o faltan las claves de X).")
        return 0
    tid = publicar(texto, creds)
    with POSTS_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"ts": ahora.isoformat(timespec="seconds"), "ch": "x", "id": p["id"],
                            "title": p["titulo"], "discount": p["desc"], "price": p["precio"],
                            "low": True, "tweet": tid}, ensure_ascii=False) + "\n")
    print(f"Publicado: https://x.com/cazaofertazas/status/{tid}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
