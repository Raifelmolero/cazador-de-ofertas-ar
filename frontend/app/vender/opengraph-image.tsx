import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Guías para vender en Mercado Libre — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'calc', etiqueta: 'Guías', titulo: 'Guías para vender en Mercado Libre y online', bajada: 'Lo que necesitás para vender en Argentina, paso a paso.' })
}
