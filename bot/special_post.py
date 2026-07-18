"""
Post especial manual — para eventos: Mundial, Hot Sale, Black Friday, etc.

Se dispara con workflow_dispatch (special_post.yml) pasando DEAL_JSON:
{
  "id": "MLA...", "title": "...", "url": "https://...",
  "price_prev": 123, "price_cur": 99, "discount": 20, "img": "https://...",
  "caption_ig": "texto para IG",
  "caption_th": "texto para Threads con {link} donde va el link de afiliado"
}

En ambas captions "{link}" se reemplaza por el link con tracking de afiliado.
Publica en IG + Threads (best-effort cada uno) y avisa al admin por Telegram.
"""

import json
import os
import sys

from cazador_bot import (
    affiliate_url,
    alert_admin,
    ig_publish,
    load_config,
    publish_threads,
)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    data = json.loads(os.environ["DEAL_JSON"])
    dry = os.getenv("DRY_RUN", "0") == "1"
    cfg = load_config()
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    affiliate_id = os.getenv("ML_AFFILIATE_ID", "")

    deal = {k: data[k] for k in ("id", "title", "url", "price_prev", "price_cur", "discount", "img")}
    link = affiliate_url(deal["url"], affiliate_id)
    caption_ig = (data.get("caption_ig") or "").replace("{link}", link) or None
    caption_th = (data.get("caption_th") or "").replace("{link}", link) or None

    results = []

    ig_user_id = os.getenv("IG_USER_ID", "")
    ig_token = os.getenv("IG_ACCESS_TOKEN", "")
    if ig_user_id and ig_token:
        try:
            permalink = ig_publish(deal, ig_user_id, ig_token, dry, caption=caption_ig, tag="esp")
            results.append(f"IG ✅ {permalink}")
        except Exception as e:  # noqa: BLE001 — que un canal no frene al otro
            print(f"[error] IG especial falló: {e}")
            results.append(f"IG ❌ {str(e)[:150]}")
    else:
        results.append("IG ⏭ sin credenciales")

    threads_user_id = os.getenv("THREADS_USER_ID", "")
    threads_token = os.getenv("THREADS_ACCESS_TOKEN", "")
    if threads_user_id and threads_token:
        try:
            permalink = publish_threads(
                deal, link, threads_user_id, threads_token, dry,
                caption=caption_th, tag="esp-th",
            )
            results.append(f"Threads ✅ {permalink}")
        except Exception as e:  # noqa: BLE001
            print(f"[error] Threads especial falló: {e}")
            results.append(f"Threads ❌ {str(e)[:150]}")
    else:
        results.append("Threads ⏭ sin credenciales")

    summary = "🎯 Post especial:\n" + "\n".join(results)
    alert_admin(token, cfg["admin_chat"], summary, dry)
    print(summary)
    return 0


if __name__ == "__main__":
    sys.exit(main())
