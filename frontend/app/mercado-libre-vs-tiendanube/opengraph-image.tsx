import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Mercado Libre vs Tiendanube — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'calc', etiqueta: 'Comparador', titulo: 'Mercado Libre vs Tiendanube: ¿dónde te queda más plata?', bajada: 'Compará tu ganancia por venta y por mes en cada canal.' })
}
