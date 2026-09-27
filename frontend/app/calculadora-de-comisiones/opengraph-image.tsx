import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Calculadora de comisiones de Mercado Libre — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'calc', etiqueta: 'Comisiones', titulo: 'Calculadora de comisiones de Mercado Libre', bajada: 'Cargo por vender, costo fijo, cuotas y envío: cuánto te queda.' })
}
