import fs from 'fs'
import path from 'path'

export interface ProductWithMargins {
  id_ml: string
  titulo: string
  categoria_principal: string
  precio_actual: number
  precio_anterior?: number
  descuento_pct?: number
  minimo_historico?: boolean
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

export function getProductos(): ProductWithMargins[] {
  const items = readJson().items as ProductWithMargins[]
  return items.sort((a, b) => b.margen_neto_clasico_ars - a.margen_neto_clasico_ars)
}

export function getProductoById(id: string): ProductWithMargins | undefined {
  return getProductos().find(p => p.id_ml === id)
}

// Ofertas para compradores (/hoy): mínimos históricos primero, después por % OFF.
export function getOfertas(): ProductWithMargins[] {
  const items = readJson().items as ProductWithMargins[]
  return items.sort(
    (a, b) =>
      Number(b.minimo_historico ?? false) - Number(a.minimo_historico ?? false) ||
      (b.descuento_pct ?? 0) - (a.descuento_pct ?? 0)
  )
}

export function getScrapedAt(): Date {
  return new Date(readJson().metadata.scraped_at)
}
