// Lectura del historial de precios (rediseño 27/11): «¿es buen momento para comprar?».
// Módulo puro (sin fs). Todo sale de NUESTRO historial (data/seguimiento.json), nunca del
// precio tachado de ML: si no hay datos suficientes, no hay veredicto ni badge.

/** Mínimo de días con precio para animarse a decir algo del promedio. */
export const DIAS_MINIMOS = 3
/** Por debajo del promedio en al menos este % → «Buen precio». */
export const BAJO_PROMEDIO_PCT = 5
/** Por encima del promedio en al menos este % → «Está caro». */
export const SOBRE_PROMEDIO_PCT = 5

export type Veredicto = 'minimo' | 'bueno' | 'normal' | 'caro'

export interface Lectura {
  veredicto: Veredicto
  promedio: number
  /** % por debajo del promedio (positivo = más barato que el promedio); redondeado */
  vsPromedioPct: number
  dias: number
}

export function promedio(precios: number[]) {
  return precios.reduce((a, b) => a + b, 0) / precios.length
}

/**
 * `actual` contra la serie diaria y el mínimo registrado. null si hay menos de DIAS_MINIMOS días.
 * «minimo» = igual o por debajo del mínimo registrado.
 */
export function leerPrecio(actual: number, serie: [string, number][], min: number): Lectura | null {
  const precios = serie.map(p => p[1]).filter(n => Number.isFinite(n) && n > 0)
  if (precios.length < DIAS_MINIMOS || !(actual > 0)) return null
  const prom = promedio(precios)
  const vsPromedioPct = Math.round(((prom - actual) / prom) * 100)
  const veredicto: Veredicto =
    actual <= min ? 'minimo' : vsPromedioPct >= BAJO_PROMEDIO_PCT ? 'bueno' : -vsPromedioPct >= SOBRE_PROMEDIO_PCT ? 'caro' : 'normal'
  return { veredicto, promedio: prom, vsPromedioPct, dias: precios.length }
}

/** Hasta `n` puntos repartidos parejo (siempre incluye el primero y el último), para el mini gráfico. */
export function muestrear(precios: number[], n = 12): number[] {
  if (precios.length <= n) return precios.map(Math.round)
  const out: number[] = []
  for (let i = 0; i < n; i++) out.push(Math.round(precios[Math.round((i * (precios.length - 1)) / (n - 1))]))
  return out
}
