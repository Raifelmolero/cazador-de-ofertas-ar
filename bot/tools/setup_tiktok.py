"""
Activa la subida a TikTok en un solo paso (correr UNA vez, en tu PC).

Antes: en developers.tiktok.com crear la app con Login Kit + Content Posting API
(Direct Post, scope video.publish) y agregar como Redirect URI:
    https://cazadordeofertas.com.ar/tiktok/callback

Uso:   python bot/tools/setup_tiktok.py

Te pide el Client Key y el Client Secret (el secret se escribe oculto), te da un
link para autorizar con la cuenta de TikTok, la página del sitio te muestra un
código que pegás acá, y se guardan 3 secrets (TIKTOK_CLIENT_KEY,
TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN) directo en GitHub Actions con `gh`.
Nada se imprime ni se guarda en archivos.
"""

import getpass
import json
import os
import secrets
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

REPO = "Raifelmolero/cazador-de-ofertas-ar"
REDIRECT = "https://cazadordeofertas.com.ar/tiktok/callback"
SCOPE = "user.info.basic,video.publish"


def auth_url(client_key: str, state: str) -> str:
    q = urllib.parse.urlencode({
        "client_key": client_key,
        "scope": SCOPE,
        "response_type": "code",
        "redirect_uri": REDIRECT,
        "state": state,
    })
    return f"https://www.tiktok.com/v2/auth/authorize/?{q}"


def exchange(client_key: str, client_secret: str, code: str) -> str:
    body = urllib.parse.urlencode({
        "client_key": client_key, "client_secret": client_secret, "code": code,
        "grant_type": "authorization_code", "redirect_uri": REDIRECT,
    }).encode()
    req = urllib.request.Request(
        "https://open.tiktokapis.com/v2/oauth/token/", data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req) as r:
            j = json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(
            f"TikTok rechazó el canje ({e.code}): {e.read().decode('utf-8', 'replace')[:300]}\n"
            f"Largo del secret recibido: {len(client_secret)} caracteres. "
            "Si el código tardó mucho en pegarse, vencido: repetí desde el link."
        )
    if "refresh_token" not in j:
        sys.exit(f"TikTok no devolvió refresh_token: {json.dumps(j)[:300]}")
    return j["refresh_token"]


def gh_token() -> str:
    for cmd in (["gh", "auth", "token", "--user", "Raifelmolero"], ["gh", "auth", "token"]):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    sys.exit("No encontré sesión de gh. Corré `gh auth login` con la cuenta Raifelmolero.")


def set_secret(name: str, value: str, token: str) -> None:
    env = {**os.environ, "GH_TOKEN": token}
    r = subprocess.run(["gh", "secret", "set", name, "--repo", REPO], input=value,
                       text=True, capture_output=True, env=env)
    if r.returncode != 0:
        sys.exit(f"No pude guardar {name}: {r.stderr.strip()}")
    print(f"✓ {name} guardado")


def main() -> None:
    client_key = os.environ.get("TIKTOK_CLIENT_KEY", "").strip() or input("Client Key: ").strip()
    client_secret = os.environ.get("TIKTOK_CLIENT_SECRET", "").strip() or getpass.getpass("Client Secret (oculto): ").strip()
    half = len(client_secret) // 2
    if len(client_secret) % 2 == 0 and client_secret[:half] == client_secret[half:]:
        client_secret = client_secret[:half]  # se pegó dos veces: nos quedamos con una
    state = secrets.token_urlsafe(12)
    print("\nAbrí este link en el navegador donde tenés abierta la cuenta @cazadordeofertas.ar y aceptá:\n")
    print(auth_url(client_key, state) + "\n")
    print("Al terminar, la página cazadordeofertas.com.ar te muestra un código. Copialo completo.")
    code = ""
    while not code:
        code = urllib.parse.unquote(input("Código (pegalo con clic derecho y Enter): ").strip())
    refresh = exchange(client_key, client_secret, code)
    token = gh_token()
    set_secret("TIKTOK_CLIENT_KEY", client_key, token)
    set_secret("TIKTOK_CLIENT_SECRET", client_secret, token)
    set_secret("TIKTOK_REFRESH_TOKEN", refresh, token)
    print("Listo. El próximo reel nocturno también sale a TikTok (privado hasta la auditoría).")


if __name__ == "__main__":
    main()
