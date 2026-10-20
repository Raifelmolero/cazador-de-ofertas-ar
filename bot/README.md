# Cazador de Ofertas AR — Bot multicanal

Bot que caza las mejores ofertas de Mercado Libre y las publica solo en
**Telegram, Instagram y Threads**, con links de afiliado etiquetados por canal.
Corre en GitHub Actions 3 veces por día (12:00, 17:00 y 21:00 hora Argentina).
**No requiere mantenimiento**: hasta los tokens de IG/Threads se renuevan solos.

> ## ⚠️ Escaneo de Mercado Libre PAUSADO (13/10/2026)
> Mercado Libre confirmó que **no permite el scrapeo** (y su API abierta para afiliados
> todavía no existe). Por eso `scrape_ml` está en `false` en `config.json`: el bot **no
> pide ninguna página de ML**. Las ofertas salen de las que cargás a mano
> (ver «Cargar una oferta a mano» abajo). Para reanudar el escaneo cuando ML habilite
> una vía oficial: `"scrape_ml": true` (y revisar `docs/HANDOFF-2026-10-13-scraper-bloqueado.md`).
> Lo de abajo («Qué hace en cada corrida») describe el modo con escaneo activo.

## Qué hace en cada corrida

1. Descarga `mercadolibre.com.ar/ofertas` (20 páginas + 6 de relámpago) y la
   misma página filtrada por 6 categorías de ticket alto (`CATEGORIAS_TICKET_ALTO`,
   `categoria_pages` en config.json): herramientas, gastronomía/embalaje,
   electro y aires, hogar/colchones, TV y vehículos. El buscador de ML
   (`listado.mercadolibre...`) NO se usa: devuelve "tráfico sospechoso".
2. Registra el precio de cada producto en `bot/state/price_history.json`
   (historial de precios propio, se alimenta solo 3 veces por día)
3. Filtra: descuento ≥ 25%, precio ≥ $10.000, no publicado antes, y
   **descarta ofertas infladas** (productos que vimos ≥5% más baratos antes:
   el "descuento" contra el precio tachado no es real)
4. Rankea: primero las ofertas en **mínimo histórico** (precio más bajo que
   registramos, con al menos 3 días de historia), después por % OFF —
   esos posts llevan el badge «📉 El precio más bajo que registramos»
   en Telegram, IG y Threads
5. Arma el link de afiliado con etiqueta de atribución **por canal**
   (`matt_word=telegram/instagram/threads` + `matt_tool` fijo, formato real
   del linkbuilder — así el panel de afiliados te dice qué canal vende)
6. Publica las 3 mejores en el canal de Telegram con foto, precios y botón de compra
7. Actualiza `frontend/data/productos_rentables.json` (las ofertas del día
   aparecen en CalculadoraML con margen calculado)
8. Registra cada publicación en `bot/state/posts_log.jsonl` (alimenta el reporte semanal)

### Instagram (3 posts por día, en cada corrida)

- Publica en el feed vía API: genera una **placa diseñada 4:5** con el
  sello «CAZADO» (la sube al repo en `bot/feed/`), caption vendedora con
  ganchos rotativos y **primer comentario automático con CTA** («link en mi bio»)
- Publica también la **story del día** con placa 9:16 (`bot/stories/`)
- Te avisa por privado con el permalink + recordatorio de sumar el producto
  a la vidriera de la bio
- Si no hay credenciales de la API (o falla), te manda el **kit IG manual**:
  imagen, caption y link listos para publicar en 2 minutos

### Reel diario (experimental, apagado por defecto)

- `bot/reel.py` genera un MP4 9:16 de ~8,5 s con la estética de la marca:
  gancho «LA CAZA DEL DÍA» → producto con zoom y sello CAZADO → revelación
  de precio + LINK EN BIO
- Solo se publica forzándolo: **Actions → Run workflow → `force_reel`**
  (sube el video al repo en `bot/reels/` y lo publica vía `media_type=REELS`)
- Cuando el formato esté aprobado, se le suma un horario fijo en `main()`

### Threads (3 posts por día)

- Mediodía y noche: post con placa + link de afiliado clickeable en el texto
- Tarde: post de **solo texto conversacional** (el algoritmo lo premia) con
  formatos rotativos tipo debate/pregunta

## Reporte semanal (domingos 23:00 ART)

`weekly_report.py` te manda por Telegram un resumen de los últimos 7 días:
publicaciones por canal, las 3 mejores ofertas de la semana (con marca 📉 si
salieron en mínimo histórico), la **cacería de la semana** (ofertas escaneadas,
descartadas por descuento inflado, mínimos históricos publicados — sale de
`bot/state/scan_log.jsonl`) y **métricas automáticas** (miembros de Telegram,
seguidores de IG y Threads) con la variación contra la semana anterior.
El historial queda en `bot/state/metrics_log.jsonl`.

## Post especial manual (Mundial, Hot Sale, Black Friday...)

Pestaña **Actions → Post Especial → Run workflow**, pegando el JSON del deal
con captions personalizadas (formato en el docstring de `bot/special_post.py`).
Publica en IG + Threads y te confirma por Telegram. Tiene modo `dry_run`.

## Renovación automática de tokens

Los tokens de IG y Threads vencen a los 60 días. `ig_token_refresh.yml` los
renueva todos los lunes y actualiza los secrets solo. Si alguna renovación
falla, te llega alerta por Telegram con los pasos para regenerarlo a mano.

## Cargar una oferta a mano (modo actual)

**Varias a la vez:** en el campo «lote» pegá una oferta por bloque con campos separados por `|` y ofertas separadas por `;;`:
`url | título | precio actual | precio anterior | imagen (opcional) ;; url | ...`. Todo o nada: si una está mal, el error dice cuál y no se carga ninguna.

Desde el celular: app de GitHub → repo → **Actions → «Agregar oferta manual» → Run workflow**.

| Campo | Qué poner |
|---|---|
| `url` | Link **largo** del producto (`https://www.mercadolibre.com.ar/...MLA...`), el de la barra del navegador. **No** el corto `meli.la`. |
| `titulo` | El título como lo muestra ML. |
| `precio_actual` | Solo el número (`749999`). |
| `precio_anterior` | El precio tachado que muestra ML (`1100000`). Es obligatorio: sin precio anterior no es una oferta. |
| `imagen` | Opcional. Link `https://http2.mlstatic.com/...` (mantené apretada la foto → «Copiar dirección de la imagen»). Sin foto no sale en Instagram. |
| `publicar_ya` | Tildado: publica ahora en los canales. Sin tildar: sale en la próxima corrida (12/17/21 hs). |

Qué pasa: `bot/tools/oferta_manual.py` valida los datos (no hace ningún pedido a ML), la guarda en
`bot/state/ofertas_manuales.json` y el bot la trata como una oferta más: ranking, historial de
precios, links de afiliado por canal, placas, y la suma al catálogo de la web.
Reglas: una oferta manual vale **14 días** (desde el 19/10; antes 7 — en la web la tarjeta dice «precio visto el …»); no se le exige el
descuento/precio mínimo del config; igual **no sale** si ya se publicó, si el mismo título salió en los
últimos 14 días o si el historial la marca inflada. Con el escaneo pausado las ofertas nuevas **se suman**
al catálogo de la web (no lo reemplazan) y `scraped_at` conserva la fecha vieja, para que el cartel
«Actualizado» diga la verdad.

## Configuración (bot/config.json)

| Campo | Qué hace | Valor actual |
|---|---|---|
| `channel` | Canal donde publica | `@cazadordeofertasar` |
| `admin_chat` | Tu chat privado (alertas + reportes) | `8701191351` |
| `min_discount` | Descuento mínimo % | 25 |
| `min_price` | Precio mínimo ARS | 10000 |
| `max_posts` | Posts por corrida | 3 |
| `pages` | Páginas de /ofertas a leer | 3 |
| `scrape_ml` | `false` = NO escanea ML, solo ofertas manuales (ML no permite el scrapeo) | `false` |

Editás el JSON, hacés commit y push, y la próxima corrida usa los valores nuevos.

## Secretos requeridos (Settings → Secrets and variables → Actions)

| Secreto | Para qué |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token de @cazador_ofertas_ar_bot (BotFather) |
| `ML_AFFILIATE_ID` | Etiqueta general de afiliado (fallback de `matt_word`) |
| `IG_USER_ID` / `IG_ACCESS_TOKEN` | Instagram API with Instagram Login |
| `THREADS_USER_ID` / `THREADS_ACCESS_TOKEN` | Threads API |
| `GH_PAT` | PAT con permiso de secrets (para la renovación automática de tokens) |

Sin credenciales de IG/Threads el bot igual funciona: publica en Telegram y
manda el kit manual de IG.

## Etiquetas de atribución

Creadas en el **Administrador de etiquetas** del panel de afiliados con estos
nombres exactos: `telegram`, `instagram`, `threads`. Se pueden pisar con las
env vars `ML_WORD_TELEGRAM`, `ML_WORD_IG` y `ML_WORD_THREADS`.

## Correr a mano

Pestaña **Actions → Cazador Deals Bot → Run workflow** (opcional: forzar IG
y/o Threads aunque no sea el horario).

Local (prueba sin publicar):

```bash
DRY_RUN=1 python bot/cazador_bot.py
```

## Alertas automáticas al admin

- Scraper trae < 5 ofertas (ML cambió el HTML)
- Falla de publicación en IG o Threads (con el error)
- Falla en la renovación de tokens
