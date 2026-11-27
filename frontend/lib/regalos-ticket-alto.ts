// Regalos caros de Navidad (pedido del 27/11/2026): bloques destacados de notebooks, celulares y TV
// en /regalos-navidad y /regalos-navidad/[presupuesto]. Solo ofertas que ya están en los datos del
// repo (getOfertas vía ofertasDeCategoria: precio visto hace DIAS_VIGENCIA días o menos); nada
// inventado. Ticket alto = desde TICKET_ALTO_DESDE, el mismo umbral que usa el resto del sitio.
import { getCategoria, ofertasDeCategoria } from '@/lib/categorias'
import type { ProductWithMargins } from '@/lib/productos'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

export interface BloqueTicketAlto {
  id: string
  titulo: string
  emoji: string
  /** página del rubro que sigue viva todo el año */
  href: string
  total: number
  productos: ProductWithMargins[]
}

export const RUBROS_TICKET_ALTO = [
  { id: 'notebooks', categoria: 'notebooks', titulo: 'Notebooks', emoji: '💻', href: '/categoria/notebooks' },
  { id: 'celulares', categoria: 'celulares', titulo: 'Celulares', emoji: '📱', href: '/categoria/celulares' },
  { id: 'smart-tv', categoria: 'smart-tv', titulo: 'Smart TV', emoji: '📺', href: '/categoria/smart-tv' },
] as const

/** Bloques de ticket alto en el rango [min, max) de precio, de mayor a menor precio.
 *  Un producto no se repite entre bloques. Los bloques sin productos se devuelven con total 0. */
export function bloquesTicketAlto(por = 4, min = 0, max = Infinity): BloqueTicketAlto[] {
  const vistos = new Set<string>()
  const desde = Math.max(min, TICKET_ALTO_DESDE)
  return RUBROS_TICKET_ALTO.map(r => {
    const c = getCategoria(r.categoria)
    // El mismo modelo publicado por varios vendedores (mismo título): una sola tarjeta, la más barata.
    const porTitulo = new Map<string, ProductWithMargins>()
    for (const p of c ? ofertasDeCategoria(c) : []) {
      if (p.precio_actual < desde || p.precio_actual >= max || vistos.has(p.id_ml)) continue
      const t = p.titulo.trim().toLowerCase()
      const otro = porTitulo.get(t)
      if (!otro || p.precio_actual < otro.precio_actual) porTitulo.set(t, p)
    }
    const todos = [...porTitulo.values()].sort((a, b) => b.precio_actual - a.precio_actual)
    for (const p of todos) vistos.add(p.id_ml)
    return { id: r.id, titulo: r.titulo, emoji: r.emoji, href: r.href, total: todos.length, productos: todos.slice(0, por) }
  })
}
