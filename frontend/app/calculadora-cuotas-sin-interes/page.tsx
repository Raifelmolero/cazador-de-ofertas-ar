import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import CalculadoraCuotas from '@/components/CalculadoraCuotas'
import Footer from '@/components/Footer'
import { COSTOS_VERIFICADOS, CUOTAS, FUENTE_COSTOS, SIMULADOR_ML } from '@/lib/costosml'
import { calcularCuotas } from '@/lib/cuotas'
import { CALC_URL } from '@/lib/vender'

const URL = `${CALC_URL}/calculadora-cuotas-sin-interes`
const ars = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
const pct = (n: number) => `${n.toString().replace('.', ',')}%`
const c = (id: string) => CUOTAS.find(x => x.id === id)!
const ej = calcularCuotas(40000, '6', 14.69)!
const TITULO = 'Calculadora de cuotas sin interés de Mercado Libre 2026'
const DESCRIPCION = `¿Cuánto te cuesta ofrecer cuotas sin interés en Mercado Libre? Poné el precio y la cantidad de cuotas: te mostramos el costo extra, cuánto te deposita ML y a qué precio publicar para cobrar lo mismo que sin cuotas. Costos verificados el ${COSTOS_VERIFICADOS}.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — CalculadoraML`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const FAQS = [
  {
    q: '¿Cuánto cuesta ofrecer cuotas sin interés en Mercado Libre?',
    a: `Es un porcentaje del precio que se suma al cargo por vender: ${pct(c('3').pct)} en 3 cuotas, ${pct(c('6').pct)} en 6, ${pct(c('9').pct)} en 9 y ${pct(c('12').pct)} en 12. Las cuotas con interés bajo (3 a 12) cuestan ${pct(c('interes-bajo').pct)}.`,
  },
  {
    q: '¿A qué precio tengo que publicar para no perder plata con las cuotas?',
    a: `No alcanza con sumar el porcentaje: el cargo por vender y las cuotas se cobran sobre el precio nuevo. Por ejemplo, a ${ars(40000)} con 6 cuotas y cargo de 14,69%, sin cuotas te depositan ${ars(ej.recibisSin)}; para cobrar lo mismo con cuotas tenés que publicar a ${ars(ej.precioIgual)} (+${ej.subaPct.toFixed(1).replace('.', ',')}%).`,
  },
  {
    q: '¿Conviene ofrecer cuotas sin interés?',
    a: 'Las cuotas suelen mejorar la conversión, sobre todo en productos caros, pero te bajan el depósito. Compará el precio que necesitás con el de tu competencia antes de activarlas.',
  },
  {
    q: '¿El costo fijo por unidad cambia con las cuotas?',
    a: 'No: depende solo del precio (aplica debajo de $33.000). Pero si subís el precio para compensar las cuotas y pasás los $33.000, el costo fijo deja de aplicar; la calculadora lo tiene en cuenta.',
  },
]

export default function CalculadoraCuotasPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de cuotas sin interés de Mercado Libre',
      url: URL,
      description: DESCRIPCION,
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
          ¿Cuánto me cuesta ofrecer cuotas sin interés en Mercado Libre?
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Poné el precio y las cuotas que querés ofrecer: te mostramos cuánto te descuenta Mercado Libre por las cuotas, cuánto te
          deposita y a qué precio publicar para cobrar lo mismo que sin cuotas. Costos verificados el {COSTOS_VERIFICADOS}.
        </p>

        <CalculadoraCuotas />

        <p className="mt-6 text-sm text-zinc-400 max-w-3xl">
          ¿Querés sumar tu costo, el envío y ver tu ganancia?{' '}
          <Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">
            Usá la calculadora de comisiones
          </Link>{' '}
          o{' '}
          <Link href="/calculadora-precio-de-venta" className="text-yellow-400 hover:underline">
            calculá a cuánto publicar
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
          <div className="text-xs text-zinc-600 mt-6 space-y-1">
            <p>Fuentes (ayuda oficial de Mercado Libre, leídas el {COSTOS_VERIFICADOS}):</p>
            <ul className="list-disc pl-5">
              <li>
                <a href={FUENTE_COSTOS} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                  Costos de vender un producto
                </a>
              </li>
              <li>
                <a href={SIMULADOR_ML} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                  Simulador de costos de Mercado Libre
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
