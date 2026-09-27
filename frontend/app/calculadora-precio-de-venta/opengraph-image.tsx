import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Calculadora de precio de venta de Mercado Libre — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'calc', etiqueta: 'Precio de venta', titulo: '¿A cuánto tenés que publicar en Mercado Libre?', bajada: 'Poné tu costo y la ganancia que querés: te damos el precio.' })
}
