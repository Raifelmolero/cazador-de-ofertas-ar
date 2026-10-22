// Páginas "mejor celular / notebook hasta $X" (/mejor/[slug]) con los equipos
// del comparador (lib/comparador.ts) que hoy entran en ese presupuesto.
//
// "Mejor" acá no es una opinión: es lo que más ofrece cada publicación por el
// precio, según lo que dice su título (memoria, RAM, 5G, procesador, disco).
// Si el título no lo dice, no suma: nunca se adivina una spec.
import { equiposDe, getComparador, type Equipo } from '@/lib/comparador'

export interface Presupuesto {
  slug: string
  comparador: 'celulares' | 'notebooks'
  hasta: number
  texto: string // "300 mil"
}

const CELULARES = [200_000, 300_000, 400_000, 600_000, 1_000_000]
const NOTEBOOKS = [600_000, 800_000, 1_000_000, 1_500_000]

/** 300_000 → "300 mil", 1_000_000 → "1 millón", 1_500_000 → "1,5 millones". */
function texto(n: number): string {
  if (n < 1_000_000) return `${n / 1000} mil`
  const m = n / 1_000_000
  return m === 1 ? '1 millón' : `${m.toLocaleString('es-AR')} millones`
}
/** 300_000 → "300-mil", 1_000_000 → "1-millon", 1_500_000 → "1-5-millones". */
function slugDe(n: number): string {
  if (n < 1_000_000) return `${n / 1000}-mil`
  const m = n / 1_000_000
  return m === 1 ? '1-millon' : `${String(m).replace('.', '-')}-millones`
}

export const PRESUPUESTOS: Presupuesto[] = [
  ...CELULARES.map(n => ({ slug: `celular-hasta-${slugDe(n)}`, comparador: 'celulares' as const, hasta: n, texto: texto(n) })),
  ...NOTEBOOKS.map(n => ({ slug: `notebook-hasta-${slugDe(n)}`, comparador: 'notebooks' as const, hasta: n, texto: texto(n) })),
]

/** Mínimo de equipos para que valga la pena la página. */
const MIN_EQUIPOS = 3

/** Puntaje por lo que el título dice que trae (más es mejor). */
export function puntaje(c: Presupuesto['comparador'], e: Equipo): number {
  const o = e.orden
  if (c === 'celulares') {
    const mem = o.memoria > 0 ? Math.log2(o.memoria / 32) : 0 // 64 GB = 1, 128 = 2, 256 = 3...
    // Tope de 8 GB: los "12/16/24 GB de RAM" de los títulos suelen sumar memoria virtual.
    return mem * 2 + Math.min(o.ram, 8) / 2 + o.g5 * 2
  }
  const disco = o.disco >= 1024 ? 3 : o.disco >= 512 ? 2 : o.disco >= 256 ? 1 : 0
  // Procesador que el título no dice = básico (no cero); RAM con tope de 16 GB.
  return Math.max(o.cpu, 1) * 3 + Math.min(o.ram, 16) / 4 + disco + o.gamer
}

export interface PresupuestoArmado {
  p: Presupuesto
  equipos: Equipo[] // ordenados de más a menos puntaje (empate: más barato primero)
  recomendado: Equipo // el que más trae entre las marcas conocidas
  franjaAlta: Equipo[] // lo mejor entre el 60 % y el tope del presupuesto (marcas conocidas)
  masBarato: Equipo
  enMinimo: Equipo[] // los que hoy están en el precio más bajo que registramos
}

/** Marca reconocida: las de marca "Otra" suelen inflar specs en el título. */
const conocida = (e: Equipo) => e.marca !== 'Otra'

const cache = new Map<string, Equipo[]>()
function equipos(slug: Presupuesto['comparador']): Equipo[] {
  if (!cache.has(slug)) {
    const c = getComparador(slug)
    cache.set(slug, c ? equiposDe(c) : [])
  }
  return cache.get(slug)!
}

export function armarPresupuesto(p: Presupuesto): PresupuestoArmado | null {
  // Solo lo que entra en el presupuesto y del que sabemos algo más que el precio.
  const xs = equipos(p.comparador).filter(e => e.precio <= p.hasta && puntaje(p.comparador, e) > 0)
  if (xs.length < MIN_EQUIPOS) return null
  const orden = [...xs].sort((a, b) => puntaje(p.comparador, b) - puntaje(p.comparador, a) || a.precio - b.precio)
  const marcas = orden.filter(conocida)
  return {
    p,
    equipos: orden,
    recomendado: marcas[0] ?? orden[0],
    franjaAlta: marcas.filter(e => e.precio >= p.hasta * 0.6).slice(0, 3),
    masBarato: [...xs].sort((a, b) => a.precio - b.precio)[0],
    enMinimo: orden.filter(e => e.minimo !== null && e.precio <= e.minimo).slice(0, 5),
  }
}

export const getPresupuesto = (slug: string) => PRESUPUESTOS.find(p => p.slug === slug)

/** Los presupuestos que hoy tienen equipos suficientes (los que se publican). */
export const presupuestosConEquipos = (): PresupuestoArmado[] =>
  PRESUPUESTOS.map(armarPresupuesto).filter((x): x is PresupuestoArmado => !!x)
