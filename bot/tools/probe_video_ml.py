"""
Prueba de solo lectura: ¿las publicaciones de ML traen un video que podamos usar?

Pide la página de ofertas y unas cuantas fichas, y cuenta cuántas mencionan
video/clips y de qué tipo (mp4, m3u8, youtube...). No guarda ni publica nada;
imprime un resumen. Lo corre probe_video_ml.yml a mano.
"""

import json
import re
import sys
from pathlib import Path

from cazador_bot import http_get

PATRONES = {
    "mp4": re.compile(r"https?:[^\"'\s\\]+?\.mp4[^\"'\s\\]*", re.I),
    "m3u8": re.compile(r"https?:[^\"'\s\\]+?\.m3u8[^\"'\s\\]*", re.I),
    "youtube": re.compile(r"(youtube\.com/(?:embed|watch)[^\"'\s\\]*|youtu\.be/[^\"'\s\\]*)", re.I),
    "clips/video_id": re.compile(r"\"(?:clip_id|video_id|clips?|videoUrl|video_url)\"\s*:\s*[^,}]{0,80}", re.I),
}


def analizar(url: str) -> dict:
    out = {"url": url[:90]}
    try:
        html = http_get(url).decode("utf-8", errors="replace")
    except Exception as e:  # noqa: BLE001
        out["error"] = str(e)[:100]
        return out
    out["bytes"] = len(html)
    out["palabra_video"] = len(re.findall(r"video|clip", html, re.I))
    for nombre, pat in PATRONES.items():
        hits = pat.findall(html)
        if hits:
            out[nombre] = [h if isinstance(h, str) else h[0] for h in hits[:2]]
            out[nombre] = [h[:140] for h in out[nombre]]
    return out


def main() -> int:
    listado = http_get("https://www.mercadolibre.com.ar/ofertas").decode("utf-8", errors="replace")
    print(f"[listado] bytes={len(listado)} palabra_video={len(re.findall(r'video|clip', listado, re.I))}")
    for nombre, pat in PATRONES.items():
        n = len(pat.findall(listado))
        print(f"[listado] {nombre}: {n}")
    datos = json.loads((Path(__file__).resolve().parents[2] / "frontend" / "data" / "productos_rentables.json").read_text(encoding="utf-8"))
    links = [i["url_producto"].split("?")[0] for i in datos["items"] if i.get("url_producto")][:10]
    print(f"[fichas] links encontrados: {len(links)}")
    con_video = 0
    for u in links:
        r = analizar(u.split("#")[0])
        print("[ficha]", r)
        if any(k in r for k in ("mp4", "m3u8", "youtube", "clips/video_id")):
            con_video += 1
    print(f"[resumen] fichas con algún indicio de video: {con_video}/{len(links)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
