"""Recorta poses de Don Ofertín de las hojas de docs/personaje/ (fondo blanco)
y guarda PNG con transparencia en bot/assets/personaje/. Se corre a mano cuando
cambian las hojas: el bot solo usa los PNG ya recortados."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "docs" / "personaje"
DST = ROOT / "bot" / "assets" / "personaje"
CELDA_W, CELDA_H = 1536 // 4, 1024 // 3  # grilla 4x3 de poses.webp

# nombre → (hoja, caja de recorte)
POSES = {
    "atrapando": ("poses-1-y-4.webp", (0, 0, 768, 1024)),  # pose 1 corregida
    "pulgar": ("poses.webp", (0, CELDA_H, CELDA_W, 2 * CELDA_H)),
    "festejando": ("poses.webp", (0, 2 * CELDA_H, CELDA_W, 1024)),
    "corriendo": ("poses.webp", (CELDA_W, 2 * CELDA_H, 2 * CELDA_W + 80, 1024)),  # la red sale de la celda
    # stickers.webp: grilla 4x2 (384x512)
    "lupa": ("stickers.webp", (2 * 384, 0, 3 * 384, 512)),
    "enamorado": ("stickers.webp", (0, 512, 384, 1024)),
    "binoculares": ("stickers.webp", (3 * 384, 512, 1536, 1024)),
}


def quitar_fondo(img: Image.Image) -> Image.Image:
    """Inunda desde los bordes el blanco/gris claro (fondo y sombra del piso):
    el blanco de adentro (bigote, red) no se toca porque está rodeado de contorno."""
    img = img.convert("RGB")
    w, h = img.size
    claro = img.convert("L").point(lambda v: 0 if v > 200 else 255)
    for x in range(0, w, 6):
        for y in (0, h - 1):
            if claro.getpixel((x, y)) == 0:
                ImageDraw.floodfill(claro, (x, y), 128)
    for y in range(0, h, 6):
        for x in (0, w - 1):
            if claro.getpixel((x, y)) == 0:
                ImageDraw.floodfill(claro, (x, y), 128)
    alpha = claro.point(lambda v: 0 if v == 128 else 255)
    # Solo la figura conectada al centro: descarta restos sueltos de las poses
    # vecinas de la grilla (sombras, botas que asoman por el borde).
    cx, cy = w // 2, h // 2
    semilla = next(((x, cy) for x in sorted(range(w), key=lambda x: abs(x - cx))
                    if alpha.getpixel((x, cy)) == 255), None)
    if semilla:
        ImageDraw.floodfill(alpha, semilla, 200)
        alpha = alpha.point(lambda v: 255 if v == 200 else 0)
    alpha = alpha.filter(ImageFilter.MinFilter(3))  # saca el halo blanco del borde
    out = img.convert("RGBA")
    out.putalpha(alpha)
    return out.crop(out.getbbox())


if __name__ == "__main__":
    DST.mkdir(parents=True, exist_ok=True)
    for viejo in DST.glob("escena-*.png"):
        viejo.unlink()
    for nombre, (hoja, caja) in POSES.items():
        x0, y0, x1, y1 = caja
        m = 0 if hoja.startswith("poses-1") else 14  # margen: evita restos de la pose vecina
        pj = quitar_fondo(Image.open(SRC / hoja).crop((x0 + m, y0 + m, x1 - m, y1 - m)))
        pj.thumbnail((420, 420), Image.LANCZOS)
        pj.save(DST / f"{nombre}.png", optimize=True)
        print(nombre, pj.size)
