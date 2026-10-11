"""Scraper de ofertas de ML para correr en TU PC (IP residencial, Chrome real).

Por que: desde GitHub Actions ML devuelve la pantalla anti-bot. Aca se piden
POCAS paginas, con pausas largas, y se FRENA en la primera pantalla anti-bot.
No resuelve captchas ni disimula nada: si ML pide verificacion, se corta y se
registra un descanso; resolverla (si queres) es a mano en tu navegador.

Deja bot/state/scraped_local.json; el bot lo usa como fuente si esta fresco
(ver cazador_bot.load_scraped_snapshot). Con --push lo commitea y sube.

Uso (desde bot-repo):
    python bot/tools/scraper_local.py            # 3 paginas
    python bot/tools/scraper_local.py --pages 4 --push
"""
from __future__ import annotations

import argparse
import json
import random
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "bot"))
import cazador_bot as bot  # noqa: E402

PROFILE = Path("D:/ext/ml-profile")
SNAPSHOT = REPO / "bot" / "state" / "scraped_local.json"
ESTADO = REPO / "bot" / "state" / "scraper_local_estado.json"
MAX_PAGES_DURO = 5          # tope absoluto, aunque pidan mas
PAUSA_S = (45, 90)          # entre paginas
MIN_ENTRE_CORRIDAS_H = 5    # no correr dos veces seguidas
DESCANSO_TRAS_BLOQUEO_H = 24
MIN_DEALS = 20


def puede_correr(estado_path: Path = ESTADO, ahora: datetime | None = None) -> tuple[bool, str]:
    ahora = ahora or datetime.now(timezone.utc)
    try:
        e = json.loads(estado_path.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001 — sin estado: puede correr
        return True, ""
    hasta = e.get("descanso_hasta")
    if hasta:
        h = datetime.fromisoformat(hasta)
        if ahora < h:
            return False, f"ML bloqueo la ultima vez: descanso hasta {h.astimezone().strftime('%d/%m %H:%M')}"
    ult = e.get("ultima_corrida")
    if ult and ahora - datetime.fromisoformat(ult) < timedelta(hours=MIN_ENTRE_CORRIDAS_H):
        return False, f"corriste hace menos de {MIN_ENTRE_CORRIDAS_H} h; espera para no insistir"
    return True, ""


def anotar(estado_path: Path, bloqueado: bool, ahora: datetime | None = None) -> None:
    ahora = ahora or datetime.now(timezone.utc)
    e = {"ultima_corrida": ahora.isoformat(timespec="seconds")}
    if bloqueado:
        e["descanso_hasta"] = (ahora + timedelta(hours=DESCANSO_TRAS_BLOQUEO_H)).isoformat(timespec="seconds")
    estado_path.parent.mkdir(parents=True, exist_ok=True)
    estado_path.write_text(json.dumps(e), encoding="utf-8")


def armar_snapshot(deals: list[dict], ahora: datetime | None = None) -> dict:
    ahora = ahora or datetime.now(timezone.utc)
    return {"scraped_at": ahora.isoformat(timespec="seconds"), "deals": deals}


def _bajar_paginas(paginas: int) -> tuple[list[dict], bool]:
    from playwright.sync_api import sync_playwright  # import perezoso: solo en tu PC

    deals: list[dict] = []
    vistos: set[str] = set()
    bloqueado = False
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            str(PROFILE), channel="chrome", headless=False, locale="es-AR")
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        for n in range(1, paginas + 1):
            page.goto(bot.OFERTAS_URL.format(page=n), wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(int(random.uniform(4, 8) * 1000))
            html = page.content()
            if bot.is_blocked_html(html) or "captcha" in html.lower()[:20000]:
                print(f"[warn] pagina {n}: ML pidio verificacion. Corto aca, sin insistir.")
                bloqueado = True
                break
            cards = bot.parse_cards(html)
            print(f"[info] pagina {n}: {len(cards)} tarjetas validas")
            for d in cards:
                if d["id"] not in vistos:
                    vistos.add(d["id"])
                    deals.append(d)
            if not cards:  # sin tarjetas y sin marcador: tampoco insistimos
                break
            if n < paginas:
                time.sleep(random.uniform(*PAUSA_S))
        ctx.close()
    return deals, bloqueado


def _git(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True)


def main() -> int:
    ap = argparse.ArgumentParser(description="Scraper local de ofertas de ML (pocas paginas)")
    ap.add_argument("--pages", type=int, default=3)
    ap.add_argument("--push", action="store_true", help="commitear y subir el snapshot")
    a = ap.parse_args()
    paginas = max(1, min(a.pages, MAX_PAGES_DURO))

    ok, motivo = puede_correr()
    if not ok:
        print(f"[info] no corro: {motivo}")
        return 0
    deals, bloqueado = _bajar_paginas(paginas)
    anotar(ESTADO, bloqueado)
    if len(deals) < MIN_DEALS:
        print(f"[warn] {len(deals)} ofertas (minimo {MIN_DEALS}): no guardo el snapshot.")
        return 1
    SNAPSHOT.write_text(json.dumps(armar_snapshot(deals), ensure_ascii=False), encoding="utf-8")
    print(f"[info] snapshot guardado: {len(deals)} ofertas")
    if a.push:
        _git("pull", "--rebase", "-q")
        _git("add", str(SNAPSHOT.relative_to(REPO)))
        if _git("diff", "--cached", "--quiet").returncode != 0:
            _git("commit", "-m", "datos: snapshot local de ofertas [skip ci]")
            r = _git("push", "-q")
            print("[info] subido" if r.returncode == 0 else f"[warn] push fallo: {r.stderr[:200]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
