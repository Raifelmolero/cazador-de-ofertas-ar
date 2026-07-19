import type { Metadata } from 'next'
import { getOfertas, getScrapedAt } from '@/lib/productos'
import OfertaCard from '@/components/OfertaCard'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'

export const revalidate = 3600

const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
// Dominio propio de la marca de ofertas: su raíz sirve esta página (rewrite en
// next.config.mjs), así que el canonical consolida todo ahí.
const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: 'Ofertas de hoy — Cazador de Ofertas AR',
  description:
    'Las mejores ofertas reales de Mercado Libre Argentina, cazadas y verificadas 3 veces por día. Sin humo: filtramos los descuentos inflados.',
  alternates: { canonical: DEALS_URL },
  openGraph: {
    title: 'Ofertas de hoy — Cazador de Ofertas AR',
    description:
      'Las mejores ofertas reales de Mercado Libre Argentina, actualizadas 3 veces por día.',
    url: DEALS_URL,
    siteName: 'Cazador de Ofertas AR',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function HoyPage() {
  const ofertas = getOfertas()
  const scrapedAt = getScrapedAt().toISOString()
  const minimos = ofertas.filter(o => o.minimo_historico).length

  // Datos estructurados para rich results de Google (top 20 alcanza:
  // el resto no aporta y agranda el HTML).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ofertas de hoy — Cazador de Ofertas AR',
    url: DEALS_URL,
    numberOfItems: ofertas.length,
    itemListElement: ofertas.slice(0, 20).map((o, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: o.titulo,
        ...(o.url_imagen ? { image: o.url_imagen } : {}),
        offers: {
          '@type': 'Offer',
          price: Math.round(o.precio_actual),
          priceCurrency: 'ARS',
          availability: 'https://schema.org/InStock',
          url: o.url_producto,
        },
      },
    })),
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <span className="text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
            <span className="hidden sm:inline text-zinc-500 font-semibold text-sm ml-1.5">AR</span>
          </span>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            Unite al canal ✈️
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        className="border-b border-zinc-900 text-center px-4 py-10 sm:py-14"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}
      >
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          <LastUpdated scrapedAt={scrapedAt} /> · {ofertas.length} ofertas
          {minimos > 0 && <> · {minimos} en mínimo histórico</>}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
          Las ofertas <span className="text-yellow-400">reales</span> de hoy
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Cazadas en Mercado Libre 3 veces por día. Registramos el historial de
          precios y <strong className="text-zinc-200">descartamos los descuentos inflados</strong> —
          lo que ves acá bajó de verdad.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {ofertas.length === 0 ? (
          <p className="text-center text-zinc-500 py-16">
            Estamos cazando las ofertas de hoy… volvé en un rato 🎯
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ofertas.map(o => (
              <OfertaCard key={o.id_ml} producto={o} />
            ))}
          </div>
        )}
      </section>

      {/* CTA canal */}
      <section className="max-w-2xl mx-auto px-4 pb-4 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-8">
          <h2 className="text-xl font-black mb-2">
            ¿Querés las ofertas apenas salen? 🔥
          </h2>
          <p className="text-sm text-zinc-400 mb-5">
            En el canal de Telegram publicamos las mejores 3 veces por día,
            con alerta de mínimos históricos.
          </p>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-8 py-3 transition-colors"
          >
            Unirme al canal ✈️
          </a>
        </div>

        <p className="text-xs text-zinc-600 mt-6">
          ¿Revendés en Mercado Libre?{' '}
          {/* Absoluto a propósito: en cazadordeofertas.com.ar la raíz vuelve a esta misma página */}
          <a href="https://www.calculadoraml.com.ar" className="text-yellow-400/80 hover:text-yellow-400 transition-colors">
            Mirá el margen de estos productos en CalculadoraML →
          </a>
        </p>
      </section>

      <Footer brand="ofertas" />
    </main>
  )
}
