"""
Prueba manual de la subida a YouTube Shorts (la usa el workflow "YouTube test upload").

Sube un reel ya generado (por defecto el más reciente de bot/reels) SIEMPRE como
privado, para ver el error exacto cuando la subida nocturna falla (desde el
17/10 no quedó registrado ningún Short). Necesita YT_CLIENT_ID / YT_CLIENT_SECRET /
YT_REFRESH_TOKEN como variables de entorno. No toca Instagram, Threads ni Telegram.

Uso:   python bot/tools/test_youtube.py [ruta/al/video.mp4]
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import shorts  # noqa: E402


def main() -> int:
    reels = Path(__file__).resolve().parents[1] / "reels"
    video = Path(sys.argv[1]) if len(sys.argv) > 1 else max(reels.glob("*.mp4"), key=lambda p: p.name)
    print(f"Video: {video.name} ({video.stat().st_size / 1024:.0f} KB)")

    env = os.environ.get
    try:
        tok = shorts.youtube_access_token(env("YT_CLIENT_ID", ""), env("YT_CLIENT_SECRET", ""),
                                          env("YT_REFRESH_TOKEN", ""))
    except Exception as e:  # noqa: BLE001
        print(f"✗ access token: {e}")
        return 1
    print("✓ access token obtenido")

    deal = {"discount": 40, "title": "Prueba de integración (privado)"}
    try:
        url = shorts.upload_youtube_short(video, deal, "https://cazadordeofertas.com.ar",
                                          "https://cazadordeofertas.com.ar", tok, privacy="private")
    except Exception as e:  # noqa: BLE001
        print(f"✗ subida: {e}")
        return 1
    print(f"✓ subido (privado): {url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
