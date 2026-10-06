"""
Post de solo texto (sin producto ni link de afiliado) para Facebook y Threads.

Para contenido propio del sitio (estudios, guías): el texto vive en
bot/posts_texto/<nombre>.json con las claves "threads", "facebook" y
opcionalmente "facebook_link". Lo dispara post_texto.yml (workflow_dispatch).
Cada canal es best-effort; avisa el resultado al admin por Telegram.

Uso: POST_TEXTO=estudio-2026-10-06.json [DRY_RUN=1] python bot/post_texto.py
"""

import json
import os
import sys
from pathlib import Path

from cazador_bot import (
    FB_GRAPH,
    alert_admin,
    ig_call,
    load_config,
    publish_threads,
)

DIR = Path(__file__).resolve().parent / "posts_texto"


def publicar_facebook_texto(texto: str, link: str | None, page_id: str, page_token: str, dry: bool) -> str | None:
    """Post de texto (con vista previa del link) en la página de Facebook."""
    if dry:
        print("=" * 60)
        print(f"[DRY] Facebook texto → {link}\n{texto}")
        return "https://facebook.com/DRY_RUN"
    params = {"message": texto, "access_token": page_token}
    if link:
        params["link"] = link
    post = ig_call("POST", f"{page_id}/feed", params, base=FB_GRAPH)
    post_id = post.get("id")
    if not post_id:
        return None
    try:
        info = ig_call("GET", post_id, {"fields": "permalink_url", "access_token": page_token}, base=FB_GRAPH)
        return info.get("permalink_url") or f"post_id {post_id}"
    except Exception:  # noqa: BLE001 — el post ya salió; el permalink es cosmético
        return f"post_id {post_id}"


def cargar(nombre: str) -> dict:
    ruta = (DIR / nombre).resolve()
    if ruta.parent != DIR.resolve() or ruta.suffix != ".json":
        raise ValueError(f"Archivo inválido: {nombre}")
    return json.loads(ruta.read_text(encoding="utf-8"))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    data = cargar(os.environ["POST_TEXTO"])
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    results = []

    page_id = os.getenv("FB_PAGE_ID", "")
    page_token = os.getenv("FB_PAGE_ACCESS_TOKEN", "")
    if data.get("facebook") and page_id and page_token:
        try:
            permalink = publicar_facebook_texto(data["facebook"], data.get("facebook_link"), page_id, page_token, dry)
            results.append(f"Facebook ✅ {permalink}")
        except Exception as e:  # noqa: BLE001 — que un canal no frene al otro
            print(f"[error] Facebook texto falló: {e}")
            results.append(f"Facebook ❌ {str(e)[:150]}")
    else:
        results.append("Facebook ⏭ sin texto o sin credenciales")

    th_user = os.getenv("THREADS_USER_ID", "")
    th_token = os.getenv("THREADS_ACCESS_TOKEN", "")
    if data.get("threads") and th_user and th_token:
        if len(data["threads"]) > 500:
            results.append("Threads ❌ el texto pasa los 500 caracteres")
        else:
            try:
                permalink = publish_threads({}, "", th_user, th_token, dry, caption=data["threads"], text_only=True)
                results.append(f"Threads ✅ {permalink}")
            except Exception as e:  # noqa: BLE001
                print(f"[error] Threads texto falló: {e}")
                results.append(f"Threads ❌ {str(e)[:150]}")
    else:
        results.append("Threads ⏭ sin texto o sin credenciales")

    summary = "📝 Post de texto:\n" + "\n".join(results)
    alert_admin(os.getenv("TELEGRAM_BOT_TOKEN", ""), cfg["admin_chat"], summary, dry)
    print(summary)
    return 0 if not any("❌" in r for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
