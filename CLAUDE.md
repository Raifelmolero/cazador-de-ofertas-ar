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
- `scraper/` + `main.py` — versión vieja del scraper del sitio; el bot es
  quien actualiza `frontend/data/productos_rentables.json` ahora.
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

## Estado al 2026-07-19 (última sesión)

Hecho y en producción: bot multicanal completo, atribución por canal,
historial de precios, reporte semanal enriquecido. No queda tarea manual
diaria. Novedades de esta sesión:

- **`cazadordeofertas.com.ar` VIVO**: registrado en nic.ar, delegado a los
  nameservers de Vercel (ns1/ns2.vercel-dns.com), agregado al proyecto
  (apex + www). La raíz sirve la página de ofertas vía el rewrite.
- SEO: canonical de `/hoy` → raíz del dominio nuevo, `robots.ts`, sitemap
  con el dominio de ofertas, footer con marca propia, imagen OG dinámica
  (`opengraph-image.tsx`; ojo: `@vercel/og` NO prerenderiza en Windows —
  falla local con `TypeError: Invalid URL` en cualquier ruta, no es por
  espacios — el build real de Vercel/Linux compila bien).
- IG ahora publica **3×/día** (mismos runs que Telegram/Threads), antes 1×.
- Placas de feed y story llevan el **sello rojo "CAZADO"** (guiño a la
  estética original de la cuenta).
- La mención al canal de Telegram en `ig_caption()` quedó pusheada.

Pendientes del dueño (checklist detallado en
`../checklist-dominio-nuevo.md`): bio IG/Threads y fijado de Telegram →
dominio nuevo; etiqueta `web` en el panel ML; (opcional) Search Console
del dominio nuevo.

Próximo hito: el reporte del domingo trae los primeros números por canal →
decidir dónde invertir (SEO de CalculadoraML vs. crecimiento de audiencia).
Los badges de mínimo histórico empiezan ~21/07 (3 días de historia).
