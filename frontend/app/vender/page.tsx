import type { Metadata } from 'next'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import Footer from '@/components/Footer'
import { CALC_URL, GUIAS_VENDER } from '@/lib/vender'

const URL = `${CALC_URL}/vender`
const TITULO = 'Guías para vender en Mercado Libre y online en Argentina'
const DESCRIPCION =
  'Guías cortas para vendedores y revendedores: cuánto cobra Mercado Libre, cómo calcular el precio de venta y si conviene tener tu propia tienda online.'

export const metadata: Metadata = {
  title: `${TITULO} — CalculadoraML`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

export default function VenderPage() {
  return (
    <main className="min-h-screen">
      <CalcHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3 [text-wrap:balance]">
          {TITULO}
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8">{DESCRIPCION}</p>
        <ul className="space-y-4">
          <li>
            <Link
              href="/calculadora-de-comisiones"
              className="block rounded-2xl border border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/60 p-5"
            >
              <span className="font-bold text-yellow-300">🧮 Calculadora de comisiones de Mercado Libre</span>
              <span className="block text-sm text-zinc-400 mt-1">Cuánto te cobra ML y cuánto te queda por venta.</span>
            </Link>
          </li>
          <li>
            <Link
              href="/mercado-libre-vs-tiendanube"
              className="block rounded-2xl border border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/60 p-5"
            >
              <span className="font-bold text-yellow-300">⚖️ Mercado Libre vs Tiendanube: ¿dónde te queda más plata?</span>
              <span className="block text-sm text-zinc-400 mt-1">Tu ganancia por mes en cada uno y cuántas ventas necesitás para que el plan se pague solo.</span>
            </Link>
          </li>
          {GUIAS_VENDER.map(g => (
            <li key={g.slug}>
              <Link
                href={`/vender/${g.slug}`}
                className="block rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 p-5"
              >
                <span className="font-bold text-zinc-100">{g.titulo}</span>
                <span className="block text-sm text-zinc-400 mt-1">{g.descripcion}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </main>
  )
}
