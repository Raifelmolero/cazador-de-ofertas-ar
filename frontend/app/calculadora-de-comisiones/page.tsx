import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import CalculadoraComisiones from '@/components/CalculadoraComisiones'
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

const URL = `${CALC_URL}/calculadora-de-comisiones`
const pct = (n: number) => String(n).replace('.', ',')
const TITULO = 'Calculadora de comisiones de Mercado Libre 2026: cuánto te queda por venta'
const DESCRIPCION = `Calculá gratis cuánto te cobra Mercado Libre Argentina y cuánto ganás por venta: cargo por vender (${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%), costo fijo, cuotas y envío. Costos vigentes desde el ${COSTOS_VIGENCIA}.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — CalculadoraML`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const FAQS = [
  {
    q: '¿Cuánto cobra Mercado Libre por vender?',
    a: `Entre ${pct(CARGO_MIN)}% y ${pct(CARGO_MAX)}% del precio según la categoría y la provincia, más un costo fijo por unidad en productos de menos de $${UMBRAL_COSTO_FIJO.toLocaleString('es-AR')} y un costo extra si ofrecés cuotas (5% con interés bajo; de 8,90% a 21,60% al mismo precio).`,
  },
  {
    q: '¿La comisión se calcula sobre el precio o sobre la ganancia?',
    a: 'Sobre el precio de venta. Por eso, cuando subís el precio para cubrir la comisión, la comisión también sube: hay que dividir por (1 − porcentaje), no sumar el porcentaje.',
  },
  {
    q: '¿Cómo sé el porcentaje exacto de mi categoría?',
    a: 'En el simulador de costos de Mercado Libre o al crear la publicación, cuando definís el precio. Esta calculadora te deja mover el porcentaje dentro del rango oficial.',
  },
]

export default function CalculadoraComisionesPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de comisiones de Mercado Libre',
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
          Calculadora de comisiones de Mercado Libre
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Poné tu precio y tu costo y mirá cuánto te cobra Mercado Libre y cuánto te queda por venta. Usa los costos
          oficiales vigentes desde el {COSTOS_VIGENCIA}: cargo por vender, costo fijo por unidad y costo por cuotas.
        </p>

        <CalculadoraComisiones />

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
