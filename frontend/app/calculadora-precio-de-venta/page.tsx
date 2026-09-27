import type { Metadata } from 'next'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import CalculadoraPrecioVenta from '@/components/CalculadoraPrecioVenta'
import Footer from '@/components/Footer'
import {
  CARGO_MAX,
  CARGO_MIN,
  COSTOS_VERIFICADOS,
  COSTOS_VIGENCIA,
  FUENTE_COSTOS,
  SIMULADOR_ML,
  UMBRAL_COSTO_FIJO,
} from '@/lib/costosml'
import { CALC_URL, GUIAS_VENDER } from '@/lib/vender'

const URL = `${CALC_URL}/calculadora-precio-de-venta`
const pct = (n: number) => String(n).replace('.', ',')
const umbral = `$${UMBRAL_COSTO_FIJO.toLocaleString('es-AR')}`
const TITULO = '¿A cuánto tengo que publicar en Mercado Libre? Calculadora de precio de venta 2026'
const DESCRIPCION = `Poné tu costo y la ganancia que querés y te decimos a qué precio publicar en Mercado Libre Argentina: incluye cargo por vender (${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%), costo fijo por unidad, cuotas y envío. Costos vigentes desde el ${COSTOS_VIGENCIA}.`

export const metadata: Metadata = {
  title: `${TITULO} — CalculadoraML`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const FAQS = [
  {
    q: '¿Por qué no alcanza con sumarle la comisión al costo?',
    a: 'Porque Mercado Libre cobra el porcentaje sobre el precio final, no sobre tu costo. Si subís el precio, la comisión también sube. Por eso hay que dividir por (1 − porcentaje total) en lugar de sumar el porcentaje.',
  },
  {
    q: `¿Qué pasa con el costo fijo cerca de ${umbral}?`,
    a: `El costo fijo por unidad se cobra solo en productos de menos de ${umbral} y depende de la franja de precio. Desde ${umbral} no se cobra, así que a veces te conviene publicar justo a ${umbral}: el comprador paga un poco más y vos ganás más que publicando apenas por debajo.`,
  },
  {
    q: '¿La ganancia que calcula incluye impuestos?',
    a: 'No. Es lo que te queda después de lo que cobra Mercado Libre, el envío que pagás y tu costo, antes de tus impuestos propios (monotributo, ingresos brutos o retenciones según tu condición fiscal).',
  },
]

export default function CalculadoraPrecioVentaPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de precio de venta de Mercado Libre',
      url: URL,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-AR',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'ARS' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <CalcHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3 [text-wrap:balance]">
          ¿A cuánto tengo que publicar en Mercado Libre?
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Poné lo que te cuesta el producto y cuánto querés ganar, y te decimos el precio exacto de publicación. Tiene en
          cuenta el cargo por vender, el costo fijo por unidad (que cambia según la franja de precio), las cuotas y el envío,
          con los costos oficiales vigentes desde el {COSTOS_VIGENCIA}.
        </p>

        <CalculadoraPrecioVenta />

        <p className="mt-6 text-sm text-zinc-400 max-w-3xl">
          ¿Ya tenés un precio y querés ver cuánto te queda?{' '}
          <Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">
            Usá la calculadora de comisiones
          </Link>
          .
        </p>

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-bold text-zinc-100 mb-1">{f.q}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-6">
            Costos verificados el {COSTOS_VERIFICADOS} en la{' '}
            <a href={FUENTE_COSTOS} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
              ayuda oficial de Mercado Libre
            </a>
            . Para el porcentaje exacto de tu categoría usá el{' '}
            <a href={SIMULADOR_ML} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
              simulador de costos de ML
            </a>
            .
          </p>
        </section>

        <nav className="mt-10 max-w-3xl">
          <h2 className="font-bold text-zinc-300 mb-2">Guías para vender</h2>
          <ul className="space-y-1.5 text-sm">
            {GUIAS_VENDER.map(g => (
              <li key={g.slug}>
                <Link href={`/vender/${g.slug}`} className="text-yellow-400 hover:underline">
                  {g.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Footer />
    </main>
  )
}
