"""Sonda de solo lectura: qué endpoints de la API de ML acepta el token de la app.
Imprime solo códigos HTTP y claves de la respuesta; nunca tokens ni secrets."""
import json
import os
import sys
import urllib.error
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import ml_api  # noqa: E402

API = ml_api.API
tok = ml_api.get_token()
print("token:", "OK" if tok else "NO")
if not tok:
    sys.exit(0)

PRUEBAS = [
    "@PRODUCTOS",
    "/users/me",
    "/sites/MLA",
    "/sites/MLA/categories",
    "/categories/MLA1055",
    "/highlights/MLA/category/MLA1055",
    "/sites/MLA/search?category=MLA1055&limit=5",
    "/sites/MLA/search?q=celular&limit=5",
    "/products/search?status=active&site_id=MLA&q=celular&limit=5",
    "/trends/MLA",
    "/trends/MLA/MLA1055",
    "/items/MLA1",
    "/sites/MLA/domain_discovery/search?q=celular",
]
def _get(path):
    req = urllib.request.Request(API + path, headers={
        "Authorization": f"Bearer {tok}", "Accept": "application/json", "User-Agent": "Mozilla/5.0"})
    return json.loads(urllib.request.urlopen(req, timeout=20).read().decode())


try:
    pid = _get("/products/search?status=active&site_id=MLA&q=celular&limit=1")["results"][0]["id"]
    PRUEBAS += [f"/products/{pid}", f"/products/{pid}/items", f"/products/{pid}/items?limit=3"]
except Exception as e:  # noqa: BLE001
    print("sin producto de catalogo:", type(e).__name__)
PRUEBAS = [x for x in PRUEBAS if x != "@PRODUCTOS"]
for path in PRUEBAS:
    req = urllib.request.Request(API + path, headers={
        "Authorization": f"Bearer {tok}", "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.loads(r.read().decode())
            claves = list(data.keys())[:6] if isinstance(data, dict) else f"lista[{len(data)}]"
            print(f"{path} -> {r.status} {claves}")
    except urllib.error.HTTPError as e:
        try:
            cod = json.loads(e.read().decode()).get("code") or ""
        except Exception:  # noqa: BLE001
            cod = ""
        print(f"{path} -> {e.code} {cod}")
    except Exception as e:  # noqa: BLE001
        print(f"{path} -> error {type(e).__name__}")

