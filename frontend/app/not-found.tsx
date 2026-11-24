import type { Metadata } from 'next'
import Footer from '@/components/Footer'

// 404 con la marca del sitio de ofertas. Sin este archivo la 404 heredaba el title
// del layout raíz («CalculadoraML — Productos rentables…»). Next le agrega noindex solo.
const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: { absolute: 'Página no encontrada — Cazador de Ofertas AR' },
  description: 'Esta página no existe o se movió. Mirá las ofertas de hoy en Mercado Libre, el Black Friday 2026 y las comparativas por rubro.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4" aria-hidden="true">🎯</p>
        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-3">Esta página no existe</h1>
        <p className="text-zinc-400 mb-8">Puede que se haya movido o que la oferta ya no esté. Seguí por acá:</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={DEALS_URL} className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5">
            Ofertas de hoy
          </a>
          <a href={`${DEALS_URL}/black-friday`} className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-6 py-2.5">
            Black Friday 2026
          </a>
        </div>
      </section>
      <Footer brand="ofertas" />
    </main>
  )
}
