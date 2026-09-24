// Productos de ticket alto con historial de precios propio (/precio/[slug]).
// Lo escribe el bot (update_seguimiento en bot/cazador_bot.py) y, a diferencia
// del catálogo del día, es persistente: la página sigue viva aunque el
// producto hoy no esté en oferta (hasta 60 días sin verlo).
import fs from 'fs'
import path from 'path'
import { CATEGORIAS, normalizar } from '@/lib/categorias'

export interface Seguido {
  id: string
  slug: string
  titulo: string
  url: string
  img: string | null
  precio_lista: number
  ultimo_visto: string
  relampago: boolean
  min: number
  min_ts: string
  desde: string
  serie: [string, number][]
}

let cache: { items: Seguido[]; actualizado: string } | null = null

function leer() {
  if (cache) return cache
  let raw: { items: Record<string, Omit<Seguido, 'id'>>; actualizado?: string }
  try {
    raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'seguimiento.json'), 'utf8'))
  } catch {
    raw = { items: {} }
  }
  const items = Object.entries(raw.items).map(([id, v]) => ({ id, ...v }))
  cache = { items, actualizado: raw.actualizado ?? '' }
  return cache
}

export const getSeguidos = () => leer().items
export const getSeguido = (slug: string) => leer().items.find(s => s.slug === slug)
export const actualizadoSeguimiento = () => leer().actualizado

export function precioActual(s: Seguido) {
  return s.serie[s.serie.length - 1][1]
}

/** ¿Hoy está en oferta? (lo vimos en la última corrida del bot) */
export const vigente = (s: Seguido) => s.ultimo_visto === actualizadoSeguimiento()

/** Categoría del sitio a la que pertenece (misma regla de keywords que /categoria). */
export function categoriaDeSeguido(s: Seguido) {
  const t = normalizar(s.titulo)
  const inicio = t.split(/\s+/).slice(0, 4).join(' ')
  return CATEGORIAS.find(c => c.keywords.some(k => t.includes(k)) && !c.excluir.some(x => inicio.includes(x)))
}

export function seguidosDeCategoria(slug: string) {
  return getSeguidos().filter(s => categoriaDeSeguido(s)?.slug === slug)
}

/** Mapa id_ml → slug para enlazar desde tarjetas y tablas. */
export function slugPorId(): Record<string, string> {
  return Object.fromEntries(getSeguidos().map(s => [s.id, s.slug]))
}
