// Equipos reales para las guías de tecnología (lib/guias-tecno.ts): en vez de
// las ofertas genéricas del día, cada guía muestra los celulares, notebooks o
// smart TV del comparador (lib/comparador.ts) que cumplen su criterio, con su
// precio de hoy y el más bajo que registramos.
//
// El criterio sale solo de lo que dice el título de ML (lo mismo que usa el
// comparador): nunca se adivina una spec. Si hoy no hay al menos
// MIN_EQUIPOS_GUIA equipos que cumplan, la guía queda noindex y fuera del
// sitemap (regla del sitio: páginas flacas no se indexan).
import { normalizar } from '@/lib/categorias'
import { equiposDe, getComparador, type Equipo } from '@/lib/comparador'
import type { Guia } from '@/lib/guias'

type ComparadorSlug = 'celulares' | 'notebooks' | 'smart-tv'

export interface SeleccionEquipos {
  /** De qué comparador salen (varios: se mezclan y se ordenan juntos). */
  comparador: ComparadorSlug | ComparadorSlug[]
  /** Encabezado de la sección de productos. */
  titulo: string
  /** Sobre el título normalizado: qué modelos entran (si falta, entran todos). */
  incluye?: RegExp
  /** Sobre el título normalizado: qué modelos quedan afuera. */
  excluye?: RegExp
  /** Mínimos sobre Equipo.orden (ej. { ram: 16, disco: 512 }). */
  minimos?: Record<string, number>
  desde?: number
  hasta?: number
  /** Solo los que hoy están en el precio más bajo que registramos. */
  enMinimo?: boolean
  /** Solo marcas reconocidas (default true): las "Otra" suelen inflar specs en el título. */
  soloConocidas?: boolean
  /** Cómo ordenar: por precio (default) o del más caro al más barato. */
  orden?: 'precio' | 'precio-desc'
  /** Cuántos mostrar (default 6). */
  max?: number
}

export const MIN_EQUIPOS_GUIA = 3

const cache = new Map<string, Equipo[]>()
function todos(slug: ComparadorSlug): Equipo[] {
  if (!cache.has(slug)) {
    const c = getComparador(slug)
    cache.set(slug, c ? equiposDe(c) : [])
  }
  return cache.get(slug)!
}

const SUFIJOS = new Set(['pro', 'max', 'ultra', 'plus', 'fe', 'fusion', 'lite', 'go', 'slim', 'flip', 'e', 's'])

/** Clave de modelo ("Motorola|g06") para no repetir la misma publicación en otro
 *  color o de otro vendedor: el primer código con número del título (más un
 *  sufijo tipo Pro/Ultra). */
function modelo(e: Equipo): string {
  const ws = normalizar(e.titulo).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  const i = ws.findIndex(w => /\d/.test(w))
  const cod = i < 0 ? ws.slice(0, 4).join(' ') : ws[i] + (SUFIJOS.has(ws[i + 1]) ? ' ' + ws[i + 1] : '')
  // Celulares: un solo lugar por modelo (el más barato), sin importar la memoria;
  // notebooks y TV: cada configuración cuenta aparte (procesador, pulgadas, panel).
  const config = 'g5' in e.orden ? '' : JSON.stringify(e.orden)
  return [e.marca, cod, config].join('|')
}

/** Los equipos de hoy que cumplen el criterio de la guía (vacío si la guía no tiene). */
export function equiposDeGuia(g: Pick<Guia, 'equipos'>): Equipo[] {
  const s = g.equipos
  if (!s) return []
  const conocidas = s.soloConocidas ?? true
  const vistos = new Set<string>()
  const fuentes = Array.isArray(s.comparador) ? s.comparador : [s.comparador]
  const base = fuentes.flatMap(todos).sort((a, b) => a.precio - b.precio)
  const xs = base.filter(e => {
    const t = normalizar(e.titulo)
    if (s.incluye && !s.incluye.test(t)) return false
    if (s.excluye && s.excluye.test(t)) return false
    if (conocidas && e.marca === 'Otra') return false
    if (s.desde != null && e.precio < s.desde) return false
    if (s.hasta != null && e.precio > s.hasta) return false
    for (const [k, v] of Object.entries(s.minimos ?? {})) if (!((e.orden[k] ?? 0) >= v)) return false
    const k = modelo(e)
    if (vistos.has(k)) return false
    vistos.add(k)
    return true
  })
  // Después de quedarse con el más barato de cada modelo: si hay otra publicación
  // del mismo modelo más barata, la cara no cuenta como "en su mínimo".
  const final = s.enMinimo ? xs.filter(e => e.minimo != null && e.precio <= e.minimo) : xs
  const orden = s.orden === 'precio-desc' ? [...final].reverse() : final
  return orden.slice(0, s.max ?? 6)
}

/** Una guía con selección de equipos se indexa solo si hoy tiene equipos suficientes. */
export const guiaIndexable = (g: Pick<Guia, 'equipos'>): boolean => !g.equipos || equiposDeGuia(g).length >= MIN_EQUIPOS_GUIA
