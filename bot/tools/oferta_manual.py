"""Carga una oferta a mano (la elegís vos en Mercado Libre) para que el bot la publique.

Hoy el bot NO escanea mercadolibre.com.ar (ML confirmó que el scrapeo no está
permitido; ver docs/HANDOFF-2026-10-13-scraper-bloqueado.md). Esta herramienta
agrega una oferta a bot/state/ofertas_manuales.json; el bot la toma en la próxima
corrida (cazador_bot.load_manual_deals), la publica en los canales y la pone en la web.

Se usa desde el celular con Actions → «Agregar oferta manual» (las entradas llegan
por variables de entorno). Local:
    python bot/tools/oferta_manual.py --url URL --titulo "..." --actual 1234567 --anterior 1500000 [--imagen URL]

No hace NINGÚN pedido a ML: todo lo que publica es lo que escribiste vos.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "bot"))
from cazador_bot import MANUAL_MAX_DIAS, MANUAL_PATH, STATE_PATH, title_key  # noqa: E402

BAJA_REPUBLICAR_PCT = 5   # si el precio bajó al menos esto, la oferta vuelve a poder publicarse
DESCUENTO_MAX_PCT = 80    # más que esto casi seguro es un número mal tipeado

HOSTS_ML = ("mercadolibre.com.ar",)


def pesos(n: int) -> str:
    return f"${n:,}".replace(",", ".")


class OfertaInvalida(ValueError):
    """Dato mal cargado: el mensaje es para mostrarle a la persona, en español."""


def parsear_precio(texto: str, campo: str) -> int:
    """'1.234.567', '$ 1234567' o '1.234.567,00' → 1234567. Sin decimales."""
    texto = str(texto or "")
    if re.search(r"[^\d.,$\s]", texto):   # letras, signo menos, etc.: se rechaza, no se "limpia"
        raise OfertaInvalida(f"{campo}: «{texto}» no es un precio. Escribí solo el número, por ejemplo 1234567.")
    limpio = re.sub(r"[^\d.,]", "", texto)
    limpio = re.sub(r",\d{1,2}$", "", limpio)       # centavos con coma
    limpio = limpio.replace(".", "").replace(",", "")
    if not limpio.isdigit() or int(limpio) <= 0:
        raise OfertaInvalida(f"{campo}: «{texto}» no es un precio. Escribí solo el número, por ejemplo 1234567.")
    return int(limpio)


def limpiar_url(url: str) -> tuple[str, str]:
    """Devuelve (url_limpia, id). Pide el link largo de mercadolibre.com.ar."""
    url = (url or "").strip()
    u = urlparse(url)
    host = (u.hostname or "").lower()
    if host == "meli.la" or host.endswith(".meli.la"):
        raise OfertaInvalida("Ese es un link corto de afiliado (meli.la). Abrí el producto en el navegador "
                             "y pegá el link largo de la barra de direcciones (mercadolibre.com.ar/...).")
    if u.scheme != "https" or not any(host == h or host.endswith("." + h) for h in HOSTS_ML):
        raise OfertaInvalida("El link tiene que ser https://...mercadolibre.com.ar/... (el del producto).")
    limpia = f"https://{host}{u.path}"
    m = re.search(r"(MLAU?)-?(\d{6,13})", u.path)
    if m:
        return limpia, f"{m.group(1)}{m.group(2)}"
    # Sin código MLA en el link: id estable derivado del link (no usar hash(), que cambia en cada corrida).
    return limpia, "M" + hashlib.sha1(limpia.encode()).hexdigest()[:12]


def limpiar_imagen(imagen: str | None) -> str | None:
    imagen = (imagen or "").strip()
    if not imagen:
        return None
    u = urlparse(imagen)
    if u.scheme != "https" or (u.hostname or "").lower() != "http2.mlstatic.com":
        raise OfertaInvalida("La imagen tiene que ser un link https://http2.mlstatic.com/... "
                             "(en el navegador: mantené apretada la foto → «Copiar dirección de la imagen»). "
                             "Si no la tenés, dejá ese campo vacío.")
    return imagen


def limpiar_cuotas(cuotas: str | None) -> str | None:
    """Texto corto de financiación, ej. «12 cuotas de $124.999 sin interés». Opcional."""
    cuotas = re.sub(r"\s+", " ", (cuotas or "").strip())
    if not cuotas:
        return None
    if len(cuotas) > 50 or re.search(r"[<>]", cuotas):
        raise OfertaInvalida("Cuotas: texto corto (hasta 50 letras), sin < ni >. Ej.: 12 cuotas de $124.999 sin interés.")
    return cuotas


def armar_oferta(url: str, titulo: str, actual: str, anterior: str, imagen: str | None = None,
                 cuotas: str | None = None, hoy: datetime | None = None) -> dict:
    limpia, deal_id = limpiar_url(url)
    titulo = re.sub(r"\s+", " ", (titulo or "").strip())
    if len(titulo) < 5:
        raise OfertaInvalida("Falta el título del producto (mínimo 5 letras).")
    cur = parsear_precio(actual, "Precio actual")
    prev = parsear_precio(anterior, "Precio anterior")
    if prev <= cur:
        raise OfertaInvalida(f"El precio anterior ({pesos(prev)}) tiene que ser mayor que el actual ({pesos(cur)}). "
                             "Es el precio tachado que muestra ML; si no tiene, no es una oferta.")
    if prev > cur * 10 or round((prev - cur) / prev * 100) > DESCUENTO_MAX_PCT:
        raise OfertaInvalida(f"El precio anterior ({pesos(prev)}) es demasiado alto frente al actual ({pesos(cur)}): "
                             f"más de {DESCUENTO_MAX_PCT}% de descuento casi siempre es un número mal tipeado. Revisalo.")
    hoy = hoy or datetime.now(timezone.utc)
    return {
        "id": deal_id,
        "title": titulo[:150],
        "url": limpia,
        "price_prev": prev,
        "price_cur": cur,
        "discount": round((prev - cur) / prev * 100),
        "img": limpiar_imagen(imagen),
        "cuotas": limpiar_cuotas(cuotas),
        "agregada": hoy.date().isoformat(),
    }


def avisos(oferta: dict, items: list[dict], posted: set[str]) -> list[str]:
    """Cosas a mirar antes de que salga (no frenan la carga)."""
    out = []
    previa = next((i for i in items if i.get("id") == oferta["id"]), None)
    if previa:
        out.append(f"ya estaba cargada (antes {pesos(previa['price_cur'])}); se reemplaza con el precio nuevo.")
    clave = title_key(oferta["title"])
    otra = next((i for i in items if i.get("id") != oferta["id"] and title_key(i.get("title", "")) == clave), None)
    if otra:
        out.append(f"el título es igual a otra oferta vigente ({otra['id']}): puede ser el mismo producto con otro link.")
    if oferta["id"] in posted:
        baja = previa and previa["price_cur"] and (previa["price_cur"] - oferta["price_cur"]) / previa["price_cur"] * 100 >= BAJA_REPUBLICAR_PCT
        out.append("ya se publicó antes y el bot no repite ids" + (": como el precio bajó, se libera para volver a salir." if baja else
                   " (no vuelve a salir salvo que el precio baje 5% o más respecto de la carga anterior)."))
    if oferta["discount"] < 10:
        out.append(f"descuento de solo {oferta['discount']}%: va al final del ranking.")
    return out


def _liberar_publicada(oferta_id: str, state_path: Path | None = None) -> bool:
    """Saca el id de posted_ids.json para que el bot pueda volver a publicarlo."""
    state_path = state_path or STATE_PATH
    try:
        data = json.loads(state_path.read_text(encoding="utf-8"))
        ids = data.get("posted_ids", [])
        if oferta_id not in ids:
            return False
        data["posted_ids"] = [i for i in ids if i != oferta_id]
        state_path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return True
    except Exception:  # noqa: BLE001
        return False


def guardar(oferta: dict, path: Path | None = None, state_path: Path | None = None) -> int:
    """Suma (o reemplaza por id) la oferta; descarta las vencidas. Devuelve cuántas quedan."""
    from datetime import date
    path = path or MANUAL_PATH
    try:
        items = json.loads(path.read_text(encoding="utf-8")).get("items", [])
    except Exception:  # noqa: BLE001
        items = []
    try:
        posted = set(json.loads((state_path or STATE_PATH).read_text(encoding="utf-8")).get("posted_ids", []))
    except Exception:  # noqa: BLE001
        posted = set()
    for a in avisos(oferta, items, posted):
        print(f"::warning::«{oferta['title'][:60]}»: {a}")
    previa = next((i for i in items if i.get("id") == oferta["id"]), None)
    if previa and oferta["id"] in posted and previa.get("price_cur"):
        if (previa["price_cur"] - oferta["price_cur"]) / previa["price_cur"] * 100 >= BAJA_REPUBLICAR_PCT:
            _liberar_publicada(oferta["id"], state_path)
    hoy = date.fromisoformat(oferta["agregada"])
    vigentes = []
    for it in items:
        try:
            if it["id"] != oferta["id"] and (hoy - date.fromisoformat(it["agregada"])).days <= MANUAL_MAX_DIAS:
                vigentes.append(it)
        except (KeyError, ValueError):
            continue
    vigentes.append(oferta)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"items": vigentes}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return len(vigentes)


def parsear_lote(texto: str) -> list[dict]:
    """Varias ofertas en un texto: una por línea (o separadas por ';;'), campos con '|':
    url | titulo | precio actual | precio anterior | imagen (opcional) | cuotas (opcional).
    Todo o nada: si una línea está mal, no se carga ninguna y el error dice cuál."""
    lineas = [l.strip() for l in re.split(r"\n|;;", texto or "") if l.strip()]
    if not lineas:
        raise OfertaInvalida("El lote está vacío. Formato: url | título | precio actual | precio anterior | imagen (opcional)")
    ofertas, errores = [], []
    for i, linea in enumerate(lineas, 1):
        campos = [c.strip() for c in linea.split("|")]
        if len(campos) not in (4, 5, 6):
            errores.append(f"Oferta {i}: hay {len(campos)} campos y tienen que ser 4 a 6 separados por «|».")
            continue
        try:
            ofertas.append(armar_oferta(*campos))
        except OfertaInvalida as e:
            errores.append(f"Oferta {i}: {e}")
    if errores:
        raise OfertaInvalida("No se cargó ninguna. " + " ".join(errores))
    return ofertas


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--lote", default=os.getenv("OFERTA_LOTE", ""))
    for k in ("url", "titulo", "actual", "anterior"):
        ap.add_argument(f"--{k}", default=os.getenv(f"OFERTA_{k.upper()}", ""))
    ap.add_argument("--imagen", default=os.getenv("OFERTA_IMAGEN", ""))
    ap.add_argument("--cuotas", default=os.getenv("OFERTA_CUOTAS", ""))
    a = ap.parse_args()
    if a.lote.strip():
        try:
            ofertas = parsear_lote(a.lote)
        except OfertaInvalida as e:
            print(f"::error::{e}")
            return 1
        for o in ofertas:
            n = guardar(o)
            print(f"OK: «{o['title']}» a {pesos(o['price_cur'])} ({o['discount']}% OFF)")
        print(f"Cargadas {len(ofertas)}. Ofertas manuales vigentes: {n}.")
        sin_img = sum(1 for o in ofertas if not o["img"])
        if sin_img:
            print(f"Aviso: {sin_img} sin imagen (no salen en Instagram).")
        return 0
    try:
        oferta = armar_oferta(a.url, a.titulo, a.actual, a.anterior, a.imagen, a.cuotas)
    except OfertaInvalida as e:
        print(f"::error::{e}")
        return 1
    n = guardar(oferta)
    print(f"OK: «{oferta['title']}» a {pesos(oferta['price_cur'])} (antes {pesos(oferta['price_prev'])}, "
          f"{oferta['discount']}% OFF). Ofertas manuales vigentes: {n}.")
    if not oferta["img"]:
        print("Aviso: sin imagen. Va a Telegram y a la web, pero Instagram necesita foto.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
