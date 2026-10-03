"""Pone nombre y frase en la franja amarilla de las tarjetas del carrusel.

Entrada: DON OFERTÍN/carrusel/1.png ... 9.png (bajadas de Gemini, 4:5).
Salida:  VIDEOS VIRALES/carrusel-final/1.jpg ... 9.jpg (1080x1350, listas para IG).
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent.parent
SRC = BASE / "DON OFERTÍN" / "carrusel"
DST = Path(__file__).resolve().parent / "carrusel-final"

TEXTOS = {
    1: ("DON OFERTÍN · El cazador", "“¿Cincuenta por ciento de qué, querido?”"),
    2: ("DOÑA ROSA · La ministra de economía", "“¿Y cuánto salió?”"),
    3: ("TINCHO · El impulsivo", "“¡Estaba de oferta!”"),
    4: ("GUSTAVO · El cuñado", "“Tengo un contacto.”"),
    5: ("MARCE · La ordenada", "“Mirá el historial.”"),
    6: ("DOÑA CHOLA · La consuegra", "“Ay, Rosa… yo la pagué menos.”"),
    7: ("BENJA · El primo del cuarto del fondo", "“Abuelo… hay cupón.”"),
    8: ("PRECIO · El detector de inflados", "“Grrr…”"),
    9: ("¿CUÁL SOS VOS? COMENTÁ ↓", "Las ofertas reales de la familia → link en la bio"),
}


def fuente(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    for f in (["arialbd.ttf", "Arial Bold.ttf"] if bold else ["arial.ttf", "Arial.ttf"]):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            continue
    return ImageFont.load_default()


def centrado(d: ImageDraw.ImageDraw, y: int, texto: str, f, w: int) -> None:
    ancho = d.textlength(texto, font=f)
    d.text(((w - ancho) / 2, y), texto, font=f, fill="#111111")


def armar(n: int) -> Path | None:
    src = next((p for p in SRC.glob(f"{n}.*")), None)
    if not src:
        print(f"falta {n}")
        return None
    im = Image.open(src).convert("RGB").resize((1080, 1350), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    titulo, frase = TEXTOS[n]
    # Franja propia (igual en todas): tapa la franja original de Gemini,
    # que cambia de alto entre tarjetas.
    if n == 7:  # tapa el logo de la notebook (sin marcas reales)
        from PIL import ImageFilter
        caja = (860, 780, 1000, 920)
        im.paste(im.crop(caja).filter(ImageFilter.GaussianBlur(14)), caja[:2])
    top = 1030 if n in (5, 6) else 1095  # Marce y Chola traen la franja más alta
    d.rounded_rectangle((40, top, 1040, 1310), radius=36, fill="#FACC15",
                        outline="#111111", width=10)
    centrado(d, top + 37 + (65 if top < 1095 else 0) // 2, titulo, fuente(50), 1080)
    centrado(d, top + 115 + (65 if top < 1095 else 0) // 2, frase, fuente(42, bold=False), 1080)
    DST.mkdir(exist_ok=True)
    out = DST / f"{n}.jpg"
    im.save(out, quality=92)
    return out


if __name__ == "__main__":
    for n in TEXTOS:
        print(armar(n))
