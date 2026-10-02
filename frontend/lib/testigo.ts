// Precio testigo del Cyber Monday / Black Friday: el mínimo y el máximo que el
// bot vio de cada producto en las semanas previas (bot/state/precio_testigo_2026.json,
// lo escribe update_testigo en cazador_bot.py). En noviembre sirve para decir,
// con datos propios, si una oferta del evento bajó de verdad.
import fs from 'node:fs'
import path from 'node:path'

export interface PrecioTestigo {
  t: string
  min: number
  min_ts: string
  max: number
  dias: number
  ult: string
}

export interface Testigo {
  desde: string
  hasta: string
  actualizado?: string
  items: Record<string, PrecioTestigo>
}

let cache: Testigo | null = null

export function getTestigo(): Testigo {
  if (cache) return cache
  try {
    const p = path.join(process.cwd(), '..', 'bot', 'state', 'precio_testigo_2026.json')
    cache = JSON.parse(fs.readFileSync(p, 'utf8')) as Testigo
  } catch {
    cache = { desde: '2026-10-03', hasta: '2026-11-01', items: {} }
  }
  return cache
}

/** Días mínimos de registro para usar el precio testigo (con 1-2 lecturas
 *  sueltas no alcanza para decir "en octubre estaba a $X"). */
export const TESTIGO_MIN_DIAS = 3

export type Veredicto = 'bajo' | 'igual' | 'subio'

/** Compara el precio de hoy contra el más bajo registrado antes del evento.
 *  "bajo": al menos 3% más barato · "subio": más caro que ese mínimo. */
export function veredictoTestigo(precioHoy: number, t: PrecioTestigo | undefined): Veredicto | null {
  if (!t || t.dias < TESTIGO_MIN_DIAS) return null
  if (precioHoy <= t.min * 0.97) return 'bajo'
  if (precioHoy <= t.min * 1.02) return 'igual'
  return 'subio'
}
