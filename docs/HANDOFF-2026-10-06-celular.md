# HANDOFF 2026-10-06 (sesión desde el celular, sin PC — leer antes de tocar nada)

Antes leer `docs/HANDOFF-2026-10-03.md` y `docs/HANDOFF-2026-10-04b-familia.md`.
Otro chat trabaja con Don Ofertín/familia/videos: no pisarlo. Esta sesión solo
tocó `frontend/lib/landings.ts` y archivos nuevos en `docs/`.

## Hecho (todo en main)
- 6 landings nuevas en `frontend/lib/landings.ts` (`/ofertas/[slug]`), con el
  mismo patrón que las 7 existentes: aires inverter, colchones 2 plazas/queen/king,
  Smart TV 55"+, heladeras, herramientas eléctricas, termotanques y calefones.
  Se filtran del catálogo del día y solo entran al sitemap si hay productos
  suficientes (`min`: 3 a 5). Build completo (2044 páginas) y lint OK.
- `docs/CYBER-POSTS-2026.md`: calendario del 26/10 al 5/11 con textos listos.
  Los `[corchetes]` se completan con productos reales del día.
- Recordatorio programado (`send_later`) para el sáb 31/10 12:00 ART: completar
  esos textos con productos reales y dejarlos listos para `special_post.yml`.
- Trello: tarjetas nuevas #24 (alertas de precio por Telegram), #25 (Pinterest),
  #26 (menciones externas / GEO) y #27 (bajar cadencia de Telegram).

## Verificado y descartado
- El pendiente "/#verificador cae en bloque oculto en celular" ya estaba
  resuelto por `components/AnclaVerificador.tsx` (usado en `app/hoy/page.tsx`).

## Pendientes / decisiones de Raifel
1. Mié 07/10: medición semanal (panel ML por etiqueta, Clarity, Search Console)
   y decidir #27 (Telegram) con datos.
2. Elegir cuáles de #24/#25/#26 vale la pena empezar.
3. Verificar en vivo que las landings nuevas cargan y cuáles quedaron en el sitemap
   (heladeras y colchones queen/king estaban justo en el mínimo).
4. Las stories con link de la lista de PENDIENTES DE RAIFEL siguen siendo manuales.

## Notas
- Cuidado: en IG nunca escribir el handle de Telegram con `@` (usar t.me/...).
- Sandbox remoto: `npm ci` + `npx next build` anda; el scraper de ML no.

## Agregado más tarde (06/10)
- Día de la Madre (`frontend/app/dia-de-la-madre/page.tsx`): rangos con ticket alto primero, sin repetidos (por título) y sin no-regalos (micrófono, inflable, hidrolavadora, pencil, rugged).
- Botón "Avisame si baja" en las tarjetas de ticket alto (`OfertaCard.tsx`) + evento `alerta_click` en `app/clics-ml.tsx`. El backend de alertas (`bot/alertas.py`) ya existía.
- CI de lint arreglado (Link en vez de `<a>` en guias, mejores y landings).
- NUEVO publicador de texto: `bot/post_texto.py` + `.github/workflows/post_texto.yml` + textos en `bot/posts_texto/*.json`. Publica en Facebook (página) y Threads, sin producto ni afiliado. Se corre con dry_run primero. Post del estudio publicado el 06/10 en ambos canales (utm_source=facebook/threads, utm_campaign=estudio).
- OJO: la URL del estudio es `/estudio/descuentos-inflados-mercado-libre` (no existe `/estudio`). Corregido en `docs/MENCIONES-EXTERNAS-2026.md`.
- Trello: #23 con investigación de X (precios contradictorios, verificar), #24 a #29 nuevas. Comentario de prueba sobrante en #22 ya marcado como borrable.
- Un test viejo (`bot/tests/test_atribucion.py`) importa `pytest`; localmente sin pytest da error de importación. No es regresión.

## Videos de ML en la web (06/10, noche) — NO se puede automatizar hoy
- Pedido del dueño: en los 2-3 primeros destacados de la web, mostrar el video de la publicación de ML en vez de la foto. NO quiere videos generados por nosotros (se revirtió el generador `web_videos.py`, commit d9cf505).
- Prueba corrida en GitHub Actions (`probe_video_ml.yml`, solo lectura): el listado de /ofertas no trae ningún indicio de video, y las 10 fichas pedidas devolvieron ~41 KB casi idénticos, sin la palabra "video": ML no sirve la ficha real al runner (ya se sabía por `bot/alertas.py`). Conclusión: sacar los videos por scraping NO funciona desde Actions.
- Caminos a evaluar: (a) API oficial de ML (`api.mercadolibre.com/items/{id}`, campo de video si existe; requiere crear una app en developers.mercadolibre.com.ar y tokens; NO verificado); (b) material oficial de la sección "Campañas de videos" del panel de afiliados; (c) curación manual de 2-3 productos por día. Derechos de los videos de vendedores: no verificado.
