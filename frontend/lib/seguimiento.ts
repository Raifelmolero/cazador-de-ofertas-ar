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

/**
 * Mercado Libre repite el mismo título en publicaciones de distintos vendedores
 * del mismo producto. Agrupamos por título normalizado y elegimos una página
 * principal (la de más historial; empate: menor mínimo, luego slug). Las demás
 * siguen existiendo pero apuntan su canonical a la principal y salen del
 * sitemap y de los listados/links internos.
 */
let principales: Map<string, Seguido> | null = null
function mapaPrincipal() {
  if (principales) return principales
  const grupos = new Map<string, Seguido[]>()
  for (const s of leer().items) {
    const k = normalizar(s.titulo).replace(/\s+/g, ' ').trim()
    grupos.set(k, [...(grupos.get(k) ?? []), s])
  }
  principales = new Map()
  for (const g of grupos.values()) {
    const p = [...g].sort(
      (a, b) => b.serie.length - a.serie.length || a.min - b.min || a.slug.localeCompare(b.slug),
    )[0]
    for (const s of g) principales.set(s.id, p)
  }
  return principales
}
/** Página principal (canónica) del producto; es el mismo seguido si no tiene duplicados. */
export const principalDe = (s: Seguido) => mapaPrincipal().get(s.id) ?? s
export const esPrincipal = (s: Seguido) => principalDe(s).id === s.id
/** Seguidos sin duplicados: para sitemap, listados y links internos. */
export const getSeguidosPrincipales = () => getSeguidos().filter(esPrincipal)
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
  return getSeguidosPrincipales().filter(s => categoriaDeSeguido(s)?.slug === slug)
}

/** Mapa id_ml → slug para enlazar desde tarjetas y tablas. */
export function slugPorId(): Record<string, string> {
  return Object.fromEntries(getSeguidos().map(s => [s.id, principalDe(s).slug]))
}
