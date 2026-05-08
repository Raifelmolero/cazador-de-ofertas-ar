import fs from 'fs'
import path from 'path'

export interface ProductWithMargins {
  id_ml: string
  titulo: string
  categoria_principal: string
  precio_actual: number
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

export function getProductos(): ProductWithMargins[] {
  const filePath = path.join(process.cwd(), '..', 'data', 'productos_rentables.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(raw)
  return data.items as ProductWithMargins[]
}

export function getProductoById(id: string): ProductWithMargins | undefined {
  return getProductos().find(p => p.id_ml === id)
}
