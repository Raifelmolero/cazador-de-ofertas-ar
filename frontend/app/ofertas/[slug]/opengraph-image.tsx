import { ogCard, OG_SIZE } from '@/lib/og-card'
import { getLanding } from '@/lib/landings'

export const alt = 'Ofertas de Mercado Libre — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const l = getLanding(slug)
  return ogCard({
    marca: 'cazador',
    etiqueta: l?.tipo === 'bajaron' ? 'Bajaron de precio' : (l?.nombre ?? 'Ofertas'),
    titulo: l?.h1 ?? 'Ofertas de Mercado Libre Argentina',
    bajada: 'Descuentos verificados contra el historial de precios.',
  })
}
