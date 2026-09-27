import { ogCard } from '@/lib/og-card'

// OG del home de calculadoraml. No es app/opengraph-image.tsx porque ese se
// heredaría a todas las páginas sin OG propio (incluidas las del Cazador).
export const dynamic = 'force-static'

export function GET() {
  return ogCard({
    marca: 'calc',
    etiqueta: 'Gratis',
    titulo: 'Calculadora de comisiones de Mercado Libre',
    bajada: 'Cuánto te cobra ML y cuánto te queda por venta. ML vs Tiendanube y guías para vendedores.',
  })
}
