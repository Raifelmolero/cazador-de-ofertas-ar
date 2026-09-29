import { ogCard, OG_SIZE } from '@/lib/og-card'

export const alt = 'Calculadora de consumo eléctrico — Cazador de Ofertas AR'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return ogCard({
    marca: 'cazador',
    etiqueta: 'Calculadora',
    titulo: 'Calculadora de consumo eléctrico: ¿cuánto gasta cada aparato?',
    bajada: 'Watts × horas × días → kWh por mes y costo con tu precio del kWh.',
  })
}
