import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Regalos de Navidad — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'cazador', etiqueta: 'Navidad', titulo: 'Regalos de Navidad: ofertas reales por presupuesto', bajada: 'Descuentos verificados contra el historial de precios.' })
}
