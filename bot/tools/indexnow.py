"""Avisa a los buscadores de IndexNow (Bing, que alimenta Copilot/ChatGPT;
Yandex, Seznam, Naver) que las páginas del sitio cambiaron. No necesita
cuenta: la clave se prueba con el archivo público frontend/public/<clave>.txt.

Lee las URLs del sitemap en vivo, así cualquier página nueva (categoría,
guía) se avisa sola. IndexNow desaconseja reenviar URLs sin cambios, así que
se recuerda lo ya enviado (archivo que el workflow guarda en la caché de
Actions) y cada modo manda solo lo que corresponde:

  push    solo URLs nuevas (páginas recién publicadas)
  diario  URLs nuevas + las que cambiaron en las últimas 26 h (lastmod)
  todo    todas (a mano, por ejemplo después de un cambio grande)

Sin memoria (caché vencida o primera corrida) se manda todo una vez.
Uso: python bot/tools/indexnow.py [push|diario|todo]
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

HOST = "cazadordeofertas.com.ar"
KEY = "801aa2e967da65f584c2c78fa86d3762"
UA = "Mozilla/5.0 (compatible; CazadorBot/1.0; +https://cazadordeofertas.com.ar)"
ENVIADAS = Path(os.environ.get("INDEXNOW_ENVIADAS", ".indexnow/enviadas.txt"))


def parse_sitemap(xml: str) -> dict[str, datetime | None]:
    """URL -> lastmod (None si no tiene o no se entiende)."""
    urls: dict[str, datetime | None] = {}
    for bloque in re.findall(r"<url>(.*?)</url>", xml, re.S):
        loc = re.search(r"<loc>([^<]+)</loc>", bloque)
        if not loc or HOST not in loc.group(1):
            continue
        mod = re.search(r"<lastmod>([^<]+)</lastmod>", bloque)
        fecha = None
        if mod:
            try:
                fecha = datetime.fromisoformat(mod.group(1).strip().replace("Z", "+00:00"))
            except ValueError:
                pass
        urls[loc.group(1).strip()] = fecha
    return urls


def elegir(urls: dict[str, datetime | None], enviadas: set[str], modo: str,
           ahora: datetime) -> list[str]:
    if modo == "todo" or not enviadas:
        return sorted(urls)
    nuevas = {u for u in urls if u not in enviadas}
    if modo == "push":
        return sorted(nuevas)
    corte = ahora - timedelta(hours=26)
    cambiadas = {u for u, f in urls.items() if f and f >= corte}
    return sorted(nuevas | cambiadas)


def main() -> int:
    modo = sys.argv[1] if len(sys.argv) > 1 else "diario"
    if modo not in ("push", "diario", "todo"):
        print(f"[indexnow] modo desconocido: {modo}")
        return 1
    req = urllib.request.Request(f"https://{HOST}/sitemap.xml", headers={"User-Agent": UA})
    urls = parse_sitemap(urllib.request.urlopen(req, timeout=30).read().decode("utf-8"))
    enviadas = set(ENVIADAS.read_text().split()) if ENVIADAS.exists() else set()
    lista = elegir(urls, enviadas, modo, datetime.now(timezone.utc))
    if not lista:
        print(f"[indexnow] modo {modo}: nada nuevo que avisar ({len(urls)} URLs en el sitemap)")
        return 0
    body = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": f"https://{HOST}/{KEY}.txt",
        "urlList": lista[:10000],
    }).encode()
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow", data=body,
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": UA},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"[indexnow] modo {modo}: {len(lista)} de {len(urls)} URLs enviadas -> HTTP {r.status}")
    except urllib.error.HTTPError as e:
        print(f"[indexnow] HTTP {e.code}: {e.read()[:300]!r}")
        if e.code != 202:
            return 1
    ENVIADAS.parent.mkdir(parents=True, exist_ok=True)
    ENVIADAS.write_text("\n".join(sorted(enviadas | set(urls))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
