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
DUR_HOOK, DUR_PROD, DUR_PRICE = 2.0, 3.5, 3.0
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
        # punch-in: arranca grande y asienta (ease-out en los primeros 0,6 s)
        k = _ease_out(min(t / 0.6, 1.0))
        scale = 1.6 - 0.6 * k
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


def _scene_precio(deal: dict, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((W // 2, 210), "CAZADOR DE OFERTAS AR", font=_font(46), fill=AMBER, anchor="mm")

    prev_f = _font(58, bold=False)
    prev_txt = f"Antes {_fmt(deal['price_prev'])}"
    pw = d.textlength(prev_txt, font=prev_f)
    d.text((W // 2, 640), prev_txt, font=prev_f, fill=GRAY, anchor="mm")
    d.line([(W - pw) // 2 - 10, 640, (W + pw) // 2 + 10, 640], fill=GRAY, width=6)

    # pop del precio: escala 1,45 → 1,0 con ease-out en 0,5 s
    k = _ease_out(min(t / 0.5, 1.0))
    d.text((W // 2, 860), _fmt(deal["price_cur"]), font=_font(int(190 - 60 * k + 60)), fill=AMBER, anchor="mm")

    if t > 0.45:
        ahorro = deal["price_prev"] - deal["price_cur"]
        d.text((W // 2, 1060), f"Te ahorrás {_fmt(ahorro)}", font=_font(52), fill=WHITE, anchor="mm")

    if deal.get("discount") is not None:
        _badge(d, W // 2, 1270, f"-{deal['discount']}%", 1.0)

    d.rectangle([0, 1560, W, 1720], fill=AMBER)
    banner_f = _font(66)
    banner_txt = "LINK EN BIO"
    tw = d.textlength(banner_txt, font=banner_f)
    cx = W // 2 + 30
    d.text((cx, 1640), banner_txt, font=banner_f, fill=BLACK, anchor="mm")
    ax = int(cx - tw / 2 - 60)
    d.polygon([(ax, 1612), (ax - 27, 1652), (ax + 27, 1652)], fill=BLACK)
    d.rectangle([ax - 10, 1652, ax + 10, 1674], fill=BLACK)

    d.text((W // 2, 1800), "@elcazadordeofertas.ar", font=_font(36, bold=False), fill=GRAY, anchor="mm")
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
    bounds = (DUR_HOOK, DUR_HOOK + DUR_PROD)  # cortes de escena
    for i in range(n_frames):
        ts = i / FPS
        if ts < bounds[0]:
            frame = _scene_hook(deal, ts)
        elif ts < bounds[1]:
            frame = _scene_producto(deal, card, ts - bounds[0])
        else:
            frame = _scene_precio(deal, ts - bounds[1])

        # fundidos: entrada del video y ±FADE alrededor de cada corte
        alpha = 1.0
        if ts < 0.3:
            alpha = ts / 0.3
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
