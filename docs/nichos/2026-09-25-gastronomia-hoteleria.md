# Segundo nicho — Gastronomía y Hotelería (equipamiento) (2026-09-25)

## Recomendación

**Gastronomía y Hotelería (equipamiento gastronómico/industrial): freidoras
industriales, hornos pizzeros, amasadoras, cortadoras de fiambre,
exhibidoras.** Es la única categoría de comisión 15% que queda con catálogo
real y sin página propia (Colchones ya está armado; Embalaje no tiene una
sola oferta en 1529 posts). El catálogo es chico (8/1529, 0.5%) pero está en
línea con otras categorías que ya tienen página y les va bien
(termotanques 10/1529, parrillas 2/1529) — no es un impedimento nuevo, es el
mismo patrón que ya funciona en el sitio. Lo que lo hace atractivo de verdad:
**cero competencia** — ninguna búsqueda de este rubro devolvió un sitio o
blog argentino haciendo comparativas (a diferencia de cafeteras, cámaras de
seguridad o microondas, todas saturadas por mejorescompras.com.ar y
productosvirales.com.ar) — y **ticket altísimo**: un horno pizzero ronda
$950.000 a $1.500.000; al 15% de comisión, una sola venta deja más plata que
varias semanas de electrodomésticos chicos.

## Cómo se descartaron los otros candidatos (inventario + datos)

**Ya cubierto por el sitio** (excluido por consigna): Hogar completo
(aires/heladeras/lavarropas/freezers/termotanques/cocinas/ventiladores/
aspiradoras/monitores/freidoras de aire/parrillas/bicicletas/perfumes/
smart TV), Colchones, y Herramientas eléctricas (en marcha, excluido también
por consigna).

**Candidatos nuevos evaluados con datos reales** (conteo en
`bot/state/posts_log.jsonl`, 1529 posts, 18/07 al 25/09):

| Nicho | Comisión | Catálogo | Demanda (WebSearch) | Competencia (WebSearch) |
|---|---|---|---|---|
| Embalaje y logística | 15% | **0/1529** | — | — |
| Cafeteras | 7% | 47/1529 (3.1%) | Alta (regalo Día de la Madre) | **Altísima**: mejorescompras.com.ar tiene 3 páginas dedicadas + productosvirales, hoyconviene, micafeteraexpress |
| Microondas | 7% | 17/1529 (1.1%) | Alta | **Alta**: hasta el propio blog de Mercado Libre tiene comparativa, más 4 sitios de nicho |
| Cámaras de seguridad / hogar | 4% (estimado) | 6/1529 (0.4%) | Alta | **Alta**: mismo grupo de competidores (mejorescompras, productosvirales, modohogar, hogartecno) |
| Materiales de obra (cemento, membrana) | 4% (estimado) | 16/1529 (1.0%) | Alta, pero son "calculadoras" (redmateriales, servidos, bricocalcula), no comparativas de producto — mal fit: se compra en corralón, no en ML | Media, pero el producto no calza con el modelo de afiliados |
| **Gastronomía/Hotelería** | **15%** | 8/1529 (0.5%) | Media (B2B: dueños de local, foodtrucks, pastelería casera) | **Nula** — no encontré un solo sitio/blog argentino comparando este rubro |

*(Comisión de cámaras/obra marcada "(estimado)": son las notas ya existentes
en `CATEGORY_COMMISSION_WEIGHT`, sin ventas propias que las confirmen.)*

## Puntaje explicado (escala 1-5 por factor, salvo comisión en %)

| Nicho | Comisión | Ticket | Demanda | 1/Competencia | Temporada | Puntaje (cualitativo) |
|---|---|---|---|---|---|---|
| **Gastronomía/Hotelería** | 15% (real, confirmada en panel) | 5 (hasta $1,5M un horno pizzero) | 2 (nicho B2B, menos gente busca esto que un microondas) | 5 (cero competencia encontrada) | 2 (sin fecha fuerte, pero repunta antes de Navidad por pasteleros caseros) | **Alto** — 15 × 5 × 2 × 5 × 2 = 1500 (relativo) |
| Cafeteras | 7% | 3 (~$150-290k) | 5 (muy buscado, regalo Día Madre) | 1 (saturadísimo) | 4 (Día de la Madre 18/10, a 3 semanas) | Medio — 7×3×5×1×4 = 420 |
| Microondas | 7% | 2 (~$150-250k) | 4 | 1 (saturado) | 1 (sin fecha) | Bajo — 7×2×4×1×1 = 56 |
| Cámaras de seguridad | 4% | 2 (~$40-110k) | 4 | 1 (saturado) | 1 | Bajo — 4×2×4×1×1 = 32 |
| Materiales de obra | 4% | 3 (bolsas/kits, ticket medio) | 4 | 3 (media, pero mal fit de producto) | 3 (reformas de primavera) | Bajo — 4×3×4×3×3 = 432 pero **descartado por fit de producto**, no por puntaje: el cemento se compra en el corralón de la esquina, no hace sentido empujarlo con links de ML |
| Embalaje | 15% | — | — | — | — | **Descartado**: catálogo cero, no hay nada que rankear |

Las cuentas son un desempate relativo, no una fórmula exacta — el punto es
que Gastronomía/Hotelería gana por el combo comisión×ticket×competencia
nula, aunque pierda en demanda contra cafeteras/microondas: ahí la
competencia establecida hace casi imposible rankear rápido, mientras que
en gastronomía se puede ser el primer resultado bueno.

## Plan concreto — Gastronomía y Hotelería (equipamiento)

1. **`/categoria/equipamiento-gastronomico`** (nueva) — keywords:
   `freidora industrial`, `horno industrial`, `cocina industrial`,
   `horno pizzero`, `amasadora`, `cortadora de fiambre`, `exhibidora`,
   `plancha industrial`, `procesadora industrial`, `cafetera industrial`,
   `mesa de acero inoxidable`, `campana industrial` (son las mismas de
   `CATEGORY_COMMISSION_WEIGHT` en `bot/cazador_bot.py`, ya probadas). Sin
   necesidad de excluir mucho: son términos que casi no aparecen en uso
   doméstico.
2. **`/guias/que-horno-pizzero-comprar-para-mi-negocio`** — keyword: "qué
   horno pizzero comprar", "horno pizzero para negocio precio argentina",
   "horno pizzero a gas o eléctrico". Volumen bajo pero cero competencia:
   con contenido claro y honesto puede rankear rápido.
3. **`/guias/que-freidora-industrial-comprar`** — keyword: "freidora
   industrial precio argentina", "freidora industrial cuántos litros
   necesito". Ejemplo real de venta propia: pedido de $23.8k de comisión
   ya registrado en el panel (ver notas de `cazador_bot.py`).
4. **`/guias/cuanto-cuesta-equipar-un-foodtruck-o-local-de-comidas`** — guía
   ancla que suma todo el rubro (freidora, plancha, exhibidora, mesa de
   acero, cortadora de fiambre) por presupuesto, pensada para quien arranca
   un local o foodtruck. Es la que más chance tiene de que una IA la cite
   ("qué necesito para abrir un foodtruck en Argentina").
5. **`/mejores/mejores-hornos-pizzeros`** (comparativa, cuando el catálogo
   lo sostenga — revisar en 2-3 semanas si ya hay 3-4 productos simultáneos
   en `productos_rentables.json`/`seguimiento.json`; si no, dejar solo la
   categoría y las guías, que no dependen de tener muchos productos a la
   vez).
6. Ángulo de temporada aprovechable, sin fecha límite dura: en las 3-4
   semanas previas a Navidad crece la demanda de pasteleros/panaderos
   caseros que escalan producción (roscas, pan dulce) y necesitan una
   segunda amasadora o exhibidora — vale la pena un guiño en la guía ancla
   antes de esa fecha, no hace falta pieza nueva.
7. Etiqueta ML (`matt_word`): mantener `web` (convención del sitio). Sugerido
   solo si el dueño quiere medir el rubro aparte en el panel de afiliados:
   `web_gastronomia`.

## Qué NO hacer y riesgos

- **No prometer catálogo diario parejo**: 8 posts en 2.3 meses es ~1 cada
  8-9 días. Las páginas de categoría ya manejan el caso "sin ofertas hoy"
  con mensaje + CTA a `/` (mismo patrón que termotanques/parrillas), así que
  no queda vacía, pero hay que aceptar que no se va a actualizar todos los
  días como herramientas o colchones.
- **No mezclar con `/categoria/cocinas-y-hornos`**: esa página ya cubre
  cocinas/hornos domésticos; equipamiento gastronómico es otro público
  (dueño de local, no familia) y otro ticket. Si se mezclan, el SEO de
  ambas se diluye.
- **No abrir cafeteras, microondas ni cámaras de seguridad todavía**: buen
  catálogo y buena demanda, pero la competencia (mejorescompras.com.ar,
  productosvirales.com.ar y similares) ya tiene 3-4 páginas por rubro con
  meses de indexación. Entrar ahí hoy es pelear cuesta arriba por poco.
  Reconsiderar solo si el sitio ya tiene autoridad de dominio (revisar
  Search Console con 2-3 meses más de historia).
- **No empujar materiales de obra (cemento, membrana, revoque)**: buena
  demanda y catálogo razonable, pero mal fit de producto — se compra en el
  corralón del barrio, no por link de afiliado a Mercado Libre. Comisión
  baja (4%, estimada) además.
- **No abrir Embalaje**: cero ofertas en 1529 posts. El scraper de
  `/ofertas` de ML directamente no trae ese rubro; no hay nada para armar
  una página con catálogo real.
- **No inventar comisiones**: las de gastronomía y colchones están
  confirmadas en el panel de afiliados (ver `CLAUDE.md`); las de cámaras de
  seguridad y materiales de obra son estimaciones del propio código, sin
  ventas que las respalden — si aparecen ventas reales de esos rubros,
  avisar para ajustar `CATEGORY_COMMISSION_WEIGHT`.
- **Riesgo principal**: si en 3-4 semanas el catálogo de gastronomía sigue
  en 1 producto cada 8-9 días y no aparece ninguna venta en el panel, es
  señal de que el volumen es demasiado bajo para sostener el esfuerzo —
  reevaluar antes de invertir en la comparativa (paso 5 del plan).
