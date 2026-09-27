// Costo del envío gratis para el vendedor en Mercado Libre Argentina (productos
// nuevos), por peso, precio y color de reputación. Sale de ENVIO_GRATIS_VERDE
// (ayuda ML 40538, reputación verde, hasta 10 kg). Las otras reputaciones se
// derivan del precio sin descuento (verde ÷ (1 − descuento)), y coinciden con
// las tablas oficiales 40545 (amarilla) y 40547 (naranja o roja) leídas el
// 27/09/2026: ej. hasta 0,3 kg amarilla $9.904 / $7.428 / $8.148; naranja
// $12.380 (menos de $33.000) y $13.580 (desde $33.000).
import { ENVIO_GRATIS_VERDE, UMBRAL_COSTO_FIJO } from './costosml'

export type Reputacion = 'verde' | 'amarilla' | 'naranja'

export const REPUTACIONES: { id: Reputacion; nombre: string; descMenos33: number; descDesde33: number; fuente: string }[] = [
  { id: 'verde', nombre: 'Verde, MercadoLíder o sin reputación', descMenos33: 30, descDesde33: 50, fuente: 'https://www.mercadolibre.com.ar/ayuda/40538' },
  { id: 'amarilla', nombre: 'Amarilla', descMenos33: 20, descDesde33: 40, fuente: 'https://www.mercadolibre.com.ar/ayuda/40545' },
  { id: 'naranja', nombre: 'Naranja o roja', descMenos33: 0, descDesde33: 0, fuente: 'https://www.mercadolibre.com.ar/ayuda/40547' },
]

/** Límite superior (kg) de cada fila de ENVIO_GRATIS_VERDE, en el mismo orden. */
export const LIMITES_KG = [0.3, 0.5, 1, 1.5, 2, 3, 4, 5, 8, 10]
export const PESO_MAX_TABLA = 10
export const AYUDA_COSTOS_ENVIO = 'https://www.mercadolibre.com.ar/ayuda/3482'

export interface ResultadoEnvio {
  obligatorio: boolean // desde $33.000 el envío gratis viene incluido
  fila: string
  costo: number
  sinDescuento: number
  descuentoPct: number
}

/** null si el peso supera la tabla que tenemos (más de 10 kg) o es inválido. */
export function costoEnvioGratis(precio: number, pesoKg: number, rep: Reputacion): ResultadoEnvio | null {
  if (!(pesoKg > 0) || pesoKg > PESO_MAX_TABLA) return null
  const i = LIMITES_KG.findIndex(l => pesoKg <= l)
  const f = ENVIO_GRATIS_VERDE[i]
  const r = REPUTACIONES.find(x => x.id === rep)!
  const obligatorio = precio >= UMBRAL_COSTO_FIJO
  let sinDescuento: number
  let descuentoPct: number
  if (!obligatorio) {
    sinDescuento = Math.round(f.menos33 / 0.7)
    descuentoPct = r.descMenos33
  } else {
    // Naranja/roja: la tabla oficial tiene un solo valor desde $33.000 (el de $50.000+).
    const base = rep === 'naranja' || precio >= 50000 ? f.desde50 : f.de33a50
    sinDescuento = Math.round(base / 0.5)
    descuentoPct = r.descDesde33
  }
  return { obligatorio, fila: f.peso, sinDescuento, descuentoPct, costo: Math.round((sinDescuento * (100 - descuentoPct)) / 100) }
}
