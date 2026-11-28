// Filtro rápido por categoría de /hoy. Módulo puro (lo importa la grilla, que corre en el navegador).
// `slug` es el de lib/categorias: la regla de qué entra en cada rubro es la misma que en /categoria.
export const RUBROS_FILTRO = [
  { slug: 'notebooks', label: '💻 Notebooks' },
  { slug: 'smart-tv', label: '📺 Smart TV' },
  { slug: 'aire-acondicionado', label: '❄️ Aires' },
  { slug: 'celulares', label: '📱 Celulares' },
  { slug: 'heladeras', label: '🧊 Heladeras' },
  { slug: 'colchones', label: '🛏️ Colchones' },
  { slug: 'herramientas-electricas', label: '🛠️ Herramientas' },
  { slug: 'bicicletas', label: '🚲 Bicis' },
] as const

/** Presupuesto (rediseño 27/11): «hasta» incluye los más baratos. `?presupuesto=<slug>` en la URL. */
export const PRESUPUESTOS_FILTRO = [
  { slug: 'hasta-50000', label: 'Hasta $50.000', min: 0, max: 50_000 },
  { slug: 'hasta-200000', label: 'Hasta $200.000', min: 0, max: 200_000 },
  { slug: 'hasta-1000000', label: 'Hasta $1.000.000', min: 0, max: 1_000_000 },
  { slug: 'mas-de-1000000', label: 'Más de $1.000.000', min: 1_000_001, max: Infinity },
] as const

export type PresupuestoId = (typeof PRESUPUESTOS_FILTRO)[number]['slug']

export function enPresupuesto(precio: number, slug: PresupuestoId | 'all') {
  if (slug === 'all') return true
  const p = PRESUPUESTOS_FILTRO.find(x => x.slug === slug)
  return !p || (precio >= p.min && precio <= p.max)
}

/** Evento que mandan los chips del hero (components/ChipsHero) y escucha la grilla (OfertasGrid). */
export const EVENTO_FILTRO = 'cz:filtro'
export type DetalleFiltro = { presupuesto?: PresupuestoId; rubro?: string; minimos?: boolean }

/**
 * Cuántas ofertas de la grilla van en el HTML de la home; el resto lo baja la grilla de
 * /ofertas-hoy.json al pintar. Vive acá (módulo puro) y NO en OfertasGrid: importada desde un
 * archivo 'use client', en el servidor llegaba como referencia de cliente en vez de número,
 * `slice(0, …)` daba [] y la home salía sin ninguna tarjeta en el HTML (bug hasta el 28/11).
 */
export const OFERTAS_EN_HTML = 24
