// Links a páginas afines para el estado "hoy no hay ofertas" de una página de
// rubro (ver components/SinOfertas): que una grilla vacía nunca sea un callejón
// sin salida. Prioriza lo que SÍ tiene contenido hoy: comparativas indexables
// del rubro, la guía de compra y categorías afines con ofertas.
import { CATEGORIAS, ofertasDeCategoria } from '@/lib/categorias'
import { COMPARATIVAS, indexable } from '@/lib/comparativas'
import { GUIAS } from '@/lib/guias'
import { NICHOS } from '@/lib/nichos'

export interface EnlaceAfin {
  href: string
  texto: string
}

let ofertasPorCategoria: Map<string, number> | null = null
function cantidadOfertas(slug: string) {
  if (!ofertasPorCategoria) {
    ofertasPorCategoria = new Map(CATEGORIAS.map(c => [c.slug, ofertasDeCategoria(c).length]))
  }
  return ofertasPorCategoria.get(slug) ?? 0
}

/**
 * @param categoria slug de /categoria/* de la página (si tiene): sus comparativas
 *   y guía van primero y las categorías que comparten nicho se priorizan.
 */
export function enlacesAfines({ categoria, max = 6 }: { categoria?: string; max?: number } = {}): EnlaceAfin[] {
  const out: EnlaceAfin[] = []
  const agregar = (e: EnlaceAfin) => {
    if (out.length < max && !out.some(x => x.href === e.href)) out.push(e)
  }

  if (categoria) {
    for (const c of COMPARATIVAS) {
      if (c.categoria === categoria && indexable(c)) agregar({ href: `/mejores/${c.slug}`, texto: `🏆 Comparativa: ${c.nombre}` })
    }
    const guia = GUIAS.find(g => g.categoria?.slug === categoria)
    if (guia) agregar({ href: `/guias/${guia.slug}`, texto: `📘 ${guia.titulo}` })
  }

  const propios = new Set(NICHOS.filter(n => categoria && n.categorias.includes(categoria)).flatMap(n => n.categorias))
  const afines = CATEGORIAS.filter(c => c.slug !== categoria)
    .map((c, i) => ({ c, n: cantidadOfertas(c.slug), comparte: propios.has(c.slug), i }))
    // Con ofertas primero (no mandar a otra grilla vacía), después las del mismo
    // nicho y, entre iguales, las que más ofertas tienen.
    .sort((a, b) => Number(b.n > 0) - Number(a.n > 0) || Number(b.comparte) - Number(a.comparte) || b.n - a.n || a.i - b.i)
  for (const { c, n } of afines) {
    agregar({ href: `/categoria/${c.slug}`, texto: n > 0 ? `${c.nombre} (${n} hoy)` : c.nombre })
  }

  return out
}
