"""Sonda de SOLO LECTURA: ¿ML deja pasar un puñado de pedidos desde Actions?

Pide 4 páginas con pausas largas (misma lógica de detección que el bot) y dice
cuáles pasan y cuáles devuelven la pantalla anti-bot. No publica nada ni toca
estado. Sirve para saber si el bloqueo es por VOLUMEN (con pocos pedidos pasa) o
por IP (no pasa ni una). Se corre a mano: Actions → Probe scraping ML.
"""
import re
import sys
import time

import cazador_bot as bot

PAUSA_S = 20


def probar(nombre: str, url: str) -> bool:
    try:
        html = bot.http_get(url).decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001 — queremos ver el error tal cual
        print(f"[{nombre}] error de red: {e!r}")
        return False
    bloqueada = bot.is_blocked_html(html)
    tarjetas = len(bot.parse_cards(html))
    titulo = re.search(r"<title>(.*?)</title>", html, re.S)
    print(f"[{nombre}] {len(html)} bytes | anti-bot: {'SI' if bloqueada else 'no'} | "
          f"tarjetas válidas: {tarjetas} | title: {(titulo.group(1).strip()[:70] if titulo else '-')}")
    return not bloqueada and tarjetas > 0


def main() -> int:
    cat = next(iter(bot.CATEGORIAS_TICKET_ALTO))
    pruebas = [
        ("ofertas p1", bot.OFERTAS_URL.format(page=1)),
        ("ofertas p2", bot.OFERTAS_URL.format(page=2)),
        ("relampago p1", bot.RELAMPAGO_URL.format(page=1)),
        (f"categoria {bot.CATEGORIAS_TICKET_ALTO[cat]} p1", bot.OFERTAS_CATEGORIA_URL.format(cat=cat, page=1)),
    ]
    ok = []
    for i, (nombre, url) in enumerate(pruebas):
        if i:
            time.sleep(PAUSA_S)
        ok.append(probar(nombre, url))
    print(f"\nResumen: {sum(ok)}/{len(ok)} páginas pasaron.")
    if sum(ok) == len(ok):
        print("→ Con pocos pedidos pasa: el bloqueo parece ser por VOLUMEN. Bajar páginas/frecuencia.")
    elif sum(ok) == 0:
        print("→ No pasa ni una: el bloqueo parece ser por IP/servidor, no por volumen.")
    else:
        print("→ Resultado mixto: pasa a veces; conviene repetir la sonda en otro momento.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
