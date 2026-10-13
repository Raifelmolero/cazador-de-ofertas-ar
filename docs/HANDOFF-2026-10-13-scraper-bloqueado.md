# HANDOFF 2026-10-13 — ML bloquea al bot: causa probable del estancamiento

## Qué pasa (verificado con logs de Actions y archivos de estado)
- Hasta el 05/10 el bot escaneaba ~1.500 productos por corrida (`scan_log.jsonl`:
  1.543 el 05/10 21:59 UTC) y publicaba 20–50 piezas por día (`posts_log.jsonl`).
- Desde el 08/10 el escaneo es de 45–48 productos y las publicaciones cayeron a
  8 (08/10), 21 (12/10) y 4 (13/10 hasta el mediodía). Sin datos entre el 06 y el 07/10.
- Corrida del 13/10 17:00 UTC (run 38435061802): **todas las páginas de /ofertas y de
  las categorías devuelven la pantalla anti-bot** (`ML devolvió la pantalla anti-bot`,
  0 tarjetas). La API oficial tampoco rescata: `/highlights/...` da 403
  `PA_UNAUTHORIZED_RESULT_FROM_POLICIES` y el catálogo trae 3 ofertas, 0 con precio
  anterior real (se descarta para no pisar el sitio). Resultado: `SOLO_DATOS`, no se
  publica nada.
- Lo único que alimenta hoy al bot es el snapshot de la PC del dueño
  (`bot/state/scraped_local.json`, 48 ofertas, 12/10 18:43 UTC, vale 14 h).
  Con eso el sitio quedó en **25 productos** (antes ~280): menos ofertas en la web,
  en Telegram, IG y Threads.
- El refresh_token de ML sí rota y se guarda bien (la cadena de la API está sana);
  lo que falta es PERMISO de la app sobre `/highlights` e `/items`, no el token.

## Por qué importa
El tráfico del sitio y de las redes depende de que haya ofertas frescas 3 veces por día.
Con el bot casi parado, IG baja de seguidores (1.498 → 1.490) y la web muestra poco.
Los clics de la semana al 06/10 (409) son de ANTES del bloqueo: la semana siguiente
va a verse peor si no se resuelve. Faltan 3 semanas para el Cyber Monday (2/11).

## Prueba de volumen (13/10, run 38448756654, solo lectura)
`probe_scraping.yml` pidió 4 páginas con 20 s de pausa (ofertas p1/p2, relámpago, categoría):
**0 de 4 pasaron** (anti-bot en todas, ~41 KB iguales). Con tan pocos pedidos el resultado es
el mismo, así que el bloqueo NO es por volumen: ML rechaza las IP de GitHub Actions.
Bajar páginas o frecuencia no lo arregla. (Antes de 05/10 esas mismas IP pasaban; qué cambió
del lado de ML no se puede saber desde acá.)

## Opciones (ninguna evade el bloqueo de ML; las tres son legítimas)
1. **Scraper local programado en la PC del dueño** (`bot/tools/scraper_local.py`,
   IP residencial, pocas páginas, pausas largas, frena en la primera pantalla
   anti-bot). Hoy se corrió una sola vez a mano (12/10). Programarlo 3×/día con el
   Programador de tareas de Windows mantiene el snapshot fresco. Límite: son ~48
   ofertas por corrida (3 páginas), no 1.500, y la PC tiene que estar prendida.
2. **Pedirle a ML el permiso de la API** para la app `7890698556822222`
   (highlights/items/search devuelven 403 por política). Texto sugerido para
   soporte de developers.mercadolibre.com.ar:
   > Tengo una app (ID 7890698556822222) para un sitio de ofertas del programa de
   > afiliados. Con token de usuario (refresh_token) recibo 403
   > PA_UNAUTHORIZED_RESULT_FROM_POLICIES en /highlights/MLA/category/{id},
   > /items?ids= y /sites/MLA/search. ¿Qué permiso o certificación necesita la app
   > para leer destacados y precios (price / original_price) de ítems públicos?
3. **Política de catálogo cuando el scraping falla**: hoy el sitio se achica a lo
   que haya (25 productos). Alternativa: conservar el último catálogo completo hasta
   N días marcándolo como «precio de hace X horas». Decisión del dueño: más
   productos con precio posiblemente viejo vs. menos productos y frescos.
   (No implementado.)

## Qué NO se hace
No se intenta saltear la pantalla anti-bot (proxies, rotación de IP, headers falsos):
el propio `scraper_local.py` se frena a propósito en la primera verificación.

## Hecho en la sesión del 13/10 (otro frente, ya en main)
Cyber Monday: ofertas de ticket alto arriba en /cyber-monday, recordatorio de
calendario `/cyber-monday/agenda.ics` y `/black-friday/agenda.ics`, link «Agendá»
en el banner de temporada (`lib/agenda.ts`).
