import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Calculadora de envío gratis de Mercado Libre — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'calc', etiqueta: 'Envío gratis', titulo: '¿Cuánto te cuesta el envío gratis en Mercado Libre?', bajada: 'Según precio, peso y reputación, con las tablas oficiales.' })
}
