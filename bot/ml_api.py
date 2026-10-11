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

Con el token client_credentials de la app (sin permisos de usuario) ML responde
403 PA_UNAUTHORIZED_RESULT_FROM_POLICIES en highlights, /search e /items (sonda
bot/tools/probe_ml_api.py, workflow "Probe ML API"). Lo que SÍ da 200 con ese
token es el catálogo, y por ahí se arma el plan C (fetch_deals_catalogo):

  GET /trends/MLA/{CATEGORY_ID}      tendencias de la categoría (lista de ~50;
                                     se asume [{"keyword": ..., "url": ...}]).
  GET /products/search?status=active&site_id=MLA&q={keyword}&limit=N
                                     productos de catálogo (results[]: id,
                                     name, domain_id, pictures, ...).
  GET /products/{id}/items           ofertas del producto (results[]: item_id,
                                     price, original_price?, condition,
                                     shipping.free_shipping, seller_id, ...).
  GET /products/{id}                 solo si la búsqueda no trajo nombre/foto.

Del catálogo NO se garantiza un precio anterior: si el item no trae
original_price (ni sale_price.regular_amount) la oferta queda con price_prev ==
price_cur y discount 0 — sin inventar nada. El bot la deja afuera de las
publicaciones (min_discount) pero sigue alimentando historial de precios,
testigo y seguimiento.

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
            "Authorization": f"Bearer {token}", "Accept": "application/json",
            "User-Agent": "Mozilla/5.0"})
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


# ---------------------------------------------------------------- plan C: catálogo

# Presupuesto por corrida: ~7 trends + ~28 búsquedas + el resto /products/{id}/items.
MAX_LLAMADAS = 250
PAUSA_S = 0.1              # entre llamadas, para no pegarle fuerte a la API
KEYWORDS_POR_CAT = 4
PRODUCTOS_POR_KEYWORD = 5
FALLOS_SEGUIDOS_MAX = 6    # 403/429/5xx en fila → se corta la etapa
# Un "precio anterior" que implica más de 80% OFF es casi siempre un dato basura
# (o una publicación trucha): se ignora y la oferta queda sin descuento.
DESCUENTO_MAX_CREIBLE = 80


def _num(v) -> float | None:
    """Número positivo desde int/float/str/{"amount": ...}; None si no se puede."""
    if isinstance(v, bool):
        return None
    if isinstance(v, dict):
        v = v.get("amount", v.get("value"))
        if isinstance(v, (dict, bool)):
            return None
    if isinstance(v, str):
        try:
            v = float(v)
        except ValueError:
            return None
    if isinstance(v, (int, float)) and v == v and v > 0:
        return float(v)
    return None


def _precios_item(it: dict) -> tuple[float | None, float | None]:
    """(precio actual, precio anterior o None) de un item de catálogo."""
    cur = _num(it.get("price"))
    prev = _num(it.get("original_price"))
    sp = it.get("sale_price")
    if isinstance(sp, dict):
        monto, regular = _num(sp.get("amount")), _num(sp.get("regular_amount"))
        if monto and regular and regular > monto:
            cur, prev = monto, regular
        elif cur is None:
            cur = monto
    if cur is None:
        return None, None
    if prev is not None and (prev <= cur or (prev - cur) * 100 / prev > DESCUENTO_MAX_CREIBLE):
        prev = None
    return cur, prev


def _envio_gratis(it: dict) -> bool | None:
    sh = it.get("shipping")
    if isinstance(sh, dict) and isinstance(sh.get("free_shipping"), bool):
        return sh["free_shipping"]
    return None


def _mejor_item(items: list) -> dict | None:
    """El item nuevo (en ARS) con mejor precio; a igual precio, el de envío gratis."""
    mejor, clave = None, None
    for it in items or []:
        if not isinstance(it, dict):
            continue
        cond = it.get("condition")
        if cond is not None and str(cond).lower() != "new":
            continue
        moneda = it.get("currency_id")
        if moneda is not None and str(moneda).upper() != "ARS":
            continue
        cur, _ = _precios_item(it)
        if cur is None:
            continue
        k = (cur, 0 if _envio_gratis(it) else 1)
        if clave is None or k < clave:
            mejor, clave = it, k
    return mejor


def _https(u) -> str | None:
    if not isinstance(u, str) or not u.strip():
        return None
    return u.strip().replace("http://", "https://", 1)


def _imagen(producto: dict, item: dict) -> str | None:
    pics = producto.get("pictures")
    if isinstance(pics, list):
        for p in pics:
            if isinstance(p, dict):
                u = _https(p.get("secure_url") or p.get("url"))
                if u:
                    return u
    return _https(item.get("secure_thumbnail") or item.get("thumbnail"))


def item_catalogo_to_deal(producto: dict, item: dict) -> dict | None:
    """Producto de catálogo + su mejor item → dict con el formato de parse_cards.

    id = id del producto de catálogo (igual que parse_cards con links /p/MLA...,
    estable aunque cambie el ganador de la compra). Sin precio anterior no hay
    descuento: price_prev == price_cur y discount 0 (el filtro del bot lo deja
    fuera de las publicaciones). Extras opcionales: fuente, envio_gratis, seller_id.
    """
    try:
        pid = str(producto.get("id") or "")
        if not re.fullmatch(r"MLA\d{4,}", pid):
            return None
        titulo = str(producto.get("name") or producto.get("title") or item.get("title") or "").strip()
        cur, prev = _precios_item(item)
        if not titulo or cur is None:
            return None
        url = None
        for cand in (item.get("permalink"), producto.get("permalink")):
            cand = _https(cand)
            if cand and "mercadolibre.com" in cand:
                url = cand.split("?")[0].split("#")[0]
                break
        if not url:
            url = f"https://www.mercadolibre.com.ar/p/{pid}"
        cur_i = int(round(cur))
        prev_i = int(round(prev)) if prev else cur_i
        if prev_i <= cur_i:
            prev_i, desc = cur_i, 0
        else:
            desc = int(round((prev_i - cur_i) * 100 / prev_i))
        seller = item.get("seller_id")
        if isinstance(seller, dict):
            seller = seller.get("id")
        return {
            "relampago": bool(item.get("deal_ids")),
            "id": pid,
            "title": titulo,
            "url": url,
            "price_prev": prev_i,
            "price_cur": cur_i,
            "discount": desc,
            "img": _imagen(producto, item),
            "fuente": "catalogo",
            "envio_gratis": _envio_gratis(item),
            "seller_id": str(seller) if seller else None,
        }
    except (TypeError, ValueError):
        return None


def _keywords(r) -> list[str]:
    """Keywords de /trends/MLA/{cat}: tolera [{"keyword": ...}], ["texto"] o {"results": [...]}."""
    if isinstance(r, dict):
        for k in ("results", "trends", "content", "keywords"):
            if isinstance(r.get(k), list):
                r = r[k]
                break
    out: list[str] = []
    vistas: set[str] = set()
    for e in r if isinstance(r, list) else []:
        if isinstance(e, dict):
            e = e.get("keyword") or e.get("query") or e.get("name") or e.get("term")
        if isinstance(e, str):
            e = " ".join(e.split())
            if 2 <= len(e) <= 80 and e.lower() not in vistas:
                vistas.add(e.lower())
                out.append(e)
    return out


class _Llamador:
    """Cuenta llamadas, pausa entre ellas y corta ante fallos seguidos."""

    def __init__(self, token, request, max_llamadas, pausa):
        self.token, self.request = token, request
        self.restantes, self.pausa = max_llamadas, pausa
        self.fallos = 0
        self.total = 0

    @property
    def cortado(self) -> bool:
        return self.restantes <= 0 or self.fallos >= FALLOS_SEGUIDOS_MAX

    def get(self, path: str):
        if self.cortado:
            return None
        self.restantes -= 1
        self.total += 1
        if self.pausa:
            time.sleep(self.pausa)
        r = _get(path, self.token, self.request)
        self.fallos = 0 if r is not None else self.fallos + 1
        return r


def _intercalar(listas: list[list[dict]]) -> list[dict]:
    """Un producto de cada categoría por vuelta (sin repetir ids)."""
    out, vistos = [], set()
    for i in range(max((len(x) for x in listas), default=0)):
        for lista in listas:
            if i < len(lista):
                pid = str(lista[i]["id"])
                if pid not in vistos:
                    vistos.add(pid)
                    out.append(lista[i])
    return out


def fetch_deals_catalogo(token: str, categories: list[str] | None = None, limit: int = 100,
                         request=_request, *, keywords_por_cat: int = KEYWORDS_POR_CAT,
                         productos_por_kw: int = PRODUCTOS_POR_KEYWORD,
                         max_llamadas: int = MAX_LLAMADAS, pausa: float = PAUSA_S) -> list[dict]:
    """Ofertas armadas con endpoints de catálogo (los que acepta el token de la app).

    por categoría: /trends/MLA/{cat} → keywords → /products/search?q=keyword →
    por producto /products/{id}/items → mejor item nuevo → deal. Defensivo con
    campos faltantes; loguea solo conteos y códigos HTTP, nunca el token.
    """
    ll = _Llamador(token, request, max_llamadas, pausa)
    cats = [c for c in (categories or DEFAULT_CATEGORIES) if isinstance(c, str) and c]
    por_cat: list[list[dict]] = []
    n_kw = 0
    for cat in cats:
        kws = _keywords(ll.get(f"/trends/MLA/{urllib.parse.quote(cat)}"))[:keywords_por_cat]
        n_kw += len(kws)
        prods: list[dict] = []
        for kw in kws:
            r = ll.get("/products/search?" + urllib.parse.urlencode(
                {"status": "active", "site_id": "MLA", "q": kw, "limit": productos_por_kw}))
            res = r.get("results") if isinstance(r, dict) else None
            for p in res if isinstance(res, list) else []:
                if isinstance(p, dict) and p.get("id") and str(p.get("status", "active")).lower() == "active":
                    prods.append(p)
        por_cat.append(prods)
    candidatos = _intercalar(por_cat)
    if not candidatos:
        print(f"[warn] ml_api: catálogo sin productos ({n_kw} keywords, {ll.total} llamadas)")
        return []
    deals: list[dict] = []
    for p in candidatos:
        if ll.cortado or len(deals) >= limit * 2:
            break
        pid = urllib.parse.quote(str(p["id"]))
        r = ll.get(f"/products/{pid}/items")
        items = r.get("results") if isinstance(r, dict) else None
        item = _mejor_item(items) if isinstance(items, list) else None
        if item is None:
            continue
        if not (p.get("name") or p.get("title")):
            # La búsqueda no trajo nombre: completar desde la ficha del producto.
            ficha = ll.get(f"/products/{pid}")
            if isinstance(ficha, dict):
                p = {**ficha, **{k: v for k, v in p.items() if v}}
        d = item_catalogo_to_deal(p, item)
        if d:
            deals.append(d)
    # Con descuento real primero, mayor % primero (sort estable: el resto conserva orden).
    deals.sort(key=lambda d: d["discount"], reverse=True)
    deals = deals[:limit]
    con_desc = sum(1 for d in deals if d["discount"] > 0)
    print(f"[info] ml_api: catálogo → {len(candidatos)} productos, {len(deals)} ofertas "
          f"({con_desc} con precio anterior real), {ll.total} llamadas"
          + (" [cortado por fallos/presupuesto]" if ll.cortado else ""))
    return deals


# ---------------------------------------------------------------- orquestador

def _fetch_deals_highlights(token: str, categories: list[str], limit: int, request) -> list[dict]:
    """Plan A: /highlights + /items?ids= (requiere token de usuario; con el de
    app da 403). Se rinde a la primera falla para no gastar llamadas."""
    ids: list[str] = []
    for cat in categories:
        r = _get(f"/highlights/MLA/category/{cat}", token, request)
        if r is None:
            if not ids:
                return []
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
        if r is None and not deals:
            return []
        for entry in r or []:
            if isinstance(entry, dict) and entry.get("code") == 200:
                d = item_to_deal(entry.get("body") or {})
                if d:
                    deals.append(d)
    return deals[:limit]


def fetch_deals_api(categories: list[str] | None = None, limit: int = 100, request=_request) -> list[dict]:
    """Ofertas vía API oficial. Lista vacía (con log) ante cualquier problema.

    Primero highlights + multiget (da descuento real, pero exige token de
    usuario); si no hay permiso, el catálogo (trends → products/search →
    products/{id}/items), que sí responde con el token de la app.
    """
    token = get_token(request)
    if not token:
        return []
    cats = list(categories or DEFAULT_CATEGORIES)
    deals = _fetch_deals_highlights(token, cats, limit, request)
    if deals:
        print(f"[info] ml_api: {len(deals)} ofertas vía API oficial (highlights)")
        return deals
    print("[info] ml_api: highlights sin resultados; pruebo el catálogo")
    return fetch_deals_catalogo(token, cats, limit, request)
