"""Tendencias de búsqueda de Mercado Libre Argentina → frontend/data/tendencias.json.

Usa solo endpoints que acepta el token de la app (/trends/MLA y /trends/MLA/{cat}),
sin precios ni descuentos: el sitio los muestra como "lo que más se busca hoy" con
un link de búsqueda de ML etiquetado (ver components/TendenciasML.tsx). No pisa el
archivo si ML devuelve muy pocas keywords. Nunca imprime tokens.
"""
from __future__ import annotations

import json
import sys
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import ml_api  # noqa: E402

SALIDA = Path(__file__).resolve().parents[2] / "frontend" / "data" / "tendencias.json"
MAX_ITEMS = 36
MIN_ITEMS = 10  # menos que esto = respuesta rara de ML: no pisar lo anterior


def juntar(listas: list[list[str]], maximo: int = MAX_ITEMS) -> list[str]:
    """Intercala las listas (una keyword de cada una por vuelta) sin repetir."""
    out: list[str] = []
    vistas: set[str] = set()
    i = 0
    while len(out) < maximo and any(i < len(l) for l in listas):
        for l in listas:
            if i < len(l) and len(out) < maximo:
                k = l[i]
                if k.lower() not in vistas:
                    vistas.add(k.lower())
                    out.append(k)
        i += 1
    return out


def armar(listas: list[list[str]], ahora: datetime | None = None) -> dict | None:
    kws = juntar(listas)
    if len(kws) < MIN_ITEMS:
        return None
    ahora = ahora or datetime.now(timezone.utc)
    return {"actualizado": ahora.isoformat(timespec="seconds"),
            "items": [{"keyword": k} for k in kws]}


def main(request=ml_api._request, salida: Path = SALIDA) -> int:
    tok = ml_api.get_token(request)
    if not tok:
        print("[warn] tendencias: sin token de ML; no actualizo")
        return 0
    listas = [ml_api._keywords(ml_api._get("/trends/MLA", tok, request))]
    for cat in ml_api.DEFAULT_CATEGORIES:
        listas.append(ml_api._keywords(
            ml_api._get(f"/trends/MLA/{urllib.parse.quote(cat)}", tok, request))[:12])
    datos = armar(listas)
    if not datos:
        print("[warn] tendencias: ML devolvió muy pocas keywords; dejo el archivo como estaba")
        return 0
    salida.parent.mkdir(parents=True, exist_ok=True)
    salida.write_text(json.dumps(datos, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"[info] tendencias: {len(datos['items'])} keywords guardadas")
    return 0


if __name__ == "__main__":
    sys.exit(main())
