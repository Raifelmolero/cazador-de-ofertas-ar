import { ogCard, OG_SIZE } from '@/lib/og-card'
import { GUIAS_VENDER, getGuiaVendedor } from '@/lib/vender'

export const alt = 'Guía para vendedores — CalculadoraML'
export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return GUIAS_VENDER.map(g => ({ slug: g.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuiaVendedor((await params).slug)
  return ogCard({
    marca: 'calc',
    etiqueta: 'Guía para vendedores',
    titulo: g?.titulo ?? 'Guías para vender en Mercado Libre y online',
    bajada: 'Vender en Mercado Libre y online en Argentina.',
  })
}
