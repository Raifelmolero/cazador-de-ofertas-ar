// Destino de las cajas de producto de /guias/[slug]: cada guía lleva a su
// comparativa (/mejores/*), a las landings (/ofertas/*) del rubro y a la búsqueda
// en ML con link de afiliado. Todo sale de datos existentes (lib/comparativas,
// lib/landings, categoría de la guía): no se inventa ningún slug.
import { busquedaML } from '@/lib/afiliado'
import { COMPARATIVAS, getComparativa, indexable, type Comparativa } from '@/lib/comparativas'
import type { Guia } from '@/lib/guias'
import { landingsDeGuia } from '@/lib/landings'
import type { EnlaceCta } from '@/components/CtaCalculadora'

const slugDeMejores = (href?: string) => href?.match(/^\/mejores\/([a-z0-9-]+)\/?(?:[?#].*)?$/)?.[1]

/** Comparativa que corresponde a la guía (campo propio, botón final, links
 *  destacados, o la comparativa de su misma categoría). */
export function comparativaDeGuia(g: Guia): Comparativa | undefined {
  const candidatos = [
    g.comparativa,
    slugDeMejores(g.cta?.href),
    ...(g.enlaces ?? []).map(e => slugDeMejores(e.href)),
  ]
  for (const slug of candidatos) {
    const c = slug ? getComparativa(slug) : undefined
    if (c) return c
  }
  const porGuia = COMPARATIVAS.find(c => c.guia === g.slug)
  if (porGuia) return porGuia
  if (g.categoria) return COMPARATIVAS.find(c => c.categoria === g.categoria?.slug && indexable(c))
  return undefined
}

export interface CtaGuia {
  nombre: string
  ml: EnlaceCta
  internos: EnlaceCta[]
}

/** Datos de las cajas de producto, o null si la guía no tiene rubro de producto
 *  (ej. guías de método): ahí no hay a dónde llevar sin inventar. */
export function ctaDeGuia(g: Guia): CtaGuia | null {
  const comp = comparativaDeGuia(g)
  const nombre = comp?.nombre ?? g.categoria?.nombre
  if (!nombre) return null
  const internos: EnlaceCta[] = []
  if (comp && indexable(comp)) internos.push({ href: `/mejores/${comp.slug}`, texto: `Comparativa de ${comp.nombre}` })
  else if (g.categoria) internos.push({ href: `/categoria/${g.categoria.slug}`, texto: `${g.categoria.nombre} en oferta` })
  for (const l of landingsDeGuia(g).slice(0, 2)) {
    internos.push({ href: `/ofertas/${l.slug}`, texto: l.nombre.charAt(0).toUpperCase() + l.nombre.slice(1) })
  }
  return { nombre, ml: { href: busquedaML(nombre), texto: `Ver ${nombre} en Mercado Libre` }, internos }
}
