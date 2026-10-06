"""
Videos cortos para la web: los productos que más rankean ese día, en MP4.

El reel diario de IG sale de madrugada y su producto casi nunca sigue en la web
al día siguiente, así que acá se rinden videos aparte a partir de
frontend/data/productos_rentables.json (la misma fuente que arma la página).
Los guarda en frontend/public/videos/<id_ml>.mp4 y borra los que ya no están
entre los mejores. Best-effort: si algo falla, la web sigue sin video.

Usa el mismo render que el reel (reel.render_reel_v2): Pillow + ffmpeg.
"""

import json
import re
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
SITE_DATA = BASE_DIR.parent / "frontend" / "data" / "productos_rentables.json"
VIDEOS_DIR = BASE_DIR.parent / "frontend" / "public" / "videos"
MIN_DESCUENTO = 20  # igual que la "caza del día" de la página
SAFE_ID = re.compile(r"^[A-Za-z0-9_-]+$")


def candidatos(items: list[dict], keep: int) -> list[dict]:
    """Los `keep` mejores por prioridad (ganancia esperada) con foto y descuento real."""
    buenos = [
        i for i in items
        if (i.get("descuento_pct") or 0) >= MIN_DESCUENTO
        and i.get("url_imagen")
        and SAFE_ID.match(str(i.get("id_ml", "")))
    ]
    buenos.sort(key=lambda i: i.get("prioridad") or 0, reverse=True)
    return buenos[:keep]


def a_deal(item: dict) -> dict:
    return {
        "title": item["titulo"],
        "discount": item.get("descuento_pct") or 0,
        "price_cur": item["precio_actual"],
        "price_prev": item.get("precio_anterior") or item["precio_actual"],
        "low": bool(item.get("minimo_historico")),
        "sello_temporada": "",
    }


def generar(max_nuevos: int = 2, keep: int = 6, fetch=None, render=None,
            data_path: Path = SITE_DATA, out_dir: Path = VIDEOS_DIR) -> dict:
    """Genera hasta `max_nuevos` videos que falten y poda el resto.
    `fetch(url)->bytes` y `render(deal, bytes, path)` se inyectan en los tests."""
    items = json.loads(data_path.read_text(encoding="utf-8")).get("items", [])
    top = candidatos(items, keep)
    vigentes = {i["id_ml"] for i in top}
    out_dir.mkdir(parents=True, exist_ok=True)

    borrados = 0
    for f in out_dir.glob("*.mp4"):
        if f.stem not in vigentes:
            f.unlink()
            borrados += 1

    if render is None:
        from reel import render_reel_v2 as render  # requiere Pillow + ffmpeg
    if fetch is None:
        def fetch(url: str) -> bytes:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()

    nuevos = []
    for item in top:
        if len(nuevos) >= max_nuevos:
            break
        destino = out_dir / f"{item['id_ml']}.mp4"
        if destino.exists():
            continue
        try:
            render(a_deal(item), fetch(item["url_imagen"]), destino)
            nuevos.append(item["id_ml"])
        except Exception as e:  # noqa: BLE001 — un video roto no frena a los demás
            print(f"[warn] video web {item['id_ml']}: {e}")
            destino.unlink(missing_ok=True)
    return {"nuevos": nuevos, "borrados": borrados, "vigentes": sorted(vigentes)}
