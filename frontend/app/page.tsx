import { getProductos, getScrapedAt } from '@/lib/productos'
import ProductsGrid from '@/components/ProductsGrid'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'

export const revalidate = 3600

export default function HomePage() {
  const productos = getProductos()
  const scrapedAt = getScrapedAt().toISOString()

  const margenPromedio = Math.round(
    productos.reduce(
      (sum, p) => sum + (p.margen_neto_clasico_ars / p.precio_actual) * 100,
      0
    ) / productos.length
  )

  return (
    <main className="min-h-screen">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-yellow-400 tracking-tight">CalculadoraML</span>
            <span className="hidden sm:inline text-xs text-zinc-600 ml-2">Mercado Libre Argentina</span>
          </div>
          <span className="text-xs font-bold text-black bg-yellow-400 px-3 py-1.5 rounded-full">
            {productos.length} productos hoy
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-900 text-center px-4 py-14 sm:py-20"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <LastUpdated scrapedAt={scrapedAt} /> · {productos.length} productos analizados
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
          Los productos más rentables<br />
          de <span className="text-yellow-400">Mercado Libre</span> ahora
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Analizamos tendencias diariamente para que encuentres qué vale la pena comprar o revender.
          Calculadora de ganancia incluida, gratis.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-10 sm:gap-16 mb-8">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-yellow-400">{productos.length}</span>
            <span className="block text-xs text-zinc-600 mt-1">productos</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-yellow-400">{margenPromedio}%</span>
            <span className="block text-xs text-zinc-600 mt-1">margen promedio</span>
          </div>
          <div>
            <span className="block text-xl sm:text-2xl font-black text-yellow-400 leading-tight">
              <LastUpdated scrapedAt={scrapedAt} />
            </span>
            <span className="block text-xs text-zinc-600 mt-1">actualizado</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="#productos"
          className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-7 py-3 rounded-full transition-colors shadow-[0_0_30px_rgba(250,204,21,0.2)]"
        >
          Ver los productos ↓
        </a>
      </section>

      {/* Banner canal de Telegram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <a
          href="https://t.me/cazadordeofertasar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-sky-400/20 bg-sky-400/5 hover:bg-sky-400/10 transition-colors px-6 py-5"
        >
          <div className="text-center sm:text-left">
            <span className="block text-sm font-bold text-white">
              📢 Las mejores ofertas de ML, gratis en tu Telegram
            </span>
            <span className="block text-xs text-zinc-500 mt-0.5">
              3 ofertas seleccionadas por día, con precio real y % de descuento. Sin spam.
            </span>
          </div>
          <span className="shrink-0 bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs px-5 py-2.5 rounded-full transition-colors">
            Unirme al canal →
          </span>
        </a>
      </section>

      {/* Section header */}
      <div id="productos" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-end justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Productos en tendencia</h2>
          <p className="text-xs text-zinc-600 mt-0.5">Ordenados por margen de ganancia</p>
        </div>
        <span className="text-xs text-yellow-400 border border-yellow-400/20 bg-yellow-400/5 px-3 py-1 rounded-full">
          Mayor margen primero
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <ProductsGrid productos={productos} />
      </div>

      <Footer />

    </main>
  )
}
