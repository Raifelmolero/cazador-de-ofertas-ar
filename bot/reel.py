"""
Genera el reel 9:16 (MP4 ~11 s) con Pillow + ffmpeg.

Cuatro escenas con la estética de la marca (negro/ámbar, sello CAZADO):
  1. Gancho (1,6 s): "LA CAZA DEL DÍA"
  2. Producto (3,4 s): tarjeta blanca con zoom lento (Ken Burns) + título
  3. Precio (2,5 s): precio de hoy con pop
  4. Cierre (>= 3 s a pantalla completa): la web cazadordeofertas.com.ar/ig

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
import os
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

from story import (
    AMBER, BG, BLACK, GRAY, STAMP_RED, WHITE,
    _font, _fmt, _pegar_personaje, _ribbon_temporada, _stamp_cazado, _wrap,
    pose_personaje,
)

W, H = 1080, 1920
FPS = 30
# gancho corto (el que no enganchó en 2 s ya se fue) y más aire para el
# contador de precio del cierre
DUR_HOOK, DUR_PROD, DUR_PRICE = 1.6, 3.4, 2.5
FADE = 0.18  # segundos de fundido en los cortes
# La tarjeta de la web tiene que verse ENTERA (sin el fundido de entrada)
# al menos CIERRE_MIN_S segundos, y es lo último del video.
CIERRE_MIN_S = 3.0
DUR_CLOSE = 3.5


def _ease_out(t: float) -> float:
    return 1 - (1 - t) ** 4


def _personaje_entra(img: Image.Image, deal: dict, box: tuple[int, int, int, int],
                     t: float, t0: float) -> None:
    """Don Ofertín entra deslizándose desde la izquierda a partir de t0 (0,4 s)."""
    if t < t0:
        return
    dx = int(-(box[2] + 40) * (1 - _ease_out(min((t - t0) / 0.4, 1.0))))
    x0, y0, x1, y1 = box
    _pegar_personaje(img, pose_personaje(deal), (x0 + dx, y0, x1 + dx, y1))


def _scene_hook(deal: dict, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.text((W // 2, 210), "CAZADOR DE OFERTAS AR", font=_font(46), fill=AMBER, anchor="mm")
    d.text((W // 2, 268), "ofertas verificadas de MercadoLibre", font=_font(30, bold=False), fill=GRAY, anchor="mm")

    d.text((W // 2, 760), "LA CAZA", font=_font(150), fill=WHITE, anchor="mm")
    d.text((W // 2, 920), "DEL DÍA", font=_font(150), fill=AMBER, anchor="mm")

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

    # solo el precio de hoy, con pop (sin precio anterior ni descuento); la
    # web va en la escena de cierre, entera y a pantalla completa
    d.text((W // 2, 860), "PRECIO DE HOY", font=_font(52), fill=WHITE, anchor="mm")
    k = _ease_out(min(t / 0.4, 1.0))
    d.text((W // 2, 1030), _fmt(deal["price_cur"]), font=_font(int(170 * (1.12 - 0.12 * k))),
           fill=AMBER, anchor="mm")
    _personaje_entra(img, deal, (0, 1170, 300, 1555), t, 0.8)
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
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    card = _make_card(image_bytes)
    total = DUR_HOOK + DUR_PROD + DUR_PRICE + DUR_CLOSE
    n_frames = round(total * FPS)

    proc = subprocess.Popen(_ffmpeg_cmd(out_path, n_frames, fade_audio=1.0),
                            stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    black = Image.new("RGB", (W, H), (0, 0, 0))
    thumb = card.resize((520, 520), Image.LANCZOS)
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
            frame = _scene_close_v2(deal, ts - bounds[2])

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

FADE_V2 = 0.28  # fundidos un poco más largos que v1 para que se sientan suaves
# cierre: CIERRE_MIN_S entero + el fundido de entrada + margen (3,5 s)
DUR_HOOK_V2, DUR_MAIN_V2, DUR_CLOSE_V2 = 1.0, 4.5, 3.5

# safe area de reels/stories de IG: la UI tapa ~14% arriba y ~20% abajo.
# Todo texto/badge/sello relevante va entre SAFE_TOP y SAFE_BOTTOM.
SAFE_TOP = int(H * 0.14)
SAFE_BOTTOM = int(H * 0.80)


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

    # único mensaje de esta escena, centrado en el área segura. Sin % ni
    # "mínimo histórico" (regla 24/11/2026).
    k = _ease_out(min(t / 0.35, 1.0))
    scale = 1.35 - 0.35 * k
    cy = (SAFE_TOP + SAFE_BOTTOM) // 2
    d.text((W // 2, cy - 90), "LA CAZA", font=_font(int(150 * scale)), fill=WHITE, anchor="mm")
    d.text((W // 2, cy + 80), "DEL DÍA", font=_font(int(150 * scale)), fill=AMBER, anchor="mm")
    return img


_TITLE_FILLER = {
    "blanco", "blanca", "negro", "negra", "gris", "plateado", "plateada",
    "plata", "azul", "rojo", "roja", "verde", "wifi", "wi-fi",
}


def _wrap_no_ellipsis(draw: ImageDraw.ImageDraw, text: str, font, max_w: int, max_lines: int = 2):
    """Como `_wrap` pero corta en la última palabra completa, sin agregar
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


def _shorten_title_v2(draw: ImageDraw.ImageDraw, title: str, font, max_w: int, max_lines: int = 2):
    """Acorta el título de forma inteligente para el reel: corta en el
    primer separador fuerte (" - ", " | ", ","), y si igual no entra en
    `max_lines` saca relleno (colores, "WiFi") antes de cortar por palabra."""
    short = re.split(r"\s[-|]\s|,", title, maxsplit=1)[0].strip()

    lines = _wrap_no_ellipsis(draw, short, font, max_w, max_lines)
    fits = sum(len(line.split()) for line in lines) >= len(short.split())
    if not fits:
        words = [w for w in short.split() if w.lower() not in _TITLE_FILLER]
        trimmed = " ".join(words)
        if trimmed and trimmed != short:
            lines = _wrap_no_ellipsis(draw, trimmed, font, max_w, max_lines)
    return lines


def _scene_main_v2(deal: dict, hero: Image.Image, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    # producto a pantalla completa arriba (protagonista, sin marco blanco);
    # puede pisar el 14% superior porque ahí solo hay imagen, sin texto
    ph = 1000
    zoom = 1.0 + 0.06 * (t / DUR_MAIN_V2)
    crop = int(hero.width / zoom)
    off = (hero.width - crop) // 2
    frame = hero.crop((off, off, off + crop, off + crop)).resize((W, ph), Image.BILINEAR)
    img.paste(frame, (0, 0))

    # velo inferior para que el precio se lea siempre, sobre cualquier foto
    grad = Image.new("L", (1, ph), 0)
    for y in range(ph):
        grad.putpixel((0, y), int(255 * max(0.0, (y - ph * 0.55) / (ph * 0.45))))
    grad = grad.resize((W, ph))
    dark = Image.new("RGB", (W, ph), BG)
    img.paste(Image.composite(dark, img.crop((0, 0, W, ph)), grad), (0, 0))
    d = ImageDraw.Draw(img)

    title_f = _font(46)
    title_lines = _shorten_title_v2(d, deal["title"], title_f, 940)
    sello = (deal.get("sello_temporada") or "").strip()
    show_ribbon = bool(sello)

    # bloque título+precio centrado en el espacio oscuro que queda debajo
    # del producto (respetando el 20% inferior, reservado para la UI de IG).
    # Solo título y precio de hoy: sin precio anterior, %, ahorro ni mínimo.
    line_h = 58
    gap_title_price = 34
    price_h = 150
    ribbon_gap, ribbon_h = (24, 46) if show_ribbon else (0, 0)
    block_h = len(title_lines) * line_h + gap_title_price + price_h + ribbon_gap + ribbon_h
    avail_top, avail_bottom = ph, SAFE_BOTTOM
    y = avail_top + max(20, (avail_bottom - avail_top - block_h) // 2)

    for line in title_lines:
        d.text((W // 2, y), line, font=title_f, fill=WHITE, anchor="mm")
        y += line_h
    y += gap_title_price

    # precio: entra con pop apenas arranca la escena
    k = _ease_out(min(t / 0.4, 1.0))
    price_f = _font(int(132 * (1.12 - 0.12 * k)))
    d.text((W // 2, y + price_h // 2), _fmt(deal["price_cur"]), font=price_f, fill=AMBER, anchor="mm")
    y += price_h
    if show_ribbon:
        y += ribbon_gap + ribbon_h // 2
        _ribbon_temporada(d, W // 2, y, sello, font_size=32)
    return img


def _scene_close_v2(deal: dict, t: float) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # único sello CAZADO de todo el video, en el cierre
    _stamp_cazado(img, (W // 2, SAFE_TOP + 100), 1.7)

    banner_top, banner_bot = 900, 1140
    d.rectangle([0, banner_top, W, banner_bot], fill=AMBER)
    d.text((W // 2, banner_top + 85), "ENTRÁ A", font=_font(56), fill=BLACK, anchor="mm")
    d.text((W // 2, banner_top + 165), "cazadordeofertas.com.ar/ig", font=_font(40), fill=BLACK, anchor="mm")

    d.text((W // 2, banner_bot + 100), "@elcazadordeofertas.ar", font=_font(36, bold=False), fill=GRAY, anchor="mm")
    d.text((W // 2, banner_bot + 165), "seguime para la próxima caza", font=_font(34), fill=WHITE, anchor="mm")
    # Don Ofertín entre el sello y el banner
    _personaje_entra(img, deal, (W // 2 - 190, banner_top - 380, W // 2 + 190, banner_top - 10), t, 0.2)
    return img


def render_reel_v2(deal: dict, image_bytes: bytes, out_path: str | Path) -> Path:
    """Variante rápida y agresiva del reel (9 s): hook en 1 s, producto
    protagonista a pantalla completa, precio gigante y cierre con CTA fuerte.
    No reemplaza a `render_reel`."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    hero = _hero_crop(image_bytes, 1400)
    total = DUR_HOOK_V2 + DUR_MAIN_V2 + DUR_CLOSE_V2
    n_frames = round(total * FPS)

    proc = subprocess.Popen(_ffmpeg_cmd(out_path, n_frames, fade_audio=0.6),
                            stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

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
            if abs(ts - b) < FADE_V2:
                alpha = min(alpha, abs(ts - b) / FADE_V2)
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
