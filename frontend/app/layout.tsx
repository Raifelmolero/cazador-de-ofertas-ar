import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://calculadoraml.com.ar'),
  title: 'SEO Pasivo ML — Calculadora de Ganancia',
  description: 'Descubrí los productos más rentables de Mercado Libre y calculá tu ganancia neta en segundos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
