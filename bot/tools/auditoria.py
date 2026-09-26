"""Departamento de Auditoría (tarjeta #21): chequeo diario del negocio.

Sin IA ni tokens: revisa que el bot siga publicando, que las páginas clave del
sitio respondan y junta el resultado de los tests y de `npm audit` (los corre
el workflow auditoria.yml y pasan el resultado por variables de entorno).
Deja una línea en bot/state/auditoria_log.jsonl (la lee /oficina) y, si algo
falla, avisa al admin por Telegram.
"""

from __future__ import annotations

import json
import os
import re
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STATE = ROOT / "bot" / "state"
LOG = STATE / "auditoria_log.jsonl"
SITIO = "https://cazadordeofertas.com.ar"
UA = "Mozilla/5.0 (CazadorAuditoria)"


def _status(url: str) -> int:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:  # noqa: BLE001 — red caída cuenta como falla
        return 0


def chequear_bot() -> tuple[bool, str]:
    lineas = (STATE / "posts_log.jsonl").read_text(encoding="utf-8").splitlines()
    if not lineas:
        return False, "El bot no registró ninguna publicación"
    ult = datetime.fromisoformat(json.loads(lineas[-1])["ts"])
    horas = (datetime.now(timezone.utc) - ult) / timedelta(hours=1)
    # Corre 3 veces por día: más de 12 h sin publicar es una falla, no un bache.
    return horas < 12, f"Última publicación hace {horas:.0f} h"


def chequear_sitio() -> tuple[bool, str]:
    urls = [SITIO, f"{SITIO}/herramientas", f"{SITIO}/oficina", f"{SITIO}/sitemap.xml"]
    # Además, una muestra de guías y comparativas sacadas del sitemap.
    try:
        req = urllib.request.Request(f"{SITIO}/sitemap.xml", headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=20) as r:
            sitemap = r.read().decode("utf-8", "ignore")
        muestra = [u for u in re.findall(r"<loc>([^<]+)</loc>", sitemap) if "/guias/" in u or "/mejores/" in u]
        urls += muestra[:15]
    except Exception:  # noqa: BLE001
        pass
    rotas = [u for u in urls if _status(u) != 200]
    if rotas:
        return False, f"{len(rotas)} de {len(urls)} páginas no responden: " + ", ".join(rotas[:3])
    return True, f"{len(urls)} páginas OK"


def main() -> None:
    checks = {
        "bot": chequear_bot(),
        "sitio": chequear_sitio(),
        "tests": (os.getenv("TESTS_OK") == "1", "Tests del bot " + ("OK" if os.getenv("TESTS_OK") == "1" else "FALLAN")),
        "dependencias": (
            os.getenv("NPM_AUDIT_OK") == "1",
            "Sin vulnerabilidades altas" if os.getenv("NPM_AUDIT_OK") == "1" else "npm audit encontró vulnerabilidades altas o críticas",
        ),
    }
    ok = all(v[0] for v in checks.values())
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "ok": ok,
        "checks": {k: {"ok": v[0], "detalle": v[1]} for k, v in checks.items()},
    }
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    for k, (bueno, detalle) in checks.items():
        print(f"{'OK ' if bueno else 'MAL'} {k}: {detalle}")

    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not ok and token:
        admin = json.loads((ROOT / "bot" / "config.json").read_text(encoding="utf-8"))["admin_chat"]
        malos = "\n".join(f"• {k}: {v[1]}" for k, v in checks.items() if not v[0])
        data = json.dumps({"chat_id": admin, "text": f"🛡️ Auditoría diaria: hay problemas\n{malos}"}).encode()
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data=data, headers={"Content-Type": "application/json"},
        )
        try:
            urllib.request.urlopen(req, timeout=20)
        except Exception as e:  # noqa: BLE001
            print(f"[warn] alerta no enviada: {e}")


if __name__ == "__main__":
    main()
