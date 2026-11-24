// Enlazado interno hacia las landings de Black Friday (lib/black-friday-landings.ts).
// Pedido del 23/11/2026: en las 10 páginas /mejor, /mejores, /guias y /precio-hoy más
// cercanas a notebooks, celulares, TV y aires, un bloque chico amarillo arriba de todo
// que lleva a la landing BF del rubro. Se apaga solo después del 30/11 (hora Argentina).
// Sin precios, porcentajes ni cupones: solo el link.

/** Primer instante en que el bloque ya no se muestra: 01/12/2026 00:00 ART. */
export const FIN_AVISO_BF = '2026-12-01T00:00:00-03:00'

export const FIN_AVISO_BF_MS = new Date(FIN_AVISO_BF).getTime()

export function avisoBFVigente(ahora: number = Date.now()): boolean {
  return ahora < FIN_AVISO_BF_MS
}

export interface DestinoBF {
  /** slug de la landing (/mejores/<slug>) */
  slug: string
  /** texto del link */
  texto: string
}

const NOTEBOOKS: DestinoBF = { slug: 'black-friday-notebooks', texto: 'Ver las notebooks que elegimos' }
const CELULARES: DestinoBF = { slug: 'black-friday-celulares', texto: 'Ver los celulares que elegimos' }
const TV: DestinoBF = { slug: 'black-friday-smart-tv', texto: 'Ver los smart TV que elegimos' }
const AIRES: DestinoBF = { slug: 'black-friday-aires-acondicionados', texto: 'Ver los aires que elegimos' }

/** Ruta de la página → landing BF del rubro. Son exactamente 10. */
export const AVISO_BF_POR_RUTA: Record<string, DestinoBF> = {
  '/mejores/mejores-notebooks': NOTEBOOKS,
  '/guias/que-notebook-comprar-black-friday': NOTEBOOKS,
  '/precio-hoy/notebook': NOTEBOOKS,
  '/mejores/mejores-celulares': CELULARES,
  '/guias/que-celular-comprar-black-friday': CELULARES,
  '/precio-hoy/iphone': CELULARES,
  '/mejores/mejores-smart-tv': TV,
  '/guias/que-smart-tv-comprar-black-friday': TV,
  '/precio-hoy/smart-tv-55-pulgadas': TV,
  '/mejor/aires-acondicionados': AIRES,
}

export function destinoBF(ruta: string): DestinoBF | undefined {
  return AVISO_BF_POR_RUTA[ruta]
}

/** Bloque compacto de enlaces a /black-friday y a TODAS las landings /mejores/black-friday-*
 *  (components/EnlacesBF.tsx), pedido del 24/11/2026: las 9 páginas top de Search Console con
 *  bloque destacado (lib/cta-destacados.ts, lotes 1 y 2). El valor es la landing del rubro de la
 *  página, que va primera; el resto sigue en el orden de LANDINGS_BF. Se apaga con FIN_AVISO_BF. */
export const ENLACES_BF_POR_RUTA: Record<string, string> = {
  '/guias/samsung-galaxy-a-o-s-cual-conviene': 'black-friday-celulares',
  '/guias/que-motorola-comprar-moto-g-o-edge': 'black-friday-celulares-baratos',
  '/guias/que-xiaomi-redmi-comprar': 'black-friday-celulares-baratos',
  '/guias/mejor-celular-para-jugar': 'black-friday-gaming',
  '/precio-hoy/iphone': 'black-friday-celulares',
  '/guias/que-cocina-comprar': 'black-friday-heladeras',
  '/guias/google-tv-roku-tizen-o-webos-cual-conviene': 'black-friday-smart-tv',
  '/precio-hoy/smart-tv-32-pulgadas': 'black-friday-smart-tv',
  '/precio-hoy/samsung-galaxy-s': 'black-friday-celulares',
}

/** Slugs de landings ordenados para la ruta (la del rubro primero), o [] si la ruta no lleva bloque. */
export function ordenEnlacesBF(ruta: string, slugs: string[]): string[] {
  const primero = ENLACES_BF_POR_RUTA[ruta]
  if (!primero) return []
  return [...slugs.filter(s => s === primero), ...slugs.filter(s => s !== primero)]
}
