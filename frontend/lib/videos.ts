// Videos cortos de las mejores ofertas del día (los genera bot/web_videos.py en
// public/videos/<id_ml>.mp4). Se leen al buildear: si no hay ninguno, la página
// no muestra el bloque. Solo se usan los de productos que siguen en la lista.
import fs from 'fs'
import path from 'path'
import type { OfertaLight } from '@/components/OfertaCard'

export const MAX_VIDEOS = 2

export function idsConVideo(): Set<string> {
  try {
    const dir = path.join(process.cwd(), 'public', 'videos')
    return new Set(fs.readdirSync(dir).filter(f => f.endsWith('.mp4')).map(f => f.slice(0, -4)))
  } catch {
    return new Set()
  }
}

/** Las primeras ofertas (ya vienen por ganancia esperada) que tienen video. */
export function videosDestacados(ofertas: OfertaLight[], max = MAX_VIDEOS): OfertaLight[] {
  const ids = idsConVideo()
  if (ids.size === 0) return []
  return ofertas.filter(o => ids.has(o.id_ml)).slice(0, max)
}
