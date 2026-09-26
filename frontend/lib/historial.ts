// Historial de precios del bot (bot/state/price_history.json) para el
// verificador de la home y la extensión de navegador. Se lee en el build,
// igual que el estudio: cada commit del bot redeploya y queda fresco.
import fs from 'node:fs'
import path from 'node:path'

export interface Hist {
  min: number
  min_ts: string
  first_ts: string
  last: number
  last_ts: string
}

let cache: Record<string, Hist> | null = null

export function getHistorial(): Record<string, Hist> {
  if (cache) return cache
  try {
    const p = path.join(process.cwd(), '..', 'bot', 'state', 'price_history.json')
    cache = JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    cache = {}
  }
  return cache!
}
