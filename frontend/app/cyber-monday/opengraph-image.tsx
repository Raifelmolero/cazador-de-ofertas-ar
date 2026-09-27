import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Cyber Monday — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'cazador', etiqueta: 'Cyber Monday', titulo: 'Cyber Monday en Argentina: fechas y ofertas reales', bajada: 'Descuentos verificados contra el historial de precios.' })
}
