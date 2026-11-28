// Las ofertas de la home en formato liviano (solo lo que usa la grilla).
// La home manda las primeras en el HTML y el resto lo baja /ofertas-hoy.json
// después de pintar: el HTML pesaba ~600 KB y frenaba el celular.
import type { OfertaLight } from '@/components/OfertaCard'
import { getOfertas } from '@/lib/productos'
import { corregirConcurso } from '@/lib/topconcurso'
import { seguidoPorId, slugPorId } from '@/lib/seguimiento'
import { BAJO_PROMEDIO_PCT, leerPrecio, muestrear } from '@/lib/lectura-precio'
import { enCategoria, getCategoria } from '@/lib/categorias'
import { esExcluidaDeDestacados, sinOmen } from '@/lib/prioridades'
import { RUBROS_FILTRO } from '@/lib/rubros-filtro'

/** slug del filtro rápido de /hoy al que pertenece el título (misma regla que /categoria). */
function rubroDe(titulo: string): string | undefined {
  return RUBROS_FILTRO.find(r => {
    const c = getCategoria(r.slug)
    return !!c && enCategoria(c, titulo)
  })?.slug
}

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
  // Lo que tendencias-hoy.md manda sacar (data/categorias-prioritarias.json)
  // baja al final de la grilla en vez de encabezarla.
  const ordenadas = ticketAltoPrimero(corregirConcurso(getOfertas()))
  const sacar = ordenadas.filter(esExcluidaDeDestacados)
  const lista = sacar.length ? [...ordenadas.filter(o => !esExcluidaDeDestacados(o)), ...sacar] : ordenadas
  return conDestacada(sinOmen(lista)).map(o => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    precio_visto: o.precio_visto,
    historial: historial[o.id_ml],
    rubro: rubroDe(o.titulo),
    vs_promedio: vsPromedio(o.id_ml, o.precio_actual),
  }))
}

/** % por debajo de NUESTRO promedio (≥ BAJO_PROMEDIO_PCT y con ≥ 3 días de serie); si no, nada. */
function vsPromedio(id: string, precio: number): number | undefined {
  const s = seguidoPorId(id)
  const l = s ? leerPrecio(precio, s.serie, s.min) : null
  return l && l.vsPromedioPct >= BAJO_PROMEDIO_PCT ? l.vsPromedioPct : undefined
}

/**
 * Mini gráfico de las tarjetas: solo para las que van en el HTML (la home pasa las primeras),
 * así /ofertas-hoy.json no engorda. Últimos 30 días de serie, hasta 12 puntos, y el precio de
 * hoy al final si es distinto del último registrado.
 */
export function conSpark(lista: OfertaLight[]): OfertaLight[] {
  return lista.map(o => {
    const s = seguidoPorId(o.id_ml)
    if (!s || s.serie.length < 3) return o
    const precios = s.serie.slice(-30).map(p => p[1])
    if (Math.round(precios[precios.length - 1]) !== Math.round(o.precio_actual)) precios.push(o.precio_actual)
    return { ...o, spark: muestrear(precios) }
  })
}
