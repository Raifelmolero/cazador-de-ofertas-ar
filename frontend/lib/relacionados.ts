// Enlazado interno para bajar el rebote: de una ficha de precio a otras fichas
// de la misma categoría (en oferta hoy primero, ticket parecido) y, en los hubs,
// las 3 mejores ofertas de hoy. Todo sale de los datos del seguimiento y del
// catálogo del día; no hay precios fijos en texto.
import { COMPARATIVAS, indexable } from '@/lib/comparativas'
import type { OfertaLight } from '@/components/OfertaCard'
import { PRECIOS_HOY } from '@/lib/preciohoy'
import {
  categoriaDeSeguido,
  precioActual,
  seguidosDeCategoria,
  vigente,
  type Seguido,
} from '@/lib/seguimiento'

export interface ItemRelacionado {
  href: string
  titulo: string
  precio: number
  img: string | null
  enOferta: boolean
  enMinimo: boolean
}

export interface EnlaceExtra {
  href: string
  texto: string
}

const aItem = (s: Seguido): ItemRelacionado => ({
  href: `/precio/${s.slug}`,
  titulo: s.titulo,
  precio: precioActual(s),
  img: s.img,
  enOferta: vigente(s),
  enMinimo: vigente(s) && precioActual(s) <= s.min,
})

/** En oferta hoy primero; entre iguales, el ticket más cercano al de referencia. */
function ordenar(grupo: Seguido[], referencia: number) {
  const dist = (s: Seguido) => (referencia > 0 ? Math.abs(Math.log(precioActual(s) / referencia)) : 0)
  return [...grupo].sort(
    (a, b) => Number(vigente(b)) - Number(vigente(a)) || dist(a) - dist(b) || a.slug.localeCompare(b.slug),
  )
}

/** Fichas /precio parecidas a una ficha: misma categoría, ticket similar, en oferta primero. */
export function relacionadosDePrecio(s: Seguido, n = 4): ItemRelacionado[] {
  const cat = categoriaDeSeguido(s)
  if (!cat) return []
  return ordenar(
    seguidosDeCategoria(cat.slug).filter(x => x.id !== s.id),
    precioActual(s),
  )
    .slice(0, n)
    .map(aItem)
}

/** Links a páginas de decisión de la categoría: comparativa /mejores y /precio-hoy hermanas. */
export function extrasDeCategoria(catSlug: string | undefined, excluirPrecioHoy?: string): EnlaceExtra[] {
  if (!catSlug) return []
  const out: EnlaceExtra[] = []
  const comp = COMPARATIVAS.find(c => c.categoria === catSlug && indexable(c))
  if (comp) out.push({ href: `/mejores/${comp.slug}`, texto: `🏆 Comparativa: ${comp.nombre}` })
  for (const p of PRECIOS_HOY) {
    if (p.categoria === catSlug && p.slug !== excluirPrecioHoy) {
      out.push({ href: `/precio-hoy/${p.slug}`, texto: `Precio de ${p.nombre} hoy` })
    }
  }
  return out.slice(0, 4)
}

/**
 * Para /precio-hoy/[slug]: fichas de la misma categoría que no son de este
 * producto genérico, con ticket cercano a la referencia (mediana de la página).
 */
export function relacionadosDePrecioHoy(
  catSlug: string | undefined,
  excluirIds: Set<string>,
  referencia: number,
  n = 4,
): ItemRelacionado[] {
  if (!catSlug) return []
  return ordenar(
    seguidosDeCategoria(catSlug).filter(x => !excluirIds.has(x.id)),
    referencia,
  )
    .slice(0, n)
    .map(aItem)
}

/**
 * Las n ofertas con más descuento (mínimo histórico primero, que es el dato más
 * fuerte para comprar). Solo con descuento real o mínimo registrado.
 */
export function topDescuento<T extends OfertaLight>(ofertas: T[], n = 3): T[] {
  return ofertas
    .filter(o => o.minimo_historico || (o.descuento_pct ?? 0) > 0)
    .sort(
      (a, b) =>
        // ≥20 % OFF primero: un mínimo histórico con 7 % OFF no es "destacada".
        Number((b.descuento_pct ?? 0) >= 20) - Number((a.descuento_pct ?? 0) >= 20) ||
        Number(b.minimo_historico ?? false) - Number(a.minimo_historico ?? false) ||
        (b.descuento_pct ?? 0) - (a.descuento_pct ?? 0) ||
        b.precio_actual - a.precio_actual,
    )
    .slice(0, n)
}
