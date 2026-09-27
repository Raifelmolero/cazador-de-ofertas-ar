"""
Post manual de solo texto en Threads y, opcionalmente, en el canal de
Telegram (sin oferta de ML): para difundir guías, páginas propias o
novedades como el canal de WhatsApp. Lo dispara texto_post.yml pasando
TEXTO. Avisa al admin por Telegram.
"""

import os
import sys

from cazador_bot import alert_admin, load_config, publish_threads, tg_call


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    texto = os.environ["TEXTO"].strip()
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    th_user, th_token = os.getenv("THREADS_USER_ID", ""), os.getenv("THREADS_ACCESS_TOKEN", "")
    results = []
    if os.getenv("TELEGRAM") == "1":
        if dry:
            print("[DRY] Telegram\n" + texto)
            results.append("Telegram (dry)")
        else:
            try:
                msg = tg_call(token, "sendMessage", {"chat_id": cfg["channel"], "text": texto})
                results.append("Telegram ✅")
                if os.getenv("FIJAR") == "1":
                    mid = (msg.get("result") or msg).get("message_id")
                    tg_call(token, "pinChatMessage", {
                        "chat_id": cfg["channel"], "message_id": mid, "disable_notification": True,
                    })
                    results.append("Telegram 📌 fijado")
            except Exception as e:  # noqa: BLE001 — que un canal no frene al otro
                results.append(f"Telegram ❌ {str(e)[:150]}")
    if os.getenv("THREADS", "1") == "1":
        try:
            permalink = publish_threads({}, "", th_user, th_token, dry, caption=texto, text_only=True)
            results.append(f"Threads ✅ {permalink}")
        except Exception as e:  # noqa: BLE001
            results.append(f"Threads ❌ {str(e)[:150]}")
    res = "\n".join(results)
    alert_admin(token, cfg["admin_chat"], "📝 Post de texto:\n" + res, dry)
    print(res)
    return 0


if __name__ == "__main__":
    sys.exit(main())
