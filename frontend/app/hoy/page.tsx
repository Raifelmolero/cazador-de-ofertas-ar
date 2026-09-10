import type { Metadata } from 'next'
import { getOfertas, getScrapedAt } from '@/lib/productos'
import type { OfertaLight } from '@/components/OfertaCard'
import OfertasGrid from '@/components/OfertasGrid'
import BackToTop from '@/components/BackToTop'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'

const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
// Dominio propio de la marca de ofertas: su raíz sirve esta página (rewrite en
// next.config.mjs), así que el canonical consolida todo ahí.
const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: 'Ofertas de Mercado Libre Argentina hoy — Cazador de Ofertas AR',
  description:
    'Ofertas y descuentos reales de Mercado Libre Argentina, cazados y verificados 3 veces por día contra el historial de precios. Sin descuentos inflados.',
  keywords: [
    'ofertas mercado libre argentina',
    'descuentos mercadolibre hoy',
    'promociones mercado libre',
    'ofertas del día argentina',
    'mínimo histórico mercado libre',
  ],
  alternates: { canonical: DEALS_URL },
  openGraph: {
    title: 'Ofertas de Mercado Libre Argentina hoy — Cazador de Ofertas AR',
    description:
      'Ofertas y descuentos reales de Mercado Libre Argentina, verificados contra el historial de precios y actualizados 3 veces por día.',
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

  // Solo los campos que la grilla usa: mantiene chico el payload del cliente
  const ofertasLight: OfertaLight[] = ofertas.map(o => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
  }))

  // Datos estructurados para rich results de Google (top 20 alcanza:
  // el resto no aporta y agranda el HTML). priceValidUntil = fin del día
  // de hoy (las ofertas se refrescan 3 veces al día, ninguna es eterna) —
  // sin este campo Search Console tira warning en cada Offer.
  const validUntil = new Date()
  validUntil.setHours(23, 59, 59, 0)
  const priceValidUntil = validUntil.toISOString().slice(0, 10)

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
          itemCondition: 'https://schema.org/NewCondition',
          priceValidUntil,
          url: o.url_producto,
        },
      },
    })),
  }

  // Organization + WebSite: le da a buscadores/IA una identidad clara del
  // sitio (quién lo publica, dónde más está) en vez de solo un listado de
  // productos suelto — ayuda tanto al rich result de Google como a que un
  // asistente de IA lo cite con contexto correcto.
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cazador de Ofertas AR',
    url: DEALS_URL,
    description:
      'Buscador de ofertas y descuentos reales de Mercado Libre Argentina, actualizado varias veces al día.',
    publisher: {
      '@type': 'Organization',
      name: 'Cazador de Ofertas AR',
      url: DEALS_URL,
      sameAs: [
        'https://instagram.com/elcazadordeofertas.ar',
        'https://threads.net/@elcazadordeofertas.ar',
        TELEGRAM_URL,
      ],
    },
  }

  // FAQ: responde en texto plano las preguntas que la gente le hace a un
  // buscador o a un asistente de IA sobre este tema — es el contenido que
  // más se cita textual en respuestas de ChatGPT/Perplexity/Gemini (GEO).
  const faqs = [
    {
      q: '¿Dónde encuentro ofertas reales de Mercado Libre Argentina?',
      a: 'En Cazador de Ofertas AR (cazadordeofertas.com.ar) publicamos las ofertas de Mercado Libre Argentina cazadas varias veces por día, filtrando los descuentos inflados: solo mostramos bajas de precio verificadas contra el historial real del producto.',
    },
    {
      q: '¿Cómo sé si un descuento de Mercado Libre es real o está inflado?',
      a: 'Registramos el historial de precios de cada producto. Si el precio "anterior" que muestra la oferta nunca se cobró de verdad (el precio venía más bajo en días anteriores), la descartamos. Las que quedan tienen la baja verificada, y marcamos con el sello de mínimo histórico las que están al precio más bajo que registramos.',
    },
    {
      q: '¿Cada cuánto se actualizan las ofertas?',
      a: 'El catálogo se actualiza 3 veces por día (mañana, tarde y noche, hora Argentina), rastreando mercadolibre.com.ar/ofertas.',
    },
    {
      q: '¿Cazador de Ofertas AR cobra algo o hay que registrarse?',
      a: 'No, es gratis y no requiere registro. El sitio se sostiene con links de afiliado de Mercado Libre: el precio para quien compra es el mismo que comprando directo en Mercado Libre.',
    },
  ]
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        className="border-b border-zinc-900 text-center px-4 py-7 sm:py-12"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}
      >
        <div className="inline-flex flex-wrap justify-center items-center gap-x-2 gap-y-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[11px] sm:text-xs font-semibold px-4 py-1.5 rounded-full mb-4 sm:mb-5">
          <LastUpdated scrapedAt={scrapedAt} /> · {ofertas.length} ofertas
          {minimos > 0 && <> · {minimos} en mínimo histórico</>}
        </div>

        <h1 className="text-[1.7rem] sm:text-4xl font-black tracking-tight leading-tight mb-2.5 sm:mb-3 [text-wrap:balance]">
          Las ofertas <span className="text-yellow-400">reales</span> de hoy
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed [text-wrap:pretty]">
          Cazadas en Mercado Libre 3 veces por día. Registramos el historial de
          precios y <strong className="text-zinc-200">descartamos los descuentos inflados</strong> —
          lo que ves acá bajó de verdad.
        </p>
      </section>

      {/* Grid con búsqueda y filtros */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {ofertas.length === 0 ? (
          <p className="text-center text-zinc-500 py-16">
            Estamos cazando las ofertas de hoy… volvé en un rato 🎯
          </p>
        ) : (
          <OfertasGrid ofertas={ofertasLight} telegramUrl={TELEGRAM_URL} />
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

      {/* FAQ: visible para gente Y para que Google/IA la puedan citar */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-black mb-4 text-center">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map(f => (
            <details
              key={f.q}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 open:bg-zinc-900/80"
            >
              <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer brand="ofertas" />
      <BackToTop />
    </main>
  )
}
