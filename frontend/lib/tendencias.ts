import fs from 'node:fs'
import path from 'node:path'

export interface Tendencias {
  actualizado: string
  items: { keyword: string }[]
}

/** Búsquedas en tendencia de ML (las baja .github/workflows/tendencias.yml).
 *  Sin precios: solo palabras. Si el archivo no existe o está vacío, null. */
export function getTendencias(): Tendencias | null {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'tendencias.json'), 'utf-8')
    const d = JSON.parse(raw) as Tendencias
    if (!d?.actualizado || !Array.isArray(d.items) || d.items.length === 0) return null
    return d
  } catch {
    return null
  }
}
