// Descuentos inflados del día (/descuentos-inflados y el bloque de la home).
// Lo escribe el bot en cada corrida (write_infladas en bot/cazador_bot.py): una
// muestra de las ofertas de mercadolibre.com.ar/ofertas cuyo precio de hoy está
// al menos 5% arriba del mínimo que registramos ANTES para ese producto.
//
// Es un dato, no un juicio sobre el vendedor. Los links van sin afiliado a
// propósito: no se gana plata con un descuento que el sitio dice que no es real.
import fs from 'node:fs'
import path from 'node:path'
import { CATEGORIAS, normalizar, type Categoria } from '@/lib/categorias'

export interface CasoInflado {
  id: string
  titulo: string
  /** Link plano a la publicación de ML (sin parámetros de afiliado) o null */
  url: string | null
  img: string | null
  precio_hoy: number
  /** El "antes" tachado que muestra ML */
  precio_tachado: number
  /** % OFF que anuncia la publicación */
  descuento_anunciado: number
  /** Precio más bajo que registramos antes de la corrida de hoy */
  minimo_registrado: number
  minimo_fecha: string
  /** Primera vez que vimos el producto en las ofertas */
  visto_desde: string | null
  /** Cuánto más barato estuvo, en % del precio de hoy */
  diferencia_pct: number
}

export interface InfladasDelDia {
  /** ISO de la corrida del bot que armó la lista (null = todavía no corrió) */
  actualizado: string | null
  fecha: string | null
  /** Ofertas marcadas como infladas en esa corrida (null = sin datos) */
  detectadas: number | null
  casos: CasoInflado[]
}

const VACIO: InfladasDelDia = { actualizado: null, fecha: null, detectadas: null, casos: [] }

const esTexto = (x: unknown): x is string => typeof x === 'string' && x.length > 0
const esPrecio = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x > 0
const esFecha = (x: unknown): x is string => esTexto(x) && /^\d{4}-\d{2}-\d{2}/.test(x)

/** Solo links a publicaciones de ML y sin query string (nunca un afiliado). */
function urlPlana(u: unknown): string | null {
  if (!esTexto(u)) return null
  try {
    const url = new URL(u)
    if (url.protocol !== 'https:' || !/(^|\.)mercadolibre\.com\.ar$/.test(url.hostname)) return null
    return `${url.origin}${url.pathname}`
  } catch {
    return null
  }
}

function aCaso(x: Record<string, unknown>): CasoInflado | null {
  const { precio_hoy, precio_tachado, minimo_registrado, descuento_anunciado } = x
  if (!esTexto(x.id) || !esTexto(x.titulo) || !esFecha(x.minimo_fecha)) return null
  if (!esPrecio(precio_hoy) || !esPrecio(precio_tachado) || !esPrecio(minimo_registrado)) return null
  if (typeof descuento_anunciado !== 'number') return null
  // Si no es inflado según la misma regla del bot, no se muestra.
  if (minimo_registrado >= precio_hoy * 0.95) return null
  return {
    id: x.id,
    titulo: x.titulo,
    url: urlPlana(x.url),
    img: esTexto(x.img) && x.img.startsWith('https://http2.mlstatic.com/') ? x.img : null,
    precio_hoy,
    precio_tachado,
    descuento_anunciado,
    minimo_registrado,
    minimo_fecha: x.minimo_fecha.slice(0, 10),
    visto_desde: esFecha(x.visto_desde) ? x.visto_desde.slice(0, 10) : null,
    diferencia_pct: Math.round((1 - minimo_registrado / precio_hoy) * 100),
  }
}

let cache: InfladasDelDia | null = null

export function getInfladas(): InfladasDelDia {
  if (cache) return cache
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'infladas.json'), 'utf8'))
    const items: unknown[] = Array.isArray(raw?.items) ? raw.items : []
    cache = {
      actualizado: esTexto(raw.actualizado) ? raw.actualizado : null,
      fecha: esFecha(raw.fecha) ? raw.fecha.slice(0, 10) : null,
      detectadas: typeof raw.infladas_detectadas === 'number' ? raw.infladas_detectadas : null,
      casos: items
        .map(i => (i && typeof i === 'object' ? aCaso(i as Record<string, unknown>) : null))
        .filter((c): c is CasoInflado => c !== null),
    }
  } catch {
    cache = VACIO
  }
  return cache
}

/** Categoría del sitio del producto (misma regla de keywords que /categoria). */
export function categoriaDe(titulo: string): Categoria | undefined {
  const t = normalizar(titulo)
  const inicio = t.split(/\s+/).slice(0, 4).join(' ')
  return CATEGORIAS.find(c => c.keywords.some(k => t.includes(k)) && !c.excluir.some(x => inicio.includes(x)))
}

export const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** "2026-09-02" → "02/09" (con año si no es el de `referencia`). */
export function diaMes(iso: string, referencia?: string | null) {
  const [a, m, d] = iso.slice(0, 10).split('-')
  return referencia && referencia.slice(0, 4) !== a ? `${d}/${m}/${a}` : `${d}/${m}`
}
