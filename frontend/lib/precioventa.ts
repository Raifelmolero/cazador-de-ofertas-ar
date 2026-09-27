// Calculadora inversa: a qué precio publicar en Mercado Libre para ganar lo que
// querés. El costo fijo por unidad depende del precio (bandas y umbral de
// $33.000), así que no alcanza con una fórmula: se prueba cada banda y se
// queda con el precio más bajo que cae dentro de la banda que asumió.

import { COSTO_FIJO_FLEX, UMBRAL_COSTO_FIJO, calcular, costoFijo } from './costosml'

export interface EntradaPrecio {
  costo: number
  ganancia: number // en pesos
  cargoPct: number
  cuotasPct: number
  envio: number
}

export interface Banda {
  desde: number
  hasta: number // Infinity para la banda sin costo fijo
  fijo: number
}

export const BANDAS: Banda[] = [
  ...COSTO_FIJO_FLEX.map((t, i) => ({ desde: i === 0 ? 0 : COSTO_FIJO_FLEX[i - 1].hasta + 1, hasta: t.hasta, fijo: t.costo })),
  { desde: UMBRAL_COSTO_FIJO, hasta: Infinity, fijo: 0 },
]

/** Neto que queda (antes de restar tu costo) a un precio dado. */
const neto = (p: number, e: EntradaPrecio) =>
  calcular({ precio: p, cargoPct: e.cargoPct, cuotasPct: e.cuotasPct, envio: e.envio, costo: 0 }).recibis

export interface SolucionPrecio {
  /** Precio entero más bajo que deja al menos la ganancia pedida. */
  precio: number
  banda: Banda
  /** Precio candidato de cada banda (null si ninguno de esa banda sirve). */
  candidatos: { banda: Banda; precio: number | null }[]
  /** Si el precio quedó cerca de $33.000: publicando a $33.000 no pagás costo fijo y ganás más. */
  subirAlUmbral: { precio: number; gananciaExtra: number } | null
}

export function precioParaGanancia(e: EntradaPrecio): SolucionPrecio | null {
  const k = 1 - (e.cargoPct + e.cuotasPct) / 100
  if (k <= 0) return null
  const objetivo = e.costo + e.ganancia
  const candidatos = BANDAS.map(banda => {
    // Dentro de una banda el neto crece con el precio: el mínimo es el mayor
    // entre el inicio de la banda y la fórmula despejada (redondeada para arriba).
    const formula = Math.ceil((objetivo + e.envio + banda.fijo) / k - 1e-9)
    let p = Math.max(banda.desde, formula, 1)
    while (p <= banda.hasta && neto(p, e) < objetivo - 1e-6) p++ // por redondeos
    return { banda, precio: p <= banda.hasta && costoFijo(p) === banda.fijo ? p : null }
  })
  const validos = candidatos.filter(c => c.precio !== null) as { banda: Banda; precio: number }[]
  if (!validos.length) return null
  const mejor = validos.reduce((a, b) => (b.precio < a.precio ? b : a))
  let subirAlUmbral: SolucionPrecio['subirAlUmbral'] = null
  // Solo lo sugerimos si el precio ya está a menos de 10% del umbral: más
  // abajo, subir a $33.000 cambia demasiado el precio que ve el comprador.
  if (mejor.precio < UMBRAL_COSTO_FIJO && mejor.precio >= UMBRAL_COSTO_FIJO * 0.9) {
    const extra = neto(UMBRAL_COSTO_FIJO, e) - neto(mejor.precio, e)
    if (extra >= 0) subirAlUmbral = { precio: UMBRAL_COSTO_FIJO, gananciaExtra: extra }
  }
  return { precio: mejor.precio, banda: mejor.banda, candidatos, subirAlUmbral }
}
