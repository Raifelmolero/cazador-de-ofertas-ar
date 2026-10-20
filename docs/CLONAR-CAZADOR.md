# Cómo clonar el Cazador para un segundo sitio (fase 5)

Cuándo: cuando este sitio se sostenga solo 2-3 semanas (carga diaria + medición semanal andando y
ventas estables). No antes: un dominio nuevo arranca con autoridad cero y tarda meses en Google.

## Qué se reutiliza sin tocar
- `bot/` completo: publicación multicanal, historial de precios, detección de infladas, alertas,
  `tools/oferta_manual.py` y `tools/lote_navegador.py` (carga desde el navegador).
- `frontend/` (Next.js): grilla, verificador, /precio, comparativas, guías, Cyber/Black Friday.
- Workflows de GitHub Actions y las dos tareas programadas (carga diaria, medición semanal).

## Qué hay que cambiar (medido el 19/10/2026)
| Qué | Dónde | Esfuerzo |
|---|---|---|
| Dominio y marca | 280 menciones en 59 archivos (`grep -rl cazadordeofertas`). Primero centralizarlas en un `frontend/lib/marca.ts` y `bot/marca.py`, después clonar | 1 sesión |
| Host del sitio | env `DEALS_HOST` en Vercel (ya existe) | 1 min |
| Etiqueta de afiliado | `ML_WORD_WEB` / `matt_word` + crear las etiquetas en el panel de ML | 10 min |
| Rubros | `comision_estimada`, `FUERA` y categorías de `lote_navegador.py` | 1 h |
| Textos, guías y comparativas | `frontend/lib/guias.ts`, `comparativas.ts`, `landings.ts` (contenido propio: nada de copiar textos, Google castiga los sitios clonados) | varias sesiones |
| Canales | bot de Telegram nuevo, cuentas nuevas (o ninguna: hoy las redes casi no traen clics) | opcional |

## Pasos
1. Centralizar la marca en este repo (sin cambiar nada visible) y testear.
2. Repo nuevo a partir de este (template), dominio en nic.ar, proyecto nuevo en Vercel.
3. Etiquetas nuevas en el panel de afiliados para medir aparte.
4. Tarea programada de carga propia (otras categorías, mismo método).
5. Contenido propio del nicho: 5-10 guías de compra antes de pedir indexación.

## Nicho sugerido
Uno de ticket alto que este sitio no cubra fuerte: herramientas/construcción o bebés/juguetería.
Medir antes en este sitio cuál de esos rubros vende más (medición semanal → generalOrders.item_list).
