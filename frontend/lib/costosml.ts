// Costos de vender en Mercado Libre Argentina, vigentes desde el 1/09/2026.
// Fuente: mercadolibre.com.ar/ayuda/Costos-de-vender-un-producto_870 y
// mercadolibre.com.ar/ayuda/42400 (leídas el 27/09/2026). Si ML los cambia,
// actualizar acá: la calculadora y las guías de /vender salen de este archivo.

export const COSTOS_VERIFICADOS = '27 de septiembre de 2026'
export const COSTOS_VIGENCIA = '1 de septiembre de 2026'
export const FUENTE_COSTOS = 'https://www.mercadolibre.com.ar/ayuda/Costos-de-vender-un-producto_870'
export const SIMULADOR_ML = 'https://www.mercadolibre.com.ar/simulador-de-costos'

/** Cargo por vender: porcentaje del precio, según categoría y provincia. */
export const CARGO_MIN = 11.62
export const CARGO_MAX = 17.75

/** El costo fijo por unidad aplica solo por debajo de este precio. */
export const UMBRAL_COSTO_FIJO = 33000

/** Costo fijo por unidad con Envíos Flex, acuerdo con el comprador o retiro
 *  (depende solo del precio). Con Full, correo o colecta depende también del
 *  peso: para hasta 0,3 kg coincide con esta tabla y sube levemente con el peso. */
export const COSTO_FIJO_FLEX: { hasta: number; costo: number }[] = [
  { hasta: 14999, costo: 1330 },
  { hasta: 23999, costo: 2740 },
  { hasta: 32999, costo: 3320 },
]

export function costoFijo(precio: number): number {
  if (precio >= UMBRAL_COSTO_FIJO) return 0
  return COSTO_FIJO_FLEX.find(t => precio <= t.hasta)?.costo ?? 0
}

/** Cargo de referencia cuando no sabemos la categoría exacta: el punto medio
 *  del rango oficial. Lo usan las fichas de /calculadora/[id]. */
export const CARGO_REFERENCIA = 14.69 // punto medio del rango (igual en bot/cazador_bot.py)

/** Lo que te deposita ML por una venta sin cuotas propias, antes del envío y
 *  de tus impuestos: precio − cargo de referencia − costo fijo. */
export function netoML(precio: number, cargoPct: number = CARGO_REFERENCIA): number {
  return precio - (precio * cargoPct) / 100 - costoFijo(precio)
}

export interface OpcionCuotas {
  id: string
  nombre: string
  pct: number
}

/** Costo adicional por ofrecer cuotas (sobre el precio). */
export const CUOTAS: OpcionCuotas[] = [
  { id: 'sin', nombre: 'Sin cuotas propias (solo las del banco)', pct: 0 },
  { id: 'interes-bajo', nombre: 'Cuotas con interés bajo (3 a 12)', pct: 5 },
  { id: '3', nombre: '3 cuotas al mismo precio', pct: 8.9 },
  { id: '6', nombre: '6 cuotas al mismo precio', pct: 13.4 },
  { id: '9', nombre: '9 cuotas al mismo precio', pct: 17.8 },
  { id: '12', nombre: '12 cuotas al mismo precio', pct: 21.6 },
]

export interface Resultado {
  cargo: number
  cuotas: number
  fijo: number
  totalML: number
  recibis: number
  ganancia: number
  margenPct: number | null
}

export function calcular(o: {
  precio: number
  cargoPct: number
  cuotasPct: number
  envio: number
  costo: number
}): Resultado {
  const cargo = (o.precio * o.cargoPct) / 100
  const cuotas = (o.precio * o.cuotasPct) / 100
  const fijo = costoFijo(o.precio)
  const totalML = cargo + cuotas + fijo
  const recibis = o.precio - totalML - o.envio
  const ganancia = recibis - o.costo
  return {
    cargo,
    cuotas,
    fijo,
    totalML,
    recibis,
    ganancia,
    margenPct: o.precio > 0 ? (ganancia / o.precio) * 100 : null,
  }
}
