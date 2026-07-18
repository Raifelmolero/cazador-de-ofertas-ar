# Cazador de Ofertas AR — Bot multicanal

Bot que caza las mejores ofertas de Mercado Libre y las publica solo en
**Telegram, Instagram y Threads**, con links de afiliado etiquetados por canal.
Corre en GitHub Actions 3 veces por día (12:00, 17:00 y 21:00 hora Argentina).
**No requiere mantenimiento**: hasta los tokens de IG/Threads se renuevan solos.

## Qué hace en cada corrida

1. Descarga `mercadolibre.com.ar/ofertas` (3 páginas, ~115 productos)
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

### Instagram (corrida del mediodía)

- Publica solo en el feed vía API: genera una **placa diseñada 4:5**
  (la sube al repo en `bot/feed/`), caption vendedora con ganchos rotativos
  y **primer comentario automático con CTA** («link en mi bio»)
- Publica también la **story del día** con placa 9:16 (`bot/stories/`)
- Te avisa por privado con el permalink + recordatorio de sumar el producto
  a la vidriera de la bio
- Si no hay credenciales de la API (o falla), te manda el **kit IG manual**:
  imagen, caption y link listos para publicar en 2 minutos

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

## Configuración (bot/config.json)

| Campo | Qué hace | Valor actual |
|---|---|---|
| `channel` | Canal donde publica | `@cazadordeofertasar` |
| `admin_chat` | Tu chat privado (alertas + reportes) | `8701191351` |
| `min_discount` | Descuento mínimo % | 25 |
| `min_price` | Precio mínimo ARS | 10000 |
| `max_posts` | Posts por corrida | 3 |
| `pages` | Páginas de /ofertas a leer | 3 |

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
