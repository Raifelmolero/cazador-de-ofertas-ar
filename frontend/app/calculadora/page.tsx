import type { Metadata } from 'next'
import Link from 'next/link'
import { getFichasPorPrecio } from '@/lib/productos'
import { CALC_URL } from '@/lib/vender'
import CalcHeader from '@/components/CalcHeader'
import Footer from '@/components/Footer'

// Índice de todas las fichas /calculadora/[id], agrupadas por rango de precio.
// Existe para que cada ficha tenga al menos un link interno rastreable (la
// grilla de la home pagina en el cliente y solo muestra las primeras 48).

const URL = `${CALC_URL}/calculadora`
const TITULO = 'Calculadora de ganancia por producto de Mercado Libre'
const DESCRIPCION = 'Todas las fichas de productos en tendencia de Mercado Libre con cuánto te deposita ML por venta, ordenadas por precio.'

export const metadata: Metadata = {
  title: `${TITULO} | CalculadoraML`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const RANGOS: { hasta: number; nombre: string }[] = [
  { hasta: 20000, nombre: 'Hasta $20.000' },
  { hasta: 50000, nombre: 'De $20.000 a $50.000' },
  { hasta: 100000, nombre: 'De $50.000 a $100.000' },
  { hasta: 300000, nombre: 'De $100.000 a $300.000' },
  { hasta: Infinity, nombre: 'Más de $300.000' },
]

const ars = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

export default function IndiceFichas() {
  const fichas = getFichasPorPrecio()
  const grupos = RANGOS.map((r, i) => ({
    ...r,
    items: fichas.filter(p => p.precio_actual < r.hasta && (i === 0 || p.precio_actual >= RANGOS[i - 1].hasta)),
  })).filter(g => g.items.length > 0)

  return (
    <main className="min-h-screen">
      <CalcHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">{TITULO}</h1>
        <p className="text-sm text-zinc-400 mb-6 [text-wrap:pretty]">
          {fichas.length} productos en tendencia. Cada ficha muestra el precio en ML, lo que te deposita por venta con los costos
          oficiales y una calculadora para poner tu costo. Para un precio cualquiera usá la{' '}
          <Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">calculadora de comisiones</Link>.
        </p>
        <nav aria-label="Rangos de precio" className="flex flex-wrap gap-2 mb-8 text-xs">
          {grupos.map((g, i) => (
            <a key={g.nombre} href={`#rango-${i}`} className="border border-zinc-700 hover:border-yellow-400 text-zinc-300 rounded-full px-3 py-1">
              {g.nombre} ({g.items.length})
            </a>
          ))}
        </nav>
        {grupos.map((g, i) => (
          <section key={g.nombre} id={`rango-${i}`} className="mb-8">
            <h2 className="text-lg font-bold text-white mb-3">{g.nombre}</h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {g.items.map(p => (
                <li key={p.id_ml} className="flex justify-between gap-3 min-w-0">
                  <Link href={`/calculadora/${p.id_ml}`} className="text-zinc-300 hover:text-yellow-400 truncate">
                    {p.titulo}
                  </Link>
                  <span className="shrink-0 text-zinc-500 tabular-nums">{ars(p.precio_actual)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Footer />
    </main>
  )
}
