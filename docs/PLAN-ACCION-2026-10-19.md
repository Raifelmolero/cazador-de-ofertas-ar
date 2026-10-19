# Plan de acción 19/10 → 30/11/2026 (sale de AUDITORIA-2026-10-19.md)

Meta: volver a la semana del 6/10 — 409 clics, 62 pedidos, ~$1.000.000 por semana.
Punto de partida (semana al 19/10): 240 clics, 16 pedidos, $237.708.

La caída se explica casi toda por **volumen y frescura de ofertas** (antes ~280 frescas por día
elegidas entre ~1.500; hoy ~300 cargadas a mano, de hasta 7 días). El sitio, el SEO y los links ya
están mejor que antes de la caída.

## A. Lo que hace Claude solo (sin Raifel)

### Hecho el 19/10 (en main)
| # | Qué | Qué mejora |
|---|---|---|
| A1 | Aviso diario por Telegram si las manuales vigentes bajan de 100 | El sitio no se vacía de golpe sin aviso |
| A2 | «Mientras tanto, las mejores ofertas de hoy» en landings/categorías con pocas ofertas | Quien llega de Google a una página vacía igual tiene qué comprar |
| A3 | Filtros Smart TV 55+ y «Aire Acond» | 3 TV y 1 aire que estaban cargados ahora aparecen en sus páginas |
| A4 | Tildes rotas («ColchÃ³n») corregidas y prevenidas | Confianza y búsquedas |
| A5 | Buscador + rubros fijos arriba en celular y tablet | 68 % de las visitas: llegan al producto sin bajar 5 pantallas |
| A6 | Fecha «Última revisión» real cuando hay cargas nuevas | Se va el «hace 6 días» que espantaba compradores |
| A7 | Home sin colchones repetidos; menú de escritorio en 1 renglón | Más productos distintos por pantalla |
| A8 | Resultado de YouTube Shorts al log de Actions | Poder diagnosticar por qué no sube ningún Short |
| A9 | Auditoría, memoria (CLAUDE.md) y Trello al día | La próxima sesión arranca sin repetir |

| A9b | Buscador del sitio palabra por palabra y con plurales | «aire inverter», «aires», «colchones» ahora encuentran productos |
| A9c | Segunda auditoría: 278 páginas rastreadas, 0 errores, links de afiliado OK | Descartadas fallas técnicas como causa |

### Próximas sesiones (Claude, sin depender de Raifel)
| # | Cuándo | Qué | Qué mejora |
|---|---|---|---|
| A10 | 20/10 | Leer el log nocturno `[info] shorts:` y arreglar la subida a YouTube | Shorts diarios funcionando (hoy 0) |
| A11 | Cada carga | Revisar que cada lote cubra aires, TV 55+, heladeras, notebooks, termotanques | Páginas que ya posicionan, con producto |
| A12 | 22-23/10 | Controlar que las 141 del 15/10 se repongan antes de vencer | Evitar otro bache como el del 6-14/10 |
| A13 | 26/10 | Medición semanal (panel ML + GSC + Clarity) contra la base de arriba | Saber qué movió la aguja |
| A14 | 26-30/10 | Cyber: ofertas Cyber arriba, cuenta regresiva, comparativas por rubro | Aprovechar la semana más fuerte del año |
| A15 | 31/10-1/11 | Completar `CYBER-POSTS-2026.md` con precios testigo reales (dry-run, publica solo con permiso) | Posts del Cyber listos |
| A17 | 20-21/10 | Probar desde Actions (solo imágenes del CDN, no páginas de ML) si hay miniaturas más livianas y usarlas en las tarjetas | Sitio más rápido en celular |
| A18 | 21/10 | JSON-LD en `/precio` y `/aliexpress` | Detalle de SEO |
| A19 | 24/10 | Chequeo semanal automático de links rotos (lychee en Actions, sin ML) | Que no aparezcan links muertos sin enterarnos |
| A20 | 27-28/10 | Revisar el ranking de la home con los datos de la semana (qué rubros se clickean, vía `posts_log`/capturas) | Lo que más vende, más arriba |
| A16 | Semanal | Títulos/descr. de páginas con impresiones y 0 clics en GSC (con datos que pase Raifel) | CTR de Google |

## B. Lo que necesita a Raifel (ordenado por impacto)
| # | Qué | Tiempo | Qué mejora |
|---|---|---|---|
| B1 | Mandar 20-30 productos por día (link largo + precio actual + tachado + foto), con prioridad aires, TV grandes, heladeras, notebooks, celulares | 10-15 min/día | Es el 70-80 % de la recuperación |
| B2 | Mensaje a Agustina (ML): acceso a la API citando que mejorescompras.com.ar dice usarla | 5 min | Volver a ~280 ofertas automáticas |
| B3 | YouTube Studio (elcazadordeofertas.ar@gmail.com): ver si Google aprobó la auditoría (#18) | 5 min | Shorts públicos |
| B4 | Search Console: pedir indexación de las páginas nuevas | 10 min | Google más rápido |
| B5 | Decidir test de Meta Ads Cyber (≤ $10.000; cuenta con restricción) | — | Tráfico inmediato en el Cyber |
| B6 | Captura del panel ML el domingo 26/10 | 2 min | Medición |

## C. Lo que NO se hace
- Scraping de ML en ninguna forma (prohibido por ML; riesgo para la cuenta).
- Más contenido SEO a ciegas: ya hay mucho; el límite es autoridad del dominio (meses).
- Publicar en redes sin dry-run y permiso.
