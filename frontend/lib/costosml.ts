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

/** Envío gratis de productos nuevos: costo por unidad según el peso (el mayor
 *  entre físico y volumétrico), con reputación verde, MercadoLíder o sin
 *  reputación: 30% de descuento debajo de $33.000 y 50% desde $33.000.
 *  Fuente: mercadolibre.com.ar/ayuda/40538 (leída el 27/09/2026). Acá solo
 *  hasta 10 kg; la tabla oficial sigue hasta más de 180 kg. Amarilla:
 *  ayuda/40545 (20% y 40%). Naranja o roja, sin descuento: ayuda/40547. */
export const ENVIO_GRATIS_VERIFICADO = '27 de septiembre de 2026'
export const ENVIO_GRATIS_VERDE: { peso: string; menos33: number; de33a50: number; desde50: number }[] = [
  { peso: 'Hasta 0,3 kg', menos33: 8666, de33a50: 6190, desde50: 6790 },
  { peso: 'De 0,3 a 0,5 kg', menos33: 9506, de33a50: 6790, desde50: 7290 },
  { peso: 'De 0,5 a 1 kg', menos33: 10906, de33a50: 7790, desde50: 8290 },
  { peso: 'De 1 a 1,5 kg', menos33: 11186, de33a50: 7990, desde50: 8590 },
  { peso: 'De 1,5 a 2 kg', menos33: 11606, de33a50: 8290, desde50: 8790 },
  { peso: 'De 2 a 3 kg', menos33: 12446, de33a50: 8890, desde50: 9590 },
  { peso: 'De 3 a 4 kg', menos33: 13706, de33a50: 9790, desde50: 10890 },
  { peso: 'De 4 a 5 kg', menos33: 15106, de33a50: 10790, desde50: 11890 },
  { peso: 'De 5 a 8 kg', menos33: 16506, de33a50: 11790, desde50: 13090 },
  { peso: 'De 8 a 10 kg', menos33: 17906, de33a50: 12790, desde50: 14190 },
]

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
