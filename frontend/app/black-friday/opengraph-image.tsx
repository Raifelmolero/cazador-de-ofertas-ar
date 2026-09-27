import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Black Friday — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({ marca: 'cazador', etiqueta: 'Black Friday', titulo: 'Black Friday en Argentina: fecha y ofertas reales', bajada: 'Cómo detectar descuentos inflados y ofertas verificadas.' })
}
