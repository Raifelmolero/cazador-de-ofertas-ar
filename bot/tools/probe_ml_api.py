"""Sonda de solo lectura: qué endpoints de la API de ML acepta el token de la app.

Imprime solo códigos HTTP, claves y TIPOS de las respuestas (nunca tokens ni
secrets). Tres partes:
  1. Códigos de una lista de endpoints (qué da 200 y qué 403).
  2. ESTRUCTURA de /trends/MLA/{cat}, /products/search, /products/{id} y
     /products/{id}/items: claves y tipos, para confirmar el formato que asume
     ml_api.fetch_deals_catalogo (¿viene original_price?, ¿permalink?, ¿seller?).
  3. Corrida de punta a punta de fetch_deals_catalogo con presupuesto chico.
Lo corre el workflow "Probe ML API" a mano.
"""
import collections
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import ml_api  # noqa: E402

API = ml_api.API
CAT = "MLA1055"

# Claves cuyo VALOR se imprime (enumerados chicos, no sensibles). El resto: solo tipo.
ENUMS = {"condition", "currency_id", "status", "listing_type_id", "domain_id", "free_shipping",
         "logistic_type", "mode", "query_type", "site_id", "type", "quality_type"}

PRUEBAS = [
    "/users/me",
    "/sites/MLA",
    "/sites/MLA/categories",
    f"/categories/{CAT}",
    f"/highlights/MLA/category/{CAT}",
    f"/sites/MLA/search?category={CAT}&limit=5",
    "/sites/MLA/search?q=celular&limit=5",
    "/products/search?status=active&site_id=MLA&q=celular&limit=5",
    "/trends/MLA",
    f"/trends/MLA/{CAT}",
    "/items/MLA1",
    "/sites/MLA/domain_discovery/search?q=celular",
]


def get(path, tok):
    req = urllib.request.Request(API + path, headers={
        "Authorization": f"Bearer {tok}", "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())


def intentar(path, tok):
    """(dato, None) si dio 200; (None, 'HTTP 403 CODIGO') si no."""
    try:
        return get(path, tok), None
    except urllib.error.HTTPError as e:
        try:
            cod = json.loads(e.read().decode()).get("code") or ""
        except Exception:  # noqa: BLE001
            cod = ""
        return None, f"HTTP {e.code} {cod}".strip()
    except Exception as e:  # noqa: BLE001
        return None, f"error {type(e).__name__}"


def forma(v, prof=3):
    """Estructura de un JSON: claves y tipos; valores solo de los ENUMS."""
    if isinstance(v, dict):
        if prof <= 0:
            return f"dict[{len(v)}]"
        out = {}
        for k in list(v)[:40]:
            x = v[k]
            if k in ENUMS and (isinstance(x, (str, bool)) or x is None):
                out[str(k)] = x
            else:
                out[str(k)] = forma(x, prof - 1)
        if len(v) > 40:
            out["..."] = f"+{len(v) - 40} claves"
        return out
    if isinstance(v, list):
        return [f"list[{len(v)}]"] + ([forma(v[0], prof - 1)] if v and prof > 0 else [])
    if v is None:
        return "null"
    return type(v).__name__


def mostrar(titulo, v, prof=3):
    txt = json.dumps(forma(v, prof), ensure_ascii=False)
    print(f"{titulo}: {txt[:1800]}{'...' if len(txt) > 1800 else ''}")


def parte_codigos(tok):
    print("== CODIGOS ==")
    for path in PRUEBAS:
        data, err = intentar(path, tok)
        if err:
            print(f"{path} -> {err}")
        else:
            claves = list(data.keys())[:6] if isinstance(data, dict) else f"lista[{len(data)}]"
            print(f"{path} -> 200 {claves}")


def parte_estructura(tok):
    print("== ESTRUCTURA ==")
    tr, err = intentar(f"/trends/MLA/{CAT}", tok)
    if err:
        print(f"/trends/MLA/{CAT} -> {err}")
    else:
        mostrar(f"/trends/MLA/{CAT}", tr, 2)
        print("keywords que extrae ml_api._keywords:", len(ml_api._keywords(tr)))
    kw = (ml_api._keywords(tr) or ["celular"])[0] if tr else "celular"
    q = urllib.parse.urlencode({"status": "active", "site_id": "MLA", "q": kw, "limit": 5})
    bus, err = intentar(f"/products/search?{q}", tok)
    if err:
        print(f"/products/search -> {err}")
        return
    mostrar("/products/search (top)", {k: v for k, v in bus.items() if k != "results"}, 2)
    res = bus.get("results") or []
    print(f"/products/search results: {len(res)}")
    if res:
        mostrar("/products/search results[0]", res[0], 3)
    conteo = collections.Counter()
    enums = collections.defaultdict(collections.Counter)
    n_items = 0
    primera_ficha = primer_items = False
    for p in res[:5]:
        pid = p.get("id") if isinstance(p, dict) else None
        if not pid:
            continue
        if not primera_ficha:
            ficha, err = intentar(f"/products/{pid}", tok)
            if err:
                print(f"/products/{{id}} -> {err}")
            else:
                mostrar("/products/{id}", ficha, 2)
                primera_ficha = True
        its, err = intentar(f"/products/{pid}/items", tok)
        if err:
            print(f"/products/{{id}}/items -> {err}")
            continue
        if not primer_items:
            mostrar("/products/{id}/items (top)", {k: v for k, v in its.items() if k != "results"}, 2)
            primer_items = True
        for it in its.get("results") or []:
            if not isinstance(it, dict):
                continue
            n_items += 1
            if n_items == 1:
                mostrar("/products/{id}/items results[0]", it, 4)
            for k in ("price", "original_price", "sale_price", "deal_ids", "permalink", "thumbnail",
                      "title", "seller_id", "item_id", "id", "shipping", "condition", "currency_id"):
                if it.get(k) not in (None, "", [], {}):
                    conteo[k] += 1
            sh = it.get("shipping")
            if isinstance(sh, dict) and "free_shipping" in sh:
                conteo["shipping.free_shipping"] += 1
            if it.get("original_price") and it.get("price") and it["original_price"] > it["price"]:
                conteo["original_price>price"] += 1
            for k in ("condition", "currency_id", "listing_type_id"):
                if isinstance(it.get(k), str):
                    enums[k][it[k]] += 1
    print(f"items revisados: {n_items} | presencia de campos: {dict(conteo)}")
    print(f"enumerados: { {k: dict(v) for k, v in enums.items()} }")


def parte_end_to_end(tok):
    print("== PUNTA A PUNTA (fetch_deals_catalogo, 60 llamadas) ==")
    deals = ml_api.fetch_deals_catalogo(tok, [CAT, "MLA1000"], limit=30, max_llamadas=60)
    con = [d for d in deals if d["discount"] > 0]
    print(f"deals: {len(deals)} | con descuento real: {len(con)} | "
          f"con envio gratis: {sum(1 for d in deals if d.get('envio_gratis'))}")
    for d in (con or deals)[:5]:
        print(f"  {d['id']} ${d['price_cur']} (antes ${d['price_prev']}, {d['discount']}% OFF) "
              f"{d['title'][:50]}")


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    tok = ml_api.get_token()
    print("token:", "OK" if tok else "NO")
    if not tok:
        return 0
    for parte in (parte_codigos, parte_estructura, parte_end_to_end):
        try:
            parte(tok)
        except Exception as e:  # noqa: BLE001 — la sonda nunca debe tirar el workflow
            print(f"[{parte.__name__}] error {type(e).__name__}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
