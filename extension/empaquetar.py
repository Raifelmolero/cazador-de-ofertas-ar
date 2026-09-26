"""Arma el .zip para subir a la Chrome Web Store: solo lo que la extensión
necesita (manifest, scripts e íconos), sin README ni textos de la ficha.
Uso: python extension/empaquetar.py  → deja cazador-extension-<versión>.zip
en la carpeta desde donde se corre."""
import json
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ARCHIVOS = ["manifest.json", "background.js", "content.js", "icon16.png", "icon48.png", "icon128.png"]

version = json.loads((AQUI / "manifest.json").read_text(encoding="utf-8"))["version"]
destino = Path.cwd() / f"cazador-extension-{version}.zip"
with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
    for nombre in ARCHIVOS:
        z.write(AQUI / nombre, nombre)
print(f"Listo: {destino}")
