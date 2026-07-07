# Cazador de Ofertas AR — Bot de Telegram

Bot que publica automáticamente las mejores ofertas de Mercado Libre en el canal
de Telegram, con link de afiliado. Corre solo en GitHub Actions 3 veces por día
(12:00, 17:00 y 21:00 hora Argentina). **No requiere mantenimiento.**

## Cómo funciona

1. Descarga `mercadolibre.com.ar/ofertas` (3 páginas, ~115 productos)
2. Filtra: descuento ≥ 25%, precio ≥ $10.000, no publicado antes
3. Inyecta tu ID de afiliado (`matt_tool`) en cada link
4. Publica las 3 mejores en el canal con foto, precios y botón de compra
5. En el run del mediodía te manda por privado el "Kit Instagram": imagen,
   caption y link listos para hacer una story en 2 minutos
6. Si el scraper trae menos de 5 ofertas (ML cambió el HTML), te avisa por privado

## Configuración (bot/config.json)

| Campo | Qué hace | Valor actual |
|---|---|---|
| `channel` | Canal donde publica | `@cazadordeofertasar` |
| `admin_chat` | Tu chat privado (kit IG + alertas) | `8701191351` |
| `min_discount` | Descuento mínimo % | 25 |
| `min_price` | Precio mínimo ARS | 10000 |
| `max_posts` | Posts por corrida | 3 |
| `pages` | Páginas de /ofertas a leer | 3 |

Editás el JSON, hacés commit y push, y la próxima corrida usa los valores nuevos.

## Secretos requeridos (Settings → Secrets and variables → Actions)

- `TELEGRAM_BOT_TOKEN` — token de @cazador_ofertas_ar_bot (BotFather)
- `ML_AFFILIATE_ID` — ya estaba configurado para el sitio

## Correr a mano

Pestaña **Actions → Cazador Deals Bot → Run workflow** (opcionalmente con kit IG).

Local (prueba sin publicar):

```bash
DRY_RUN=1 python bot/cazador_bot.py
```
