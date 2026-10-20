# Plan para remontar clics y ventas (20/10/2026 → 2/11/2026)

Diagnóstico hecho el 20/10 a la tarde con el panel de afiliados día por día (1/9 → 20/10), Vercel Analytics,
Clarity y el log del bot (`bot/state/scan_log.jsonl`, `posts_log.jsonl`).

## 1. Los números

Etiqueta `web` del panel de afiliados (la que hace ~100 % de la ganancia):

| Semana | Clics | Pedidos | Ganancia | Ofertas en el sitio |
|---|---|---|---|---|
| 21-27/9 | 241 | 33 | $449.000 | 115 → 1.464 (scraper vuelve el 24-27/9) |
| 28/9-4/10 | 356 | 56 | $1.070.000 | 1.416-1.602 |
| 5-11/10 | 284 | 43 | $1.157.000 | 1.601 el 5/10 → 45 el 8/10 (bloqueo ML) |
| 12-18/10 | 145 | 16 | $238.000 | 11-291 |
| 19/10 | 15 | 3 | $62.000 | 332 |
| 20/10 | 10 (día parcial) | 0 | — | 1.753 (carga masiva) |

Antes del 21/9 casi no había clics (0-12 por día). «Principios de mes» = **50-60 clics y ~8 pedidos por día**.

Por día (web: clics/pedidos/ganancia): 27/9 64/8/$259k · 28/9 67/5/$206k · 29/9 72/4/$148k · 30/9 46/9/$298k ·
1/10 50/8/$48k · 2/10 57/6/$82k · 3/10 36/16/$61k · 4/10 28/8/$227k · 5/10 53/11/$150k · 6/10 60/5/$458k ·
7/10 54/8/$283k · 8/10 34/7/$82k · 9/10 36/4/$43k · 10/10 29/6/$124k · 11/10 18/2/$17k · 12/10 27/4/$81k ·
13/10 27/6/$100k · 14/10 19/0/$0 · 15/10 25/3/$40k · 16/10 13/2/$16k · 17/10 20/0/$0 · 18/10 14/1/$735 ·
19/10 15/3/$62k · 20/10 10/0 (parcial).

Semana 1-7/10 completa del panel: 387 clics totales (338 web + 49 extensión), 40 compradores, 62 pedidos,
ventas brutas $19,6M, comisión $1.309.106. Compradores de todo el país (BA 42 %, CABA 15 %, Córdoba 10 %).

## 2. Qué está pasando

1. **Se cayeron los clics, no la conversión.** De cada 100 clics se venden 12-16 cosas, antes y ahora.
2. **Los clics siguen a la cantidad de ofertas del sitio con ~2 días de demora.** Subieron cuando el scraper llenó
   el sitio (27/9), bajaron cuando ML bloqueó el scraping (6/10: 1.601 → 45) y no volvieron mientras hubo
   50-330 ofertas manuales. El inventario volvió recién el 20/10 (1.753).
3. **Paradoja de medición (lo más importante a confirmar):** Vercel y Clarity ven MÁS tráfico ahora que a
   principios de mes, pero el panel cuenta MENOS clics web.
   - Vercel, visitantes por semana: 1-7/10 150 → 14-20/10 308. Desde Google: 18 → 94.
   - Clarity, sesiones desde Google: 15 → 95. Telegram no aparece en el top 10 en ninguna de las dos semanas.
   - Evento `clic_ml` del sitio (Vercel, existe desde el 3/10): 3-7/10 ~24 → 14-20/10 89.
   - Panel ML, clics web: 338 → 116.
   - O sea: a principios de octubre ~8 de cada 10 clics «web» **no pasaron por sesiones que nuestros medidores
     ven**. Hipótesis principal: alguien copia nuestras ofertas con nuestro link de afiliado (las URLs con
     `matt_word=web` están en el HTML, en `/ofertas-hoy.json` y en el JSON-LD de `/precio/[slug]`) y las
     republica en otro lado (grupo, canal, otro sitio). Eso explica que esos clics crezcan y caigan junto con
     nuestro inventario y que traigan compradores reales. Otras explicaciones posibles: bloqueadores que
     tapan Vercel y Clarity a la vez, o ML contando varios clics por visita. **No está confirmado.**
4. **Factores menores:** compras del Día de la Madre (18/10) a principios de mes; pocas ventas grandes hicieron
   la mitad de la plata (iPhone 17 Pro Max $596k la semana del 6/10; $458k el 6/10).
5. **Lo que NO es:** links mal etiquetados (verificado), conversión del sitio, recorte de Telegram (no trae
   sesiones), redes (IG/Threads/FB traen muy poco).

## 3. Plan paso por paso

### Paso 1 — Inventario lleno todos los días (YA, todos los días)
- Tarea programada `cargar-ofertas-central-2010` (~11:13): mantener **1.200-1.600 ofertas vigentes**, frescas
  (refresca las de 5+ días). Lee el grupo de WhatsApp «Ofertas 🌟 MELI» para el cupón del día.
- Control diario (Claude, cada sesión): comentario de la tarea en https://trello.com/c/rAugjBkb y
  `bot/state/scan_log.jsonl` → `scanned` ≥ 1.200. Si no corrió, cargar a mano (método en
  `bot/tools/lote_navegador.py`; máximo ~35-45 páginas por corrida, solo desde el Chrome de Raifel).
- Prioridad de rubros: ticket alto que vende (celulares ≥ $1M con 10 % en su mínimo, notebooks, heladeras, TV,
  cafeteras, pelo, colchones). Piso $20.000.

### Paso 2 — Tabla diaria panel vs sitio (21/10 → 26/10)
Cada día anotar en Trello #42: clics web del panel, pedidos, ganancia, `clic_ml` de Vercel, visitantes de Vercel,
ofertas vigentes. Cómo sacarlo:
- Panel día por día: en una pestaña de `mercadolibre.com.ar/afiliados/dashboard`, `fetch` a
  `/afiliados/dashboard?filter_time_range=` + `encodeURIComponent('AAAA-MM-DDT00:00:00.000-03:00--AAAA-MM-DDT00:00:00.000-03:00')`
  (día siguiente como fin) y regex `"earnings":\{"item_list":(\[.*?\]),"filter_time_range"` → JSON con
  `{tag, clicks, quantity, earnings}`. Correrlo en segundo plano (`(async()=>{…})()` guardando en `window.__dias`)
  porque 50 días tardan más de 45 s.
- Vercel: desde una pestaña de vercel.com, `fetch('/api/web-analytics/v2/timeseries?environment=production&filter=…&from=…&to=…&projectId=cazador-de-ofertas-ar&teamId=team_pWXpzkNXgiEnvQlPzYocnmnJ&tz=America%2FBuenos_Aires')`
  con `filter={}` (visitantes: `devices`) y `filter={"event_name":{"values":["clic_ml"],"operator":"eq"}}`.
  `/api/web-analytics/v2/stats?...&type=path|referrer|hostname|event_name` da desgloses. UTM pide plan Plus (no).
- **Cómo se lee:** si con el inventario lleno el panel vuelve a 45+ clics/día y `clic_ml` sigue en ~15, la
  fuente externa existe → Paso 3. Si los dos suben juntos, era todo el sitio y la hipótesis cae.

### Paso 3 — Encontrar la fuente externa (solo si el Paso 2 la confirma, ~24-27/10)
- (a) Vercel → Observability/Logs: pedidos a `/ofertas-hoy.json`, `/feed.xml`, `/historial.json` por user-agent
  e IP (un scraper que nos copia los pide seguido y sin navegador).
- (b) Experimento de etiqueta (necesita OK de Raifel: crear una etiqueta en el Administrador de etiquetas del
  panel, p. ej. `webcopia`): las URLs que salen en el HTML/JSON llevan `webcopia` y el script `clics-ml.tsx` la
  cambia a `web` en el momento del clic dentro del sitio. Así el panel separa clics del sitio (`web`) de links
  copiados y usados afuera (`webcopia`). Tests + build antes de push.
- (c) Si se encuentra quién republica: es tráfico que nos paga; no bloquearlo. Cuidarlo (inventario fresco) y
  ver si se puede ofrecer un feed oficial.

### Paso 4 — Google (lo que más crece)
- 21/10 (cuota GSC): pedir indexación de /categoria/gamer, /categoria/bebes-y-jugueteria, /categoria/electro-de-cocina.
- Que las fichas `/precio/[slug]` no desaparezcan cuando vence la oferta (tope de seguimiento 3.000, ya puesto el
  19/10): verificar que se mantengan y que muestren «Mientras tanto, las mejores de hoy».
- 29/10: CTR de Google vs 1,7 % (86 clics/28 días).

### Paso 5 — Cyber Monday (26/10 → 4/11, Cyber 2-4/11)
- Carga diaria más grande (45 páginas) del 26/10 al 4/11; prioridad ticket alto.
- 1/11: completar `docs/CYBER-POSTS-2026.md` con productos y precios reales; dry-run + permiso antes de publicar.

### Paso 6 — Redes (sin gastar tiempo)
- Ya en main (c1aa737): Facebook 5 por día (2+2+1), Telegram 1 por corrida (3 por día). Medir el 26/10 el referrer
  facebook.com en Vercel (base 51 visitas por semana).

## 4. Metas y punto de control

| Fecha | Meta (etiqueta web) |
|---|---|
| Dom 26/10 | ≥ 30 clics/día promedio de la semana; ≥ 20 pedidos/semana |
| Lun 2/11 | ≥ 50 clics/día; ≥ 40 pedidos/semana |

**Si el 26/10 hay ≥ 1.200 ofertas todos los días y los clics no pasan de 20/día**, la hipótesis del inventario no
alcanza: revisar la fuente externa (Paso 3) y preguntar a ML Afiliados (Agustina) si cambió algo en cómo cuentan
clics o en las cookies de atribución a partir del 6/10.
