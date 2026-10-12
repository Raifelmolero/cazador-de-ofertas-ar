"""Placas de story del Dia de la Madre SIN precios (no se desactualizan).

Uso (desde bot-repo):  python bot/tools/placas_madre.py [carpeta_salida]
Una placa por dia (11 al 16/10). El link va por sticker de link; la barra de
abajo solo muestra la direccion corta.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import story  # noqa: E402

W, H = story.W, story.H
DOMINIO = "cazadordeofertas.com.ar/dia-de-la-madre"

# archivo, pose del personaje, sello superior, titular, bajada
PLACAS = [
    ("01-dom-11-cuenta-regresiva", "festejando", "DIA DE LA MADRE",
     "FALTAN 7 DIAS", "Ya ordené las ofertas por presupuesto, con el descuento verificado."),
    ("02-lun-12-hasta-50000", "lupa", "REGALO HASTA $50.000",
     "REGALOS QUE SE USAN", "Belleza, cuidado del pelo y relax por menos de $50.000."),
    ("03-mar-13-50-a-150", "pulgar", "DE $50.000 A $150.000",
     "EL REGALO QUE LE VA A GUSTAR", "Planchitas, cafeteras, freidoras: lo que más se regala."),
    ("04-mie-14-mas-de-150", "enamorado", "MÁS DE $150.000",
     "JUNTENSE ENTRE HERMANOS", "Dividido entre 3 o 4, el regalo grande sale razonable."),
    ("05-jue-15-descuento-real", "binoculares", "ANTES DE COMPRAR",
     "¿EL DESCUENTO ES REAL?", "1 de cada 6 ofertas de ML tiene el precio tachado inflado. Verificalo."),
    ("06-vie-16-ultimo-dia", "corriendo", "ULTIMO DIA SEGURO",
     "PEDILO HOY", "Mirá la fecha de entrega con tu código postal y elegí envío Full."),
]


def render(nombre: str, pose: str, sello: str, titular: str, bajada: str, out: Path) -> None:
    img = Image.new("RGB", (W, H), story.BG)
    d = ImageDraw.Draw(img)
    # sello superior
    f_sello = story._font(54)
    d.rounded_rectangle([60, 110, W - 60, 230], radius=24, fill=story.AMBER)
    d.text((W // 2, 170), sello, font=f_sello, fill=story.BLACK, anchor="mm")
    # personaje
    story._pegar_personaje(img, pose, (140, 300, W - 140, 1000))
    # titular
    f_tit = story._font(104)
    lineas = story._wrap(d, titular, f_tit, W - 140, max_lines=3)
    y = 1070
    for ln in lineas:
        d.text((W // 2, y), ln, font=f_tit, fill=story.AMBER, anchor="mm")
        y += 120
    # bajada
    f_baj = story._font(54, bold=False)
    for ln in story._wrap(d, bajada, f_baj, W - 160, max_lines=3):
        d.text((W // 2, y + 40), ln, font=f_baj, fill=story.WHITE, anchor="mm")
        y += 72
    # barra inferior
    d.rectangle([0, 1690, W, 1836], fill=story.AMBER)
    d.text((W // 2, 1763), DOMINIO, font=story._font(50), fill=story.BLACK, anchor="mm")
    img.save(out / f"{nombre}.png", "PNG")


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("placas_madre")
    out.mkdir(parents=True, exist_ok=True)
    for nombre, pose, sello, titular, bajada in PLACAS:
        render(nombre, pose, sello, titular, bajada, out)
        print("ok", nombre)


if __name__ == "__main__":
    main()
