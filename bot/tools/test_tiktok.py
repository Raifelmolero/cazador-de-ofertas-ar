"""
Prueba manual de la subida a TikTok (la usa el workflow "TikTok test upload").

Sube un reel ya generado (por defecto el más reciente de bot/reels) a la cuenta
autorizada y consulta el estado de la publicación. Necesita los secrets
TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET / TIKTOK_REFRESH_TOKEN como variables
de entorno. No toca Instagram, Threads ni Telegram.

Uso:   python bot/tools/test_tiktok.py [ruta/al/video.mp4]
"""

import json
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import shorts  # noqa: E402

STATUS_URL = "https://open.tiktokapis.com/v2/post/publish/status/fetch/"


def main() -> None:
    reels = Path(__file__).resolve().parents[1] / "reels"
    video = Path(sys.argv[1]) if len(sys.argv) > 1 else max(reels.glob("*.mp4"), key=lambda p: p.name)
    print(f"Video: {video} ({video.stat().st_size / 1024:.0f} KB)")

    env = os.environ.get
    tok = shorts.tiktok_access_token(env("TIKTOK_CLIENT_KEY", ""), env("TIKTOK_CLIENT_SECRET", ""),
                                     env("TIKTOK_REFRESH_TOKEN", ""))
    print("✓ access token obtenido")

    deal = {"discount": 40, "title": "Prueba de integración"}
    pid = shorts.upload_tiktok(video, deal, tok, privacy=env("TIKTOK_PRIVACY", "SELF_ONLY"))
    print(f"✓ subido, publish_id={pid}")

    for _ in range(10):
        time.sleep(5)
        raw, _h = shorts._request(
            STATUS_URL, json.dumps({"publish_id": pid}).encode(),
            {"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8"},
        )
        data = json.loads(raw).get("data", {})
        print("estado:", data.get("status"), data.get("fail_reason", ""))
        if data.get("status") in ("PUBLISH_COMPLETE", "FAILED"):
            break


if __name__ == "__main__":
    main()
