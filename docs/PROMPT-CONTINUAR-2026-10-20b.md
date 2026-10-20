# Prompt para continuar (20/10/2026, después de la noche 19→20)

Copiar y pegar en un chat nuevo:

---

Retomamos Cazador de Ofertas AR (afiliados de Mercado Libre + cazadordeofertas.com.ar). Repo: `C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR\bot-repo` (GitHub Raifelmolero/cazador-de-ofertas-ar; deploy = push a main → Vercel). Leé primero, en este orden:
1. Memoria: nota `noche-2026-10-19-carga-masiva-navegador` y `lunes-2026-10-19-noche-caida-ventas`.
2. `bot-repo/docs/PROMPT-CONTINUAR-2026-10-20b.md` (este archivo), `docs/PLAN-NOCHE-2026-10-19.md`, `docs/ANALISIS-CAIDA-VENTAS-2026-10-19.md`, la sección «Estado al 2026-10-20» de `CLAUDE.md`.
3. Trello (tablero «Cazador de ofertas»): tarjetas #41 (noche 19→20, plan por fases), #40 (plan de acción) y https://trello.com/c/rAugjBkb.

Seguí con los «Próximos pasos» de abajo en orden, sin preguntarme, con tests antes de push y anotando en Trello.

## Dónde quedamos (20/10 madrugada, main 90bb5a4, todo en verde)
- **Causa de la caída de ventas** (de ~$1M/semana a $237.708 el 12-18/10): el sitio se quedó sin ofertas cuando ML bloqueó el scraping (1.500 → 362). Conversión estable ~11 %.
- **Arreglado esta noche**: 362 → **1.260 ofertas manuales vigentes, 1.228 en la web** (verificado en vivo). 898 cargadas desde mercadolibre.com.ar/ofertas por categoría (≥ $50.000, ≥ 20 % OFF), leídas en el Chrome de Raifel con Claude in Chrome. Permiso de ML: Agustina (Afiliados) dijo «Sí, no hay problema» a un asistente de IA en el navegador de Raifel leyendo pocas ofertas por vez. **No pasar de ~35-45 páginas por corrida. Nunca scrapear desde Actions/servidores.**
- **Cambios en main**: manuales duran 14 días (antes 7); con scrape_ml=false TODAS las manuales van a la web (`deals_para_sitio`; había un tope oculto de 300); `deals_bot.yml` tiene input `solo_datos` (refresca la web sin publicar); seguimiento /precio con tope 3.000 (se restauraron 207 fichas que la carga había borrado); `bot/tools/lote_navegador.py` (extractor JS + filtros + lotes) con tests; destacadas priorizan ≥ 20 % OFF; test de cifrado estable. 358 tests OK; build local de 3.237 páginas OK.
- **Método de carga** (detalle en el docstring de `lote_navegador.py`): EXTRACTOR_JS en localStorage → recorrer `/ofertas?category=<id>&price=50000-*&page=N` → volcar a `<textarea>` + Ctrl+C → PowerShell `Get-Clipboard -Raw` a archivo (las herramientas del navegador cortan a ~1.000 car. en JS y 50.000 en page text) → `python bot/tools/lote_navegador.py <archivo> <carpeta>` → `gh workflow run oferta_manual.yml --json < lote_N.json` de a uno esperando cada run (Windows no acepta argumentos >32 KB; el workflow comparte concurrencia con el bot) → al final `gh workflow run deals_bot.yml --ref main -f solo_datos=true`.
- **Tareas programadas** (app de Claude, sección Scheduled): `cargar-ofertas-central-2010` diaria ~11:13 (25-35 páginas, 45 del 26/10 al 4/11, nuevas + refresco de 5+ días); `medicion-semanal-cazador` domingos ~21:08 (panel ML + GSC + 10 indexaciones → comentario en Trello #40; puede pedir permisos la 1ª vez: Raifel tiene que apretar «Run now»); `auditoria-semanal-cazador` miércoles y domingos 11:00. Corren solo con la PC prendida y la app abierta.
- **Investigado**: no hay repos abiertos mejores que lo nuestro (AMABot, PriceBuddy, Cazadescuentos; Apify descartado por scraping). API de afiliados de ML: «este trimestre», sin fecha; no reenviarle a Agustina hasta mediados de noviembre.
- Cyber Monday 2026: **2-4/11** (CACE), ya en `frontend/lib/cybermonday.ts`; /cyber-monday reindexada el 19/10 (237 impresiones/28 días, posición 53). `docs/CYBER-POSTS-2026.md` listo; los [corchetes] se completan el 1/11 con precios reales.
- Redes: IG 1.488, Threads 104, Telegram 4 → no traen clics; no invertir tiempo.
- Dependabot #19 (postcss-selector-parser): no aplica (solo build; Tailwind 3 exige v6). No tocar.
- Panel de Métricas por fechas: `mercadolibre.com.ar/afiliados/dashboard?filter_time_range=AAAA-MM-DDT00%3A00%3A00.000-03%3A00--AAAA-MM-DDT00%3A00%3A00.000-03%3A00`; con fetch desde la página se lee el JSON embebido (`"id":"summary"`, tags `{"tag":"web","clicks":…}`, `generalOrders.item_list`).

## Próximos pasos
1. **20/10 ~11:13**: revisar que la carga diaria corrió (comentario en https://trello.com/c/rAugjBkb, vigentes ≥ 1.200). Si no corrió, correrla a mano con el método de arriba.
2. **Domingo 26/10**: medición (la tarea programada; si no corre, hacerla a mano): etiqueta `web` vs 145 clics / 16 pedidos / $237.708; ver qué rubros vendieron y cargar más de esos.
3. **26/10-4/11 Cyber**: carga diaria más grande; 1/11 completar `CYBER-POSTS-2026.md` con productos y precios reales (dry-run + permiso antes de publicar nada).
4. **29/10**: CTR de Google vs 1,7 % (86 clics/28 días).
5. Fase 5 (cuando el sitio se sostenga 2-3 semanas): segundo cazador según `docs/CLONAR-CAZADOR.md` (primero centralizar la marca: 280 menciones en 59 archivos).

## Pendientes de Raifel
- PC prendida a la mañana con Claude + Chrome (sesión de ML) para la carga diaria.
- «Run now» una vez en la tarea de medición semanal para aprobar permisos.
- YouTube: `python bot/tools/setup_youtube.py` con elcazadordeofertas.ar@gmail.com y «YouTube test upload».
- AliExpress: datos de cobro. Claves de API de X, saldo de Meta Ads, portada de X (sin urgencia).

## Reglas (no negociables)
Responder en español rioplatense, directo y sin tecnicismos; recomendar siempre una opción y decir por qué. Tests y build antes de cada push (`pip install pytest` y `python -m pytest -q bot/tests`; `npx next build` si se toca el frontend). Nada público (redes, mensajes) sin dry-run y permiso. No inventar datos de productos. No scrapear ML desde servidores ni fuera del navegador de Raifel. No empujar aires/verano sin calor real. No tocar JARVIS. Meta Ads: Raifel no crea otro perfil; Claude no paga ni carga tarjetas; cualquier test necesita OK explícito con tope $10.000. Al cerrar: Trello, memoria y handoff.

---
