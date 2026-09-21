"""
Activa la subida a YouTube Shorts en un solo paso (correr UNA vez, en tu PC).

Antes: en console.cloud.google.com crear un proyecto, habilitar "YouTube Data
API v3", y en Credenciales crear un "ID de cliente de OAuth" tipo "Aplicación
de escritorio". En la pantalla de consentimiento agregar tu mail como usuario
de prueba.

Uso:   python bot/tools/setup_youtube.py

Te pide el Client ID y el Client Secret (el secret se escribe oculto), abre el
navegador para que autorices con la cuenta del canal, y guarda los 3 secrets
(YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN) directo en GitHub Actions
con `gh`. Nada se imprime ni se guarda en archivos.
"""

import getpass
import json
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer

REPO = "Raifelmolero/cazador-de-ofertas-ar"
PORT = 8765
REDIRECT = f"http://127.0.0.1:{PORT}"
SCOPE = "https://www.googleapis.com/auth/youtube.upload"


def auth_url(client_id: str) -> str:
    q = urllib.parse.urlencode({
        "client_id": client_id,
        "redirect_uri": REDIRECT,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent",  # fuerza que devuelva refresh_token
    })
    return f"https://accounts.google.com/o/oauth2/v2/auth?{q}"


def wait_for_code() -> str:
    box: dict = {}

    class H(BaseHTTPRequestHandler):
        def do_GET(self):  # noqa: N802
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            box["code"] = (qs.get("code") or [""])[0]
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write("<h2>Listo, ya podés volver a la terminal.</h2>".encode())

        def log_message(self, *a):  # silencio
            pass

    srv = HTTPServer(("127.0.0.1", PORT), H)
    while "code" not in box:
        srv.handle_request()
    return box["code"]


def exchange(client_id: str, client_secret: str, code: str) -> str:
    body = urllib.parse.urlencode({
        "code": code, "client_id": client_id, "client_secret": client_secret,
        "redirect_uri": REDIRECT, "grant_type": "authorization_code",
    }).encode()
    try:
        with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=body)) as r:
            j = json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(
            f"Google rechazó el canje ({e.code}): {e.read().decode('utf-8', 'replace')[:200]}\n"
            f"Largo del secret recibido: {len(client_secret)} caracteres (un secret normal tiene ~35, "
            "empieza con GOCSPX-). Si es 0 o muy distinto, el pegado falló."
        )
    if "refresh_token" not in j:
        sys.exit("Google no devolvió refresh_token. Revocá el acceso en myaccount.google.com/permissions y repetí.")
    return j["refresh_token"]


def gh_token() -> str:
    for cmd in (["gh", "auth", "token", "--user", "Raifelmolero"], ["gh", "auth", "token"]):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    sys.exit("No encontré sesión de gh. Corré `gh auth login` con la cuenta Raifelmolero.")


def set_secret(name: str, value: str, token: str) -> None:
    import os
    env = {**os.environ, "GH_TOKEN": token}
    r = subprocess.run(["gh", "secret", "set", name, "--repo", REPO], input=value,
                       text=True, capture_output=True, env=env)
    if r.returncode != 0:
        sys.exit(f"No pude guardar {name}: {r.stderr.strip()}")
    print(f"✓ {name} guardado")


def main() -> None:
    client_id = input("Client ID: ").strip()
    client_secret = getpass.getpass("Client Secret (oculto): ").strip()
    print("Se abre el navegador: elegí la cuenta del canal y aceptá.")
    webbrowser.open(auth_url(client_id))
    refresh = exchange(client_id, client_secret, wait_for_code())
    token = gh_token()
    set_secret("YT_CLIENT_ID", client_id, token)
    set_secret("YT_CLIENT_SECRET", client_secret, token)
    set_secret("YT_REFRESH_TOKEN", refresh, token)
    print("Listo. El próximo reel nocturno también sale como YouTube Short (privado hasta la auditoría).")


if __name__ == "__main__":
    main()
