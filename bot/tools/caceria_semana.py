"""Placa "Cacería de la semana" (1080x1350) con las 5 mejores ofertas que
publicó el bot en los últimos 7 días + Don Ofertín. Para el post de los
domingos. Uso: python bot/tools/caceria_semana.py [salida.jpg]"""

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BOT = Path(__file__).resolve().parents[1]
LOG = BOT / "state" / "posts_log.jsonl"
POSE = BOT / "assets" / "personaje" / "festejando.png"
AMARILLO, NEGRO, BLANCO, GRIS = "#FACC15", "#09090B", "#FFFFFF", "#A1A1AA"


def fuente(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    nombres = ["arialbd.ttf", "DejaVuSans-Bold.ttf"] if bold else ["arial.ttf", "DejaVuSans.ttf"]
    for n in nombres:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()


def precio(n: int) -> str:
    return "$" + f"{n:,}".replace(",", ".")


def top_semana(entries: list[dict], n: int = 5) -> list[dict]:
    """Una entrada por producto; primero los mínimos históricos, después el
    mayor ahorro en pesos (precio x descuento: prioriza ticket alto real)."""
    unicos: dict[str, dict] = {}
    for e in entries:
        unicos.setdefault(e["id"], e)

    def ahorro(e: dict) -> float:
        d = e.get("discount", 0)
        return e.get("price", 0) * d / max(1, 100 - d)

    return sorted(unicos.values(), key=lambda e: (not e.get("low"), -ahorro(e)))[:n]


def cargar(dias: int = 7) -> list[dict]:
    desde = datetime.now(timezone.utc) - timedelta(days=dias)
    out = []
    for linea in LOG.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(linea)
        except ValueError:
            continue
        if datetime.fromisoformat(e["ts"]) >= desde and e.get("price"):
            out.append(e)
    return out


def recortar(d: ImageDraw.ImageDraw, texto: str, f, ancho: int) -> str:
    if d.textlength(texto, font=f) <= ancho:
        return texto
    while texto and d.textlength(texto + "…", font=f) > ancho:
        texto = texto[:-1]
    return texto.rstrip() + "…"


def render(items: list[dict], out: Path) -> Path:
    im = Image.new("RGB", (1080, 1350), NEGRO)
    d = ImageDraw.Draw(im)
    d.text((60, 60), "CACERÍA DE", font=fuente(70), fill=AMARILLO)
    d.text((60, 140), "LA SEMANA", font=fuente(70), fill=AMARILLO)
    d.text((60, 235), "Las 5 mejores que cazó Don Ofertín", font=fuente(34, False), fill=BLANCO)
    if POSE.exists():
        pj = Image.open(POSE).convert("RGBA")
        pj.thumbnail((330, 330))
        im.paste(pj, (1080 - pj.width - 40, 30), pj)
    y = 330
    for i, e in enumerate(items, 1):
        d.rounded_rectangle((50, y, 1030, y + 170), radius=26, fill="#18181B", outline=AMARILLO, width=3)
        d.text((80, y + 28), f"{i}", font=fuente(80), fill=AMARILLO)
        d.text((160, y + 24), recortar(d, e["title"], fuente(34), 830), font=fuente(34), fill=BLANCO)
        d.text((160, y + 80), f"{e['discount']}% OFF · {precio(e['price'])}", font=fuente(40), fill=AMARILLO)
        if e.get("low"):
            d.text((160, y + 132), "Precio más bajo que registramos", font=fuente(26, False), fill=GRIS)
        y += 190
    d.text((60, 1290), "Precio verificado contra el historial · link en la bio · cazadordeofertas.com.ar",
           font=fuente(26, False), fill=GRIS)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, quality=92)
    return out


if __name__ == "__main__":
    salida = Path(sys.argv[1]) if len(sys.argv) > 1 else BOT / "stories" / "caceria-semana.jpg"
    items = top_semana(cargar())
    if not items:
        sys.exit("sin publicaciones en los últimos 7 días")
    print(render(items, salida))
