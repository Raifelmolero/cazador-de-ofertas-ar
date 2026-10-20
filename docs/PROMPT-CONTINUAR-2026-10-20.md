# Prompt para continuar (desde el 20/10/2026)

Pegar en una sesión nueva:

---

Seguimos con Cazador de Ofertas AR. Leé primero `CLAUDE.md` (sección «Estado al 2026-10-19»),
`docs/PLAN-ACCION-2026-10-19.md` y `docs/AUDITORIA-2026-10-19.md`. Trello: tarjeta #40 «PLAN DE ACCIÓN».

Dónde quedamos:
- Panel ML 7 días al 19/10: 240 clics, 16 pedidos, $237.708 (meta: volver a 409 / 62 / ~$1 M del 6/10).
  Domingo 18/10 (Día de la Madre): 16 clics, 1 venta. La causa de fondo es el volumen y la frescura
  de las ofertas: el scraping está prohibido por ML y se cargan a mano (~300 vigentes, valen 7 días;
  las 141 del 15/10 vencen el 23/10).
- El sitio está sano (2 auditorías, 278 páginas sin errores, 300/300 links con matt_word=web).
  Hecho el 19/10: respaldo «Mientras tanto» en páginas flacas, filtros TV/aires, tildes, buscador
  palabra por palabra, rubros en el header del celular, fecha real, miniaturas livianas del CDN,
  JSON-LD, links internos en la auditoría semanal, kit de WhatsApp con las 3 mejores del catálogo.
- YouTube Shorts: nunca subió nada. Causa: `youtubeSignupRequired` (token de una cuenta sin canal).
  Lo arregla Raifel en la PC con `python bot/tools/setup_youtube.py` (cuenta elcazadordeofertas.ar@gmail.com)
  y después Actions → «YouTube test upload».

Lo primero ahora:
1. Si Raifel pasó productos (link de ML + captura con precio actual y tachado): cargarlos en lote con
   Actions → «Agregar oferta manual» (campo `lote`: `url | título | precio actual | precio anterior | imagen`
   separados por `;;`). Título sacado del link; descartar si `price_history` lo vio ≥5 % más barato.
   Prioridad de rubros: aires ≤3000 fg, heladeras no frost, TV 55"+, notebooks, termotanques.
2. Contar manuales vigentes y avisar cuántas vencen el 22 y 23/10.
3. Revisar que las corridas de «Cazador Deals Bot» y Frontend CI estén en verde.
4. Si Raifel ya corrió setup_youtube: correr «YouTube test upload» y confirmar.

Calendario: 26/10 medición semanal vs. la base; 26-30/10 Cyber en el sitio; 31/10-1/11 posts del Cyber
con precios testigo (`docs/CYBER-POSTS-2026.md`, dry-run y permiso antes de publicar).

Reglas: no scrapear ML de ninguna forma; no publicar sin dry-run y permiso; responder en español
rioplatense, directo y sin tecnicismos; desarrollar en la rama de la sesión y mergear a main;
`pip install pytest` y `python -m pytest -q bot/tests` antes de subir (354 tests).

---
