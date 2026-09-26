import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { PRECIOS_HOY, ofertasDe } from '@/lib/preciohoy'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/precio-hoy`
const TITULO = 'Precio hoy en Argentina: cuánto salen los productos más buscados'
const DESC =
  'Precio de hoy de smart TV, aires, heladeras, lavarropas, colchones, notebooks y más en Mercado Libre Argentina, con el rango de las ofertas con descuento real y el historial de precios.'

export const metadata: Metadata = {
  title: `${TITULO} — Cazador de Ofertas AR`,
  description: DESC,
  alternates: { canonical: URL },
}

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

export default function PrecioHoyIndex() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight mb-4">{TITULO}</h1>
        <p className="text-zinc-400 mb-8">{DESC}</p>
        <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
          {PRECIOS_HOY.map(p => {
            const o = ofertasDe(p)
            return (
              <li key={p.slug}>
                <a href={`/precio-hoy/${p.slug}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900">
                  <span className="font-bold text-zinc-200">Precio de {p.nombre} hoy</span>
                  <span className="text-sm text-yellow-400 whitespace-nowrap">{o.length ? `desde ${precio(o[0].precio_actual)}` : 'ver historial'} →</span>
                </a>
              </li>
            )
          })}
        </ul>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
