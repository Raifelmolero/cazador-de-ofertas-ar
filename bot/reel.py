"""
Genera el reel diario 9:16 (MP4 ~8,5 s) con Pillow + ffmpeg.

Tres escenas con la estética de la marca (negro/ámbar, sello CAZADO):
  1. Gancho (2,0 s): "LA CAZA DEL DÍA" + badge % OFF con punch-in
  2. Producto (3,5 s): tarjeta blanca con zoom lento (Ken Burns) + título
  3. Precio (3,0 s): precio anterior tachado → precio actual con pop +
     ahorro + banner LINK EN BIO

Requiere ffmpeg en el PATH (o env FFMPEG_BIN). Audio: si existe
`bot/assets/reel_music.m4a` se usa como pista (con fade final) — para
cambiar la música alcanza con reemplazar ese archivo por cualquier track
con licencia. Si no existe, sale con pista silenciosa AAC.
"""

import io
import os
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

from story import AMBER, BG, BLACK, GRAY, STAMP_RED, WHITE, _font, _fmt, _stamp_cazado, _wrap

W, H = 1080, 1920
FPS = 30
# gancho corto (el que no enganchó en 2 s ya se fue) y más aire para el
# contador de precio del cierre
DUR_HOOK, DUR_PROD, DUR_PRICE = 1.6, 3.4, 3.5
FADE = 0.18  # segundos de fundido en los cortes


def _ease_out(t: float) -> float:
    return 1 - (1 - t) ** 4


def _badge(d: ImageDraw.ImageDraw, cx: int, cy: int, texto: str, scale: float = 1.0) -> None:
    f = _font(int(72 * scale))
    tw = d.textlength(texto, font=f)
    pad_x, pad_y = int(44 * scale), int(30 * scale)
    x0, x1 = cx - tw / 2 - pad_x, cx + tw / 2 + pad_x
    d.rounded_rectangle([x0, cy - 36 * scale - pad_y, x1, cy + 36 * scale + pad_y],
                        radius=int(52 * scale), fill=AMBER)
    d.text((cx, cy + 2), texto, font=f, fill=BLACK, anchor="mm")


def _scene_hook(deal: dict, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((W // 2, 210), "CAZADOR DE OFERTAS AR", font=_font(46), fill=AMBER, anchor="mm")
    d.text((W // 2, 268), "ofertas verificadas de MercadoLibre", font=_font(30, bold=False), fill=GRAY, anchor="mm")

    d.text((W // 2, 760), "LA CAZA", font=_font(150), fill=WHITE, anchor="mm")
    d.text((W // 2, 920), "DEL DÍA", font=_font(150), fill=AMBER, anchor="mm")

    if deal.get("discount") is not None:
        # punch-in: arranca grande y asienta (ease-out en los primeros 0,6 s);
        # después late suave para que el frame nunca quede estático
        import math

        k = _ease_out(min(t / 0.6, 1.0))
        scale = 1.6 - 0.6 * k
        if t > 0.6:
            scale = 1.0 + 0.02 * math.sin(2 * math.pi * 1.3 * (t - 0.6))
        _badge(d, W // 2, 1250, f"-{deal['discount']}%", scale)

    d.text((W // 2, 1700), "esperá que la veas…", font=_font(40, bold=False), fill=GRAY, anchor="mm")
    return img


def _make_card(image_bytes: bytes, size: int = 1400) -> Image.Image:
    """Tarjeta blanca con la foto, renderizada grande para poder zoomear."""
    card = Image.new("RGB", (size, size), WHITE)
    prod = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    prod = ImageOps.contain(prod, (size - 140, size - 140))
    card.paste(prod, ((size - prod.width) // 2, (size - prod.height) // 2))
    return card


def _scene_producto(deal: dict, card: Image.Image, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((W // 2, 150), "CAZADOR DE OFERTAS AR", font=_font(42), fill=AMBER, anchor="mm")

    # Ken Burns: zoom 1,00 → 1,10 lineal sobre la tarjeta pre-renderizada
    zoom = 1.0 + 0.10 * (t / DUR_PROD)
    target = 900
    crop = int(card.width / zoom)
    off = (card.width - crop) // 2
    frame_card = card.crop((off, off, off + crop, off + crop)).resize((target, target), Image.BILINEAR)

    mask = Image.new("L", (target, target), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, target, target], radius=48, fill=255)
    img.paste(frame_card, ((W - target) // 2, 260), mask)

    if deal.get("discount") is not None:
        _badge(d, W - 210, 300, f"-{deal['discount']}%", 0.85)
    _stamp_cazado(img, (240, 1140), 1.1)

    title_f = _font(54)
    y = 1330
    for line in _wrap(d, deal["title"], title_f, 960):
        d.text((W // 2, y), line, font=title_f, fill=WHITE, anchor="mm")
        y += 72

    d.text((W // 2, 1650), "¿cuánto creés que sale?", font=_font(40, bold=False), fill=GRAY, anchor="mm")
    return img


def _scene_precio(deal: dict, thumb: Image.Image, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((W // 2, 150), "CAZADOR DE OFERTAS AR", font=_font(42), fill=AMBER, anchor="mm")

    # el producto sigue presente durante la revelación (continuidad visual)
    mask = Image.new("L", thumb.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, *thumb.size], radius=36, fill=255)
    img.paste(thumb, ((W - thumb.width) // 2, 240), mask)

    prev_f = _font(54, bold=False)
    prev_txt = f"Antes {_fmt(deal['price_prev'])}"
    pw = d.textlength(prev_txt, font=prev_f)
    d.text((W // 2, 830), prev_txt, font=prev_f, fill=GRAY, anchor="mm")
    d.line([(W - pw) // 2 - 10, 830, (W + pw) // 2 + 10, 830], fill=GRAY, width=6)

    # contador: el precio "cae" desde el anterior hasta el real en 0,9 s
    k = _ease_out(min(t / 0.9, 1.0))
    valor = int(deal["price_prev"] - (deal["price_prev"] - deal["price_cur"]) * k)
    color = AMBER if k >= 1.0 else WHITE
    d.text((W // 2, 1010), _fmt(valor), font=_font(170), fill=color, anchor="mm")

    if t > 1.0:
        ahorro = deal["price_prev"] - deal["price_cur"]
        d.text((W // 2, 1190), f"Te ahorrás {_fmt(ahorro)}", font=_font(52), fill=WHITE, anchor="mm")
    if t > 1.3 and deal.get("discount") is not None:
        _badge(d, W // 2, 1390, f"-{deal['discount']}%", 0.9)

    d.rectangle([0, 1560, W, 1720], fill=AMBER)
    banner_f = _font(66)
    banner_txt = "LINK EN BIO"
    tw = d.textlength(banner_txt, font=banner_f)
    cx = W // 2 + 30
    d.text((cx, 1640), banner_txt, font=banner_f, fill=BLACK, anchor="mm")
    ax = int(cx - tw / 2 - 60)
    d.polygon([(ax, 1612), (ax - 27, 1652), (ax + 27, 1652)], fill=BLACK)
    d.rectangle([ax - 10, 1652, ax + 10, 1674], fill=BLACK)

    d.text((W // 2, 1790), "@elcazadordeofertas.ar", font=_font(36, bold=False), fill=GRAY, anchor="mm")
    d.text((W // 2, 1852), "Seguime para la caza de mañana", font=_font(34), fill=WHITE, anchor="mm")
    return img


def render_reel(deal: dict, image_bytes: bytes, out_path: str | Path) -> Path:
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    card = _make_card(image_bytes)
    total = DUR_HOOK + DUR_PROD + DUR_PRICE
    n_frames = int(total * FPS)

    ffmpeg = os.getenv("FFMPEG_BIN", "ffmpeg")
    music = Path(__file__).parent / "assets" / "reel_music.m4a"
    if music.exists():
        audio_in = ["-stream_loop", "-1", "-i", str(music)]
        audio_opts = ["-af", f"afade=t=out:st={total - 1.0:.2f}:d=1.0", "-b:a", "128k"]
    else:
        audio_in = ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
        audio_opts = ["-b:a", "64k"]
    cmd = [
        ffmpeg, "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        *audio_in,
        "-map", "0:v", "-map", "1:a",
        "-shortest",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p",
        "-c:a", "aac", *audio_opts,
        "-movflags", "+faststart",
        str(out_path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    black = Image.new("RGB", (W, H), (0, 0, 0))
    thumb = card.resize((520, 520), Image.LANCZOS)
    bounds = (DUR_HOOK, DUR_HOOK + DUR_PROD)  # cortes de escena
    for i in range(n_frames):
        ts = i / FPS
        if ts < bounds[0]:
            frame = _scene_hook(deal, ts)
        elif ts < bounds[1]:
            frame = _scene_producto(deal, card, ts - bounds[0])
        else:
            frame = _scene_precio(deal, thumb, ts - bounds[1])

        # fundidos SOLO en los cortes de escena — sin fade inicial: el frame 0
        # es la portada del reel en el feed y tiene que verse completo
        alpha = 1.0
        for b in bounds:
            if abs(ts - b) < FADE:
                alpha = min(alpha, abs(ts - b) / FADE)
        if alpha < 1.0:
            frame = Image.blend(black, frame, alpha)

        proc.stdin.write(frame.tobytes())

    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg salió con código {proc.returncode}")
    return out_path


# ---------------------------------------------------------------------------
# v2: hook más agresivo (para en el 1er segundo), ritmo rápido (7 s totales),
# producto protagonista y precio gigante. Variante nueva, no toca render_reel.
# ---------------------------------------------------------------------------

DUR_HOOK_V2, DUR_MAIN_V2, DUR_CLOSE_V2 = 1.0, 4.5, 1.5


def _hero_crop(image_bytes: bytes, size: int) -> Image.Image:
    """Foto recortada a cuadrado y llena el frame (sin marco blanco): el
    producto ocupa el máximo espacio posible, como en @directoalcarrito.ok."""
    prod = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    prod = ImageOps.fit(prod, (size, size), Image.LANCZOS)
    return prod


def _scene_hook_v2(deal: dict, hero: Image.Image, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BLACK)
    # producto de fondo, oscurecido, para que el ojo ya reconozca qué es
    bg = hero.resize((W, W), Image.LANCZOS)
    bg = Image.eval(bg, lambda p: int(p * 0.35))
    img.paste(bg, (0, (H - W) // 2))
    overlay = Image.new("RGB", (W, H), BLACK)
    img = Image.blend(overlay, img, 0.85)
    d = ImageDraw.Draw(img)

    # texto gancho: mínimo histórico si aplica, si no el % OFF gigante
    k = _ease_out(min(t / 0.35, 1.0))
    scale = 1.35 - 0.35 * k
    if deal.get("low"):
        d.text((W // 2, H // 2 - 260), "MÍNIMO", font=_font(int(120 * scale)), fill=WHITE, anchor="mm")
        d.text((W // 2, H // 2 - 120), "HISTÓRICO", font=_font(int(120 * scale)), fill=AMBER, anchor="mm")
    if deal.get("discount") is not None:
        txt = f"-{deal['discount']}%"
        d.text((W // 2, H // 2 + (60 if deal.get('low') else 0)), txt,
               font=_font(int(230 * scale)), fill=AMBER, anchor="mm")
        d.text((W // 2, H // 2 + (280 if deal.get('low') else 220)), "OFF",
               font=_font(int(90 * scale)), fill=WHITE, anchor="mm")
    d.text((W // 2, 120), "CAZADOR DE OFERTAS AR", font=_font(38), fill=GRAY, anchor="mm")
    return img


def _scene_main_v2(deal: dict, hero: Image.Image, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    # producto a pantalla completa arriba (protagonista, sin marco blanco)
    ph = 1180
    zoom = 1.0 + 0.06 * (t / DUR_MAIN_V2)
    crop = int(hero.width / zoom)
    off = (hero.width - crop) // 2
    frame = hero.crop((off, off, off + crop, off + crop)).resize((W, ph), Image.BILINEAR)
    img.paste(frame, (0, 0))

    d = ImageDraw.Draw(img)
    # velo inferior para que el precio se lea siempre, sobre cualquier foto
    grad = Image.new("L", (1, ph), 0)
    for y in range(ph):
        grad.putpixel((0, y), int(255 * max(0.0, (y - ph * 0.55) / (ph * 0.45))))
    grad = grad.resize((W, ph))
    dark = Image.new("RGB", (W, ph), BG)
    img.paste(Image.composite(dark, img.crop((0, 0, W, ph)), grad), (0, 0))
    d = ImageDraw.Draw(img)

    if deal.get("discount") is not None:
        _badge(d, W - 190, 130, f"-{deal['discount']}%", 1.05)
    _stamp_cazado(img, (170, 210), 1.15)

    title_f = _font(46)
    y = ph + 60
    for line in _wrap(d, deal["title"], title_f, 980, max_lines=2):
        d.text((W // 2, y), line, font=title_f, fill=WHITE, anchor="mm")
        y += 60

    # precio: entra con pop apenas arranca la escena (más rápido que v1)
    k = _ease_out(min(t / 0.4, 1.0))
    prev_f = _font(46, bold=False)
    prev_txt = f"Antes {_fmt(deal['price_prev'])}"
    pw = d.textlength(prev_txt, font=prev_f)
    py = y + 30
    d.text((W // 2, py), prev_txt, font=prev_f, fill=GRAY, anchor="mm")
    d.line([(W - pw) // 2 - 8, py, (W + pw) // 2 + 8, py], fill=GRAY, width=5)

    price_scale = 1.15 - 0.15 * k
    price_f = _font(int(150 * price_scale))
    d.text((W // 2, py + 130), _fmt(deal["price_cur"]), font=price_f, fill=AMBER, anchor="mm")

    ahorro = deal["price_prev"] - deal["price_cur"]
    d.text((W // 2, py + 250), f"Te ahorrás {_fmt(ahorro)}", font=_font(42), fill=WHITE, anchor="mm")
    return img


def _scene_close_v2(deal: dict, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    _stamp_cazado(img, (W // 2, 560), 1.9)

    d.rectangle([0, 900, W, 1160], fill=AMBER)
    banner_f = _font(58)
    line1 = "LINK EN BIO"
    d.text((W // 2, 985), line1, font=banner_f, fill=BLACK, anchor="mm")
    d.text((W // 2, 1065), "cazadordeofertas.com.ar", font=_font(42), fill=BLACK, anchor="mm")

    d.text((W // 2, 1300), "@elcazadordeofertas.ar", font=_font(38, bold=False), fill=GRAY, anchor="mm")
    d.text((W // 2, 1370), "seguime para la próxima caza", font=_font(36), fill=WHITE, anchor="mm")
    return img


def render_reel_v2(deal: dict, image_bytes: bytes, out_path: str | Path) -> Path:
    """Variante rápida y agresiva del reel (7 s): hook en 1 s, producto
    protagonista a pantalla completa, precio gigante y cierre con CTA fuerte.
    No reemplaza a `render_reel`."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    hero = _hero_crop(image_bytes, 1400)
    total = DUR_HOOK_V2 + DUR_MAIN_V2 + DUR_CLOSE_V2
    n_frames = int(total * FPS)

    ffmpeg = os.getenv("FFMPEG_BIN", "ffmpeg")
    music = Path(__file__).parent / "assets" / "reel_music.m4a"
    if music.exists():
        audio_in = ["-stream_loop", "-1", "-i", str(music)]
        audio_opts = ["-af", f"afade=t=out:st={total - 0.6:.2f}:d=0.6", "-b:a", "128k"]
    else:
        audio_in = ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
        audio_opts = ["-b:a", "64k"]
    cmd = [
        ffmpeg, "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        *audio_in,
        "-map", "0:v", "-map", "1:a",
        "-shortest",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p",
        "-c:a", "aac", *audio_opts,
        "-movflags", "+faststart",
        str(out_path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    black = Image.new("RGB", (W, H), (0, 0, 0))
    bounds = (DUR_HOOK_V2, DUR_HOOK_V2 + DUR_MAIN_V2)
    for i in range(n_frames):
        ts = i / FPS
        if ts < bounds[0]:
            frame = _scene_hook_v2(deal, hero, ts)
        elif ts < bounds[1]:
            frame = _scene_main_v2(deal, hero, ts - bounds[0])
        else:
            frame = _scene_close_v2(deal, ts - bounds[1])

        alpha = 1.0
        for b in bounds:
            if abs(ts - b) < FADE:
                alpha = min(alpha, abs(ts - b) / FADE)
        if alpha < 1.0:
            frame = Image.blend(black, frame, alpha)

        proc.stdin.write(frame.tobytes())

    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg (v2) salió con código {proc.returncode}")
    return out_path


if __name__ == "__main__":
    # prueba local: deal sintético con imagen gris
    buf = io.BytesIO()
    Image.new("RGB", (900, 900), (228, 228, 233)).save(buf, "JPEG")
    deal = {
        "title": "Freidora De Aire Moulinex Easy Fry Surface Xl 4l Negro",
        "discount": 51,
        "price_prev": 292490,
        "price_cur": 141990,
    }
    out = render_reel(deal, buf.getvalue(), "reel-test.mp4")
    print(f"OK → {out}")
