// Costos de vender con una tienda propia en Tiendanube (Argentina).
// Fuente: tiendanube.com/planes-y-precios y tiendanube.com/pago-nube
// (leídas el 27/09/2026). Si Tiendanube los cambia, actualizar acá: la
// calculadora /mercado-libre-vs-tiendanube sale de este archivo.
//
// Las tarifas de Pago Nube se publican "a partir de" (son las mínimas) y
// + IVA. Con Pago Nube el costo por transacción de Tiendanube está bonificado.

export const TN_VERIFICADO = '27 de septiembre de 2026'
export const FUENTE_PLANES_TN = 'https://www.tiendanube.com/planes-y-precios'
export const FUENTE_PAGO_NUBE = 'https://www.tiendanube.com/pago-nube'

/** IVA que se suma a la tarifa de Pago Nube. */
export const IVA_PCT = 21

/** Costo por transacción de Tiendanube cobrando con Pago Nube: bonificado. */
export const COSTO_TRANSACCION_PAGO_NUBE = 0

export type PlazoTarjeta = 1 | 7 | 14
export const PLAZOS_TARJETA: PlazoTarjeta[] = [14, 7, 1]

export interface PlanTN {
  id: 'inicial' | 'esencial' | 'impulso' | 'escala'
  nombre: string
  /** Abono mensual en pesos. */
  abono: number
  /** Tarifa Pago Nube con tarjeta de crédito o débito, % sin IVA, por plazo de acreditación en días. */
  tarjeta: Record<PlazoTarjeta, number>
  /** Tarifa Pago Nube con transferencia, % sin IVA. */
  transferencia: number
}

export const PLANES_TN: PlanTN[] = [
  { id: 'inicial', nombre: 'Inicial', abono: 0, tarjeta: { 1: 6.4, 7: 4.45, 14: 3.5 }, transferencia: 1.5 },
  { id: 'esencial', nombre: 'Esencial', abono: 27999, tarjeta: { 1: 6.09, 7: 4.39, 14: 3.49 }, transferencia: 1.5 },
  { id: 'impulso', nombre: 'Impulso', abono: 79999, tarjeta: { 1: 5.89, 7: 4.19, 14: 3.29 }, transferencia: 0.99 },
  { id: 'escala', nombre: 'Escala', abono: 244999, tarjeta: { 1: 5.59, 7: 3.89, 14: 2.99 }, transferencia: 0.85 },
]

export type MedioTN = 'tarjeta' | 'transferencia'

/** Tarifa de Pago Nube sin IVA, en %. */
export function tarifaPagoNube(plan: PlanTN, medio: MedioTN, plazo: PlazoTarjeta = 14): number {
  return medio === 'tarjeta' ? plan.tarjeta[plazo] : plan.transferencia
}

/** Tarifa de Pago Nube con el IVA incluido, en % del precio. */
export function tarifaConIva(pctSinIva: number): number {
  return pctSinIva * (1 + IVA_PCT / 100)
}

export interface ResultadoTN {
  tarifaPct: number
  tarifaConIvaPct: number
  comision: number
  transaccion: number
  recibis: number
  ganancia: number
}

/** Una venta en Tiendanube cobrada con Pago Nube (sin envío ni cuotas). */
export function calcularTN(o: {
  precio: number
  costo: number
  plan: PlanTN
  medio: MedioTN
  plazo?: PlazoTarjeta
}): ResultadoTN {
  const tarifaPct = tarifaPagoNube(o.plan, o.medio, o.plazo)
  const tarifaConIvaPct = tarifaConIva(tarifaPct)
  const comision = (o.precio * tarifaConIvaPct) / 100
  const transaccion = (o.precio * COSTO_TRANSACCION_PAGO_NUBE) / 100
  const recibis = o.precio - comision - transaccion
  return { tarifaPct, tarifaConIvaPct, comision, transaccion, recibis, ganancia: recibis - o.costo }
}

/**
 * Ventas por mes que necesitás para que el abono del plan se pague con lo
 * que te ahorrás por venta frente a Mercado Libre. 0 si el plan es gratis;
 * null si en Tiendanube no te ahorrás nada por venta (nunca se paga solo).
 */
export function puntoEquilibrio(abono: number, ahorroPorVenta: number): number | null {
  if (abono <= 0) return 0
  if (ahorroPorVenta <= 0) return null
  return Math.ceil(abono / ahorroPorVenta)
}
