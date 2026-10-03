import { ogCard, OG_SIZE } from '@/lib/og-card'
import { getComparativa } from '@/lib/comparativas'

export const alt = 'Comparativa de precios — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getComparativa(slug)
  return ogCard({
    marca: 'cazador',
    etiqueta: 'Comparativa',
    titulo: c?.titulo ?? 'Comparativas de precios',
    bajada: 'Los modelos en oferta hoy, comparados con su historial de precios.',
  })
}
