import type { Metadata, Viewport } from 'next'
import { Inter, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import Clarity from './clarity'

const inter = Inter({ subsets: ['latin'] })
// Fuente de titulares y precios: le da carácter propio a la marca de ofertas
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const viewport: Viewport = {
  themeColor: '#09090b',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://calculadoraml.com.ar'),
  title: 'CalculadoraML — Productos rentables de Mercado Libre',
  description: 'Descubrí los 50 productos más rentables de Mercado Libre hoy. Calculadora de ganancia incluida, gratis y actualizada a diario.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${display.variable} bg-zinc-950 text-white antialiased`}>
        {children}
        <Clarity />
      </body>
    </html>
  )
}
