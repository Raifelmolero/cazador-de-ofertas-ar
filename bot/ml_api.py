"""Fuente de ofertas por API OFICIAL de Mercado Libre (plan B del scraping).

Se usa solo si existen los secrets ML_CLIENT_ID y ML_CLIENT_SECRET (app creada
en developers.mercadolibre.com.ar) y el scraping de /ofertas devolvió 0.

Endpoints (documentación pública; NO pude verificarlos desde el sandbox, que
no llega a ML, y developers.mercadolibre.com.ar devolvió 403 al fetch —
confirmar contra la doc vigente con la app ya creada):

  POST /oauth/token  (grant_type=client_credentials)  token de app, ~6 h.
  GET  /highlights/MLA/category/{CATEGORY_ID}         más vendidos por
       categoría (devuelve ids MLA). Requiere token. Es lo más cercano a
       "destacados" que expone la API.
  GET  /items?ids=MLA1,MLA2,...  (hasta 20)           multiget: price,
       original_price, thumbnail, permalink, deal_ids. Requiere token.
  GET  /sites/MLA/search?q=...&category=...           búsqueda. Desde 2025 ML
       restringe /search: puede dar 403 para apps sin permiso/certificación.
       Por eso NO es la vía principal acá.
  GET  /sites/MLA/categories                           árbol de categorías.

No existe endpoint público documentado de "ofertas del día / relámpago"
equivalente a la página /ofertas. Por eso las "ofertas" se derivan de
destacados + multiget filtrando original_price > price.

Permisos: 401 = token vencido/invalido; 403 = la app no tiene permiso para
ese recurso (hay que pedirlo/certificar la app). En ambos casos se devuelve
lista vacía con log claro y NUNCA se levanta excepción.

Token de USUARIO (plan B si client_credentials da 403 PA_UNAUTHORIZED_...):
si además de ML_CLIENT_ID/ML_CLIENT_SECRET existe ML_REFRESH_TOKEN, se pide
el token con grant_type=refresh_token (el de la cuenta dueña de la app, que
tiene más permisos que el de la app sola). Los refresh tokens de ML ROTAN
(cada uso devuelve uno nuevo y el anterior deja de servir): el nuevo se
escribe en el archivo ML_REFRESH_TOKEN_OUT para que el workflow lo guarde
como secret (ver docs/ML-API-TOKEN-USUARIO.md). Si el refresh falla se cae
a client_credentials, como antes. Los valores de tokens NUNCA se imprimen.
"""
from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.mercadolibre.com"
# Categorías raíz de ticket alto en MLA (electro, celulares, computación, TV...).
DEFAULT_CATEGORIES = ["MLA1055", "MLA1000", "MLA1648", "MLA5726", "MLA1051", "MLA1574", "MLA1276"]
_TOKEN: dict = {"value": None, "exp": 0.0}


def has_credentials() -> bool:
    return bool(os.getenv("ML_CLIENT_ID") and os.getenv("ML_CLIENT_SECRET"))


def _request(url: str, data: bytes | None = None, headers: dict | None = None, timeout: int = 20):
    req = urllib.request.Request(url, data=data, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def has_user_token() -> bool:
    """Hay refresh token de usuario (además de client id/secret)."""
    return has_credentials() and bool(os.getenv("ML_REFRESH_TOKEN"))


def _motivo(e: urllib.error.HTTPError) -> str:
    """Código `error` de la respuesta (p.ej. invalid_grant), nunca valores sensibles."""
    try:
        cod = str(json.loads(e.read().decode("utf-8", "replace")).get("error", ""))
    except Exception:  # noqa: BLE001
        return ""
    return cod if re.fullmatch(r"[A-Za-z0-9_.\- ]{1,60}", cod) else ""


def _form(**campos: str) -> bytes:
    return urllib.parse.urlencode(campos).encode()


_FORM_HEADERS = {"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"}


def _cachear(r: dict) -> str:
    tok = r["access_token"]
    _TOKEN.update(value=tok, exp=time.time() + max(60, int(r.get("expires_in", 21600)) - 300))
    return tok


def _guardar_refresh_nuevo(nuevo: str) -> None:
    """Escribe el refresh token rotado en ML_REFRESH_TOKEN_OUT (sin imprimirlo)."""
    ruta = os.getenv("ML_REFRESH_TOKEN_OUT")
    if not ruta:
        print("[warn] ml_api: ML rotó el refresh_token pero ML_REFRESH_TOKEN_OUT no está definido: "
              "el nuevo se pierde y el actual ya no sirve; hay que volver a correr "
              "bot/tools/ml_obtener_token.py")
        return
    try:
        with open(ruta, "w", encoding="utf-8") as f:
            f.write(nuevo)
        try:
            os.chmod(ruta, 0o600)
        except OSError:
            pass
    except OSError as e:
        print(f"[warn] ml_api: ML rotó el refresh_token y no pude guardarlo ({type(e).__name__}); "
              "hay que volver a correr bot/tools/ml_obtener_token.py")
        return
    print("[info] ml_api: ML rotó el refresh_token; el nuevo quedó en el archivo para el workflow")


def _token_refresh(request) -> str | None:
    """Token de usuario (grant refresh_token). None si falla (se cae a client_credentials)."""
    actual = os.environ["ML_REFRESH_TOKEN"]
    body = _form(grant_type="refresh_token", client_id=os.environ["ML_CLIENT_ID"],
                 client_secret=os.environ["ML_CLIENT_SECRET"], refresh_token=actual)
    try:
        r = request(f"{API}/oauth/token", data=body, headers=_FORM_HEADERS)
    except urllib.error.HTTPError as e:
        motivo = _motivo(e)
        print(f"[warn] ml_api: refresh_token rechazado (HTTP {e.code}"
              f"{' ' + motivo if motivo else ''}); si es invalid_grant hay que volver a correr "
              "bot/tools/ml_obtener_token.py. Sigo con client_credentials")
        return None
    except Exception as e:  # noqa: BLE001
        print(f"[warn] ml_api: no se pudo renovar el token de usuario: {type(e).__name__}")
        return None
    if not isinstance(r, dict) or not r.get("access_token"):
        print("[warn] ml_api: la renovación no devolvió access_token; sigo con client_credentials")
        return None
    nuevo = r.get("refresh_token")
    if nuevo and nuevo != actual:
        _guardar_refresh_nuevo(str(nuevo))
    else:
        print("[info] ml_api: token de usuario renovado (el refresh_token no cambió)")
    return _cachear(r)


def _token_app(request) -> str | None:
    body = _form(grant_type="client_credentials", client_id=os.environ["ML_CLIENT_ID"],
                 client_secret=os.environ["ML_CLIENT_SECRET"])
    try:
        r = request(f"{API}/oauth/token", data=body, headers=_FORM_HEADERS)
    except urllib.error.HTTPError as e:
        print(f"[warn] ml_api: token rechazado (HTTP {e.code}); revisar ML_CLIENT_ID/ML_CLIENT_SECRET")
        return None
    except Exception as e:  # noqa: BLE001
        print(f"[warn] ml_api: no se pudo pedir token: {type(e).__name__}")
        return None
    if not r.get("access_token"):
        print("[warn] ml_api: respuesta de token sin access_token")
        return None
    return _cachear(r)


def get_token(request=_request) -> str | None:
    """Token cacheado: de usuario (refresh_token) si hay ML_REFRESH_TOKEN, si no o si
    falla, client_credentials. None si no hay credenciales o ambos fallan."""
    if not has_credentials():
        return None
    if _TOKEN["value"] and time.time() < _TOKEN["exp"]:
        return _TOKEN["value"]
    if os.getenv("ML_REFRESH_TOKEN"):
        tok = _token_refresh(request)
        if tok:
            return tok
    return _token_app(request)


def _get(path: str, token: str, request=_request):
    try:
        return request(f"{API}{path}", headers={
            "Authorization": f"Bearer {token}", "Accept": "application/json"})
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            try:
                cuerpo = e.read().decode("utf-8", "replace")[:300].replace(chr(10), " ")
            except Exception:  # noqa: BLE001
                cuerpo = ""
            print(f"[warn] ml_api: HTTP {e.code} en {path.split('?')[0]} — "
                  f"la app no tiene permiso para este recurso o el token no sirve | {cuerpo}")
        else:
            print(f"[warn] ml_api: HTTP {e.code} en {path.split('?')[0]}")
        return None
    except Exception as e:  # noqa: BLE001
        print(f"[warn] ml_api: error en {path.split('?')[0]}: {type(e).__name__}")
        return None


def item_to_deal(it: dict) -> dict | None:
    """Item de /items → dict con el formato de parse_cards (o None si no es oferta)."""
    try:
        cur, prev = it.get("price"), it.get("original_price")
        if not cur or not prev or cur >= prev:
            return None
        url = (it.get("permalink") or "").split("?")[0].split("#")[0]
        if not url or not it.get("id") or not it.get("title"):
            return None
        return {
            "relampago": bool(it.get("deal_ids")),
            "id": str(it["id"]),
            "title": str(it["title"]).strip(),
            "url": url,
            "price_prev": int(round(prev)),
            "price_cur": int(round(cur)),
            "discount": int(round((prev - cur) * 100 / prev)),
            "img": (it.get("thumbnail") or "").replace("http://", "https://") or None,
        }
    except (TypeError, ValueError):
        return None


def fetch_deals_api(categories: list[str] | None = None, limit: int = 100, request=_request) -> list[dict]:
    """Ofertas vía API oficial. Lista vacía (con log) ante cualquier problema."""
    token = get_token(request)
    if not token:
        return []
    ids: list[str] = []
    for cat in categories or DEFAULT_CATEGORIES:
        r = _get(f"/highlights/MLA/category/{cat}", token, request)
        if r is None:
            continue
        for c in r.get("content", []) or []:
            if c.get("type", "ITEM") == "ITEM" and c.get("id") and c["id"] not in ids:
                ids.append(c["id"])
    if not ids:
        print("[warn] ml_api: sin ids de destacados (¿permiso 403 o categorías vacías?)")
        return []
    deals: list[dict] = []
    for i in range(0, min(len(ids), 400), 20):
        r = _get("/items?ids=" + ",".join(ids[i:i + 20]), token, request)
        for entry in r or []:
            if isinstance(entry, dict) and entry.get("code") == 200:
                d = item_to_deal(entry.get("body") or {})
                if d:
                    deals.append(d)
    deals = deals[:limit]
    print(f"[info] ml_api: {len(deals)} ofertas vía API oficial")
    return deals
