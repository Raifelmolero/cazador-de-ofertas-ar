"""
Genera el reel 9:16 (MP4 ~11 s) con Pillow + ffmpeg.

Estilo único (pedido de Raifel, 24/11/2026: «los de fondo amarillo con rayos
están perfectos, usar siempre ese»): fondo de rayos amarillo #FACC15 /
naranja de la marca, barras negras con «CAZADOR DE OFERTAS AR» y la cuenta,
texto negro, tarjeta blanca con el producto y Don Ofertín. Ya no hay v2 ni
A/B por día: `render_reel` es la única función de render.

Cuatro escenas:
  1. Gancho (1,6 s): "LA CAZA DEL DÍA"
  2. Producto (3,4 s): tarjeta blanca con zoom lento (Ken Burns) + título
  3. Precio (2,5 s): precio de hoy con pop, en una píldora negra
  4. Cierre (>= 3 s entero): la web cazadordeofertas.com.ar/ig

Regla 24/11/2026 (dos reels salieron mal): sin badges de %, sin "OFF", sin
precio anterior tachado/"Antes"/"Estaba", sin "Te ahorrás" ni "mínimo
histórico". Solo título, precio actual y la web. El cierre se ve entero al
menos CIERRE_MIN_S segundos y ffmpeg no recorta el final (sin -shortest: el
audio se corta exacto a la duración del video con -t).

Requiere ffmpeg en el PATH (o env FFMPEG_BIN). Audio: si existe
`bot/assets/reel_music.m4a` se usa como pista (con fade final) — para
cambiar la música alcanza con reemplazar ese archivo por cualquier track
con licencia. Si no existe, sale con pista silenciosa AAC.
"""

import io
import math
import os
import re
import subprocess
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

from story import (
    WHITE, _font, _fmt, _pegar_personaje, _ribbon_temporada, _stamp_cazado,
    pose_personaje,
)

W, H = 1080, 1920
FPS = 30
# gancho corto (el que no enganchó en 2 s ya se fue) y más aire para el precio
DUR_HOOK, DUR_PROD, DUR_PRICE = 1.6, 3.4, 2.5
FADE = 0.18  # segundos de fundido en los cortes
# La tarjeta de la web tiene que verse ENTERA (sin el fundido de entrada)
# al menos CIERRE_MIN_S segundos, y es lo último del video.
CIERRE_MIN_S = 3.0
DUR_CLOSE = 3.5

# Paleta de marca (la misma de las placas BF y los botones del sitio)
AMARILLO = (250, 204, 21)   # #FACC15
NARANJA = (245, 158, 11)    # #F59E0B, los rayos
NEGRO = (13, 13, 13)

# safe area de reels/stories de IG: la UI tapa ~14% arriba y ~20% abajo.
# Las barras de marca y todo el texto van entre SAFE_TOP y SAFE_BOTTOM.
SAFE_TOP = int(H * 0.14)      # 268
SAFE_BOTTOM = int(H * 0.80)   # 1536
BAR_H = 100
CONTENT_TOP = SAFE_TOP + BAR_H          # 368
CONTENT_BOTTOM = SAFE_BOTTOM - BAR_H    # 1436

RAYOS = 28                # cantidad de rayos (mitad amarillos, mitad naranjas)
CENTRO_RAYOS = (W // 2, 820)


def _ease_out(t: float) -> float:
    return 1 - (1 - t) ** 4


@lru_cache(maxsize=1)
def _fondo_rayos() -> Image.Image:
    """Fondo de rayos naranja/amarillo que salen de un centro, con un brillo
    amarillo en el medio para que el producto y el texto negro resalten.
    Se calcula una sola vez por proceso (es igual en todos los frames)."""
    img = Image.new("RGB", (W, H), AMARILLO)
    d = ImageDraw.Draw(img)
    cx, cy = CENTRO_RAYOS
    r = math.hypot(W, H)  # alcanza las esquinas
    paso = 2 * math.pi / RAYOS
    for i in range(0, RAYOS, 2):
        a0, a1 = i * paso, (i + 1) * paso
        d.polygon([(cx, cy),
                   (cx + r * math.cos(a0), cy + r * math.sin(a0)),
                   (cx + r * math.cos(a1), cy + r * math.sin(a1))], fill=NARANJA)
    # brillo central: un disco amarillo difuminado tapa la punta de los rayos
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse([cx - 330, cy - 330, cx + 330, cy + 330], fill=235)
    glow = glow.filter(ImageFilter.GaussianBlur(140))
    return Image.composite(Image.new("RGB", (W, H), AMARILLO), img, glow)


def _base() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    """Lienzo de todas las escenas: rayos + barra negra arriba con la marca y
    barra negra abajo con la cuenta, ambas dentro del área segura de IG."""
    img = _fondo_rayos().copy()
    d = ImageDraw.Draw(img)
    d.rectangle([0, SAFE_TOP, W, CONTENT_TOP], fill=NEGRO)
    d.text((W // 2, SAFE_TOP + BAR_H // 2), "CAZADOR DE OFERTAS AR", font=_font(46),
           fill=AMARILLO, anchor="mm")
    d.rectangle([0, CONTENT_BOTTOM, W, SAFE_BOTTOM], fill=NEGRO)
    d.text((W // 2, CONTENT_BOTTOM + BAR_H // 2), "@elcazadordeofertas.ar", font=_font(38),
           fill=AMARILLO, anchor="mm")
    return img, d


def _personaje_entra(img: Image.Image, pose: str, box: tuple[int, int, int, int],
                     t: float, t0: float) -> None:
    """Don Ofertín entra deslizándose desde la izquierda a partir de t0 (0,4 s)."""
    if t < t0:
        return
    dx = int(-(box[2] + 40) * (1 - _ease_out(min((t - t0) / 0.4, 1.0))))
    x0, y0, x1, y1 = box
    _pegar_personaje(img, pose, (x0 + dx, y0, x1 + dx, y1))


def _mascara_redonda(img: Image.Image, radius: int) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, *img.size], radius=radius, fill=255)
    return mask


_TITLE_FILLER = {
    "blanco", "blanca", "negro", "negra", "gris", "plateado", "plateada",
    "plata", "azul", "rojo", "roja", "verde", "wifi", "wi-fi",
}


def _wrap_no_ellipsis(draw: ImageDraw.ImageDraw, text: str, font, max_w: int, max_lines: int = 2):
    """Parte en líneas y corta en la última palabra completa, sin agregar
    puntos suspensivos (nada de "-…")."""
    words, lines, cur = text.split(), [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if draw.textlength(cand, font=font) <= max_w:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            cur = w
            if len(lines) == max_lines:
                return lines
    if cur:
        lines.append(cur)
    return lines[:max_lines]


def _acortar_titulo(draw: ImageDraw.ImageDraw, title: str, font, max_w: int, max_lines: int = 2):
    """Acorta el título para el reel: corta en el primer separador fuerte
    (" - ", " | ", ","), y si igual no entra en `max_lines` saca relleno
    (colores, "WiFi") antes de cortar por palabra."""
    short = re.split(r"\s[-|]\s|,", title, maxsplit=1)[0].strip()
    lines = _wrap_no_ellipsis(draw, short, font, max_w, max_lines)
    fits = sum(len(line.split()) for line in lines) >= len(short.split())
    if not fits:
        words = [w for w in short.split() if w.lower() not in _TITLE_FILLER]
        trimmed = " ".join(words)
        if trimmed and trimmed != short:
            lines = _wrap_no_ellipsis(draw, trimmed, font, max_w, max_lines)
    return lines


def _scene_hook(deal: dict, t: float) -> Image.Image:
    img, d = _base()
    k = _ease_out(min(t / 0.35, 1.0))
    scale = 1.25 - 0.25 * k
    d.text((W // 2, 640), "LA CAZA", font=_font(int(150 * scale)), fill=NEGRO, anchor="mm")
    d.text((W // 2, 800), "DEL DÍA", font=_font(int(150 * scale)), fill=NEGRO, anchor="mm")
    d.text((W // 2, 930), "esperá que la veas…", font=_font(44), fill=NEGRO, anchor="mm")
    _personaje_entra(img, "lupa", (W // 2 - 220, 990, W // 2 + 220, CONTENT_BOTTOM - 6), t, 0.15)
    return img


def _make_card(image_bytes: bytes, size: int = 1400) -> Image.Image:
    """Tarjeta blanca con la foto, renderizada grande para poder zoomear."""
    card = Image.new("RGB", (size, size), WHITE)
    prod = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    prod = ImageOps.contain(prod, (size - 140, size - 140))
    card.paste(prod, ((size - prod.width) // 2, (size - prod.height) // 2))
    return card


def _scene_producto(deal: dict, card: Image.Image, t: float) -> Image.Image:
    img, d = _base()

    # Ken Burns: zoom 1,00 → 1,10 lineal sobre la tarjeta pre-renderizada
    zoom = 1.0 + 0.10 * (t / DUR_PROD)
    target = 820
    crop = int(card.width / zoom)
    off = (card.width - crop) // 2
    frame_card = card.crop((off, off, off + crop, off + crop)).resize((target, target), Image.BILINEAR)
    top = CONTENT_TOP + 40
    img.paste(frame_card, ((W - target) // 2, top), _mascara_redonda(frame_card, 48))
    _stamp_cazado(img, ((W - target) // 2 + 120, top + target - 30), 1.1)

    title_f = _font(54)
    y = top + target + 70
    for line in _acortar_titulo(d, deal["title"], title_f, 960):
        d.text((W // 2, y), line, font=title_f, fill=NEGRO, anchor="mm")
        y += 70
    return img


def _scene_precio(deal: dict, thumb: Image.Image, t: float) -> Image.Image:
    img, d = _base()

    # el producto sigue presente durante la revelación (continuidad visual)
    img.paste(thumb, ((W - thumb.width) // 2, CONTENT_TOP + 30), _mascara_redonda(thumb, 36))
    y = CONTENT_TOP + 30 + thumb.height

    # solo el precio de hoy, con pop (sin precio anterior ni descuento); la
    # web va en la escena de cierre, entera
    d.text((W // 2, y + 60), "PRECIO DE HOY", font=_font(52), fill=NEGRO, anchor="mm")
    k = _ease_out(min(t / 0.4, 1.0))
    price_f = _font(int(140 * (1.12 - 0.12 * k)))
    precio = _fmt(deal["price_cur"])
    cy = y + 200
    pw = d.textlength(precio, font=price_f)
    d.rounded_rectangle([W / 2 - pw / 2 - 40, cy - 95, W / 2 + pw / 2 + 40, cy + 95],
                        radius=40, fill=NEGRO)
    d.text((W // 2, cy), precio, font=price_f, fill=AMARILLO, anchor="mm")

    sello = (deal.get("sello_temporada") or "").strip()
    if sello:
        _ribbon_temporada(d, W // 2, cy + 140, sello, font_size=32)
    _personaje_entra(img, pose_personaje(deal), (20, cy + 110, 300, CONTENT_BOTTOM - 4), t, 0.8)
    return img


def _scene_close(deal: dict, t: float) -> Image.Image:
    img, d = _base()

    d.text((W // 2, CONTENT_TOP + 90), "TODAS LAS OFERTAS", font=_font(72), fill=NEGRO, anchor="mm")
    d.text((W // 2, CONTENT_TOP + 175), "DE HOY EN", font=_font(72), fill=NEGRO, anchor="mm")

    # caja negra con la web, grande y entera dentro del área segura
    url = "cazadordeofertas.com.ar/ig"
    size = 60
    while size > 36 and d.textlength(url, font=_font(size)) > W - 200:
        size -= 2
    box_top, box_bot = CONTENT_TOP + 250, CONTENT_TOP + 500
    d.rounded_rectangle([60, box_top, W - 60, box_bot], radius=40, fill=NEGRO)
    d.text((W // 2, box_top + 80), "ENTRÁ A", font=_font(56), fill=WHITE, anchor="mm")
    d.text((W // 2, box_top + 170), url, font=_font(size), fill=AMARILLO, anchor="mm")

    d.text((W // 2, box_bot + 70), "seguime para la próxima caza", font=_font(40), fill=NEGRO, anchor="mm")
    _personaje_entra(img, "festejando", (W // 2 - 200, box_bot + 120, W // 2 + 200, CONTENT_BOTTOM - 4),
                     t, 0.2)
    return img


def _ffmpeg_cmd(out_path: Path, n_frames: int, fade_audio: float) -> list[str]:
    """Comando de ffmpeg que NO recorta el final del video.

    Antes iba con `-shortest`, que puede comerse los últimos frames (justo el
    cierre con la web). Ahora el video manda: el audio se limita con `-t` a
    la duración exacta de los frames y el fade de audio termina ahí, así que
    nunca acorta el video. El último frame es el cierre entero, sin fundido."""
    dur_s = n_frames / FPS
    dur = f"{dur_s:.3f}"
    ffmpeg = os.getenv("FFMPEG_BIN", "ffmpeg")
    music = Path(__file__).parent / "assets" / "reel_music.m4a"
    if music.exists():
        audio_in = ["-stream_loop", "-1", "-t", dur, "-i", str(music)]
        audio_opts = ["-af", f"afade=t=out:st={dur_s - fade_audio:.3f}:d={fade_audio}",
                      "-b:a", "128k"]
    else:
        audio_in = ["-f", "lavfi", "-t", dur, "-i", "anullsrc=r=44100:cl=stereo"]
        audio_opts = ["-b:a", "64k"]
    return [
        ffmpeg, "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        *audio_in,
        "-map", "0:v", "-map", "1:a",
        "-frames:v", str(n_frames),
        "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p",
        "-c:a", "aac", *audio_opts,
        "-movflags", "+faststart",
        str(out_path),
    ]


def render_reel(deal: dict, image_bytes: bytes, out_path: str | Path) -> Path:
    """Única función de render del reel: fondo de rayos amarillo/naranja."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    card = _make_card(image_bytes)
    total = DUR_HOOK + DUR_PROD + DUR_PRICE + DUR_CLOSE
    n_frames = round(total * FPS)

    proc = subprocess.Popen(_ffmpeg_cmd(out_path, n_frames, fade_audio=1.0),
                            stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    black = Image.new("RGB", (W, H), NEGRO)
    thumb = card.resize((480, 480), Image.LANCZOS)
    # cortes de escena: gancho | producto | precio | cierre con la web
    bounds = (DUR_HOOK, DUR_HOOK + DUR_PROD, DUR_HOOK + DUR_PROD + DUR_PRICE)
    for i in range(n_frames):
        ts = i / FPS
        if ts < bounds[0]:
            frame = _scene_hook(deal, ts)
        elif ts < bounds[1]:
            frame = _scene_producto(deal, card, ts - bounds[0])
        elif ts < bounds[2]:
            frame = _scene_precio(deal, thumb, ts - bounds[1])
        else:
            frame = _scene_close(deal, ts - bounds[2])

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


if __name__ == "__main__":
    # prueba local: deal sintético con imagen gris
    buf = io.BytesIO()
    Image.new("RGB", (900, 900), (228, 228, 233)).save(buf, "JPEG")
    deal = {
        "title": "Freidora De Aire Moulinex Easy Fry Surface Xl 4l Negro",
        "price_cur": 141990,
    }
    out = render_reel(deal, buf.getvalue(), "reel-test.mp4")
    print(f"OK → {out}")
