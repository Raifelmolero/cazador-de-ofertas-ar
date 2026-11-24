import type { OfertaLight } from '@/components/OfertaCard'
import datos from '@/data/top-concurso.json'

// El JSON público guarda `matt_word=repo`; el sitio usa `web` (igual que lib/productos).
const TOP: OfertaLight[] = (datos.items as OfertaLight[]).map(o => ({
  ...o,
  url_producto: o.url_producto.replace('matt_word=repo', 'matt_word=web'),
}))
const POR_ID = new Map(TOP.map(o => [o.id_ml, o]))
const RETIRADOS = new Set<string>(datos.retirados)

/** Top del concurso 21-23/11: precios releídos a mano (data/top-concurso.json). */
export function topConcurso(): OfertaLight[] {
  return TOP
}

interface Corregible {
  id_ml: string
  precio_actual: number
  precio_anterior?: number
  descuento_pct?: number
  minimo_historico?: boolean
  precio_visto?: string
}

/**
 * Los productos del top se repiten en otros bloques de /hoy y /black-friday, y el catálogo trae
 * el tachado de ML como si fuera descuento (corrección 21/11). Acá toman el precio releído, sin
 * tachado ni sello de mínimo, y con % solo si está en el JSON. Si el catálogo tiene una lectura
 * más nueva, vale ese precio, pero sigue sin %.
 */
export function corregirConcurso<T extends Corregible>(lista: T[]): T[] {
  return lista
    .filter(o => !RETIRADOS.has(o.id_ml))
    .map(o => {
      const top = POR_ID.get(o.id_ml)
      if (!top) return o
      const masNuevo = (o.precio_visto ?? '') > (top.precio_visto ?? '')
      return {
        ...o,
        precio_actual: masNuevo ? o.precio_actual : top.precio_actual,
        precio_visto: masNuevo ? o.precio_visto : top.precio_visto,
        descuento_pct: masNuevo ? undefined : top.descuento_pct,
        precio_anterior: undefined,
        minimo_historico: false,
      }
    })
}
