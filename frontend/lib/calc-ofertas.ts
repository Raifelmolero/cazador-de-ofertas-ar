// Ofertas debajo del resultado de la calculadora (calculadoraml.com.ar, etiqueta calcml).
// Pedido del 23/11/2026: 168 clics y 0 ventas por semana con calcml. Los que usan la
// calculadora también compran: les mostramos el producto principal de 4 landings de
// Black Friday (lib/black-friday-landings.ts), con su botón de afiliado.
// Reglas: solo productos y links que ya están en los datos del repo (productosBF los
// arma desde el catálogo y descarta BGH/HP/OMEN/Victus y los que no tienen link de
// afiliado). Sin precio, %, tachados ni cupones: el precio lo ven en ML.
import { getLandingBF, productosBF, MARCAS_PROHIBIDAS, type ProductoBF } from '@/lib/black-friday-landings'

/** Rubros en orden: de cada landing sale su primer producto con foto. */
export const RUBROS_CALC = ['black-friday-notebooks', 'black-friday-celulares', 'black-friday-smart-tv', 'black-friday-lavarropas'] as const

export const MAX_OFERTAS_CALC = 4

export interface OfertaCalc {
  slug: string
  rubro: string
  emoji: string
  producto: ProductoBF
}

let cache: OfertaCalc[] | null = null

export function ofertasCalculadora(): OfertaCalc[] {
  if (cache) return cache
  const out: OfertaCalc[] = []
  for (const slug of RUBROS_CALC) {
    const l = getLandingBF(slug)
    if (!l) continue
    const p = productosBF(l).find(x => x.img && !MARCAS_PROHIBIDAS.test(x.nombre))
    if (p) out.push({ slug, rubro: l.rubro, emoji: l.emoji, producto: p })
    if (out.length >= MAX_OFERTAS_CALC) break
  }
  cache = out
  return out
}
