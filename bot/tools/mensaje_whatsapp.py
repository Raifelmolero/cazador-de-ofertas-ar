"""Arma el mensaje diario para el canal de WhatsApp «Cazador De Ofertas AR».

Raifel lo pega a mano en el canal: este script NO publica nada. Lee el
inventario del sitio (frontend/data/productos_rentables.json), el historial de
precios (frontend/data/seguimiento.json) y los cupones del día
(frontend/data/cupones-del-dia.json), elige 8-10 ofertas y deja el texto en
Markdown listo para copiar.

Reglas de selección:
- % OFF real = contra el precio más alto que registró el sitio en los últimos
  60 días (no el tachado de ML, que suele estar inflado).
- Entra si tiene descuento real >= 20 % o si está en su mínimo registrado
  (con al menos una baja real de 5 %). Hace falta historial de 4+ días.
- Prioriza ganancia esperada = precio × comisión; al menos 3 de ticket alto
  (celulares, notebooks, smart TV, electro, monitores, tablets).
- Sin usados/reacondicionados, sin infladas, máximo 2 por categoría y sin
  repetir lo que salió en el mensaje del día anterior.

Uso:
    python bot/tools/mensaje_whatsapp.py            # escribe el archivo de hoy
    python bot/tools/mensaje_whatsapp.py --imprimir # y además lo muestra
    python bot/tools/mensaje_whatsapp.py --carpeta D:/algo --fecha 2026-10-24
"""
from __future__ import annotations

import argparse
import json
import math
import re
import sys
import unicodedata
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

REPO = Path(__file__).resolve().parents[2]
DATOS = REPO / "frontend" / "data"
BASE_REVISAR = Path("C:/Users/pc/Desktop/CAZADOR DE OFERTAS AR/PARA REVISAR")
NOMBRE_ARCHIVO = "whatsapp-canal.md"

MATT_WORD = "whatsapp"
MATT_TOOL = "37267219"
SITIO = "https://cazadordeofertas.com.ar/?utm_source=whatsapp"
AR = timezone(timedelta(hours=-3))

VENTANA_DIAS = 60
MIN_DIAS_HISTORIAL = 4
DESC_REAL_MIN = 0.20
BAJA_MINIMO = 0.05
PRECIO_TICKET_ALTO = 150_000
COMISION_DEFECTO = 0.05
MAX_POR_CATEGORIA = 2

# (clave, emoji, ticket_alto, patrón sobre el título normalizado). El orden
# importa: lo más específico primero.
CATEGORIAS: list[tuple[str, str, bool, str]] = [
    ("auriculares", "🎧", False, r"\b(auricular|headset|earbuds?|buds)"),
    ("reloj", "⌚", False, r"\b(smartwatch|smart band|reloj|watch)\b"),
    ("tablet", "📱", True, r"\btablet\b|\bipad\b"),
    ("celular", "📱", True, r"\b(celular|iphone|smartphone|motorola|moto [ge]\d|samsung galaxy [asz]\d|galaxy [asz]\d|xiaomi redmi|redmi note|poco [xfm]\d)"),
    ("notebook", "💻", True, r"\b(notebook|laptop|macbook|chromebook)\b"),
    ("monitor", "🖥️", True, r"\bmonitor\b"),
    ("tv", "📺", True, r"\b(smart ?tv|televisor|tv (led|qled|oled|\d{2})|google tv|\d{2}\"? ?(pulgadas)? ?(4k|uhd|qled))"),
    ("consola", "🎮", True, r"\b(playstation|ps5|xbox|nintendo switch)\b"),
    ("heladera", "🧊", True, r"\b(heladera|freezer|refrigerador)\b"),
    ("lavarropas", "🧺", True, r"\b(lavarropas|lavasecarropas|secarropas|lavavajillas)\b"),
    ("aire", "❄️", True, r"\b(aire acondicionado|split|frigorias)\b"),
    ("cocina", "🍳", True, r"\b(microondas|horno|cocina a gas|anafe|extractor|purificador de cocina)\b"),
    ("freidora", "🍟", False, r"\bfreidora\b"),
    ("cafetera", "☕", False, r"\bcafetera\b"),
    ("colchon", "🛏️", False, r"\b(colchon|sommier)\b"),
    ("aspiradora", "🧹", False, r"\b(aspiradora|robot aspirador)\b"),
    ("pelo", "💇", False, r"\b(secador|planchita|alisador|rizador|babyliss)\b"),
    ("perfume", "🧴", False, r"\b(perfume|eau de|edt|edp|serum|crema)\b"),
    ("fitness", "🏃", False, r"\b(bicicleta|spinning|cinta de correr|caminador|eliptico)\b"),
    ("herramientas", "🔧", False, r"\b(taladro|atornillador|soldadora|amoladora|hidrolavadora|sierra|compresor|desmalezadora|motoguadana)\b"),
    ("drone", "🚁", False, r"\b(drone|dron)\b"),
    ("laser", "🔧", False, r"\b(grabadora laser|cortadora laser|impresora 3d)\b"),
    ("parlante", "🔊", False, r"\b(parlante|barra de sonido|soundbar)\b"),
]

USADO_RE = re.compile(r"\b(usad[oa]s?|reacondicionad[oa]s?|refurbished|refurb|seminuev[oa]|open ?box|como nuevo)\b")


# ---------------------------------------------------------------- utilidades

def normalizar(texto: str) -> str:
    t = unicodedata.normalize("NFKD", texto or "").encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", t.lower()).strip()


def categoria(titulo: str) -> tuple[str, str, bool]:
    t = normalizar(titulo)
    for clave, emoji, alto, patron in CATEGORIAS:
        if re.search(patron, t):
            return clave, emoji, alto
    return "otros", "🛒", False


def es_usado(titulo: str) -> bool:
    return bool(USADO_RE.search(normalizar(titulo)))


def link_whatsapp(url: str) -> str:
    """Link de afiliado con matt_word=whatsapp (reemplaza el que tenga)."""
    partes = urlsplit(url)
    params = [(k, v) for k, v in parse_qsl(partes.query, keep_blank_values=True)
              if k not in ("matt_word", "matt_tool")]
    params += [("matt_word", MATT_WORD), ("matt_tool", MATT_TOOL)]
    return urlunsplit((partes.scheme, partes.netloc, partes.path, urlencode(params), ""))


def fmt_precio(valor: float) -> str:
    return "$" + f"{int(round(valor)):,}".replace(",", ".")


def nombre_corto(titulo: str, max_chars: int = 48) -> str:
    t = re.split(r"\s+[-|–]\s+", titulo.strip())[0]
    t = re.sub(r"\b(distribuidor autorizado|nuevo|original|oficial)\b", "", t, flags=re.I)
    t = re.sub(r"[()]", "", t)
    t = re.sub(r"\s+", " ", t).strip(" ,-")
    if len(t) <= max_chars:
        return t
    corte = t[:max_chars].rsplit(" ", 1)[0]
    return corte.rstrip(" ,-+/")


def clave_modelo(titulo: str) -> str:
    """Mismo producto en otro color/vendedor: primeras 4 palabras."""
    return " ".join(re.sub(r"[^a-z0-9 ]+", " ", normalizar(titulo)).split()[:4])


def cargar_json(ruta: Path, defecto):
    try:
        return json.loads(Path(ruta).read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return defecto


# ---------------------------------------------------------------- historial

def historial(serie: list, hoy: date, ventana: int = VENTANA_DIAS) -> dict | None:
    """Precios registrados antes de hoy dentro de la ventana."""
    desde = hoy - timedelta(days=ventana)
    previos = []
    for fecha, precio in serie or []:
        try:
            f = date.fromisoformat(fecha[:10])
        except (TypeError, ValueError):
            continue
        if desde <= f < hoy and precio:
            previos.append(float(precio))
    if not previos:
        return None
    return {"max": max(previos), "min": min(previos), "dias": len(previos)}


def evaluar(item: dict, seg: dict | None, hoy: date, infladas: set[str]) -> dict | None:
    """Devuelve el candidato con su % real y puntaje, o None si no califica."""
    titulo = item.get("titulo") or ""
    precio = float(item.get("precio_actual") or 0)
    if precio <= 0 or not item.get("url_producto") or es_usado(titulo):
        return None
    if item.get("id_ml") in infladas or not seg:
        return None
    h = historial(seg.get("serie"), hoy)
    if not h or h["dias"] < MIN_DIAS_HISTORIAL:
        return None
    real = max(0.0, 1 - precio / h["max"])
    en_minimo = precio <= h["min"]
    if not (real >= DESC_REAL_MIN or (en_minimo and real >= BAJA_MINIMO)):
        return None
    clave, emoji, alto = categoria(titulo)
    comision = float(item.get("comision_clasica_pct") or COMISION_DEFECTO)
    ganancia = precio * comision
    return {
        "id": item["id_ml"],
        "titulo": titulo,
        "nombre": nombre_corto(titulo),
        "precio": precio,
        "real": real,
        "pct": int(real * 100 + 1e-9),
        "en_minimo": en_minimo,
        "categoria": clave,
        "emoji": emoji,
        "ticket_alto": alto and precio >= PRECIO_TICKET_ALTO,
        "ganancia": ganancia,
        # Raíz de la ganancia: si no, todo el mensaje serían celulares de $2M.
        "puntaje": math.sqrt(ganancia) * (1 + 5 * real) * (1.15 if en_minimo else 1.0),
        "link": link_whatsapp(item["url_producto"]),
    }


def candidatos(productos: list[dict], seguimiento: dict, hoy: date,
               infladas: set[str] | None = None) -> list[dict]:
    infladas = infladas or set()
    out = []
    for it in productos:
        c = evaluar(it, seguimiento.get(it.get("id_ml")), hoy, infladas)
        if c:
            out.append(c)
    return out


def elegir(cands: list[dict], excluir: set[str] | None = None, n: int = 10,
           min_ticket_alto: int = 3) -> list[dict]:
    """8-10 ofertas: primero ticket alto por ganancia, después el resto por
    puntaje; máximo 2 por categoría y un solo modelo de cada producto."""
    excluir = excluir or set()
    elegidos: list[dict] = []
    por_cat: dict[str, int] = {}
    modelos: set[str] = set()

    def sumar(c: dict) -> bool:
        if c["id"] in excluir or c in elegidos or len(elegidos) >= n:
            return False
        if por_cat.get(c["categoria"], 0) >= MAX_POR_CATEGORIA and c["categoria"] != "otros":
            return False
        modelo = clave_modelo(c["titulo"])
        if modelo in modelos:
            return False
        elegidos.append(c)
        modelos.add(modelo)
        por_cat[c["categoria"]] = por_cat.get(c["categoria"], 0) + 1
        return True

    altos = sorted((c for c in cands if c["ticket_alto"]), key=lambda c: -c["ganancia"] * (1 + c["real"]))
    for c in altos:
        if sum(e["ticket_alto"] for e in elegidos) >= min_ticket_alto:
            break
        sumar(c)
    for c in sorted(cands, key=lambda c: -c["puntaje"]):
        sumar(c)
    return elegidos


# ---------------------------------------------------------------- cupón

def cupon_vigente(datos: dict, ahora: datetime) -> dict | None:
    for c in (datos or {}).get("cupones", []):
        try:
            hasta = datetime.fromisoformat(c["hasta"])
        except (KeyError, TypeError, ValueError):
            continue
        if hasta.tzinfo is None:
            hasta = hasta.replace(tzinfo=AR)
        if c.get("codigo") and hasta >= ahora:
            return c
    return None


def linea_cupon(c: dict, hoy: date) -> str:
    hasta = datetime.fromisoformat(c["hasta"])
    if hasta.tzinfo is None:
        hasta = hasta.replace(tzinfo=AR)
    hasta = hasta.astimezone(AR)
    cuando = (f"hoy hasta las {hasta:%H:%M}" if hasta.date() == hoy
              else f"hasta el {hasta:%d/%m} {hasta:%H:%M}")
    desc = c.get("descuento")
    if isinstance(desc, (int, float)):
        desc_txt = fmt_precio(desc) if desc >= 100 else f"{int(desc)} %"
    else:
        desc_txt = str(desc or "")
    partes = [f"🎟️ *CUPÓN DEL DÍA:* `{c['codigo']}`", f"{desc_txt} OFF"]
    if c.get("minimo"):
        partes.append(f"compras desde {fmt_precio(c['minimo'])}")
    partes.append(f"vence {cuando}")
    return " · ".join(partes)


# ---------------------------------------------------------------- mensaje

def linea_oferta(c: dict, negrita: bool) -> str:
    pct = f"*{c['pct']} % OFF*" if negrita else f"{c['pct']} % OFF"
    extra = " · mínimo histórico" if c["en_minimo"] else ""
    return f"{c['emoji']} {c['nombre']} · {pct} · {fmt_precio(c['precio'])}{extra}\n{c['link']}"


def armar_mensaje(seleccion: list[dict], hoy: date, cupon: dict | None = None,
                  total_ofertas: int = 0) -> str:
    l = [f"🔥 *OFERTAS DE HOY EN MERCADO LIBRE* ({hoy:%d/%m})", ""]
    if cupon:
        l += [linea_cupon(cupon, hoy), ""]
    l += ["_% OFF real: comparado con nuestro historial de precios, no con el tachado._", ""]

    seleccion = sorted(seleccion, key=lambda c: -c["real"])
    if any(c["real"] >= 0.5 for c in seleccion):
        umbral, titulo = 0.5, "*Más del 50 % OFF* 👇"
    else:
        umbral, titulo = DESC_REAL_MIN, "*Más del 20 % OFF real* 👇"
    arriba = [c for c in seleccion if c["real"] >= umbral]
    resto = [c for c in seleccion if c["real"] < umbral]
    if arriba:
        l.append(titulo)
        for c in arriba:
            l += [linea_oferta(c, True), ""]
    if resto:
        l.append("*También hoy*" if arriba else "*Ofertas de hoy* 👇")
        for c in resto:
            l += [linea_oferta(c, False), ""]

    if total_ofertas >= 100:
        cien = f"{total_ofertas // 100 * 100:,}".replace(",", ".")
        l.append(f"🔎 Más de {cien} ofertas verificadas, con el historial de precio de cada una:")
    else:
        l.append("🔎 Todas las ofertas verificadas, con el historial de precio de cada una:")
    l += [SITIO, "", "_Precios y stock pueden cambiar en el día._"]
    return "\n".join(l) + "\n"


def ids_en_texto(texto: str) -> set[str]:
    return {m.upper().replace("-", "") for m in re.findall(r"MLAU?-?\d{6,}", texto, flags=re.I)}


def ids_dia_anterior(carpeta_base: Path, hoy: date) -> set[str]:
    ayer = carpeta_base / (hoy - timedelta(days=1)).isoformat()
    ids: set[str] = set()
    if ayer.is_dir():
        for f in ayer.glob("whatsapp-canal*.md"):
            ids |= ids_en_texto(f.read_text(encoding="utf-8", errors="ignore"))
    return ids


# ---------------------------------------------------------------- main

def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--carpeta", type=Path, help="carpeta de salida (por defecto PARA REVISAR/<fecha>)")
    ap.add_argument("--datos", type=Path, default=DATOS, help="carpeta frontend/data")
    ap.add_argument("--fecha", help="AAAA-MM-DD (por defecto hoy en Argentina)")
    ap.add_argument("--cantidad", type=int, default=10)
    ap.add_argument("--imprimir", action="store_true", help="mostrar el mensaje en pantalla")
    a = ap.parse_args(argv)

    ahora = datetime.now(AR)
    hoy = date.fromisoformat(a.fecha) if a.fecha else ahora.date()
    carpeta = a.carpeta or BASE_REVISAR / hoy.isoformat()

    productos = cargar_json(a.datos / "productos_rentables.json", {}).get("items", [])
    seguimiento = cargar_json(a.datos / "seguimiento.json", {}).get("items", {})
    infladas = {i.get("id") for i in cargar_json(a.datos / "infladas.json", {}).get("items", [])}
    cupones = cargar_json(a.datos / "cupones-del-dia.json", {})

    cands = candidatos(productos, seguimiento, hoy, infladas)
    seleccion = elegir(cands, ids_dia_anterior(carpeta.parent, hoy), n=a.cantidad)
    if len(seleccion) < 8:  # pocas nuevas: mejor repetir que mandar 3
        seleccion = elegir(cands, set(), n=a.cantidad)
    if not seleccion:
        print("[error] no hay ofertas que califiquen (¿datos vacíos?)", file=sys.stderr)
        return 1

    cupon = cupon_vigente(cupones, datetime.combine(hoy, ahora.timetz()) if a.fecha else ahora)
    texto = armar_mensaje(seleccion, hoy, cupon, len(productos))

    carpeta.mkdir(parents=True, exist_ok=True)
    salida = carpeta / NOMBRE_ARCHIVO
    salida.write_text(texto, encoding="utf-8")
    altos = sum(c["ticket_alto"] for c in seleccion)
    print(f"[ok] {len(seleccion)} ofertas ({altos} ticket alto) de {len(cands)} candidatas -> {salida}")
    if a.imprimir:
        sys.stdout.reconfigure(encoding="utf-8")
        print(texto)
    return 0


if __name__ == "__main__":
    sys.exit(main())
