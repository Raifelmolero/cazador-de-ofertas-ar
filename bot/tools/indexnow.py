"""Avisa a los buscadores de IndexNow (Bing, que alimenta Copilot/ChatGPT;
Yandex, Seznam, Naver) que las páginas del sitio cambiaron. No necesita
cuenta: la clave se prueba con el archivo público frontend/public/<clave>.txt.

Lee las URLs del sitemap en vivo, así cualquier página nueva (categoría,
guía) se avisa sola. Uso: python bot/tools/indexnow.py
"""
import json
import re
import sys
import urllib.request

HOST = "cazadordeofertas.com.ar"
KEY = "801aa2e967da65f584c2c78fa86d3762"
UA = "Mozilla/5.0 (compatible; CazadorBot/1.0; +https://cazadordeofertas.com.ar)"


def sitemap_urls() -> list[str]:
    req = urllib.request.Request(f"https://{HOST}/sitemap.xml", headers={"User-Agent": UA})
    xml = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
    return [u for u in re.findall(r"<loc>([^<]+)</loc>", xml) if HOST in u]


def main() -> int:
    urls = sitemap_urls()
    body = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": f"https://{HOST}/{KEY}.txt",
        "urlList": urls,
    }).encode()
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow", data=body,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": UA},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"[indexnow] {len(urls)} URLs enviadas → HTTP {r.status}")
    except urllib.error.HTTPError as e:
        print(f"[indexnow] HTTP {e.code}: {e.read()[:300]!r}")
        return 0 if e.code == 202 else 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
