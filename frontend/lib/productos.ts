import { normalizar } from '@/lib/categorias'
import fs from 'fs'
import path from 'path'
import { CARGO_REFERENCIA, costoFijo, netoML } from '@/lib/costosml'

export interface ProductWithMargins {
  id_ml: string
  titulo: string
  categoria_principal: string
  precio_actual: number
  precio_anterior?: number
  descuento_pct?: number
  minimo_historico?: boolean
  relampago?: boolean
  prioridad?: number
  precio_minimo_registrado?: number | null
  seguimiento_desde?: string | null
  moneda: string
  ventas_estimadas: number | string | null
  url_producto: string
  url_imagen: string | null
  comision_clasica_pct: number
  comision_premium_pct: number
  retencion_iibb_pct: number
  costo_envio_base_ars: number
  margen_neto_clasico_ars: number
  margen_neto_premium_ars: number
}

function readJson() {
  const filePath = path.join(process.cwd(), 'data', 'productos_rentables.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

// Los márgenes se recalculan acá con los costos oficiales de ML (lib/costosml)
// en vez de confiar en los que escribió el bot: así el sitio no depende de que
// haya corrido una versión nueva del bot. "Margen" = lo que deposita ML (sin
// restar el costo del producto, que cada vendedor pone en la calculadora).
// costo_envio_base_ars pasa a ser el costo fijo por unidad (< $33.000).
function conCostosML(p: ProductWithMargins): ProductWithMargins {
  const fijo = costoFijo(p.precio_actual)
  return {
    ...p,
    comision_clasica_pct: CARGO_REFERENCIA / 100,
    comision_premium_pct: (CARGO_REFERENCIA + 13.4) / 100,
    retencion_iibb_pct: 0,
    costo_envio_base_ars: fijo,
    margen_neto_clasico_ars: netoML(p.precio_actual),
    margen_neto_premium_ars: netoML(p.precio_actual, CARGO_REFERENCIA + 13.4),
  }
}

/** Solo los campos que usan ProductsGrid/ProductCard (la home de calculadoraml
 *  mandaba los ~420 productos completos al cliente: 1,3 MB de HTML). */
export type ProductoLight = Pick<
  ProductWithMargins,
  'id_ml' | 'titulo' | 'precio_actual' | 'margen_neto_clasico_ars' | 'minimo_historico' | 'relampago' | 'url_imagen' | 'url_producto'
>

export const aLight = (p: ProductWithMargins): ProductoLight => ({
  id_ml: p.id_ml,
  titulo: p.titulo,
  precio_actual: p.precio_actual,
  margen_neto_clasico_ars: p.margen_neto_clasico_ars,
  minimo_historico: p.minimo_historico,
  relampago: p.relampago,
  url_imagen: p.url_imagen,
  url_producto: p.url_producto,
})

export function getProductos(): ProductWithMargins[] {
  const items = (readJson().items as ProductWithMargins[]).map(conCostosML)
  return items.sort((a, b) => b.margen_neto_clasico_ars - a.margen_neto_clasico_ars)
}

export function getProductoById(id: string): ProductWithMargins | undefined {
  return getProductos().find(p => p.id_ml === id)
}

// Ofertas para compradores (/hoy): primero las de mayor ganancia esperada
// (ticket × comisión, calculada por el bot), después por % OFF.
export function getOfertas(): ProductWithMargins[] {
  const items = readJson().items as ProductWithMargins[]
  return items.sort(
    (a, b) =>
      (b.prioridad ?? 0) - (a.prioridad ?? 0) ||
      Number(b.minimo_historico ?? false) - Number(a.minimo_historico ?? false) ||
      (b.descuento_pct ?? 0) - (a.descuento_pct ?? 0)
  )
}

export function getScrapedAt(): Date {
  return new Date(readJson().metadata.scraped_at)
}

/**
 * Mismo título de ML en varias publicaciones (distintos vendedores): la ficha
 * principal es la más barata (empate: id). Las demás ponen su canonical ahí y
 * no reciben links de vecinas.
 */
let principalPorId: Map<string, ProductWithMargins> | null = null
export function fichaPrincipal(p: ProductWithMargins): ProductWithMargins {
  if (!principalPorId) {
    const clave = (x: ProductWithMargins) => normalizar(x.titulo).replace(/\s+/g, ' ').trim()
    const mejor = new Map<string, ProductWithMargins>()
    const todos = getProductos()
    for (const x of todos) {
      const m = mejor.get(clave(x))
      if (!m || x.precio_actual < m.precio_actual || (x.precio_actual === m.precio_actual && x.id_ml < m.id_ml)) mejor.set(clave(x), x)
    }
    principalPorId = new Map(todos.map(x => [x.id_ml, mejor.get(clave(x))!]))
  }
  return principalPorId.get(p.id_ml) ?? p
}

/** Fichas de /calculadora ordenadas por precio (orden estable: precio, id), sin duplicados. */
export function getFichasPorPrecio(): ProductWithMargins[] {
  return getProductos().filter(p => fichaPrincipal(p).id_ml === p.id_ml).sort((a, b) => a.precio_actual - b.precio_actual || a.id_ml.localeCompare(b.id_ml))
}

/** Vecinos fijos en el orden por precio (circular): n/2 más baratos y n/2 más
 *  caros. Así cada ficha recibe links de sus vecinas y ninguna queda huérfana. */
export function fichasParecidas(id: string, n = 6): ProductWithMargins[] {
  const lista = getFichasPorPrecio()
  const i = lista.findIndex(p => p.id_ml === id)
  if (i < 0 || lista.length < 2) return []
  const out: ProductWithMargins[] = []
  for (let k = 1; out.length < Math.min(n, lista.length - 1); k++) {
    out.push(lista[(i - k + lista.length) % lista.length])
    if (out.length < Math.min(n, lista.length - 1)) out.push(lista[(i + k) % lista.length])
  }
  return out.sort((a, b) => a.precio_actual - b.precio_actual)
}
