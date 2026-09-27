// Costo de ofrecer cuotas sin interés en Mercado Libre Argentina, para el
// vendedor. Usa solo los datos de costosml.ts (CUOTAS, calcular, costoFijo):
// compara lo que te deposita ML sin cuotas propias contra lo que te deposita
// ofreciendo cuotas, y calcula el precio que iguala el depósito.
import { COSTO_FIJO_FLEX, CUOTAS, calcular, costoFijo } from './costosml'

export interface ResultadoCuotas {
  pctCuotas: number
  costoCuotas: number // lo que ML te descuenta por ofrecer las cuotas
  recibisSin: number // depósito sin cuotas propias
  recibisCon: number // depósito ofreciendo las cuotas al mismo precio
  precioIgual: number // precio con cuotas para que te depositen lo mismo que sin cuotas
  subaPct: number // cuánto sube el precio, en %
}

/** Precio mínimo (entero) p tal que p − cargo − cuotas − costoFijo(p) ≥ objetivo. */
export function precioParaDepositar(objetivo: number, cargoPct: number, cuotasPct: number): number {
  const factor = 1 - (cargoPct + cuotasPct) / 100
  const fijos = [0, ...COSTO_FIJO_FLEX.map(t => t.costo)]
  const candidatos = fijos
    .map(f => Math.ceil((objetivo + f) / factor))
    .filter(p => p * factor - costoFijo(p) >= objetivo - 1e-6)
  return Math.min(...candidatos)
}

export function calcularCuotas(precio: number, cuotasId: string, cargoPct: number): ResultadoCuotas | null {
  const op = CUOTAS.find(c => c.id === cuotasId)
  if (!op || !(precio > 0)) return null
  const sin = calcular({ precio, cargoPct, cuotasPct: 0, envio: 0, costo: 0 })
  const con = calcular({ precio, cargoPct, cuotasPct: op.pct, envio: 0, costo: 0 })
  const precioIgual = op.pct === 0 ? precio : precioParaDepositar(sin.recibis, cargoPct, op.pct)
  return {
    pctCuotas: op.pct,
    costoCuotas: con.cuotas,
    recibisSin: sin.recibis,
    recibisCon: con.recibis,
    precioIgual,
    subaPct: ((precioIgual - precio) / precio) * 100,
  }
}
