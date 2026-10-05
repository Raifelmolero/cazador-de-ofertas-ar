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

export function ofertasHoyLight(): OfertaLight[] {
  const historial = slugPorId()
  return conDestacada(getOfertas()).map(o => ({
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
