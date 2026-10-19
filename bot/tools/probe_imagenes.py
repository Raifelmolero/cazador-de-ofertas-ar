"""
Sonda de miniaturas del CDN de imágenes de ML (http2.mlstatic.com). Solo pide
FOTOS de 3 productos ya cargados, nunca páginas de Mercado Libre: 3 × ~6 pedidos.

Para cada foto prueba variantes de nombre (2X / 1X, D_NQ / D_Q, sufijo F/O/V)
y muestra estado, peso y tamaño en píxeles. Sirve para elegir una miniatura
liviana para las tarjetas del sitio en celular. Workflow: «Probe imágenes ML».
"""

import json
import re
import struct
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
UA = "Mozilla/5.0 (CazadorProbeImagenes)"


def variantes(url: str) -> list[str]:
    m = re.match(r"(https://http2\.mlstatic\.com/)D_(?:NQ|Q)_NP_(?:2X_)?(.+)-[A-Z]{1,2}\.(webp|jpg)$", url)
    if not m:
        return []
    base, cuerpo, _ext = m.groups()
    return [f"{base}{pre}{cuerpo}-{suf}.webp" for pre, suf in [
        ("D_NQ_NP_2X_", "F"), ("D_NQ_NP_", "F"), ("D_NQ_NP_", "O"),
        ("D_Q_NP_", "O"), ("D_Q_NP_", "V"), ("D_Q_NP_2X_", "V"),
    ]]


def medidas_webp(data: bytes) -> tuple[int, int] | None:
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        return None
    chunk = data[12:16]
    if chunk == b"VP8 ":
        w, h = struct.unpack("<HH", data[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if chunk == b"VP8L":
        b = data[21:25]
        w = 1 + (((b[1] & 0x3F) << 8) | b[0])
        h = 1 + (((b[3] & 0xF) << 10) | (b[2] << 2) | ((b[1] & 0xC0) >> 6))
        return w, h
    if chunk == b"VP8X":
        w = 1 + int.from_bytes(data[24:27], "little")
        h = 1 + int.from_bytes(data[27:30], "little")
        return w, h
    return None


def main() -> None:
    items = json.loads((ROOT / "frontend/data/productos_rentables.json").read_text(encoding="utf-8"))["items"]
    fotos = [i["url_imagen"] for i in items if i.get("url_imagen")]
    if "--muestra" in sys.argv:
        # Verificación amplia: 1 de cada 10 fotos, solo las 2 miniaturas que usa el sitio.
        ok = 0
        elegidas = fotos[::10]
        for foto in elegidas:
            vs = [v for v in variantes(foto) if "/D_Q_NP_" in v and "_2X_" not in v]
            codigos = []
            for v in vs:
                try:
                    with urllib.request.urlopen(urllib.request.Request(v, headers={"User-Agent": UA}), timeout=20) as r:
                        codigos.append(r.status)
                except urllib.error.HTTPError as e:
                    codigos.append(e.code)
                except Exception:  # noqa: BLE001
                    codigos.append(0)
                time.sleep(0.5)
            ok += all(c == 200 for c in codigos) and len(codigos) == 2
            if not (all(c == 200 for c in codigos) and len(codigos) == 2):
                print(f"  FALLA {codigos} {foto}")
        print(f"Miniaturas OK: {ok}/{len(elegidas)}")
        return
    for foto in fotos[:3]:
        print(f"\nFoto: {foto}")
        for v in variantes(foto):
            try:
                with urllib.request.urlopen(urllib.request.Request(v, headers={"User-Agent": UA}), timeout=20) as r:
                    data = r.read()
                    dims = medidas_webp(data)
                    print(f"  {r.status} {len(data) / 1024:6.1f} KB {dims} {v.rsplit('/', 1)[1][:40]}")
            except urllib.error.HTTPError as e:
                print(f"  {e.code}            {v.rsplit('/', 1)[1][:40]}")
            except Exception as e:  # noqa: BLE001
                print(f"  ERR {str(e)[:60]} {v.rsplit('/', 1)[1][:40]}")
            time.sleep(1)


if __name__ == "__main__":
    sys.exit(main())
