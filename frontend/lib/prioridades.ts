// Mezcla de categorías para los destacados de la home (/hoy y respaldo de
// /black-friday). La lista de categorías, su orden, el tope de computación, la
// vigencia y lo que hay que sacar salen de data/categorias-prioritarias.json,
// que se actualiza cada día desde EQUIPO-GROK/tendencias-hoy.md sin tocar código.
import datos from '@/data/categorias-prioritarias.json'
import { normalizar } from '@/lib/categorias'

export interface OfertaMezclable {
  id_ml: string
  titulo: string
  precio_actual: number
  precio_visto?: string
}

interface CategoriaPrio {
  id: string
  nombre: string
  orden: number
  patrones: string[]
}

const re = (ps: string[]) => new RegExp(ps.join('|'))
const CATEGORIAS = [...(datos.categorias as CategoriaPrio[])]
  .sort((a, b) => a.orden - b.orden)
  .map(c => ({ ...c, re: re(c.patrones) }))
const COMPUTACION = re(datos.computacion.patrones)
const ACCESORIOS = re(datos.accesorios_no_destacar)
const EXCLUIR = (datos.excluir_destacados as { patron: string; visto_hasta?: string }[]).map(e => ({
  re: new RegExp(e.patron),
  hasta: e.visto_hasta,
}))

export const TICKET_PRIORITARIO_DESDE: number = datos.ticket_alto_desde
export const TOPE_COMPUTACION: number = datos.tope_computacion_pct / 100
export const CATEGORIAS_ACTUALIZADO: string = datos.actualizado

/** id de la categoría prioritaria del título (o 'computacion'), null si no es ninguna. */
export function categoriaPrioritaria(titulo: string): string | null {
  const t = normalizar(titulo)
  if (COMPUTACION.test(t)) return 'computacion'
  if (ACCESORIOS.test(t)) return null
  return CATEGORIAS.find(c => c.re.test(t))?.id ?? null
}

/** Lo que tendencias-hoy.md manda sacar de la home. */
export function esExcluidaDeDestacados(o: { titulo: string; precio_visto?: string }): boolean {
  const t = normalizar(o.titulo)
  return EXCLUIR.some(e => e.re.test(t) && (!e.hasta || !o.precio_visto || o.precio_visto <= e.hasta))
}

function fechaMasNueva(lista: OfertaMezclable[]): string {
  return lista.reduce((m, o) => (o.precio_visto && o.precio_visto > m ? o.precio_visto : m), '')
}

function restarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - dias)
  return d.toISOString().slice(0, 10)
}

/** Clave de modelo: evita varias tarjetas del mismo aire en distintos colores/vendedores. */
export function claveModelo(titulo: string): string {
  return normalizar(titulo).replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean).slice(0, 4).join(' ')
}

/** Candidatas a destacado por categoría prioritaria (vigentes, ticket alto, sin
 *  accesorios ni lo excluido, un modelo por tarjeta), en el orden recibido. */
function candidatasPorCategoria<T extends OfertaMezclable>(lista: T[], excluir: Iterable<string>): Map<string, T[]> {
  const fuera = new Set(excluir)
  const desde = restarDias(fechaMasNueva(lista) || '1970-01-01', datos.vigencia_dias)
  const porCat = new Map<string, T[]>(CATEGORIAS.map(c => [c.id, []]))
  const modelos = new Set<string>()
  for (const o of lista) {
    if (fuera.has(o.id_ml) || o.precio_actual < TICKET_PRIORITARIO_DESDE) continue
    if (o.precio_visto && o.precio_visto < desde) continue
    if (esExcluidaDeDestacados(o)) continue
    const cat = categoriaPrioritaria(o.titulo)
    const grupo = cat ? porCat.get(cat) : undefined
    if (!grupo) continue
    const m = claveModelo(o.titulo)
    if (modelos.has(m)) continue
    modelos.add(m)
    grupo.push(o)
  }
  return porCat
}

/** Las candidatas de UNA categoría prioritaria (mismas reglas que elegirMezcla). */
export function candidatasDeCategoria<T extends OfertaMezclable>(lista: T[], categoria: string, excluir: Iterable<string> = []): T[] {
  return candidatasPorCategoria(lista, excluir).get(categoria) ?? []
}

/**
 * Elige `n` destacados mezclando categorías: una por categoría por vuelta, en el
 * orden del JSON; solo ofertas vigentes (precio visto dentro de `vigencia_dias`
 * respecto de la carga más nueva), de ticket alto, sin accesorios ni lo excluido.
 * Computación nunca entra acá (su cupo lo respeta la vidriera de notebooks).
 * Respeta el orden recibido dentro de cada categoría.
 */
export function elegirMezcla<T extends OfertaMezclable>(lista: T[], n: number, excluir: Iterable<string> = []): T[] {
  const porCat = candidatasPorCategoria(lista, excluir)
  const out: T[] = []
  for (let vuelta = 0; out.length < n; vuelta++) {
    let agrego = false
    for (const c of CATEGORIAS) {
      const o = porCat.get(c.id)?.[vuelta]
      if (o && out.length < n) {
        out.push(o)
        agrego = true
      }
    }
    if (!agrego) break
  }
  return out
}

/** Cuántas notebooks caben en `total` destacados sin pasar el tope de computación. */
export function cupoComputacion(total: number): number {
  return Math.floor(total * TOPE_COMPUTACION)
}
