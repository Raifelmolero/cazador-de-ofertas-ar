// Páginas "mejor celular / notebook / smart TV hasta $X" (/mejor/[slug]) con los equipos
// del comparador (lib/comparador.ts) que hoy entran en ese presupuesto.
//
// "Mejor" acá no es una opinión: es lo que más ofrece cada publicación por el
// precio, según lo que dice su título (memoria, RAM, 5G, procesador, disco,
// pulgadas, resolución, panel).
// Si el título no lo dice, no suma: nunca se adivina una spec.
import { normalizar } from '@/lib/categorias'
import { equiposDe, getComparador, rangoOficial, USADOS, type Equipo } from '@/lib/comparador'
import { DIAS_VIGENCIA, tramoEdad } from '@/lib/frescura'
import { MARCAS_EXCLUIDAS_CTA } from '@/lib/cta-destacados'

export interface Presupuesto {
  slug: string
  comparador: 'celulares' | 'notebooks' | 'smart-tv'
  hasta: number
  texto: string // "300 mil"
}

// 350 mil (celulares) y 500 mil (TV): tanda 23/10. Se probaron también 250, 500 y 800 mil en
// celulares y 700/900 mil en notebooks, pero repetían los 3 primeros del escalón vecino
// (misma página con otro monto) o metían equipos dudosos: no se suman.
const CELULARES = [200_000, 300_000, 350_000, 400_000, 600_000, 1_000_000, 2_000_000, 2_500_000]
const NOTEBOOKS = [600_000, 800_000, 1_000_000, 1_200_000, 1_500_000, 2_000_000, 2_500_000, 3_000_000]
const SMART_TV = [400_000, 500_000, 600_000, 700_000, 800_000, 1_000_000, 1_200_000, 1_500_000]

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
  ...SMART_TV.map(n => ({ slug: `smart-tv-hasta-${slugDe(n)}`, comparador: 'smart-tv' as const, hasta: n, texto: texto(n) })),
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
  if (c === 'smart-tv') {
    // El tamaño pesa más (32" ≈ 1,3 · 55" ≈ 5,2 · 65" ≈ 6,8); después 4K y el tipo de panel.
    const pul = o.pulgadas > 0 ? Math.max(o.pulgadas - 24, 0) / 6 : 0
    const res = [0, 0.5, 1, 3, 4][o.resolucion] ?? 0 // HD, Full HD, 4K, 8K
    const pan = [0, 0, 1.5, 3, 4][o.panel] ?? 0 // QLED/QNED, Mini LED, OLED
    return pul + res + pan
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

/** Marca reconocida: las de marca "Otra" suelen inflar specs en el título.
 *  Las excluidas de los destacados (HP, OMEN, Victus, Omnibook, Vivobook, BGH, Likon) siguen en la
 *  lista completa, pero nunca como recomendado, más barato, franja alta ni «en su mínimo». */
const conocida = (e: Equipo) => e.marca !== 'Otra' && !MARCAS_EXCLUIDAS_CTA.test(e.titulo)

const cache = new Map<string, Equipo[]>()
const cacheConVencidas = new Map<string, Equipo[]>()
function equipos(slug: Presupuesto['comparador'], conVencidas = false): Equipo[] {
  const m = conVencidas ? cacheConVencidas : cache
  if (!m.has(slug)) {
    const c = getComparador(slug)
    m.set(slug, c ? equiposDe(c, conVencidas) : [])
  }
  return m.get(slug)!
}

/** Último precio conocido de más de DIAS_VIGENCIA días (solo completan hasta 3 en /mejor). */
const vencido = (e: Equipo) => (e.dias ?? 0) > DIAS_VIGENCIA

export function armarPresupuesto(p: Presupuesto): PresupuestoArmado | null {
  // Solo lo que entra en el presupuesto y del que sabemos algo más que el precio.
  // Solo equipos nuevos: nada de usados ni reacondicionados.
  const sirve = (e: Equipo) => e.precio <= p.hasta && puntaje(p.comparador, e) > 0 && !USADOS.test(normalizar(e.titulo))
  const xs = equipos(p.comparador).filter(sirve)
  if (xs.length < MIN_EQUIPOS) {
    // Decisión 16/11: la página no se oculta. Se completa hasta MIN_EQUIPOS con el último precio conocido
    // (los más recientes primero); la página los rotula «Precio visto hace N días» y van después de los vigentes.
    const ids = new Set(xs.map(e => e.id))
    const extra = equipos(p.comparador, true)
      .filter(e => !ids.has(e.id) && sirve(e))
      .sort((a, b) => (a.dias ?? 0) - (b.dias ?? 0) || puntaje(p.comparador, b) - puntaje(p.comparador, a))
      .slice(0, MIN_EQUIPOS - xs.length)
    xs.push(...extra)
  }
  if (xs.length < MIN_EQUIPOS) return null
  // Primero los de precio reciente (hasta 7 días); los de precio viejo van después aunque rindan más,
  // así lo «recomendado de hoy» no sale de un precio de hace dos semanas.
  // Smart TV: a igual puntaje (o igual precio) va primero la de tienda oficial, después «sin dato», al final las no oficiales
  // (rangoOficial es 1 para todos en los demás rubros, así que ahí no cambia nada).
  const orden = [...xs].sort((a, b) => tramoEdad(a.dias) - tramoEdad(b.dias) || Number(vencido(a)) - Number(vencido(b)) || puntaje(p.comparador, b) - puntaje(p.comparador, a) || rangoOficial(a) - rangoOficial(b) || a.precio - b.precio)
  const marcas = orden.filter(conocida)
  const sinExcluidas = orden.filter(e => !MARCAS_EXCLUIDAS_CTA.test(e.titulo))
  // «Recomendado»: si hay una TV oficial con puntaje hasta 10 % menor que la primera (y misma frescura), se prefiere esa.
  let recomendado = marcas[0] ?? sinExcluidas[0] ?? orden[0]
  if (p.comparador === 'smart-tv' && marcas[0] && marcas[0].tienda_oficial !== true) {
    const top = puntaje(p.comparador, marcas[0])
    const oficial = marcas.find(e => e.tienda_oficial === true && tramoEdad(e.dias) === tramoEdad(marcas[0].dias) && vencido(e) === vencido(marcas[0]) && puntaje(p.comparador, e) >= top * 0.9)
    if (oficial) recomendado = oficial
  }
  return {
    p,
    equipos: orden,
    recomendado,
    franjaAlta: marcas.filter(e => e.precio >= p.hasta * 0.6).slice(0, 3),
    masBarato: [...(sinExcluidas.length ? sinExcluidas : xs)].sort((a, b) => tramoEdad(a.dias) - tramoEdad(b.dias) || Number(vencido(a)) - Number(vencido(b)) || a.precio - b.precio || rangoOficial(a) - rangoOficial(b))[0],
    enMinimo: marcas.filter(e => e.minimo !== null && e.precio <= e.minimo).slice(0, 5),
  }
}

export const getPresupuesto = (slug: string) => PRESUPUESTOS.find(p => p.slug === slug)

/** Comparadores donde un escalón que repite los 3 primeros del escalón de abajo
 *  no se publica (sería la misma página con otro monto: contenido duplicado). */
const SIN_REPETIDOS = new Set<Presupuesto['comparador']>(['smart-tv'])
const top3 = (x: PresupuestoArmado) => x.equipos.slice(0, 3).map(e => e.id).join(',')

/** Los presupuestos que hoy tienen equipos suficientes (los que se publican). */
export function presupuestosConEquipos(): PresupuestoArmado[] {
  const out: PresupuestoArmado[] = []
  for (const x of PRESUPUESTOS.map(armarPresupuesto)) {
    if (!x) continue
    const anterior = out.findLast(o => o.p.comparador === x.p.comparador)
    if (anterior && SIN_REPETIDOS.has(x.p.comparador) && top3(anterior) === top3(x)) continue
    out.push(x)
  }
  return out
}
