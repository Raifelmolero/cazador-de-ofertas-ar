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
"""
from __future__ import annotations

import json
import os
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


def get_token(request=_request) -> str | None:
    """Token client_credentials (cacheado). None si falla o no hay credenciales."""
    if not has_credentials():
        return None
    if _TOKEN["value"] and time.time() < _TOKEN["exp"]:
        return _TOKEN["value"]
    body = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "client_id": os.environ["ML_CLIENT_ID"],
        "client_secret": os.environ["ML_CLIENT_SECRET"],
    }).encode()
    try:
        r = request(f"{API}/oauth/token", data=body, headers={
            "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"})
    except urllib.error.HTTPError as e:
        print(f"[warn] ml_api: token rechazado (HTTP {e.code}); revisar ML_CLIENT_ID/ML_CLIENT_SECRET")
        return None
    except Exception as e:  # noqa: BLE001
        print(f"[warn] ml_api: no se pudo pedir token: {type(e).__name__}")
        return None
    tok = r.get("access_token")
    if not tok:
        print("[warn] ml_api: respuesta de token sin access_token")
        return None
    _TOKEN.update(value=tok, exp=time.time() + max(60, int(r.get("expires_in", 21600)) - 300))
    return tok


def _get(path: str, token: str, request=_request):
    try:
        return request(f"{API}{path}", headers={
            "Authorization": f"Bearer {token}", "Accept": "application/json"})
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            print(f"[warn] ml_api: HTTP {e.code} en {path.split('?')[0]} — "
                  "la app no tiene permiso para este recurso o el token no sirve")
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
