import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Calculadora de cuotas sin interés de Mercado Libre — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'calc', etiqueta: 'Cuotas sin interés', titulo: '¿Cuánto te cuesta ofrecer cuotas sin interés?', bajada: 'Costo extra, cuánto te deposita ML y a qué precio publicar.' })
}
