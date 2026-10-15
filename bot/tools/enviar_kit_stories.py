"""
Manda al Telegram privado del admin las placas de historias de IG con su link
y el texto del sticker, para copiar y pegar desde el celular.

Lee docs/stories-kit/<set>/kit.json (lista de {archivo, cuando, link, sticker}).
Cada placa va como documento (calidad original, 1080x1920): al tocarla,
"Guardar en galería". El link va en el pie, en <code> para copiarlo con un toque.

Uso: TELEGRAM_BOT_TOKEN=... python bot/tools/enviar_kit_stories.py madre [--dry]
No publica nada en Instagram: solo manda mensajes al chat del dueño.
"""
import html
import json
import os
import sys
import urllib.request
import uuid
from pathlib import Path

ADMIN_CHAT = "8701191351"
RAIZ = Path(__file__).resolve().parents[2]


def multipart(campos: dict, nombre_archivo: str, contenido: bytes) -> tuple[bytes, str]:
    b = uuid.uuid4().hex
    partes = []
    for k, v in campos.items():
        partes.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
    partes.append((f'--{b}\r\nContent-Disposition: form-data; name="document"; filename="{nombre_archivo}"\r\n'
                   "Content-Type: image/png\r\n\r\n").encode() + contenido + b"\r\n")
    partes.append(f"--{b}--\r\n".encode())
    return b"".join(partes), f"multipart/form-data; boundary={b}"


def pie(item: dict) -> str:
    return (f"📲 <b>{html.escape(item['cuando'])}</b>\n"
            f"Sticker «Enlace» → pegá:\n<code>https://{html.escape(item['link'])}</code>\n"
            f"Texto del sticker: <b>{html.escape(item['sticker'])}</b>")


def main(argv=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    dry = "--dry" in argv
    sets = [a for a in argv if not a.startswith("--")]
    if not sets:
        print("Falta el nombre del set (carpeta de docs/stories-kit).")
        return 2
    carpeta = RAIZ / "docs" / "stories-kit" / sets[0]
    items = json.loads((carpeta / "kit.json").read_text(encoding="utf-8"))
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    if not dry and not token:
        print("Sin TELEGRAM_BOT_TOKEN.")
        return 1
    for it in items:
        ruta = carpeta / it["archivo"]
        if dry:
            print(f"[DRY] {ruta.name} ({ruta.stat().st_size} bytes)\n{pie(it)}\n")
            continue
        cuerpo, tipo = multipart({"chat_id": ADMIN_CHAT, "caption": pie(it), "parse_mode": "HTML"},
                                 ruta.name, ruta.read_bytes())
        req = urllib.request.Request(f"https://api.telegram.org/bot{token}/sendDocument",
                                     data=cuerpo, headers={"Content-Type": tipo})
        with urllib.request.urlopen(req, timeout=60) as r:
            print(ruta.name, r.status)
    return 0


if __name__ == "__main__":
    sys.exit(main())
