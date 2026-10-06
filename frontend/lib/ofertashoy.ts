// Las ofertas de la home en formato liviano (solo lo que usa la grilla).
// La home manda las primeras en el HTML y el resto lo baja /ofertas-hoy.json
// después de pintar: el HTML pesaba ~600 KB y frenaba el celular.
import type { OfertaLight } from '@/components/OfertaCard'
import { getOfertas } from '@/lib/productos'
import { slugPorId } from '@/lib/seguimiento'
import { enCategoria, getCategoria } from '@/lib/categorias'

// "La caza del día" (la 1ª tarjeta) la ve casi todo el que entra desde la bio:
// que sea algo de casa con buen descuento, no equipamiento industrial.
export function conDestacada<T extends { titulo: string; descuento_pct?: number; minimo_historico?: boolean }>(lista: T[]): T[] {
  const gastro = getCategoria('equipamiento-gastronomico')
  const i = lista.findIndex(o => (!gastro || !enCategoria(gastro, o.titulo)) && ((o.descuento_pct ?? 0) >= 20 || o.minimo_historico))
  return i > 0 ? [lista[i], ...lista.slice(0, i), ...lista.slice(i + 1)] : lista
}

// Ticket alto: lo que más ganancia dejó (panel de afiliados 28/09-05/10: colchones,
// sommiers y herramientas al 15%; un colchón de $86k en 2 ventas). Se sube
// arriba de la grilla sin cambiar el orden interno (que ya es por ganancia
// esperada). Equipamiento gastronómico/industrial no cuenta: no es compra de casa.
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'
export { TICKET_ALTO_DESDE }
export function esTicketAlto(titulo: string, precio: number): boolean {
  const gastro = getCategoria('equipamiento-gastronomico')
  if (gastro && enCategoria(gastro, titulo)) return false
  if (precio >= TICKET_ALTO_DESDE) return true
  return ['colchones', 'herramientas-electricas'].some(slug => {
    const c = getCategoria(slug)
    return !!c && enCategoria(c, titulo)
  })
}

export function ticketAltoPrimero<T extends { titulo: string; precio_actual: number }>(lista: T[]): T[] {
  const alto = lista.filter(o => esTicketAlto(o.titulo, o.precio_actual))
  if (alto.length === 0) return lista
  return [...alto, ...lista.filter(o => !esTicketAlto(o.titulo, o.precio_actual))]
}

export function ofertasHoyLight(): OfertaLight[] {
  const historial = slugPorId()
  return conDestacada(ticketAltoPrimero(getOfertas())).map(o => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    historial: historial[o.id_ml],
  }))
}
