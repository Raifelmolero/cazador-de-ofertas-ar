import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
