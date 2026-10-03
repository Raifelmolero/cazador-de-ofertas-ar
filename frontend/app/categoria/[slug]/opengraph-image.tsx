import { ogCard, OG_SIZE } from '@/lib/og-card'
import { getCategoria } from '@/lib/categorias'

export const alt = 'Ofertas por categoría — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = getCategoria(slug)
  return ogCard({
    marca: 'cazador',
    etiqueta: c?.nombre ?? 'Ofertas',
    titulo: c?.titulo ?? 'Ofertas de Mercado Libre Argentina',
    bajada: 'Descuentos verificados contra el historial de precios.',
  })
}
