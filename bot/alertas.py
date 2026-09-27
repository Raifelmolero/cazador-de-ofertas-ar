"""
Alertas de precio por Telegram (chat privado con el bot).

La persona le manda al bot un link de Mercado Libre (y opcionalmente el
precio al que lo quiere). Cada vez que el bot de ofertas escanea ML registra
el último precio visto de cada producto en state/price_history.json; este
script cruza las alertas contra ese registro y avisa por privado cuando el
producto aparece a ese precio o menos. Cada alerta avisa una sola vez.

Solo vemos precios de productos que aparecen en los listados de ofertas que
escanea el bot (la ficha de ML no se puede leer desde el runner), y eso se le
dice a la persona al crear la alerta.

El repo es público: los chat_id son datos personales, así que el archivo de
alertas se guarda cifrado (Fernet, clave en el secret ALERTAS_KEY). Con /stop
se borra todo lo de esa persona.

Lo corre alertas.yml cada 15 minutos. Uso: python bot/alertas.py
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from cazador_bot import (
    affiliate_url,
    alert_admin,
    esc,
    fmt_price,
    load_config,
    load_price_history,
    tg_call,
)

BASE_DIR = Path(__file__).resolve().parent
ALERTAS_PATH = BASE_DIR / "state" / "alertas.enc"
MAX_POR_CHAT = 10
MAX_TOTAL = 3000
MATT_WORD = "alertas"

AYUDA = (
    "🔔 <b>Alertas de precio de Cazador de Ofertas</b>\n\n"
    "Mandame el link de un producto de Mercado Libre y te aviso cuando baje.\n"
    "Si querés un precio puntual, ponelo después del link:\n"
    "<code>https://articulo.mercadolibre.com.ar/MLA-... 150000</code>\n\n"
    "/mis_alertas — ver tus alertas\n"
    "/borrar 2 — borrar la alerta 2 (o /borrar todas)\n"
    "/stop — borrar todos tus datos\n\n"
    "Solo vemos el precio cuando el producto aparece en las ofertas que "
    "revisamos 3 veces por día, así que puede pasar que no te avisemos. "
    "Guardamos solo tu número de chat y tus alertas."
)


def hoy() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


# ---------------------------------------------------------------- almacenamiento

def _fernet():
    from cryptography.fernet import Fernet
    return Fernet(os.environ["ALERTAS_KEY"].encode())


def cargar(path: Path = ALERTAS_PATH) -> dict:
    vacio = {"offset": 0, "alertas": []}
    if not path.exists():
        return vacio
    try:
        return json.loads(_fernet().decrypt(path.read_bytes()))
    except Exception as e:  # noqa: BLE001 — clave cambiada o archivo roto
        print(f"[alertas] no se pudo leer el archivo: {e!r}; se empieza de cero")
        return vacio


def guardar(data: dict, path: Path = ALERTAS_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(_fernet().encrypt(json.dumps(data, separators=(",", ":")).encode()))


def commitear(path: Path = ALERTAS_PATH) -> None:
    repo = BASE_DIR.parent
    git = ["git", "-C", str(repo)]
    subprocess.run([*git, "add", str(path)], check=True)
    if subprocess.run([*git, "diff", "--cached", "--quiet"]).returncode == 0:
        return
    subprocess.run([*git, "commit", "-m", "alertas: estado"], check=True)
    for _ in range(3):  # el bot de ofertas puede estar pusheando al mismo tiempo
        subprocess.run([*git, "-c", "rebase.autoStash=true", "pull", "--rebase", "origin", "main"],
                       check=True)
        if subprocess.run([*git, "push", "origin", "main"]).returncode == 0:
            return
    raise RuntimeError("no se pudo pushear alertas.enc")


# ---------------------------------------------------------------- mensajes

LINK_RE = re.compile(r"https?://[^\s]*mercadolibre\.com\.ar[^\s]*", re.I)


def parsear_link(texto: str) -> dict | None:
    """Del mensaje saca el link de ML, el código MLA, un nombre legible
    (del slug de la URL) y el precio objetivo si lo escribió."""
    m = LINK_RE.search(texto)
    if not m:
        return None
    url = m.group(0).split("?")[0].split("#")[0]
    mla = re.search(r"MLA-?(\d{6,13})", url)
    if not mla:
        return None
    slug = re.search(r"mercadolibre\.com\.ar/(?:MLA-?\d+-)?([a-z0-9-]{8,})", url, re.I)
    nombre = slug.group(1).replace("-_JM", "").replace("-", " ").strip() if slug else ""
    resto = texto[:m.start()] + " " + texto[m.end():]
    precio = re.search(r"\$?\s*(\d{1,3}(?:[.,]\d{3})+|\d{4,9})", resto)
    objetivo = int(re.sub(r"[.,]", "", precio.group(1))) if precio else None
    return {"url": url, "mla": f"MLA{mla.group(1)}", "nombre": nombre[:80],
            "objetivo": objetivo}


def de_chat(data: dict, chat: int) -> list[dict]:
    return [a for a in data["alertas"] if a["chat"] == chat]


def responder(data: dict, chat: int, texto: str, historia: dict) -> str:
    """Aplica el mensaje sobre `data` y devuelve la respuesta (HTML)."""
    t = texto.strip()
    cmd = t.split()[0].lower().split("@")[0] if t else ""
    mias = de_chat(data, chat)

    if cmd == "/stop":
        data["alertas"] = [a for a in data["alertas"] if a["chat"] != chat]
        return "Listo, borré todas tus alertas y tus datos. Si querés volver, mandame un link."
    if cmd == "/mis_alertas":
        if not mias:
            return "No tenés alertas. Mandame un link de Mercado Libre para crear una."
        lineas = []
        for i, a in enumerate(mias, 1):
            meta = f"a {fmt_price(a['objetivo'])} o menos" if a["objetivo"] else "cuando baje"
            lineas.append(f"{i}. {esc(a['nombre'] or a['mla'])} — {meta}")
        return "🔔 Tus alertas:\n\n" + "\n".join(lineas) + "\n\nPara borrar una: /borrar 1"
    if cmd == "/borrar":
        arg = t.split()[1].lower() if len(t.split()) > 1 else ""
        if arg == "todas":
            data["alertas"] = [a for a in data["alertas"] if a["chat"] != chat]
            return "Borré todas tus alertas."
        if arg.isdigit() and 1 <= int(arg) <= len(mias):
            data["alertas"].remove(mias[int(arg) - 1])
            return "Alerta borrada."
        return "Decime cuál: /borrar 1 (mirá los números con /mis_alertas) o /borrar todas."

    # /start con código (deep link desde el sitio: t.me/<bot>?start=MLA123)
    if cmd == "/start" and len(t.split()) > 1 and re.fullmatch(r"MLA\d{6,13}", t.split()[1]):
        mla = t.split()[1]
        link = {"url": f"https://articulo.mercadolibre.com.ar/{mla[:3]}-{mla[3:]}",
                "mla": mla, "nombre": "", "objetivo": None}
    else:
        link = parsear_link(t)
    if not link:
        return AYUDA

    if len(mias) >= MAX_POR_CHAT:
        return f"Ya tenés {MAX_POR_CHAT} alertas, que es el máximo. Borrá alguna con /borrar."
    if len(data["alertas"]) >= MAX_TOTAL:
        return "Ahora no puedo sumar más alertas. Probá en unos días."

    h = historia.get(link["mla"])
    objetivo = link["objetivo"]
    if objetivo is None and h:
        objetivo = h["last"] - 1  # cualquier baja contra el último precio visto
    for a in mias:
        if a["mla"] == link["mla"]:
            data["alertas"].remove(a)  # se reemplaza por la nueva
    data["alertas"].append({
        "chat": chat, "mla": link["mla"], "url": link["url"], "nombre": link["nombre"],
        "objetivo": objetivo, "creada": hoy(),
    })

    if h:
        visto = (f"La última vez que lo vimos ({h['last_ts'][8:10]}/{h['last_ts'][5:7]}) "
                 f"estaba a {fmt_price(h['last'])}; el más bajo que registramos fue "
                 f"{fmt_price(h['min'])}.")
    else:
        visto = "Todavía no lo vimos en ninguna oferta: te aviso cuando aparezca."
    meta = f"a {fmt_price(objetivo)} o menos" if objetivo else "apenas lo veamos en oferta"
    return f"✅ Alerta creada: te aviso cuando esté {meta}.\n\n{visto}\n\nTus alertas: /mis_alertas"


# ---------------------------------------------------------------- avisos

def para_avisar(data: dict, historia: dict) -> list[tuple[dict, dict]]:
    """Alertas que se cumplen: el producto se vio después de crear la alerta
    a un precio igual o menor al objetivo (o a cualquier precio si no hay)."""
    out = []
    for a in data["alertas"]:
        h = historia.get(a["mla"])
        if not h or h["last_ts"] < a["creada"]:
            continue
        if a["objetivo"] is None or h["last"] <= a["objetivo"]:
            out.append((a, h))
    return out


def texto_aviso(a: dict, h: dict, affiliate_id: str) -> str:
    link = affiliate_url(a["url"], affiliate_id, MATT_WORD)
    nombre = esc(a["nombre"] or "El producto que seguías")
    minimo = " Es el precio más bajo que registramos. 🔥" if h["last"] <= h["min"] else ""
    return (
        f"🔔 <b>Bajó de precio</b>\n\n{nombre}\n"
        f"Lo vimos a <b>{fmt_price(h['last'])}</b>.{minimo}\n\n"
        f"👉 {link}\n\n"
        "El precio puede cambiar en cualquier momento. Es un link de afiliado: "
        "si comprás, ganamos una comisión y a vos te cuesta lo mismo.\n"
        "Esta alerta ya se cumplió; para otra, mandame el link de nuevo."
    )


# ---------------------------------------------------------------- main

def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token or not os.getenv("ALERTAS_KEY"):
        print("[alertas] faltan TELEGRAM_BOT_TOKEN o ALERTAS_KEY")
        return 1
    cfg = load_config()
    affiliate_id = os.getenv("ML_AFFILIATE_ID", "")
    data = cargar()
    historia = load_price_history()
    antes = json.dumps(data, sort_keys=True)

    try:
        updates = tg_call(token, "getUpdates", {
            "offset": data["offset"], "timeout": 0, "allowed_updates": ["message"],
        }).get("result", [])
    except Exception as e:  # noqa: BLE001 — p. ej. 409 si hay un webhook configurado
        alert_admin(token, cfg["admin_chat"], f"⚠️ Alertas: getUpdates falló: {str(e)[:200]}", False)
        return 1

    creadas = 0
    for u in updates:
        data["offset"] = u["update_id"] + 1
        msg = u.get("message") or {}
        chat = msg.get("chat", {})
        if chat.get("type") != "private" or not msg.get("text"):
            continue
        n = len(data["alertas"])
        resp = responder(data, chat["id"], msg["text"], historia)
        creadas += len(data["alertas"]) > n
        try:
            tg_call(token, "sendMessage", {"chat_id": chat["id"], "text": resp,
                                           "parse_mode": "HTML", "disable_web_page_preview": True})
        except Exception as e:  # noqa: BLE001
            print(f"[alertas] no se pudo responder: {e!r}")

    avisadas = 0
    for a, h in para_avisar(data, historia):
        try:
            tg_call(token, "sendMessage", {"chat_id": a["chat"], "text": texto_aviso(a, h, affiliate_id),
                                           "parse_mode": "HTML"})
            avisadas += 1
        except Exception as e:  # noqa: BLE001 — si bloqueó al bot, la alerta se descarta igual
            print(f"[alertas] no se pudo avisar: {e!r}")
        data["alertas"].remove(a)

    print(f"[alertas] {len(updates)} mensajes, {creadas} alertas nuevas, {avisadas} avisos, "
          f"{len(data['alertas'])} activas")
    if json.dumps(data, sort_keys=True) != antes:
        guardar(data)
        commitear()
    if avisadas:
        alert_admin(token, cfg["admin_chat"], f"🔔 Alertas: {avisadas} aviso(s) de baja enviados", False)
    return 0


if __name__ == "__main__":
    sys.exit(main())
