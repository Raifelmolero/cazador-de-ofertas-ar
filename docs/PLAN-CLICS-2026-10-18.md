# Plan por fases para subir clics (18/10 → 30/11/2026)

Base: etiqueta `web` 11-17/10 = 149 clics/semana (~21/día), $253.596. Pico: 322 clics/semana. Meta por fase en clics `web` por semana (medir cada domingo en el panel de ML).

## Fase 1 — Sostener lo que ya hay (18-23/10) · meta 180
- Cargar ~20 ofertas/día (ticket alto, ≥30 % off). Las 148 del 15/10 vencen el 23/10 → llegar al 23/10 con 150+ vigentes cargadas de 17-23/10.
- Que el bot publique primero lo más nuevo y de ticket alto (revisar `load_manual_deals` / ranking en `bot/cazador_bot.py`: hoy rotan ofertas de hasta 7 días).
- Cerrar la caída de publicaciones: confirmar que las corridas 12/17/21 h salen todos los días (hubo 6 días casi sin publicar).

## Fase 2 — SEO de lo que ya tiene impresiones (19-26/10) · meta 220
- GSC (28 d, Rendimiento → Consultas): listar consultas con impresiones y 0 clics (ej. "black friday 2026", cafeteras, "iphone 17e") y reescribir título/descripción de la página que responde.
- Reforzar con enlaces internos las guías que ya indexaron (hoy están 18 guías nuevas del 15-18/10 sin tráfico medido): desde home, categorías y comparativas.
- Pedir indexación de cada guía nueva (cuota ~10/día).
- Nada de datos inventados: si una consulta es de un producto sin ficha confiable (ej. un modelo nuevo), solo se publica lo verificable.

## Fase 3 — Cyber Monday 2-4/11 y Black Friday 27/11 (26/10-4/11) · meta 300+
- 26/10-30/10: ofertas Cyber arriba, cuenta regresiva, comparativas por categoría (celulares, TV, aires, notebooks ya existen).
- 31/10 y 1/11: llenar `[corchetes]` de `docs/CYBER-POSTS-2026.md` y `CYBER-HISTORIAS-2026.md` con precios testigo reales; publicar solo con dry-run y permiso de Raifel.
- 2-4/11: lote diario de ofertas Cyber y publicación frecuente.

## Fase 4 — Fuentes de tráfico nuevas (en paralelo, decisión de Raifel)
1. Meta: revisar `business.facebook.com/accountquality` (TUYO). Si habilita anuncios: test ≤ $10.000 (`docs/META-ADS-TEST-2026.md`); rinde si el clic cuesta < ~$1.000 (un clic web deja ~$1.700-2.300).
2. Historias de Instagram con link sticker (las sube Raifel con el kit de Telegram): hoy IG mandó ~1 toque en 30 días → probar 1 semana con 1 historia/día y medir etiqueta `instagram`.
3. WhatsApp/Telegram: el canal de WhatsApp tiene seguidores nuevos → mensaje diario con 3 ofertas (lo manda Raifel).
4. Pinterest y menciones externas (`docs/MENCIONES-EXTERNAS-2026.md`): una por semana.
5. Afiliados extra (Tiendanube Partners, Awin, AliExpress cobro): solo diversifican, no suben clics ML.

## Fase 5 — Medición (todos los domingos)
- Panel ML: etiqueta `web`, clics/semana, ganancia/clic y mix por categoría. Comparar contra 149 clics/$253.596 (11-17/10).
- GSC cada 28 días (base 74 clics, 4,47K impresiones): 29/10.
- Clarity: sesiones por canal (OrganicSearch, Other, Social).
- Regla: si una fase no mueve los clics en una semana, cambiar de palanca; no sumar más contenido a ciegas.

## Avance Fase 2 (18/10 noche)
GSC 28 d: 86 clics, 5,17K impresiones, CTR 1,7 %, pos. 18,2 (clics e impresiones SUBEN en los últimos días). Consultas con impresiones y 0 clics: black friday 2026 (109), iphone 17e (65), televisores smart (34), cyber monday 2024 argentina (31), cafetera oferta (30), cyber monday cafetera (26), oferta cafetera (20), cyber monday argentina (20), tv 55 pulgadas (17).
Cambios: título /black-friday; `mejores-cafeteras` ("Cafeteras en oferta"), `mejores-smart-tv` ("Televisores smart TV") y descripción de `mejores-iphone` (17e). Siguen bajo posición ~11-26: el límite es el ranking, no solo el título; medir el 29/10.
