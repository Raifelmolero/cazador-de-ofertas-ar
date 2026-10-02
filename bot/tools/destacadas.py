"""Genera las tapas e historias de las destacadas de Instagram con Don Ofertín
(docs/personaje/destacadas/). Se corre a mano; Raifel las sube desde el celular
porque la API de Instagram no permite crear destacadas."""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from story import AMBER, BG, GRAY, WHITE, _font, _wrap  # noqa: E402
from tools.recortar_personaje import quitar_fondo  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
PJ = ROOT / "docs" / "personaje"
OUT = PJ / "destacadas"
W, H = 1080, 1920
EXP_W, EXP_H = 1672 // 4, 941 // 3  # grilla 4x3 de expresiones.webp


def expresion(n: int) -> Image.Image:
    r, c = divmod(n - 1, 4)
    m = 10
    caja = (c * EXP_W + m, r * EXP_H + m, (c + 1) * EXP_W - m, (r + 1) * EXP_H - m)
    return quitar_fondo(Image.open(PJ / "expresiones.webp").crop(caja))


def escena(n: int, tiza: list[str] | None = None) -> Image.Image:
    """Escena sin el tercio superior vacío (fondo negro, se pega sobre BG).
    tiza: líneas para escribir en el pizarrón de la escena 6."""
    im = Image.open(PJ / f"escena-{n}.webp").convert("RGB")
    if tiza:
        dd = ImageDraw.Draw(im)
        y = 640
        for linea in tiza:
            dd.text((800, y), linea, font=_font(54), fill=(235, 235, 225), anchor="mm")
            y += 78
    # negro conectado al borde → transparente (así no queda un recuadro)
    w, h = im.size
    m = im.convert("L").point(lambda v: 255 if v > 40 else 0)
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if m.getpixel((x, y)) == 0:
                ImageDraw.floodfill(m, (x, y), 128)
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if m.getpixel((x, y)) == 0:
                ImageDraw.floodfill(m, (x, y), 128)
    out = im.convert("RGBA")
    out.putalpha(m.point(lambda v: 0 if v == 128 else 255))
    return out.crop(out.getbbox())


def tapa(nombre: str, exp: int) -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    r = 470  # IG recorta un círculo centrado: todo lo importante adentro
    d.ellipse([W // 2 - r, H // 2 - r, W // 2 + r, H // 2 + r], fill=AMBER)
    cara = ImageOps.contain(expresion(exp), (820, 820))
    capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # apoyada en el borde inferior del círculo: el corte recto queda afuera
    capa.paste(cara, ((W - cara.width) // 2, H // 2 + r - cara.height + 40), cara)
    circulo = Image.new("L", (W, H), 0)
    ImageDraw.Draw(circulo).ellipse([W // 2 - r, H // 2 - r, W // 2 + r, H // 2 + r], fill=255)
    capa.putalpha(Image.composite(capa.getchannel("A"), Image.new("L", (W, H), 0), circulo))
    img.paste(capa, (0, 0), capa)
    img.save(OUT / f"tapa-{nombre}.jpg", quality=92)


def historia(nombre: str, titulo: str, cuerpo: list[str], imagen: Image.Image,
             link: str) -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((W // 2, 150), "CAZADOR DE OFERTAS AR", font=_font(40), fill=AMBER, anchor="mm")
    y = 290
    for linea in _wrap(d, titulo, _font(84), 960, 3):
        d.text((W // 2, y), linea, font=_font(84), fill=WHITE, anchor="mm")
        y += 100
    y += 30
    for parrafo in cuerpo:
        for linea in _wrap(d, parrafo, _font(46, bold=False), 940, 4):
            d.text((W // 2, y), linea, font=_font(46, bold=False), fill=WHITE, anchor="mm")
            y += 60
        y += 24
    # imagen del personaje entre el texto y el link
    alto = 1640 - y - 20
    pj = ImageOps.contain(imagen.convert("RGBA"), (980, max(alto, 300)))
    img.paste(pj, ((W - pj.width) // 2, 1640 - pj.height), pj)
    # espacio para el sticker de link de IG + texto del link
    d.rounded_rectangle([120, 1680, W - 120, 1800], radius=60, fill=AMBER)
    tam = 40
    while d.textlength(link, font=_font(tam)) > W - 300 and tam > 22:
        tam -= 2
    d.text((W // 2, 1740), link, font=_font(tam), fill=BG, anchor="mm")
    d.text((W // 2, 1860), "tocá el link para entrar", font=_font(32, bold=False), fill=GRAY, anchor="mm")
    img.save(OUT / f"historia-{nombre}.jpg", quality=92)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    pose = lambda n: quitar_fondo(Image.open(PJ / "poses.webp").crop(  # noqa: E731
        ((n - 1) % 4 * 384 + 14, (n - 1) // 4 * 341 + 14,
         ((n - 1) % 4 + 1) * 384 - 14, ((n - 1) // 4 + 1) * 341 - 14)))
    D = [
        ("1-verifica", 9, "¿TE TIENTA UNA OFERTA?",
         ["1. Copiá el link del producto en Mercado Libre.",
          "2. Pegalo en cazadordeofertas.com.ar",
          "3. Te digo si el descuento es real o trucho, con el historial de precios."],
         quitar_fondo(Image.open(PJ / "poses.webp").crop((770, 0, 1150, 372))),  # pose 3: las botas pasan la celda
         "cazadordeofertas.com.ar"),
        ("2-truchos", 2, "¡PRECIO TRUCHO!",
         ["Suben el precio unos días antes y después le ponen \"50% OFF\".",
          "En la web te muestro qué descuentos están inflados."],
         escena(1), "cazadordeofertas.com.ar/descuentos-inflados"),
        ("3-minimos", 12, "MÍNIMO HISTÓRICO",
         ["Cuando un producto llega a su precio más bajo registrado, lo marco así.",
          "Mirá el historial de cada producto antes de comprar."],
         escena(3), "cazadordeofertas.com.ar"),
        ("4-cupones", 8, "CUPONES DE MERCADO LIBRE",
         ["Dónde encontrar los cupones vigentes y cómo usarlos para pagar menos."],
         pose(5), "cazadordeofertas.com.ar/cupones-mercado-libre"),
        ("5-alertas", 6, "TE AVISO SI BAJA",
         ["1. Entrá al producto en la web.",
          "2. Tocá \"Avisame si baja\".",
          "3. Te escribo por Telegram cuando baje el precio."],
         escena(4), "cazadordeofertas.com.ar"),
        ("6-regalos", 7, "REGALOS DÍA DE LA MADRE",
         ["Ideas por presupuesto: hasta $100.000, de $100.000 a $300.000 y regalos grandes."],
         escena(5), "cazadordeofertas.com.ar/dia-de-la-madre"),
    ]
    for nombre, exp, titulo, cuerpo, im, link in D:
        tapa(nombre, exp)
        historia(nombre, titulo, cuerpo, im, link)
        print(nombre)
