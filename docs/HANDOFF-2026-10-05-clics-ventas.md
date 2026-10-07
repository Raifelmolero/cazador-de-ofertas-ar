# HANDOFF 05-06/10/2026 — Clics y ventas (web, bot, reel colchón)

Sigue a `HANDOFF-2026-10-04b-familia.md` y `HANDOFF-2026-10-04-clics.md`.

## Datos reales del panel ML (28/09–05/10)
440 clics (+38%), 57 órdenes (+90%), conversión 13-15%, ventas brutas $16,9M, **ganancia estimada $1.118.285 (+136%)**.
- Etiqueta `web`: 379 clics, 63 unidades, 15,04%, $1.118.285. Etiqueta `extension`: 61 clics, 0 ventas. Telegram/IG/Threads: no figuran (todo entra por la web).
- Mejores días: 30/09 $298k, 04/10 (26% conv.), 03/10 (28% conv., 16 unidades). Peores: 28 y 29/09 (muchos clics, 5-6%).
- Mayor ganancia: colchón Fika 2 plazas ($86k en 2 unidades, 15%), monitor LG ($27k), freidora Philips ($22k). Los baratos al 4% casi no suman.
- Panel: `mercadolibre.com.ar/afiliados/dashboard?filter_time_range=...` (`/afiliados/metricas` da Not Found; entrar por hub → "Ir a Métricas"). Claude in Chrome anda; pestañas: Etiquetas de seguimiento / Fecha / Productos vendidos se leen por JS.

## Hecho y en main (todo pusheado)
1. **Bot** (a8d5ad6): dedupe por título 14 días (`title_key`, `recent_title_keys`): la soldadora Mig salía con IDs distintos y se repitió 7 veces en IG.
2. **Bot** (b9a13de): `CATEGORIA_PLUS` x1.25 colchón/sommier/herramientas, x1.15 aire/heladera (criterio del agente, no de datos: ajustar con el panel); `elegir_estrella` evita >2 de la misma familia en las últimas 5 de IG; captions IG/Threads con "% OFF a $precio" en la 1ª línea. 232 tests.
3. **Web SEO** (bc6f93b): índices `/guias` y `/mejores`, links en footer, sitemap y llms-full con comparativas.
4. **Web conversión** (d9c15f9): ticket alto primero en /hoy y /categoria (`lib/ticketalto.ts`, umbral $250k + colchones/herramientas), bloque `ColchonesDestacados`, botón "Comprar en Mercado Libre", sello de mínimo visible, tracking Clarity `click_ml_ticket_alto`/`click_ml_etiqueta`/`click_ml_seccion=colchones_home` y Vercel `clic_ml` con etiqueta/ticket_alto/seccion.
5. **10 guías de ticket alto** (merge 10224eb, `lib/guias-ticket-alto.ts`): colchon-de-resortes-o-de-espuma, medidas-de-colchon-y-sommier, cuanto-sale-un-colchon-2-plazas, soldadora-inverter-o-convencional, taladro-percutor-o-atornillador, aire-acondicionado-inverter-o-convencional, heladera-no-frost-o-con-freezer, termotanque-electrico-o-a-gas-o-calefon, cinta-para-correr-en-casa-como-elegir, bicicleta-fija-o-cinta-para-correr.
6. **7 landings `/ofertas/[slug]`** (1dbb8ed, `lib/landings.ts`): ofertas-mas-de-30-off, ofertas-ticket-alto, minimos-historicos-hoy, bajaron-de-precio-esta-semana, aires hasta/más de 3000 frigorías, colchones-1-plaza-y-media. Indexables solo con ≥5 productos (≥3 aires/colchones), si no `noindex`.
7. **UX móvil** (64a8742): cabecera compacta y botón ancho en /precio/[slug], barra fija con safe-area, inputs 16px (sin zoom iOS). NO verificado en celular real.

## Pendiente de Raifel (Search Console / Bing a mano, después del deploy)
Pedir indexación: `/guias`, `/mejores`, `/mejores/mejores-colchones`, `-aires-acondicionados`, `-heladeras`, `-notebooks`, `-celulares`, las 10 guías nuevas (empezar por colchones y aire), `/ofertas/ofertas-mas-de-30-off`, `/ofertas/ofertas-ticket-alto`, `/ofertas/minimos-historicos-hoy`, `/ofertas/bajaron-de-precio-esta-semana`, y reenviar `/sitemap.xml`. Las de aires/colchones de /ofertas dejar que las tome el sitemap. IndexNow del bot avisa solo las URLs nuevas.

## Reel 11 "El colchón de Rosa" — LISTO, SIN PUBLICAR (esperando OK de Raifel)
`VIDEOS VIRALES/11 - El colchon de Rosa/REEL-colchon-de-Rosa.mp4` (17 s): escena 1 Rosa ("Ofertín, este colchón ya tiene veinte años"), escena 2 Ofertín ("Un colchón se compra cada diez años: no lo compres sin mirar el historial"), gancho arriba "El colchón de Rosa tiene 20 años 😅", cierre con Colchón Calm Híbrido 2 Plazas 140x190 a $482.862 (26% OFF, mínimo histórico). Ya enviado a Raifel con SendUserFile. Revisado: una voz por clip, cinco dedos, sin logos. El precio del cierre puede cambiar: regenerar con `python bot/tools/cierre_reel.py ENTRADA SALIDA --gancho "..." --buscar colchon` si se sube otro día. Subir martes/miércoles de noche. Caption: "¿Cuántos años tiene tu colchón? 😅 Antes de comprar, mirá el historial de precios. Ofertas verificadas en el link de la bio."
Archivos: escena-1-original/rosa, escena-2-original/ofertin, unido-sin-cierre.mp4, prompts en `PROMPTS escenas (una voz por clip).txt` (sin camisón ni cama: el filtro de Gemini rechazó una escena con Rosa+Ofertín juntos).
Cómo lancé Gemini desde Claude in Chrome: input file oculto + file_upload + paste sobre `.ql-editor` + clic en `button[aria-label="Send message"]`; un chat nuevo por escena; los resultados aparecen recargando el chat; los videos de Gemini duran 10 s (recortar con ffmpeg).

## Video 02 "Abuelos reaccionan al Cyber" — falta escena 3
Escenas 1 y 2 listas. La escena 3 (chat `gemini.google.com/app/b04649b44b85dfb5`) fue RECHAZADA por Gemini ("No puedo crear videos de personas reales en situaciones así") — tenía Rosa + Ofertín juntos. Rehacer con UN solo personaje en cuadro (Rosa: "Juli, pasame la tarjeta del abuelo"), en chat nuevo. Los archivos de `_entrada` `63d27433` y `c1a13802` son la escena 2 repetida (descartar). Textos en pantalla: "Abu, ¿cuánto pensás que sale este tele?" / "Y este dice 70% OFF" / "¿Y esta freidora?" → "Freidora: ✅ CAZADA", luego cierre_reel.py.

## Amidata
Carpeta `Desktop/AMIDATA-BASE` revisada; saqué datos de Raifel (chat admin → `PENDIENTE_CHAT_ADMIN`, matt_tool → `TU_MATT_TOOL`) y borré un mp4 suelto. Falta `git init` y repo a nombre de Ari. Proyecto aparte, no mezclar.

## Trello (resumen 05/10)
GH_PAT NO vence 14/10 (renovado hasta 6/9/2027). Por hacer Raifel: stories con link una por noche 05–16/10 (antes `regenerar_stories.py`), correr "auditoria-semanal-cazador" una vez, mirar indexación 5 URLs el miércoles, extensión Chrome Web Store (zip, ficha, captura 1280x800, etiqueta `extension` en ML), registros Tiendanube/AliExpress/Temu, borrar secreto viejo Google ****6fKm, confirmar bio IG/Threads → sitio, subir carrusel consuegra martes/miércoles. Claude: medición miércoles 07/10, Dependabot/CodeQL/secret scanning (#21), pruebas GEO en IAs (#19). Stories Día de la Madre no después del 18/10; pre-Cyber bot 19–25/10; Cyber 2–4/11. Tarjetas duplicadas #22 y #14 desactualizada. **Pagar Google AI Pro antes del 7/10.**

## Medición miércoles 07/10 (comparar contra 28/09–05/10)
Panel ML etiqueta `web`: clics, órdenes, conversión, ganancia/clic y mix colchones/herramientas. Clarity: `click_ml_ticket_alto` / `click_ml`, `click_ml_seccion=colchones_home`, scroll y clics por sesión en móvil `/precio/*`. Speed Insights LCP/CLS. Vercel `clic_ml` por página. Vigilar que los clics totales no bajen (el bloque de colchones empuja la grilla). Reel colchón: vistas/likes vs último (~800 vistas, 26 likes). Decidir recortar Telegram (`max_posts` 5→3; ojo: también define web/WhatsApp) tras medir.

## Reglas vigentes
Nada se publica sin OK de Raifel · Raifel baja los videos de Gemini a `_entrada` · otro chat trabaja en el repo: commitear solo archivos propios, `git pull --rebase --autostash` antes de push · tests/build antes de push · no tocar JARVIS · no preguntar "¿sigo?", recomendar siempre · los worktrees de agentes quedan en `bot-repo/.claude/worktrees/` (varios con junction `frontend/node_modules`: `rmdir` de la junction antes de borrar el worktree) · el cwd de la sesión debe ser `bot-repo` para que los agentes con worktree funcionen.
