"""
Genera la imagen 9:16 de la story diaria de Instagram (requiere Pillow).

Diseño: fondo oscuro, tarjeta blanca con la foto del producto, badge de % OFF,
título, precio anterior tachado, precio actual grande y banner "LINK EN BIO".
"""

import io
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

W, H = 1080, 1920
BG = (15, 15, 19)
AMBER = (255, 199, 0)
WHITE = (255, 255, 255)
GRAY = (168, 168, 176)
BLACK = (12, 12, 14)
STAMP_RED = (206, 43, 43)

_BOLD_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]
_REG_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "C:/Windows/Fonts/arial.ttf",
]


def _font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    for path in _BOLD_FONTS if bold else _REG_FONTS:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default(size)


def _fmt(n: int) -> str:
    return f"${n:,.0f}".replace(",", ".")


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, max_w: int, max_lines: int = 2):
    words, lines, cur = text.split(), [], ""
    for i, w in enumerate(words):
        cand = (cur + " " + w).strip()
        if draw.textlength(cand, font=font) <= max_w:
            cur = cand
        else:
            lines.append(cur)
            cur = w
            if len(lines) == max_lines:
                lines[-1] = lines[-1].rstrip(" .,") + "…"
                return lines
    if cur:
        lines.append(cur)
    return lines[:max_lines]


def _stamp_cazado(img: Image.Image, center: tuple[int, int], scale: float = 1.0) -> None:
    """Sello tipo goma "CAZADO" rotado, pisando la esquina de la tarjeta."""
    f = _font(int(58 * scale))
    tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    tw = int(tmp.textlength("CAZADO", font=f))
    pad_x, pad_y = int(28 * scale), int(16 * scale)
    w, h = tw + pad_x * 2, int(58 * scale) + pad_y * 2
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ink = STAMP_RED + (235,)
    ld.rounded_rectangle([0, 0, w - 1, h - 1], radius=int(12 * scale), outline=ink, width=int(6 * scale))
    ld.text((w // 2, h // 2 + 1), "CAZADO", font=f, fill=ink, anchor="mm")
    layer = layer.rotate(11, expand=True, resample=Image.BICUBIC)
    img.paste(layer, (center[0] - layer.width // 2, center[1] - layer.height // 2), layer)


def render_feed(deal: dict, image_bytes: bytes, out_path: str | Path) -> Path:
    """Placa 4:5 (1080x1350) para el post del feed."""
    FW, FH = 1080, 1350
    img = Image.new("RGB", (FW, FH), BG)
    d = ImageDraw.Draw(img)

    d.text((FW // 2, 78), "CAZADOR DE OFERTAS AR", font=_font(40), fill=AMBER, anchor="mm")
    d.text((FW // 2, 128), "ofertas verificadas de MercadoLibre", font=_font(27, bold=False), fill=GRAY, anchor="mm")

    card_w = 760
    card = Image.new("RGB", (card_w, card_w), WHITE)
    prod = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    prod = ImageOps.contain(prod, (card_w - 80, card_w - 80))
    card.paste(prod, ((card_w - prod.width) // 2, (card_w - prod.height) // 2))
    mask = Image.new("L", (card_w, card_w), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, card_w, card_w], radius=42, fill=255)
    img.paste(card, ((FW - card_w) // 2, 175), mask)

    badge_f = _font(56)
    badge_txt = f"-{deal['discount']}%"
    tw = d.textlength(badge_txt, font=badge_f)
    bx1, byc = 945, 205
    bx0 = bx1 - tw - 66
    d.rounded_rectangle([bx0, byc - 50, bx1, byc + 50], radius=38, fill=AMBER)
    d.rounded_rectangle([bx0, byc - 50, bx1, byc + 50], radius=38, outline=BG, width=6)
    d.text(((bx0 + bx1) // 2, byc + 2), badge_txt, font=badge_f, fill=BLACK, anchor="mm")

    _stamp_cazado(img, (320, 900), 0.95)

    title_f = _font(44)
    y = 995
    for line in _wrap(d, deal["title"], title_f, 940):
        d.text((FW // 2, y), line, font=title_f, fill=WHITE, anchor="mm")
        y += 58

    prev_f = _font(40, bold=False)
    prev_txt = f"Antes {_fmt(deal['price_prev'])}"
    pw = d.textlength(prev_txt, font=prev_f)
    py = 1128
    d.text((FW // 2, py), prev_txt, font=prev_f, fill=GRAY, anchor="mm")
    d.line([(FW - pw) // 2 - 8, py, (FW + pw) // 2 + 8, py], fill=GRAY, width=4)

    d.text((FW // 2, 1210), _fmt(deal["price_cur"]), font=_font(92), fill=AMBER, anchor="mm")

    d.rectangle([0, 1276, FW, 1350], fill=AMBER)
    banner_f = _font(42)
    banner_txt = "LINK EN BIO"
    tw = d.textlength(banner_txt, font=banner_f)
    cx = FW // 2 + 18
    d.text((cx, 1312), banner_txt, font=banner_f, fill=BLACK, anchor="mm")
    ax = int(cx - tw / 2 - 42)
    d.polygon([(ax, 1295), (ax - 17, 1320), (ax + 17, 1320)], fill=BLACK)
    d.rectangle([ax - 7, 1320, ax + 7, 1333], fill=BLACK)

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "JPEG", quality=90)
    return out_path


def render_story(deal: dict, image_bytes: bytes, out_path: str | Path) -> Path:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # marca arriba
    d.text((W // 2, 115), "CAZADOR DE OFERTAS AR", font=_font(46), fill=AMBER, anchor="mm")
    d.text((W // 2, 172), "ofertas verificadas de MercadoLibre", font=_font(30, bold=False), fill=GRAY, anchor="mm")

    # tarjeta blanca con la foto
    card_w = 880
    card = Image.new("RGB", (card_w, card_w), WHITE)
    prod = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    prod = ImageOps.contain(prod, (card_w - 90, card_w - 90))
    card.paste(prod, ((card_w - prod.width) // 2, (card_w - prod.height) // 2))
    mask = Image.new("L", (card_w, card_w), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, card_w, card_w], radius=48, fill=255)
    img.paste(card, ((W - card_w) // 2, 235), mask)

    # badge % OFF pisando la esquina superior derecha de la tarjeta
    badge_f = _font(66)
    badge_txt = f"-{deal['discount']}%"
    tw = d.textlength(badge_txt, font=badge_f)
    bx1, byc = 1005, 268
    bx0 = bx1 - tw - 78
    d.rounded_rectangle([bx0, byc - 58, bx1, byc + 58], radius=44, fill=AMBER)
    d.rounded_rectangle([bx0, byc - 58, bx1, byc + 58], radius=44, outline=BG, width=6)
    d.text(((bx0 + bx1) // 2, byc + 2), badge_txt, font=badge_f, fill=BLACK, anchor="mm")

    # sello CAZADO pisando la esquina inferior izquierda de la tarjeta
    _stamp_cazado(img, (310, 1080), 1.1)

    # título (máx. 2 líneas)
    title_f = _font(50)
    y = 1210
    for line in _wrap(d, deal["title"], title_f, 960):
        d.text((W // 2, y), line, font=title_f, fill=WHITE, anchor="mm")
        y += 66

    # precio anterior tachado
    prev_f = _font(46, bold=False)
    prev_txt = f"Antes {_fmt(deal['price_prev'])}"
    pw = d.textlength(prev_txt, font=prev_f)
    py = 1392
    d.text((W // 2, py), prev_txt, font=prev_f, fill=GRAY, anchor="mm")
    d.line([(W - pw) // 2 - 8, py, (W + pw) // 2 + 8, py], fill=GRAY, width=5)

    # precio actual grande
    d.text((W // 2, 1505), _fmt(deal["price_cur"]), font=_font(112), fill=AMBER, anchor="mm")
    ahorro = deal["price_prev"] - deal["price_cur"]
    d.text((W // 2, 1608), f"Te ahorrás {_fmt(ahorro)}", font=_font(42, bold=False), fill=WHITE, anchor="mm")

    # banner LINK EN BIO
    d.rectangle([0, 1690, W, 1836], fill=AMBER)
    banner_f = _font(64)
    banner_txt = "LINK EN BIO"
    tw = d.textlength(banner_txt, font=banner_f)
    cx = W // 2 + 28
    d.text((cx, 1763), banner_txt, font=banner_f, fill=BLACK, anchor="mm")
    # flecha hacia arriba a la izquierda del texto
    ax = int(cx - tw / 2 - 56)
    d.polygon([(ax, 1737), (ax - 26, 1775), (ax + 26, 1775)], fill=BLACK)
    d.rectangle([ax - 10, 1775, ax + 10, 1795], fill=BLACK)

    d.text((W // 2, 1878), "@elcazadordeofertas.ar", font=_font(34, bold=False), fill=GRAY, anchor="mm")

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "JPEG", quality=90)
    return out_path
