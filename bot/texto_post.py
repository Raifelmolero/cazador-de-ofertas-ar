"""
Post manual de solo texto en Threads (sin oferta de ML): para difundir
guías o páginas propias, p. ej. las de calculadoraml.com.ar. Lo dispara
texto_post.yml pasando TEXTO. Avisa al admin por Telegram.
"""

import os
import sys

from cazador_bot import alert_admin, load_config, publish_threads


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    texto = os.environ["TEXTO"].strip()
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    th_user, th_token = os.getenv("THREADS_USER_ID", ""), os.getenv("THREADS_ACCESS_TOKEN", "")
    try:
        permalink = publish_threads({}, "", th_user, th_token, dry, caption=texto, text_only=True)
        res = f"Threads ✅ {permalink}"
    except Exception as e:  # noqa: BLE001
        res = f"Threads ❌ {str(e)[:150]}"
    alert_admin(token, cfg["admin_chat"], "📝 Post de texto:\n" + res, dry)
    print(res)
    return 0


if __name__ == "__main__":
    sys.exit(main())
