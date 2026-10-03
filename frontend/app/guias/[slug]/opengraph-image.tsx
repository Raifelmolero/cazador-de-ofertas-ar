import { ogCard, OG_SIZE } from '@/lib/og-card'
import { getGuia } from '@/lib/guias'

export const alt = 'Guía de compra — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = getGuia(slug)
  return ogCard({
    marca: 'cazador',
    etiqueta: 'Guía de compra',
    titulo: g?.titulo ?? 'Guías de compra',
    bajada: 'Qué mirar antes de comprar y ofertas con descuento real verificado.',
  })
}
