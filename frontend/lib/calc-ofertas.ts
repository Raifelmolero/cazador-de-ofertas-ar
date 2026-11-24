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

/** Calculadora de consumo eléctrico (cazadordeofertas.com.ar, lote ctr-cta 24/11: 1.510 imp /
 *  0,33 % de CTR en 28 días): mismo bloque, con equipos que gastan menos luz (aire inverter,
 *  heladera inverter no frost, lavarropas). Sin BGH ni Likon: lo filtra ofertasDeRubros. */
export const RUBROS_CONSUMO = ['black-friday-aires-acondicionados', 'black-friday-heladeras', 'black-friday-lavarropas'] as const

/** Likon y su id (MLA80862058) tampoco van en estos bloques, además de MARCAS_PROHIBIDAS. */
const EXCLUIDAS_EXTRA = /\blikon\b/i
const IDS_EXCLUIDOS = new Set(['MLA80862058'])

/** Primer producto con foto de cada landing BF de `rubros`, hasta `max`. */
export function ofertasDeRubros(rubros: readonly string[], max: number): OfertaCalc[] {
  const out: OfertaCalc[] = []
  for (const slug of rubros) {
    const l = getLandingBF(slug)
    if (!l) continue
    const p = productosBF(l).find(
      x => x.img && !MARCAS_PROHIBIDAS.test(x.nombre) && !EXCLUIDAS_EXTRA.test(x.nombre) && !IDS_EXCLUIDOS.has(x.id),
    )
    if (p) out.push({ slug, rubro: l.rubro, emoji: l.emoji, producto: p })
    if (out.length >= max) break
  }
  return out
}

let cache: OfertaCalc[] | null = null

export function ofertasCalculadora(): OfertaCalc[] {
  cache ??= ofertasDeRubros(RUBROS_CALC, MAX_OFERTAS_CALC)
  return cache
}

let cacheConsumo: OfertaCalc[] | null = null

export function ofertasConsumo(): OfertaCalc[] {
  cacheConsumo ??= ofertasDeRubros(RUBROS_CONSUMO, RUBROS_CONSUMO.length)
  return cacheConsumo
}
