"""
Reparte el reel del día a YouTube Shorts y TikTok (stdlib pura).

Cada destino se activa solo si están sus credenciales como secrets; sin ellas
no hace nada (así se puede mergear antes de tener las cuentas). Todo es
best-effort: una falla acá jamás frena a IG/Telegram, solo se informa al admin.

YouTube  — YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN
           (videos.insert, subida resumable; hasta que Google audite el
           proyecto los videos quedan privados — ver YT_PRIVACY).
TikTok   — TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN
           (Content Posting API, FILE_UPLOAD; sin auditoría de TikTok solo
           permite SELF_ONLY — ver TIKTOK_PRIVACY).
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

YT_TOKEN_URL = "https://oauth2.googleapis.com/token"
YT_UPLOAD_URL = (
    "https://www.googleapis.com/upload/youtube/v3/videos"
    "?uploadType=resumable&part=snippet,status"
)
TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/"
TIKTOK_INIT_URL = "https://open.tiktokapis.com/v2/post/publish/video/init/"

YT_TITLE_MAX = 100
TIKTOK_TITLE_MAX = 150


def _request(url: str, data: bytes | None, headers: dict, method: str = "POST",
             timeout: int = 120) -> tuple[bytes, dict]:
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read(), dict(resp.headers)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        raise RuntimeError(f"HTTP {e.code} en {url.split('?')[0]}: {body}") from None


def yt_title(deal: dict) -> str:
    """Título ≤100 caracteres terminado en #Shorts (así YouTube lo clasifica)."""
    suffix = " #Shorts"
    base = f"{deal['discount']}% OFF · {deal['title']}"
    return base[: YT_TITLE_MAX - len(suffix)].rstrip() + suffix


def yt_description(deal: dict, site_link: str, ml_link: str) -> str:
    return (
        f"🔥 {deal['title']}\n\n"
        f"🛒 Ver la oferta en Mercado Libre: {ml_link}\n"
        f"🔎 Más ofertas todos los días: {site_link}\n\n"
        "Como afiliados de Mercado Libre podemos recibir una comisión por tus compras, "
        "sin costo extra para vos.\n#ofertas #mercadolibre #argentina"
    )


def tiktok_caption(deal: dict) -> str:
    base = f"{deal['discount']}% OFF · {deal['title']} 🔥 Link en la bio #ofertas #mercadolibre"
    return base[:TIKTOK_TITLE_MAX]


def youtube_access_token(client_id: str, client_secret: str, refresh_token: str) -> str:
    body = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }).encode()
    raw, _ = _request(YT_TOKEN_URL, body, {"Content-Type": "application/x-www-form-urlencoded"})
    return json.loads(raw)["access_token"]


def upload_youtube_short(video: Path, deal: dict, site_link: str, ml_link: str,
                         access_token: str, privacy: str = "private") -> str:
    """Sube el MP4 como Short. Devuelve la URL del video."""
    meta = {
        "snippet": {
            "title": yt_title(deal),
            "description": yt_description(deal, site_link, ml_link),
            "tags": ["ofertas", "mercadolibre", "argentina", "shorts"],
            "categoryId": "22",
        },
        "status": {"privacyStatus": privacy, "selfDeclaredMadeForKids": False},
    }
    data = video.read_bytes()
    _, headers = _request(
        YT_UPLOAD_URL,
        json.dumps(meta).encode(),
        {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Type": "video/mp4",
            "X-Upload-Content-Length": str(len(data)),
        },
    )
    session = headers.get("Location") or headers.get("location")
    if not session:
        raise RuntimeError("YouTube no devolvió la URL de subida")
    raw, _ = _request(session, data, {"Content-Type": "video/mp4"}, method="PUT", timeout=300)
    return f"https://youtube.com/shorts/{json.loads(raw)['id']}"


def tiktok_access_token(client_key: str, client_secret: str, refresh_token: str) -> str:
    body = urllib.parse.urlencode({
        "client_key": client_key,
        "client_secret": client_secret,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }).encode()
    raw, _ = _request(TIKTOK_TOKEN_URL, body, {"Content-Type": "application/x-www-form-urlencoded"})
    j = json.loads(raw)
    if "access_token" not in j:
        raise RuntimeError(f"TikTok sin access_token: {str(j)[:200]}")
    return j["access_token"]


def upload_tiktok(video: Path, deal: dict, access_token: str,
                  privacy: str = "SELF_ONLY") -> str:
    """Publica el MP4 vía FILE_UPLOAD en un solo chunk. Devuelve el publish_id."""
    data = video.read_bytes()
    size = len(data)
    init = {
        "post_info": {
            "title": tiktok_caption(deal),
            "privacy_level": privacy,
            "disable_comment": False,
        },
        "source_info": {
            "source": "FILE_UPLOAD",
            "video_size": size,
            "chunk_size": size,
            "total_chunk_count": 1,
        },
    }
    raw, _ = _request(
        TIKTOK_INIT_URL,
        json.dumps(init).encode(),
        {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json; charset=UTF-8",
        },
    )
    j = json.loads(raw)
    err = j.get("error", {})
    if err.get("code") not in (None, "ok"):
        raise RuntimeError(f"TikTok init: {err}")
    upload_url = j["data"]["upload_url"]
    _request(
        upload_url,
        data,
        {
            "Content-Type": "video/mp4",
            "Content-Length": str(size),
            "Content-Range": f"bytes 0-{size - 1}/{size}",
        },
        method="PUT",
        timeout=300,
    )
    return j["data"]["publish_id"]


def cross_post(video: Path, deal: dict, site_link: str, ml_links: dict[str, str],
               dry: bool = False) -> list[str]:
    """Sube el reel a los destinos con credenciales. Devuelve líneas de resumen
    (una por destino, éxito o error) para el aviso al admin; [] si no hay ninguno
    configurado."""
    out: list[str] = []
    env = os.environ.get

    if env("YT_CLIENT_ID") and env("YT_CLIENT_SECRET") and env("YT_REFRESH_TOKEN"):
        if dry:
            out.append("[DRY] YouTube Short")
        else:
            try:
                tok = youtube_access_token(env("YT_CLIENT_ID"), env("YT_CLIENT_SECRET"),
                                           env("YT_REFRESH_TOKEN"))
                url = upload_youtube_short(
                    video, deal, site_link, ml_links["youtube"], tok,
                    privacy=env("YT_PRIVACY", "private"),
                )
                out.append(f"▶️ YouTube Short: {url}")
            except Exception as e:  # noqa: BLE001 — best-effort
                out.append(f"⚠️ YouTube Short falló: {str(e)[:150]}")

    if env("TIKTOK_CLIENT_KEY") and env("TIKTOK_CLIENT_SECRET") and env("TIKTOK_REFRESH_TOKEN"):
        if dry:
            out.append("[DRY] TikTok")
        else:
            try:
                tok = tiktok_access_token(env("TIKTOK_CLIENT_KEY"), env("TIKTOK_CLIENT_SECRET"),
                                          env("TIKTOK_REFRESH_TOKEN"))
                pid = upload_tiktok(video, deal, tok, privacy=env("TIKTOK_PRIVACY", "SELF_ONLY"))
                out.append(f"🎵 TikTok enviado (publish_id {pid})")
            except Exception as e:  # noqa: BLE001 — best-effort
                out.append(f"⚠️ TikTok falló: {str(e)[:150]}")

    return out
