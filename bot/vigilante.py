"""Vigilante de la Oficina (corre en GitHub Actions, aunque la PC esté apagada).

Cada 2 h revisa, solo leyendo:
  1. Que las páginas clave del sitio respondan 200.
  2. Que los workflows del bot hayan corrido bien hace poco.
  3. El latido de la PC (variable LATIDO_PC del repo; la escribe el Director local
     con `gh variable set`, sin commits ni builds):
     si tiene más de 14 h, la PC o las tareas de Claude están trabadas.
Si algo falla avisa por Telegram privado. Si está todo bien, silencio.
No publica, no mergea, no despliega.
"""
from __future__ import annotations

import json
import os
import subprocess
import urllib.parse
import urllib.request
from datetime import datetime, timezone

ADMIN_CHAT = "8701191351"
SITIO = "https://cazadordeofertas.com.ar"
PAGINAS = ["/", "/mejores", "/precio-hoy", "/llms.txt", "/sitemap.xml"]
# workflow -> horas máximas sin una corrida exitosa
WORKFLOWS = {"deals_bot.yml": 6, "alertas.yml": 2, "salud_tokens.yml": 30}
LATIDO_MAX_H = 14


def chequear_paginas() -> list[str]:
    malos = []
    for p in PAGINAS:
        req = urllib.request.Request(SITIO + p, headers={"User-Agent": "CazadorVigilante/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                if r.status != 200:
                    malos.append(f"{p} → {r.status}")
        except Exception as e:  # noqa: BLE001
            malos.append(f"{p} → {getattr(e, 'code', type(e).__name__)}")
    return malos


def horas_desde(iso: str) -> float:
    t = datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return (datetime.now(timezone.utc) - t).total_seconds() / 3600


def chequear_workflows() -> list[str]:
    malos = []
    for wf, max_h in WORKFLOWS.items():
        try:
            out = subprocess.run(
                ["gh", "run", "list", "--workflow", wf, "--status", "success",
                 "--limit", "1", "--json", "createdAt"],
                capture_output=True, text=True, timeout=60, check=True).stdout
            runs = json.loads(out)
        except Exception as e:  # noqa: BLE001
            malos.append(f"{wf}: no pude leer ({type(e).__name__})")
            continue
        if not runs:
            malos.append(f"{wf}: sin corridas exitosas")
        elif (h := horas_desde(runs[0]["createdAt"])) > max_h:
            malos.append(f"{wf}: última OK hace {h:.0f} h")
    return malos


def chequear_latido() -> list[str]:
    try:
        h = horas_desde(os.environ["LATIDO_PC"].strip())
    except Exception:  # noqa: BLE001
        return ["latido de la PC: no existe todavía"]
    return [f"PC/Director sin latido hace {h:.0f} h (¿PC apagada o tareas trabadas?)"] if h > LATIDO_MAX_H else []


def avisar(texto: str) -> None:
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if not token:
        print("sin TELEGRAM_BOT_TOKEN; no aviso")
        return
    data = urllib.parse.urlencode({"chat_id": ADMIN_CHAT, "text": texto}).encode()
    urllib.request.urlopen(f"https://api.telegram.org/bot{token}/sendMessage", data, timeout=20)


def main() -> None:
    problemas = chequear_paginas() + chequear_workflows() + chequear_latido()
    if problemas:
        msg = "🚨 Vigilante Cazador\n" + "\n".join(f"• {p}" for p in problemas)
        print(msg)
        avisar(msg)
    else:
        print("todo OK")


if __name__ == "__main__":
    main()
