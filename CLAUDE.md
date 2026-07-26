# Cazador de Ofertas AR

Negocio de afiliados de Mercado Libre Argentina, 100% automatizado. Publica
ofertas en Telegram, Instagram y Threads con links de afiliado etiquetados por
canal, y tiene un sitio en Vercel con dos caras. El dueño (Raifel) opera todo
desde el teléfono: **respondele en español rioplatense (vos), directo y sin
tecnicismos innecesarios.**

## Arquitectura

- `bot/` — el corazón. `cazador_bot.py` corre en GitHub Actions 3×/día
  (12:00, 17:00, 21:00 ART; ver `.github/workflows/deals_bot.yml`): scrapea
  `mercadolibre.com.ar/ofertas` (~100 productos, stdlib pura), filtra, publica.
  Leé `bot/README.md` — está al día y explica todo el sistema.
- `frontend/` — Next.js en Vercel. Dos caras en un deploy:
  `calculadoraml.com.ar` = calculadora de márgenes para revendedores;
  `/hoy` = ofertas del día para compradores (link-in-bio propio). El rewrite
  por hostname en `next.config.mjs` hace que la raíz del dominio de ofertas
  (default `cazadordeofertas.com.ar`, configurable con env `DEALS_HOST`)
  sirva `/hoy`.
- `bot/tests/` — tests de la lógica pura (link de afiliado, ofertas infladas,
  márgenes, parseo de ML, retención de media). Corren solos en Actions y a
  mano con `python -m unittest discover -s bot/tests -v`.
- Estado en `bot/state/` (posted_ids, posts_log, scan_log, price_history,
  metrics_log): lo commitean los workflows con `[skip ci]`. Cada push a main
  redeploya Vercel, así el sitio siempre tiene datos frescos.

## Decisiones clave (no re-litigar)

- **Atribución por canal**: los links llevan `matt_word=telegram/instagram/
  threads/web` + `matt_tool=37267219` fijo (formato verificado del linkbuilder
  de ML; la etiqueta va en matt_word). Etiquetas creadas en el Administrador
  de etiquetas del panel de afiliados.
- **Historial de precios** (`price_history.json`): badge «📉 El precio más
  bajo que registramos» con ≥3 días de historia; descarta ofertas infladas
  (vistas ≥5% más baratas antes); mínimos históricos primeros en el ranking.
- **Todo best-effort**: IG/Threads caídos nunca frenan Telegram. Errores →
  alerta por privado al admin (chat 8701191351).
- **Cero mantenimiento** es el principio rector: tokens de IG/Threads se
  renuevan solos los lunes (`ig_token_refresh.yml`), reporte semanal los
  domingos 23:00 ART (`weekly_report.yml`) con métricas y «cacería de la
  semana», posts especiales manuales vía `special_post.yml`.

## Modo de trabajo

- El bot corre desde `main`: los cambios se desarrollan en la rama de la
  sesión y se mergean a `main` (modo aprobado por el dueño — sin PIs largos).
- Probar antes de mergear: tests sintéticos en Python + `npx next build` para
  el frontend. `DRY_RUN=1 python bot/cazador_bot.py` no publica (ojo: el
  sandbox remoto no llega a mercadolibre.com.ar, el scraper solo anda en
  Actions).
- Correr el bot a mano: Actions → Cazador Deals Bot → Run workflow (inputs
  para forzar IG/Threads). Los logs del job muestran el resumen de la corrida.

## Historia previa (sesión del 2026-07-19)

Bot multicanal completo, atribución por canal, historial de precios y reporte
semanal enriquecido, todo en producción. **`cazadordeofertas.com.ar` VIVO**:
registrado en nic.ar, delegado a los nameservers de Vercel, apex + www en el
proyecto; la raíz sirve la página de ofertas vía el rewrite. SEO armado
(canonical de `/hoy` → dominio nuevo, `robots.ts`, sitemap, footer con marca
propia, imagen OG dinámica). IG pasó a publicar 3×/día. Placas con el sello
rojo "CAZADO".

Ojo con `opengraph-image.tsx`: `@vercel/og` NO prerenderiza en Windows —
falla local con `TypeError: Invalid URL` en cualquier ruta, no es por
espacios. El build real de Vercel/Linux compila bien.

Los pendientes manuales de esa sesión (bios → dominio nuevo, etiqueta `web`
en el panel de ML) ya los hizo el dueño.

## Estado al 2026-07-26 (última sesión)

Sesión de optimización y deuda técnica, disparada por un mail de Vercel
avisando 75% de la cuota gratis de Image Optimization.

- **Fotos de producto sin optimizador de Vercel**: las imágenes de ML ya
  vienen comprimidas del CDN de ML, así que re-optimizarlas solo gastaba
  transformaciones (el bot trae fotos nuevas 3×/día, cada una es una
  transformación que nunca se cacheó). Van con `unoptimized`.
- **Sin ISR en `/` ni `/hoy`**: los datos son estáticos y cada push del bot
  ya redeploya, así que el `revalidate=3600` regeneraba sin nada nuevo que
  mostrar, gastando invocaciones.
- **Retención de 14 días para la media** (`_prune_old_media`). Cuidado: las
  placas/stories/reels se commitean **a propósito**, porque las APIs de
  IG/Threads exigen una URL pública y se usa `raw.githubusercontent`. NO
  gitignorearlas: rompe la publicación. Una vez publicado, IG sirve su copia
  y el archivo del repo ya no hace falta. La fecha se saca del **nombre**,
  no del mtime: en el runner todo tiene la fecha del checkout.
- **Frontend en Next 16 + React 19** (venía de Next 14.2.35). `params` ahora
  es `Promise` (se await-ea en `calculadora/[id]`); `next lint` ya no existe,
  se usa `eslint` directo con flat config en `eslint.config.mjs`.

El `npm audit` sigue marcando 4 highs: son `postcss` y `sharp` empaquetados
dentro de Next, más `brace-expansion` del herramental de dev. No se pueden
arreglar sin romper Next y ninguna corre en este sitio (estático, sin
optimizador de imágenes). No perder tiempo ahí.

`LastUpdated` ya no lee el reloj durante el render (leía `Date.now()` dos
veces, con lecturas distintas para el texto y el semáforo de "datos viejos");
ahora hay un solo `ahora` en estado que el intervalo refresca. El shuffle de
`ProductsGrid` sigue con un `eslint-disable` puntual y explicado — sortear
durante el render rompería la hidratación, que es justo lo que el efecto
evita. No es deuda pendiente, es intencional.

**CI nuevo**: `frontend_ci.yml` (build + lint, dispara con cambios en
`frontend/`) y `bot_tests.yml` (corre `bot/tests/`, dispara con cambios en
`bot/`). Ambos con `workflow_dispatch` para correrlos a mano. Los commits de
estado del bot llevan `[skip ci]` y no los despiertan.

**`scraper/` + `main.py` + `requirements.txt` borrados**: era la versión vieja
del scraper (playwright), reemplazada por el bot hace tiempo pero seguía
duplicando la fórmula de márgenes (mismas constantes copiadas en
`scraper/calculator.py` y `cazador_bot.py` — riesgo de desincronizarse en
silencio). `.env.example` estaba desactualizado (documentaba variables del
scraper muerto y le faltaban casi todas las del bot); reescrito con las 19
que el bot realmente lee.

### Los números de ML: cero tráfico orgánico, no es cosa del código

**Posts vs. audiencia (últimos 7 días, `bot/state/posts_log.jsonl`)**:
Telegram 100 posts (2 suscriptores), IG 42 entre feed/story/reel (1475
seguidores), Threads 21 (7 seguidores). El 61% del esfuerzo de publicación va
al canal más chico.

**Panel de afiliados de ML, mismos 7 días**: Telegram e Instagram con **0
clicks** cada uno. La única actividad fue la etiqueta `web` (7 clicks, 2
ventas) — y esas ventas las generó un amigo del dueño con un link pasado a
mano, no tráfico real. Ingreso orgánico real de la semana: **$0**.

Causa técnica identificada: Instagram no permite links clickeables en el
caption, y las stories del bot van sin link sticker (no se puede agregar por
API — no es algo para "arreglar" en código). El único camino clickeable desde
IG es la bio. El caption tenía el link de la bio **tercero**, después de tres
líneas promocionando Telegram. Reordenado: la bio va primero y sola: Telegram
queda en una línea al final (`ig_caption()`, con test que fija el orden).

**Search Console** (ya conectado, no hace falta configurarlo — el dueño lo
hizo por su cuenta): 12 impresiones y 0 clicks en 7 días, posición promedio
12,7. Es lo esperable para un dominio con ~1 semana de vida — no hay atajo
técnico, la autoridad se construye en meses. Sin acción por ahora; revisar de
nuevo con más historia (3-4 semanas).

**Sitemap recortado**: sacadas las ~96 páginas `/calculadora/[id]` — rotan
~50% por corrida del bot (de 118 URLs vivas el 20/07, solo 29 seguían
respondiendo 6 días después) y apuntan a consultas sin volumen. Quedan las 2
URLs estables (`calculadoraml.com.ar` y `cazadordeofertas.com.ar`), que son
las que tienen que ganar las búsquedas genéricas. Las páginas de calculadora
siguen existiendo y navegables desde el sitio, solo se dejó de anunciarlas.

**Próximo hito**: con más historia en ML (30 días) y Search Console (3-4
semanas), decidir si vale la pena bajarle la cadencia a Telegram — hoy es
puro costo de mantenimiento sin contrapartida — y si Instagram empieza a
mover clicks reales a la bio con el caption reordenado.
