# Prompt para continuar (22/10/2026) — Cazador de Ofertas AR

Pegá esto en una sesión nueva de Claude Code en `C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR`:

---
Retomamos Cazador de Ofertas AR. Leé primero: la memoria (MEMORY.md + `martes-2026-10-20-diagnostico-clics.md`, secciones «21/10»), este archivo completo y la tarjeta Trello #42 (https://trello.com/c/ZyYW9Xqx, comentarios del 21/10). Usá la extensión de Chrome (Claude in Chrome) para todo lo del navegador: el navegador interno no abre localhost ni tiene las sesiones de Raifel.

## Estado al cierre del 21/10 (~23:30), todo en main y verificado en vivo

1. **Carga diaria** (tarea programada `cargar-ofertas-central-2010`, 11:13): el 21/10 corrió a las 18:28 porque la PC estaba apagada (corre sola al prenderla). 1.925 ofertas vigentes (+176, +2 de las recomendaciones de Agus), cupón FLASHMELI. Estamos sobre el tope de 1.600: las próximas corridas, más refresco de precios que ofertas nuevas.
2. **Comparadores** /comparador/celulares (79) y /comparador/notebooks (53) — main 9c26b77. Ahora leen memorias sin «gb» («G15 4/128»).
3. **21 duelos /vs/*** (lib/vs.ts, lista DUELOS; para sumar uno: definir Modelo con regex sobre el título normalizado + agregar el par). 14 de celulares (b11cd50) + 7 de notebooks (d30778f): HP 255 G10 vs Aspire Go 15, Aspire Lite 15 vs HP 255, Vivobook 15 vs IdeaPad Slim 3, IdeaPad 1 vs Aspire Lite 15, Galaxy Book4 vs Vivobook 15, Vivobook 14 vs 15, LOQ vs OMEN. La diferencia se calcula a igual memoria (celulares) o procesador (notebooks), en la más barata en común, y avisa el más barato de cada uno si no coincide. Una página solo se arma si los dos modelos tienen precio.
4. **8 páginas /mejor/*** (lib/presupuesto.ts) — main c1db778: celular hasta 300 mil / 400 mil / 600 mil / 1 millón; notebook hasta 600 mil / 800 mil / 1 millón / 1,5 millones (la de celular 200 mil no se arma: <3 equipos con datos). Puntaje por lo que dice el título; recomienda solo marcas conocidas (marca ≠ «Otra»); RAM de celulares con tope 8 GB (virtual), notebooks RAM tope 16 GB y procesador desconocido = básico.
5. Todo enlazado desde los comparadores (secciones «El mejor según tu presupuesto» y «Cara a cara»), sitemap y llms.txt.
6. **GSC 21/10 (10 pedidos, tope diario):** /comparador/celulares, /comparador/notebooks, /cyber-monday/tecnologia, /tecno, /precio-hoy/iphone, /categoria/electro-de-cocina, /vs/iphone-17-vs-iphone-17-pro, /vs/samsung-galaxy-s26-vs-iphone-17, /mejor/celular-hasta-400-mil, /mejor/notebook-hasta-1-millon. Ya estaban en Google: /categoria/gamer y /categoria/bebes-y-jugueteria. Método en GSC: buscador de arriba (clic en ~(600,26)), Enter, botón «Request indexing» en ~(1219,295), confirmar leyendo el diálogo visible por JS (las capturas a veces se cuelgan).
7. **Clics** (panel ML por día = fetch a /afiliados/dashboard?filter_time_range=AAAA-MM-DDT00:00:00.000-03:00--… y leer `generalKpis`; el parámetro `filter_tag` NO filtra): hasta el 17/10 el panel contaba muchos más clics que el clic_ml de Vercel (clics de afuera del sitio); desde el 18/10 casi coinciden → cayeron los clics de afuera, el sitio da 10-20/día. Panel todas las etiquetas: 12/10 33 · 13/10 33 · 14/10 53 · 15/10 43 · 16/10 32 · 17/10 28 · 18/10 16 · 19/10 16 · 20/10 23/0/$0 · 21/10 parcial 10/1/$42k. El «últimos 7 días» de la Central (65) NO es confiable.
8. **Campaña de incentivo REAL** (Central → Campañas con incentivos; aviso por WhatsApp de la cuenta de empresa «Mercado Libre - Afiliados y Creadores» +54 9 11 7145-7886): $30.000 extra por 2 ventas del 1 al 31/10, inscripto desde el 1/10, progreso 0/2 (raro con ventas en octubre). Lo pregunta Raifel con «Necesito ayuda» o a Agus.

## Pendiente de decisión de Raifel
- **Neumáticos** (propuesta hecha, sin OK todavía): hoy hay ~20 en la web. Plan: (1) sacar `neum[aá]tico` del regex FUERA de bot/tools/lote_navegador.py (dejar «repuesto»); (2) sumar a la tarea diaria búsquedas «neumatico» y «bateria auto» en la Central cada 2 días; (3) con ≥40 neumáticos, páginas por rodado (R14, R15, R16, R17) en vez de por medida suelta. Pedir OK antes de tocar la tarea programada.

## Hacer el 22/10, en orden
1. Verificar la carga de las 11:13 (≥1.200 vigentes, cupón del día, que haya corrido).
2. Fila diaria del 21/10 cerrada en #42 y separar web vs sitio desde el selector de etiquetas del panel (no por URL).
3. GSC (cuota nueva): /vs/moto-g15-vs-samsung-galaxy-a16, /vs/hp-255-g10-vs-acer-aspire-go-15, /vs/lenovo-loq-vs-hp-omen, /mejor/celular-hasta-600-mil, /mejor/celular-hasta-1-millon, /mejor/notebook-hasta-1-5-millones, /mejor/celular-hasta-300-mil.
4. Neumáticos si Raifel da el OK.
5. GEO: IndexNow/Bing de las páginas nuevas; referrers de IAs (Vercel stats type=referrer) semanal.
6. Dom 26/10: medición semanal vs metas (≥30 clics/día, ≥20 pedidos/semana). Cyber 2-4/11 (/cyber-monday/tecnologia marca sola real/inflado).

## Cómo se trabaja (técnico)
- Worktree de trabajo: D:/wt/sitio (ramas por tarea desde origin/main; push con `git push origin HEAD:main` tras OK de Raifel). bot-repo local está desactualizado (usar git pull o los worktrees).
- Vista previa: `.claude/launch.json` config «tecno» (next start en D:/wt/sitio/frontend, puerto 3124) → abrir en Chrome con la extensión y desregistrar el service worker de la PWA. Requiere `npx next build` antes (~3 min, correr en segundo plano).
- Antes de cada push: `python -m pytest bot/tests -q` (365 OK), `npx tsc --noEmit`, `npx eslint`, `npx next build`.
- Verificar en vivo con curl (Vercel tarda ~2-4 min) y el sitemap.
- Prueba rápida de datos sin build: `npx tsx` con un script que importe lib/vs.ts o lib/presupuesto.ts.
- Cargar ofertas sueltas: bot/tools/lote_navegador.py (línea W/ruta§título§actual§tachado§código-foto; la foto de una ficha /p/ sale de meta og:image) → `gh workflow run oferta_manual.yml -R Raifelmolero/cazador-de-ofertas-ar --json < lote.json` desde Bash (PowerShell mete BOM) → `deals_bot.yml -f solo_datos=true`.

## Reglas
Tests antes de cada push; nada público sin permiso de Raifel (captura + OK); no scrapear ML fuera de su navegador; en WhatsApp solo leer el grupo «Ofertas 🌟 MELI» salvo que Raifel pida otro mensaje; no escribir nada en WhatsApp; no tocar JARVIS; Claude no escribe credenciales; no empujar aires/verano sin calor real; recomendar siempre una opción; español rioplatense sin tecnicismos. Al cerrar: Trello + memoria + handoff.
---
