# Por qué cayeron las ventas (análisis del 19/10/2026)

Fuentes: panel de Afiliados ML (Métricas, leído en el navegador el 19/10 a la noche), Clarity (17-19/10),
Vercel Analytics (30 días), Search Console y los registros del bot (`scan_log`, `posts_log`).

## 1. Los números, semana por semana (panel ML, ganancia estimada)

| Semana | Clics totales | Clics web | Pedidos | Ganancia |
|---|---|---|---|---|
| 21-27/09 | 320 | 241 | 30 | $474.184 |
| 28/09-04/10 | 417 | 356 | 51 | $1.070.312 |
| 05-11/10 | 318 | 284 | 37 | $1.157.148 |
| 12-18/10 | 238 | 145 | 16 | $237.708 |

- **No hubo semanas de $1,7 M.** El máximo fue $1,16 M (05-11/10), y la mitad de eso fue **un solo iPhone 17 Pro Max**
  ($9,9 M de venta → $595.980 de comisión). Sin ese premio, esa semana dio ~$561 k. El $1,6 M que circulaba era de 30 días.
- La comparación honesta es: ~$550 k a $1 M por semana a fines de septiembre contra $238 k ahora (−60 a −75 %).
- De los 238 clics de la última semana, **90 son de la extensión de Chrome (0 ventas)**. Los clics que venden (web) son 145.

## 2. Día por día: los clics web se cortaron en dos escalones

| Período | Clics web por día (promedio) |
|---|---|
| 28/09-07/10 | ~52 |
| 08/10-13/10 | ~29 |
| 14/10-18/10 | ~18 |

Domingo 18/10 (Día de la Madre): 14 clics web, 1 venta de $735. Lunes 19/10 (parcial): 8 clics, 3 ventas, $61.965.

## 3. La causa principal: el sitio se quedó sin ofertas

Ofertas que tenía el sitio (máximo del día, `scan_log`):

| Fecha | Ofertas |
|---|---|
| 27/09-05/10 | 1.450-1.600 (bot automático) |
| 08/10 | 45 (ML bloquea el scraping) |
| 12-14/10 | 11-48 |
| 15-19/10 | 158 → 332 (carga manual) |
| 19/10 noche | ~366 (+34 de esta sesión) |

Los dos escalones de clics coinciden con esto: primero se vacía el sitio (8/10) y unos días después dejan de volver
los que entraban seguido a ver qué había nuevo. Con 1.500 ofertas rotando todos los días había motivo para volver
y algo para cada uno; con 300 que duran 7 días, no.

La conversión no es el problema: la etiqueta web sigue en ~11 % (16 pedidos / 145 clics).

## 4. Causas secundarias

- **Ticket más bajo y más ventas indirectas**: comisión por pedido $21 k (28/09) → $15 k (12/10). La última semana
  la mitad de las ventas fueron "indirectas" (el comprador terminó comprando otra cosa, comisión 2-4 %).
- **Google no es el problema**: Search Console viene subiendo (de ~1 a ~10-14 clics por día en octubre). Hoy Google es
  casi la mitad de las visitas (Clarity 17-19/10: 44 de 95 sesiones). Pero sigue siendo poco volumen.
- **Redes casi no traen**: Instagram 1 sesión en 3 días; Telegram 1 clic en la semana. Facebook sí trajo ~100
  visitantes en 30 días (Vercel). El bot volvió a publicar desde el 14/10, pero con pocas ofertas repetidas.

## 5. Qué hacer (en orden)

1. **Volver a 800-1.000 ofertas vigentes.** Recomendado: cargar 30-50 por día desde la Central de afiliados
   (sección "Productos seleccionados para vos", ordenada por mayor precio, solo 15 % de comisión y ≥20 % OFF,
   descartando las que el historial vio ≥5 % más baratas). Hoy: 34 cargadas así en una corrida.
2. **API oficial de ML** (lo que usa mejorescompras.com.ar con 9.000 productos): es la única forma de volver a los
   números de septiembre sin trabajo manual. Seguir con Agustina / soporte de Afiliados.
3. **Medir sin la extensión**: mirar siempre la etiqueta `web` (la extensión suma clics pero no vende).
4. Domingo 26/10: comparar la etiqueta web contra 145 clics / 16 pedidos / $237.708.
