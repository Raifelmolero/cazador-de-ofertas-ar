// Estudio "descuentos inflados": el dato propio y citable del sitio (#19 GEO).
// Sale del registro de cada pasada del bot por mercadolibre.com.ar/ofertas
// (bot/state/scan_log.jsonl: ofertas revisadas, en mínimo histórico e
// infladas). Inflada = ya la habíamos visto ≥5% más barata antes
// (HIST_INFLATED_MARGIN en bot/cazador_bot.py).
//
// Se lee en el build (cada commit del bot redeploya, así que se actualiza solo).
// Si el archivo no está (build fuera del repo), queda la última foto conocida.

import fs from 'node:fs'
import path from 'node:path'

interface Scan {
  ts: string
  scanned: number
  minimos: number
  infladas: number
}

export interface Estudio {
  desde: string
  hasta: string
  /** ISO completo de la última pasada contada (para dateModified) */
  ultima: string
  pasadas: number
  revisadas: number
  infladas: number
  minimos: number
  pctInfladas: number
  pctMinimos: number
  porMes: { mes: string; pasadas: number; revisadas: number; infladas: number; pct: number }[]
}

const FOTO: Scan[] = [
  { ts: '2026-07-19T02:22:29+00:00', scanned: 22364, minimos: 0, infladas: 5644 },
  { ts: '2026-09-25T23:14:45+00:00', scanned: 4798, minimos: 887, infladas: 1202 },
]

function leerScans(): Scan[] {
  const p = path.join(process.cwd(), '..', 'bot', 'state', 'scan_log.jsonl')
  try {
    return fs
      .readFileSync(p, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(l => JSON.parse(l) as Scan)
  } catch {
    return FOTO
  }
}

const pct = (a: number, b: number) => (b ? Math.round((1000 * a) / b) / 10 : 0)

export function getEstudio(): Estudio {
  // Solo pasadas con el filtro de infladas activo (arrancó el 19/07)
  const scans = leerScans().filter(s => s.infladas > 0 && s.scanned > 0)
  const revisadas = scans.reduce((a, s) => a + s.scanned, 0)
  const infladas = scans.reduce((a, s) => a + s.infladas, 0)
  const minimos = scans.reduce((a, s) => a + s.minimos, 0)
  const meses = new Map<string, { pasadas: number; revisadas: number; infladas: number }>()
  for (const s of scans) {
    const m = s.ts.slice(0, 7)
    const x = meses.get(m) ?? { pasadas: 0, revisadas: 0, infladas: 0 }
    x.pasadas++
    x.revisadas += s.scanned
    x.infladas += s.infladas
    meses.set(m, x)
  }
  return {
    desde: scans[0]?.ts.slice(0, 10) ?? '',
    hasta: scans[scans.length - 1]?.ts.slice(0, 10) ?? '',
    ultima: scans[scans.length - 1]?.ts ?? '',
    pasadas: scans.length,
    revisadas,
    infladas,
    minimos,
    pctInfladas: pct(infladas, revisadas),
    pctMinimos: pct(minimos, revisadas),
    porMes: [...meses].map(([mes, x]) => ({ mes, ...x, pct: pct(x.infladas, x.revisadas) })),
  }
}

/**
 * Última pasada del bot (cualquiera, con o sin infladas): cuántas ofertas revisó y en cuántas
 * el precio era el más bajo registrado. Para el contador del hero de la home. null si no hay
 * registro o si la pasada tiene más de 3 días (no se muestra un «hoy» viejo).
 */
export function ultimaPasada(ahora = Date.now()): { ts: string; revisadas: number; minimos: number } | null {
  const s = leerScans().filter(x => x.scanned > 0).at(-1)
  if (!s) return null
  if (ahora - Date.parse(s.ts) > 3 * 86_400_000) return null
  return { ts: s.ts, revisadas: s.scanned, minimos: s.minimos }
}
