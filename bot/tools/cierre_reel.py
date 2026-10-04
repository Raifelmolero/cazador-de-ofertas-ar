"""Le agrega a un reel vertical hecho con IA (720x1280) un texto gancho
arriba durante todo el video y un CIERRE de 3 s al final con la foto del
producto real, el precio, "Link en la bio" y Don Ofertín.

Uso:
  python bot/tools/cierre_reel.py ENTRADA.mp4 SALIDA.mp4 --gancho "Cuando tu señora pregunta cuánto salió 👀"
      [--deal-id MLA123 | --titulo "..." --precio 1234567 --imagen URL_o_ruta [--antes 2000000]]
      [--buscar freidora] [--sin-ding]

Sin producto elige solo una oferta de ticket alto de hogar/electro que esté
hoy en el sitio (frontend/data/productos_rentables.json): primero las que
están en mínimo histórico, después la de mayor ganancia esperada según el
bot. --buscar restringe la elección a títulos con esas palabras.

Los emojis se dibujan con la fuente de emojis del sistema (Segoe UI Emoji
en Windows, Noto Color Emoji en Linux); si no hay, se sacan del texto en vez
de dejar cuadraditos. Necesita ffmpeg/ffprobe (PATH o WinGet).
"""

import argparse
import json
import math
import shutil
import struct
import subprocess
import sys
import tempfile
import unicodedata
import urllib.request
import wave
from datetime import datetime, timezone
from glob import glob
from io import BytesIO
from pathlib import Path
from typing import Callable

from PIL import Image, ImageDraw, ImageFont, ImageOps

BOT = Path(__file__).resolve().parents[1]
DATOS = BOT.parent / "frontend" / "data"
PERSONAJE = BOT / "assets" / "personaje"
AMARILLO, NEGRO, BLANCO, GRIS = "#FACC15", "#09090B", "#FFFFFF", "#A1A1AA"
W, H = 720, 1280
LIBRE_ARRIBA = 120   # zona de la interfaz de IG: el gancho arranca debajo
DUR_CIERRE = 3.0
TICKET_ALTO = 150_000
DESCUENTO_MIN = 20
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

# Hogar/electro con ticket alto (palabras sin tildes, en minúscula).
HOGAR_ELECTRO = [
    "heladera", "freezer", "lavarropas", "secarropas", "lavavajillas", "cocina",
    "horno", "anafe", "microondas", "aire acondicionado", "split", "climatizador",
    "ventilador", "calefactor", "estufa", "termotanque", "calefon", "aspiradora",
    "freidora", "cafetera", "smart tv", "televisor", "colchon", "sommier",
    "purificador", "licuadora", "batidora", "procesadora", "pava electrica",
]
EXCLUIR = [
    "repuesto", "accesorio", "funda", "soporte", "filtro", "control remoto",
    "cuchillo", "utensilio", "organizador", "bandeja", "molde", "manguera",
    "cable", "burlete", "protector", "cubre",
]


# ---------------------------------------------------------------- lógica pura

def _norm(s: str) -> str:
    s = unicodedata.normalize("NFD", (s or "").lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def formatear_precio(n) -> str:
    """1234567 -> "$ 1.234.567" (sin decimales, punto de miles)."""
    return "$ " + f"{int(round(float(n))):,}".replace(",", ".")


def parsear_precio(s) -> int:
    """"$ 1.234.567" / "1234567" / 1234567.0 -> 1234567."""
    if isinstance(s, (int, float)):
        return int(round(s))
    digitos = "".join(c for c in str(s).split(",")[0] if c.isdigit())
    if not digitos:
        raise ValueError(f"precio inválido: {s!r}")
    return int(digitos)


def es_hogar_electro(titulo: str) -> bool:
    t = _norm(titulo)
    return any(k in t for k in HOGAR_ELECTRO) and not any(k in t for k in EXCLUIR)


def _producto(id_ml, titulo, precio, antes, imagen, url=None, minimo=False) -> dict:
    precio = parsear_precio(precio)
    antes = parsear_precio(antes) if antes else None
    descuento = round(100 * (1 - precio / antes)) if antes and antes > precio else None
    return {"id": id_ml, "titulo": (titulo or "").strip(), "precio": precio,
            "precio_anterior": antes, "descuento": descuento, "imagen": imagen,
            "url": url, "minimo": bool(minimo)}


def desde_rentable(it: dict) -> dict:
    p = _producto(it.get("id_ml"), it.get("titulo"), it.get("precio_actual"),
                  it.get("precio_anterior"), it.get("url_imagen"), it.get("url_producto"),
                  it.get("minimo_historico"))
    if it.get("descuento_pct"):
        p["descuento"] = int(it["descuento_pct"])
    return p


def desde_seguimiento(id_ml: str, it: dict) -> dict:
    ultimo = it["serie"][-1][1]
    return _producto(id_ml, it.get("titulo"), ultimo, it.get("precio_lista"), it.get("img"),
                     it.get("url"), ultimo <= it.get("min", 0))


def elegir_producto(items: list[dict], buscar: str | None = None,
                    minimo: int = TICKET_ALTO) -> dict | None:
    """De los items de productos_rentables.json, la oferta de hogar/electro
    con foto, precio >= minimo y descuento >= DESCUENTO_MIN que más conviene
    mostrar: primero mínimos históricos, después la de mayor ganancia
    esperada del bot (`prioridad`), y a igualdad el mayor ahorro en pesos."""
    palabras = _norm(buscar).split() if buscar else []
    candidatos = []
    for it in items:
        titulo = _norm(it.get("titulo", ""))
        if not it.get("url_imagen") or not titulo:
            continue
        if (it.get("precio_actual") or 0) < minimo or (it.get("descuento_pct") or 0) < DESCUENTO_MIN:
            continue
        if palabras:
            if not all(p in titulo for p in palabras):
                continue
        elif not es_hogar_electro(titulo):
            continue
        candidatos.append(it)
    if not candidatos:
        return None

    def clave(it: dict):
        ahorro = (it.get("precio_anterior") or 0) - (it.get("precio_actual") or 0)
        return (not it.get("minimo_historico"), -(it.get("prioridad") or 0), -ahorro)

    return desde_rentable(min(candidatos, key=clave))


def buscar_por_id(deal_id: str, rentables: list[dict], seguimiento: dict) -> dict | None:
    deal_id = deal_id.strip().upper().replace("-", "")
    for it in rentables:
        if str(it.get("id_ml", "")).upper() == deal_id:
            return desde_rentable(it)
    it = seguimiento.get(deal_id)
    if it and it.get("serie"):
        return desde_seguimiento(deal_id, it)
    return None


def _un_espacio(t: str) -> str:
    """Colapsa espacios repetidos sin perder el de cada borde."""
    medio = " ".join(t.split())
    if not medio:
        return " " if t else ""
    return (" " if t[0] == " " else "") + medio + (" " if t[-1] == " " else "")


def segmentar(texto: str, dibuja_txt: Callable[[str], bool],
              dibuja_emoji: Callable[[str], bool]) -> list[tuple[str, bool]]:
    """Parte el texto en tramos (texto, es_emoji). Lo que ninguna fuente
    dibuja se descarta (nada de cuadraditos); los espacios sobrantes también."""
    tramos: list[tuple[str, bool]] = []
    for ch in texto:
        if ch in "\ufe0f\u200d":   # selector de variación / unión de emojis
            continue
        if ch.isspace() or dibuja_txt(ch):
            es_emoji = False
            ch = " " if ch.isspace() else ch
        elif dibuja_emoji(ch):
            es_emoji = True
        else:
            continue
        if tramos and tramos[-1][1] == es_emoji:
            tramos[-1] = (tramos[-1][0] + ch, es_emoji)
        else:
            tramos.append((ch, es_emoji))
    # espacios: sin dobles (quedan al sacar un emoji del medio) ni en los bordes
    tramos = [(t if e else _un_espacio(t), e) for t, e in tramos]
    if tramos and not tramos[0][1]:
        tramos[0] = (tramos[0][0].lstrip(), False)
    if tramos and not tramos[-1][1]:
        tramos[-1] = (tramos[-1][0].rstrip(), False)
    return [t for t in tramos if t[0]]


def partir_lineas(texto: str, medir: Callable[[str], float], ancho: float) -> list[str]:
    """Corta en la menor cantidad de líneas que entran en `ancho` y reparte las
    palabras para que las líneas queden parejas (no "línea larga + palabra suelta")."""
    palabras = texto.split()
    if not palabras:
        return []
    n, actual = 1, ""
    for p in palabras:
        cand = f"{actual} {p}".strip()
        if actual and medir(cand) > ancho:
            n, actual = n + 1, p
        else:
            actual = cand

    memo: dict[tuple[int, int], tuple[float, tuple[str, ...]]] = {}

    def mejor(i: int, k: int) -> tuple[float, tuple[str, ...]]:
        if (i, k) in memo:
            return memo[i, k]
        if k == 1:
            linea = " ".join(palabras[i:])
            res = (medir(linea), (linea,))
        else:
            res = None
            for j in range(i + 1, len(palabras) - k + 2):
                linea = " ".join(palabras[i:j])
                resto = mejor(j, k - 1)
                cand = (max(medir(linea), resto[0]), (linea,) + resto[1])
                if res is None or cand[0] < res[0]:
                    res = cand
        memo[i, k] = res
        return res

    return list(mejor(0, min(n, len(palabras)))[1])


# ---------------------------------------------------------------- fuentes

_FUENTES_EMOJI = [
    "seguiemj.ttf", "C:/Windows/Fonts/seguiemj.ttf",
    "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", "NotoColorEmoji.ttf",
    "/System/Library/Fonts/Apple Color Emoji.ttc",
]


def fuente(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    nombres = ["arialbd.ttf", "DejaVuSans-Bold.ttf"] if bold else ["arial.ttf", "DejaVuSans.ttf"]
    for n in nombres:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default(size)


def _fuente_emoji(size: int):
    """(fuente, tamaño nativo). Las de bitmap (Noto, Apple) solo cargan en
    tamaños fijos: se dibujan en el suyo y se escalan."""
    for nombre in _FUENTES_EMOJI:
        for s in (size, 109, 160, 96, 64):
            try:
                return ImageFont.truetype(nombre, s), s
            except OSError:
                continue
    return None, 0


def _mascara(f, ch: str):
    try:
        m = f.getmask(ch)
        return (m.size, bytes(m))
    except Exception:  # noqa: BLE001 — fuente que no sabe dibujarlo
        return None


class Texto:
    """Fuente de texto + fuente de emojis del mismo tamaño visual."""

    _NO_EXISTE = "\U000E0FFF"  # sin glifo en ninguna fuente: da el cuadradito

    def __init__(self, size: int, bold: bool = True):
        self.size = size
        self.f = fuente(size, bold)
        self.fe, self.fe_size = _fuente_emoji(size)
        self._cache: dict[tuple[bool, str], bool] = {}
        self._img: dict[str, Image.Image] = {}
        self._tofu = _mascara(self.f, self._NO_EXISTE)
        self._tofu_e = _mascara(self.fe, self._NO_EXISTE) if self.fe else None

    def _dibuja(self, emoji: bool, ch: str) -> bool:
        if (emoji, ch) not in self._cache:
            f, tofu = (self.fe, self._tofu_e) if emoji else (self.f, self._tofu)
            m = _mascara(f, ch) if f else None
            self._cache[emoji, ch] = m is not None and m != tofu and m[0] != (0, 0)
        return self._cache[emoji, ch]

    def tramos(self, texto: str) -> list[tuple[str, bool]]:
        return segmentar(texto, lambda c: self._dibuja(False, c), lambda c: self._dibuja(True, c))

    def limpiar(self, texto: str) -> str:
        return "".join(t for t, _ in self.tramos(texto))

    def _emoji(self, ch: str) -> Image.Image:
        if ch not in self._img:
            tmp = ImageDraw.Draw(Image.new("RGBA", (4, 4)))
            x0, y0, x1, y1 = tmp.textbbox((0, 0), ch, font=self.fe, embedded_color=True)
            im = Image.new("RGBA", (max(1, x1 - x0), max(1, y1 - y0)), (0, 0, 0, 0))
            ImageDraw.Draw(im).text((-x0, -y0), ch, font=self.fe, embedded_color=True)
            alto = round(self.size * 0.98)
            self._img[ch] = im.resize((max(1, round(im.width * alto / im.height)), alto), Image.LANCZOS)
        return self._img[ch]

    def medir(self, texto: str) -> float:
        total = 0.0
        for t, es_emoji in self.tramos(texto):
            if es_emoji:
                total += sum(self._emoji(c).width + self.size * 0.06 for c in t)
            else:
                total += self.f.getlength(t)
        return total

    def dibujar(self, img: Image.Image, x: float, base: float, texto: str, fill,
                borde: int = 0) -> None:
        """Escribe con la línea de base en `base` (los emojis van centrados
        en la altura de las mayúsculas)."""
        d = ImageDraw.Draw(img)
        for t, es_emoji in self.tramos(texto):
            if es_emoji:
                for c in t:
                    em = self._emoji(c)
                    x += self.size * 0.03
                    img.paste(em, (round(x), round(base - self.size * 0.36 - em.height / 2)), em)
                    x += em.width + self.size * 0.03
            else:
                d.text((x, base), t, font=self.f, fill=fill, anchor="ls",
                       stroke_width=borde, stroke_fill=NEGRO)
                x += self.f.getlength(t)

    def centrado(self, img: Image.Image, cx: float, base: float, texto: str, fill, borde: int = 0) -> None:
        self.dibujar(img, cx - self.medir(texto) / 2, base, texto, fill, borde)


# ---------------------------------------------------------------- imágenes

def render_gancho(texto: str, w: int = W, h: int = H) -> Image.Image:
    """Capa transparente con el gancho en una franja semitransparente arriba
    (debajo de los 120 px de la interfaz de IG), máximo 2 líneas si entra."""
    margen, pad_x, pad_y = 28, 26, 18
    for size in range(58, 33, -2):
        t = Texto(size)
        lineas = partir_lineas(t.limpiar(texto), t.medir, w - 2 * (margen + pad_x))
        if len(lineas) <= 2:
            break
    capa = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    if not lineas:
        return capa
    alto_linea = round(t.size * 1.2)
    ancho = max(t.medir(li) for li in lineas) + 2 * pad_x
    x0, y0 = (w - ancho) / 2, LIBRE_ARRIBA
    y1 = y0 + len(lineas) * alto_linea + 2 * pad_y
    ImageDraw.Draw(capa).rounded_rectangle((x0, y0, x0 + ancho, y1), radius=26,
                                           fill=(9, 9, 11, 170), outline=AMARILLO, width=3)
    texto_capa = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for i, li in enumerate(lineas):
        base = y0 + pad_y + i * alto_linea + t.size * 0.93
        t.centrado(texto_capa, w / 2, base, li, BLANCO, borde=2)
    return Image.alpha_composite(capa, texto_capa)


def cargar_foto(src: str) -> Image.Image:
    if src.startswith(("http://", "https://")):
        req = urllib.request.Request(src, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            datos = r.read()
        im = Image.open(BytesIO(datos))
    else:
        im = Image.open(src)
    im = im.convert("RGBA")
    fondo = Image.new("RGBA", im.size, BLANCO)
    im = Image.alpha_composite(fondo, im).convert("RGB")
    # las fotos de ML traen mucho margen blanco: se recorta para que el
    # producto ocupe la tarjeta
    caja = ImageOps.invert(im.convert("L")).point(lambda v: 255 if v > 14 else 0).getbbox()
    if caja:
        m = 10
        im = im.crop((max(0, caja[0] - m), max(0, caja[1] - m),
                      min(im.width, caja[2] + m), min(im.height, caja[3] + m)))
    return im


def _recortar(t: Texto, texto: str, ancho: int, max_lineas: int = 2) -> list[str]:
    lineas = partir_lineas(t.limpiar(texto), t.medir, ancho)
    if len(lineas) <= max_lineas:
        return lineas
    ultima = " ".join(lineas[max_lineas - 1:])
    while ultima and t.medir(ultima + "…") > ancho:
        ultima = ultima[:-1]
    return lineas[:max_lineas - 1] + [ultima.rstrip(" ,.-") + "…"]


def render_cierre(p: dict, foto: Image.Image | None) -> Image.Image:
    """Placa final 720x1280: CAZADO + % OFF, foto en tarjeta blanca, título,
    precio, "Link en la bio" y Don Ofertín. Lo importante queda entre y=140
    e y=1070 (fuera de la interfaz de IG)."""
    im = Image.new("RGB", (W, H), NEGRO)
    d = ImageDraw.Draw(im)

    # encabezado
    Texto(96).dibujar(im, 48, 228, "CAZADO", AMARILLO)
    pill = f"{p['descuento']}% OFF" if p.get("descuento") else "PRECIO REAL"
    tp = Texto(40)
    pw = tp.medir(pill)
    d.rounded_rectangle((48, 246, 48 + pw + 40, 302), radius=28, fill=AMARILLO)
    tp.dibujar(im, 68, 289, pill, NEGRO)

    # tarjeta con la foto
    card = (56, 320, W - 56, 700)
    d.rounded_rectangle(card, radius=36, fill=BLANCO)
    if foto is not None:
        f = ImageOps.contain(foto, (card[2] - card[0] - 48, card[3] - card[1] - 48), Image.LANCZOS)
        im.paste(f, ((card[0] + card[2] - f.width) // 2, (card[1] + card[3] - f.height) // 2))
    if p.get("minimo"):
        tm = Texto(22)
        txt = "PRECIO MÁS BAJO REGISTRADO"
        mw = tm.medir(txt)
        d.rounded_rectangle((W / 2 - mw / 2 - 18, card[3] - 20, W / 2 + mw / 2 + 18, card[3] + 18),
                            radius=19, fill=NEGRO, outline=AMARILLO, width=2)
        tm.centrado(im, W / 2, card[3] + 8, txt, AMARILLO)

    # Don Ofertín arriba a la derecha, pisando el borde de la tarjeta
    pose = PERSONAJE / ("festejando.png" if p.get("minimo") else "pulgar.png")
    if pose.exists():
        pj = ImageOps.contain(Image.open(pose).convert("RGBA"), (250, 262), Image.LANCZOS)
        im.paste(pj, (W - 24 - pj.width, card[1] + 28 - pj.height), pj)

    # título, precios y llamado
    y = card[3] + 60
    tt = Texto(29)
    for li in _recortar(tt, p["titulo"], W - 120):
        tt.centrado(im, W / 2, y, li, BLANCO)
        y += 37
    if p.get("precio_anterior") and p.get("descuento"):
        ta = Texto(30, bold=False)
        antes = f"Antes {formatear_precio(p['precio_anterior'])}"
        aw = ta.medir(antes)
        ta.centrado(im, W / 2, y + 12, antes, GRIS)
        d.line((W / 2 - aw / 2 - 6, y + 1, W / 2 + aw / 2 + 6, y + 1), fill=GRIS, width=3)
        y += 46
    precio = formatear_precio(p["precio"])
    size = 96
    while size > 50 and Texto(size).medir(precio) > W - 100:
        size -= 4
    Texto(size).centrado(im, W / 2, y + size * 0.78, precio, AMARILLO)
    y += size * 0.78 + 56
    Texto(46).centrado(im, W / 2, y, "Link en la bio 👆", BLANCO)
    Texto(32).centrado(im, W / 2, y + 48, "cazadordeofertas.com.ar", AMARILLO)
    return im


# ---------------------------------------------------------------- video

def _binario(nombre: str) -> str:
    encontrado = shutil.which(nombre)
    if encontrado:
        return encontrado
    patron = str(Path.home() / "AppData/Local/Microsoft/WinGet/Packages/*FFmpeg*/**/bin" / f"{nombre}.exe")
    hallados = sorted(glob(patron, recursive=True))
    if hallados:
        return hallados[-1]
    sys.exit(f"No encuentro {nombre}: instalalo (winget install Gyan.FFmpeg) o sumalo al PATH.")


def info_video(ffprobe: str, ruta: Path) -> dict:
    out = subprocess.run(
        [ffprobe, "-v", "error", "-show_entries",
         "stream=codec_type,width,height,r_frame_rate,sample_rate,duration:format=duration",
         "-of", "json", str(ruta)], capture_output=True, text=True, check=True).stdout
    data = json.loads(out)
    v = next(s for s in data["streams"] if s["codec_type"] == "video")
    a = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    dur = float(v.get("duration") or data["format"]["duration"])
    return {"w": int(v["width"]), "h": int(v["height"]), "fps": v["r_frame_rate"], "dur": dur,
            "audio": a is not None, "sr": int(a["sample_rate"]) if a else 48000}


def escribir_ding(ruta: Path, dur: float = DUR_CIERRE, sr: int = 48000, ding: bool = True) -> None:
    """WAV estéreo de `dur` segundos: un "ding-ding" de caja al arrancar el
    cierre (o silencio). Hace falta audio en el cierre para que el concat no rompa."""
    notas = [(0.0, 1568.0), (0.12, 2093.0)] if ding else []
    muestras = bytearray()
    for i in range(int(dur * sr)):
        t, v = i / sr, 0.0
        for t0, fr in notas:
            if t >= t0:
                u = t - t0
                env = min(1.0, u / 0.004) * math.exp(-5.5 * u)
                v += env * (math.sin(2 * math.pi * fr * u) + 0.35 * math.sin(4 * math.pi * fr * u)
                            + 0.12 * math.sin(2 * math.pi * 3.01 * fr * u))
        s = int(max(-1.0, min(1.0, v * 0.2)) * 32767)
        muestras += struct.pack("<hh", s, s)
    with wave.open(str(ruta), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(bytes(muestras))


def componer(ffmpeg: str, entrada: Path, salida: Path, gancho: Path, cierre: Path,
             audio_cierre: Path, info: dict) -> None:
    w, h, fps, dur, sr = info["w"], info["h"], info["fps"], info["dur"], info["sr"]
    cmd = [ffmpeg, "-y", "-v", "error", "-i", str(entrada), "-i", str(gancho),
           "-loop", "1", "-framerate", fps, "-t", f"{DUR_CIERRE}", "-i", str(cierre),
           "-i", str(audio_cierre)]
    audio_ppal = "0:a"
    if not info["audio"]:
        cmd += ["-f", "lavfi", "-t", f"{dur}", "-i", f"anullsrc=r={sr}:cl=stereo"]
        audio_ppal = "4:a"
    aform = f"aresample={sr},aformat=sample_fmts=fltp:channel_layouts=stereo"
    filtro = ";".join([
        f"[1:v]scale={w}:{h}[g]",
        f"[0:v][g]overlay=0:0:format=auto,format=yuv420p,setsar=1,fps={fps}[v0]",
        f"[2:v]scale={w}:{h},format=yuv420p,setsar=1,fps={fps},fade=t=in:st=0:d=0.25[v1]",
        f"[{audio_ppal}]{aform},apad,atrim=0:{dur},asetpts=N/SR/TB[a0]",
        f"[3:a]{aform},atrim=0:{DUR_CIERRE},asetpts=N/SR/TB[a1]",
        "[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]",
    ])
    cmd += ["-filter_complex", filtro, "-map", "[v]", "-map", "[a]",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-profile:v", "high",
            "-pix_fmt", "yuv420p", "-r", fps, "-c:a", "aac", "-b:a", "128k", "-ar", str(sr),
            "-movflags", "+faststart", str(salida)]
    subprocess.run(cmd, check=True)


# ---------------------------------------------------------------- main

def _cargar(nombre: str) -> dict:
    ruta = DATOS / nombre
    return json.loads(ruta.read_text(encoding="utf-8")) if ruta.exists() else {}


def resolver_producto(args) -> dict:
    rentables = _cargar("productos_rentables.json")
    items = rentables.get("items", [])
    if args.deal_id:
        p = buscar_por_id(args.deal_id, items, _cargar("seguimiento.json").get("items", {}))
        if not p:
            sys.exit(f"No encuentro {args.deal_id} en frontend/data (ni en ofertas de hoy ni en seguimiento).")
    elif args.titulo and args.precio and args.imagen:
        p = _producto(None, args.titulo, args.precio, args.antes, args.imagen)
    else:
        p = elegir_producto(items, args.buscar)
        if not p:
            sys.exit("No hay ofertas de hogar/electro de ticket alto con foto en los datos de hoy"
                     + (f" que digan «{args.buscar}»" if args.buscar else "") + ".")
        scraped = rentables.get("metadata", {}).get("scraped_at")
        if scraped:
            dias = (datetime.now(timezone.utc) - datetime.fromisoformat(scraped)).days
            if dias >= 2:
                print(f"OJO: los datos de ofertas tienen {dias} días; el precio puede haber cambiado.")
    # lo que se pase a mano pisa lo que vino de los datos
    if args.titulo:
        p["titulo"] = args.titulo
    if args.imagen:
        p["imagen"] = args.imagen
    if args.precio or args.antes:
        nuevo = _producto(p["id"], p["titulo"], args.precio or p["precio"],
                          args.antes or p["precio_anterior"], p["imagen"], p["url"], p["minimo"])
        p.update({k: nuevo[k] for k in ("precio", "precio_anterior", "descuento")})
    return p


def main(argv: list[str] | None = None) -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("entrada", type=Path)
    ap.add_argument("salida", type=Path)
    ap.add_argument("--gancho", required=True, help="texto de arriba durante todo el video")
    ap.add_argument("--deal-id", help="MLA... de una oferta de frontend/data")
    ap.add_argument("--titulo")
    ap.add_argument("--precio", help="precio actual en pesos (1234567 o $ 1.234.567)")
    ap.add_argument("--antes", help="precio anterior (opcional, para el %% OFF)")
    ap.add_argument("--imagen", help="URL o ruta de la foto del producto")
    ap.add_argument("--buscar", help="elegir automáticamente entre títulos con estas palabras")
    ap.add_argument("--sin-ding", action="store_true", help="cierre en silencio")
    args = ap.parse_args(argv)

    if not args.entrada.exists():
        sys.exit(f"No existe {args.entrada}")
    if args.salida.resolve() == args.entrada.resolve():
        sys.exit("La salida no puede ser el mismo archivo que la entrada.")

    p = resolver_producto(args)
    print(f"Producto: {p['titulo']}")
    print(f"Precio:   {formatear_precio(p['precio'])}"
          + (f" ({p['descuento']}% OFF, antes {formatear_precio(p['precio_anterior'])})" if p.get("descuento") else "")
          + (" — mínimo histórico" if p.get("minimo") else ""))
    if p.get("url"):
        print(f"Link:     {p['url']}")

    foto = None
    if p.get("imagen"):
        try:
            foto = cargar_foto(p["imagen"])
        except Exception as e:  # noqa: BLE001 — sin foto igual sale el cierre
            print(f"OJO: no pude bajar la foto ({e}); el cierre sale sin foto.")

    ffmpeg, ffprobe = _binario("ffmpeg"), _binario("ffprobe")
    info = info_video(ffprobe, args.entrada)
    args.salida.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        render_gancho(args.gancho).save(tmp / "gancho.png")
        render_cierre(p, foto).save(tmp / "cierre.png")
        escribir_ding(tmp / "cierre.wav", sr=info["sr"], ding=not args.sin_ding)
        componer(ffmpeg, args.entrada, args.salida, tmp / "gancho.png", tmp / "cierre.png",
                 tmp / "cierre.wav", info)
    print(f"Listo: {args.salida} ({info['dur'] + DUR_CIERRE:.1f} s)")


if __name__ == "__main__":
    main()
