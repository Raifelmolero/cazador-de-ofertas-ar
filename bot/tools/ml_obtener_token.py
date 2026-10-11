"""Obtiene UNA vez el refresh_token de usuario de Mercado Libre (plan B de la API).

Se corre en la PC de Raifel, no en GitHub Actions. Hace el flujo OAuth
"authorization_code" de la app (la misma de ML_CLIENT_ID/ML_CLIENT_SECRET):

  1. Imprime la URL de autorización (auth.mercadolibre.com.ar). La abrís en el
     navegador, entrás con la cuenta dueña de la app y aceptás.
  2. ML te redirige a la redirect_uri con ?code=TG-... . Copiás el code (o la
     URL completa) y lo pegás acá. No se muestra en pantalla.
  3. Canjea el code en POST /oauth/token y guarda el refresh_token en un
     archivo local FUERA del repo. NUNCA imprime tokens ni secrets.

Uso (stdlib pura):
  python bot/tools/ml_obtener_token.py --redirect-uri https://cazadordeofertas.com.ar/
  (ML_CLIENT_ID / ML_CLIENT_SECRET / ML_REDIRECT_URI se leen del entorno si
  existen; si no, pregunta. El secret se pide sin eco.)

Opciones: --salida RUTA (default ~/.cazador-ofertas/ml_refresh_token.txt),
--pkce (si la app tiene PKCE activado). Docs: docs/ML-API-TOKEN-USUARIO.md
"""
from __future__ import annotations

import argparse
import base64
import getpass
import hashlib
import json
import os
import re
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

AUTH_URL = "https://auth.mercadolibre.com.ar/authorization"
TOKEN_URL = "https://api.mercadolibre.com/oauth/token"
REPO = Path(__file__).resolve().parents[2]
SALIDA_DEFAULT = Path.home() / ".cazador-ofertas" / "ml_refresh_token.txt"


def _post(url: str, data: bytes, timeout: int = 20) -> dict:
    req = urllib.request.Request(url, data=data, headers={
        "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def par_pkce() -> tuple[str, str]:
    """(code_verifier, code_challenge S256)."""
    verifier = secrets.token_urlsafe(64)
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return verifier, base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")


def armar_url(client_id: str, redirect_uri: str, state: str, challenge: str | None = None) -> str:
    q = {"response_type": "code", "client_id": client_id, "redirect_uri": redirect_uri, "state": state}
    if challenge:
        q.update(code_challenge=challenge, code_challenge_method="S256")
    return AUTH_URL + "?" + urllib.parse.urlencode(q)


def extraer_code(pegado: str, state_esperado: str | None = None) -> str:
    """Acepta el code suelto o la URL completa de redirección. Valida `state` si viene."""
    txt = pegado.strip().strip("'\"")
    if not txt:
        raise ValueError("no pegaste nada")
    qs = None
    if txt.startswith(("http://", "https://")):
        qs = urllib.parse.urlparse(txt).query
    elif "code=" in txt:
        qs = txt.split("?", 1)[-1]
    if qs is not None:
        q = urllib.parse.parse_qs(qs)
        if not q.get("code"):
            raise ValueError("lo pegado no tiene el parámetro code")
        if state_esperado and q.get("state") and q["state"][0] != state_esperado:
            raise ValueError("el state de la URL no coincide: abortado por seguridad")
        return q["code"][0]
    if re.search(r"\s", txt):
        raise ValueError("lo pegado no parece un code de ML (tiene espacios)")
    return txt


def canjear_code(client_id: str, client_secret: str, code: str, redirect_uri: str,
                 verifier: str | None = None, post=_post) -> dict:
    campos = {"grant_type": "authorization_code", "client_id": client_id,
              "client_secret": client_secret, "code": code, "redirect_uri": redirect_uri}
    if verifier:
        campos["code_verifier"] = verifier
    return post(TOKEN_URL, urllib.parse.urlencode(campos).encode())


def _dentro_del_repo(ruta: Path) -> bool:
    try:
        ruta.resolve().relative_to(REPO.resolve())
        return True
    except ValueError:
        return False


def guardar_refresh(ruta: Path, refresh_token: str) -> None:
    ruta.parent.mkdir(parents=True, exist_ok=True)
    ruta.write_text(refresh_token, encoding="utf-8")
    try:
        os.chmod(ruta, 0o600)
    except OSError:
        pass


def _leer_secreto(prompt: str) -> str:
    return getpass.getpass(prompt) if sys.stdin.isatty() else sys.stdin.readline().strip()


def _motivo_http(e: urllib.error.HTTPError) -> str:
    try:
        cuerpo = json.loads(e.read().decode("utf-8", "replace"))
        return " ".join(str(cuerpo.get(k, "")) for k in ("error", "message") if cuerpo.get(k))[:200]
    except Exception:  # noqa: BLE001
        return ""


def main(argv: list[str] | None = None, leer_secreto=_leer_secreto, post=_post) -> int:
    ap = argparse.ArgumentParser(description="Obtiene el refresh_token de usuario de Mercado Libre.")
    ap.add_argument("--redirect-uri", default=os.getenv("ML_REDIRECT_URI"),
                    help="exactamente la Redirect URI configurada en la app de ML")
    ap.add_argument("--salida", type=Path, default=SALIDA_DEFAULT,
                    help="archivo donde guardar el refresh_token (fuera del repo)")
    ap.add_argument("--pkce", action="store_true", help="usar PKCE (si la app lo tiene activado)")
    a = ap.parse_args(argv)

    if _dentro_del_repo(a.salida):
        print("Error: --salida está dentro del repo; elegí una ruta fuera para no commitear el token.")
        return 2
    client_id = os.getenv("ML_CLIENT_ID") or input("ML_CLIENT_ID (App ID): ").strip()
    client_secret = os.getenv("ML_CLIENT_SECRET") or leer_secreto("ML_CLIENT_SECRET (no se muestra): ")
    redirect_uri = a.redirect_uri or input("Redirect URI de la app: ").strip()
    if not (client_id and client_secret and redirect_uri):
        print("Faltan datos (client id, secret o redirect uri).")
        return 2

    state = secrets.token_urlsafe(16)
    verifier, challenge = par_pkce() if a.pkce else (None, None)
    print("\n1) Abrí esta URL en el navegador, entrá con la cuenta DUEÑA de la app y aceptá:\n")
    print(armar_url(client_id, redirect_uri, state, challenge))
    print("\n2) Te redirige a tu Redirect URI con ?code=TG-... (la página puede dar error, no importa).")
    print("   Copiá el code o la URL completa de la barra y pegala acá (no se muestra).")
    try:
        code = extraer_code(leer_secreto("code o URL: "), state)
    except ValueError as e:
        print(f"Error: {e}")
        return 2

    try:
        r = canjear_code(client_id, client_secret, code, redirect_uri, verifier, post)
    except urllib.error.HTTPError as e:
        print(f"Error: ML rechazó el canje (HTTP {e.code}) {_motivo_http(e)}".rstrip())
        print("El code vence en minutos y sirve una sola vez: repetí desde el paso 1.")
        return 1
    except Exception as e:  # noqa: BLE001
        print(f"Error: no se pudo canjear el code ({type(e).__name__}).")
        return 1
    refresh = r.get("refresh_token") if isinstance(r, dict) else None
    if not refresh:
        print("Error: ML no devolvió refresh_token. Activá el permiso 'offline_access' "
              "(Mantener sesión) en la app de ML y repetí.")
        return 1

    guardar_refresh(a.salida, str(refresh))
    print("\nListo. El refresh_token quedó guardado (no se muestra) en:")
    print(f"  {a.salida}")
    print(f"  user_id: {r.get('user_id', '?')} | scope: {r.get('scope', '?')}")
    print("\nPróximo paso: cargarlo como secret del repo, sin copiarlo a mano:")
    print(f'  gh secret set ML_REFRESH_TOKEN --repo Raifelmolero/cazador-de-ofertas-ar < "{a.salida}"')
    print("Después borrá el archivo. Más detalles: docs/ML-API-TOKEN-USUARIO.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
