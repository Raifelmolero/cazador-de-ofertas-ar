import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Calculadora de frigorías — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({
    marca: 'cazador',
    etiqueta: 'Calculadora',
    titulo: 'Calculadora de frigorías: ¿qué aire acondicionado necesito?',
    bajada: 'm², altura, sol y personas → frigorías, BTU, kW y aires en oferta de ese tamaño.',
  })
}
