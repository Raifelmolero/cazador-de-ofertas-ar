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

## Respuesta de ML y decisión (13/10, tarde)
Agustina (Afiliados ML) contestó por WhatsApp: «el tema de tener una API abierta por el momento
no se permite scrapeo» → la API abierta para afiliados se está desarrollando y **el scrapeo no
está permitido**. Decisión del dueño: **pausar el escaneo y trabajar con ofertas cargadas a mano**.
Hecho: `scrape_ml=false` en `bot/config.json` (cero pedidos a ML), `bot/tools/oferta_manual.py` +
workflow «Agregar oferta manual» (`oferta_manual.yml`), documentado en `bot/README.md`.
Se descartan: el scraper local en la PC/celular, proxies y cualquier forma de evadir el bloqueo.
Se borró `probe_scraping` (pedía páginas de ML). Ojo: `probe_video_ml.py` y `scraper_local.py`
también piden páginas de ML (solo a mano): NO usarlos. Pendiente: preguntar a ML por el acceso
anticipado a la API y si hay un listado oficial de ofertas en el panel de afiliados.
Las páginas `/precio` se mantienen 60 días sin refresco (`SEGUIMIENTO_MAX_DIAS`).

## Opciones que se evaluaron (ninguna evade el bloqueo de ML; las tres son legítimas)
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

## Cierre de la sesión del 13/10 (desde el celular) — dónde quedamos
- **Estado**: escaneo PAUSADO (`scrape_ml=false`). Carga manual lista en main, incluida la
  carga de varias a la vez: Actions → «Agregar oferta manual» → campo `lote`
  (`url | título | actual | anterior | imagen` separadas por `;;`, todo o nada). Commit 89006d3.
- **El dueño preguntó** si se puede scrapear «de forma externa» (nube, repo de GitHub, otra app,
  sin la cuenta). **Respuesta firme: no.** Sigue siendo scrapeo (ML lo prohíbe), las IPs de
  datacenter ya están bloqueadas y los links publicados llevan su etiqueta de afiliado, así que la
  sanción caería sobre su cuenta. No armar scrapers en la nube/PC/repos externos.
- **Panel de afiliados (app de ML, capturas del 13/10)**: secciones Más vendidos, pestañas
  Para vos/Tecnología/Hogar/Electro, Listas de afiliados, Campañas de videos, Campañas con
  incentivos, Ingresos, Colaboradores, canal de WhatsApp y de Telegram del programa. **No se ve
  exportación/descarga.** Falta ver qué trae «Listas de afiliados» y un producto abierto.
- **Claude no puede ver ML ni meli.la** desde el sandbox (proxy). Para cargar ofertas necesita que el
  dueño pase por el chat: link LARGO (mercadolibre.com.ar/...MLA...), título, precio actual, precio
  tachado (y, para Instagram, link de imagen http2.mlstatic.com). Con capturas Claude arma el lote y lo
  carga sin publicar (commit directo a `bot/state/ofertas_manuales.json`, o vía Actions).
- **Mensaje para Agus (aún no enviado)**: dónde ver/descargar las listas, si hay exportación o
  catálogo, y cómo pedir acceso anticipado a la API de afiliados (afiliado 37267219; el dueño debe
  confirmar el ID en el panel).
- **Números 7 días hasta el 13/10**: 301 clics, 38 pedidos, $1.170.558 estimados (anterior $1.013.911).
- **Trello**: tarjeta #31 creada (ML bloquea el scraping); comentario en #30 (videos).
- **Pendiente del dueño**: mandar capturas (producto abierto de Más vendidos y «Listas de afiliados»),
  enviar el mensaje a Agus, unirse al canal WhatsApp/Telegram del programa, probar «Agregar oferta
  manual» sin `publicar_ya`.
- **Pendiente de Claude**: cuando lleguen datos, cargar el lote; verificar el CI Bot Tests de
  89006d3; opcional: parser de texto pegado del panel (si el formato lo permite).
