import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import CalculadoraMLvsTN from '@/components/CalculadoraMLvsTN'
import Footer from '@/components/Footer'
import { CARGO_MAX, CARGO_MIN, COSTOS_VERIFICADOS, FUENTE_COSTOS } from '@/lib/costosml'
import { FUENTE_PAGO_NUBE, FUENTE_PLANES_TN, PLANES_TN, TN_VERIFICADO } from '@/lib/tiendanube'
import { CALC_URL, GUIAS_VENDER, TIENDANUBE_AFILIADO, TIENDANUBE_URL } from '@/lib/vender'

const URL = `${CALC_URL}/mercado-libre-vs-tiendanube`
const pct = (n: number) => String(n).replace('.', ',')
const ars = (n: number) => `$${n.toLocaleString('es-AR')}`
const TITULO = 'Mercado Libre vs Tiendanube: ¿dónde te queda más plata?'
const DESCRIPCION = `Calculadora gratis: compará cuánto ganás por venta y por mes vendiendo en Mercado Libre (cargo de ${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%) o en tu tienda de Tiendanube con Pago Nube, y cuántas ventas necesitás para que el plan se pague solo.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — CalculadoraML`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const [inicial, esencial, impulso, escala] = PLANES_TN

const FAQS = [
  {
    q: '¿Cuánto cobra Tiendanube por venta si cobro con Pago Nube?',
    a: `Con Pago Nube el costo por transacción de Tiendanube está bonificado y pagás solo la tarifa de Pago Nube. Con tarjeta y acreditación a 14 días arranca en ${pct(inicial.tarjeta[14])}% + IVA en el plan Inicial, ${pct(esencial.tarjeta[14])}% en Esencial, ${pct(impulso.tarjeta[14])}% en Impulso y ${pct(escala.tarjeta[14])}% en Escala. Con transferencia, desde ${pct(esencial.transferencia)}% + IVA en Inicial y Esencial, ${pct(impulso.transferencia)}% en Impulso y ${pct(escala.transferencia)}% en Escala. Son tarifas "a partir de", según Tiendanube.`,
  },
  {
    q: '¿Cuándo conviene Tiendanube en vez de Mercado Libre?',
    a: 'Cuando lo que te ahorrás de comisión en cada venta, multiplicado por las ventas del mes, supera el abono del plan, y además ya tenés de dónde traer compradores (redes, WhatsApp, clientes que vuelven). En Mercado Libre los compradores ya están; en tu tienda los tenés que conseguir vos.',
  },
  {
    q: '¿Puedo vender en Mercado Libre y en Tiendanube al mismo tiempo?',
    a: 'Sí. Muchos vendedores usan Mercado Libre para conseguir clientes nuevos y la tienda propia para los que vuelven. Tiendanube se puede conectar con Mercado Libre para manejar el stock en un solo lugar.',
  },
]

export default function MLvsTiendanubePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora Mercado Libre vs Tiendanube',
      description: DESCRIPCION,
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
  const afiliado = Boolean(TIENDANUBE_AFILIADO)

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <CalcHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs text-zinc-500 mb-3">
          <Link href="/vender" className="hover:text-yellow-400">Guías para vender</Link>
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3 [text-wrap:balance]">
          {TITULO}
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Poné tu precio, tu costo y cuántas ventas hacés por mes. Te mostramos cuánto ganás en Mercado Libre y cuánto
          en tu propia tienda de Tiendanube cobrando con Pago Nube, restando el abono del plan, y cuántas ventas por
          mes necesitás para que el plan se pague solo.
        </p>

        <CalculadoraMLvsTN />

        <section className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <p className="text-zinc-300 mb-4">
            ¿Te dan los números? Podés arrancar con el plan Inicial ({ars(inicial.abono)} por mes) o probar un plan pago
            7 días sin costo.
          </p>
          <a
            href={TIENDANUBE_URL}
            target="_blank"
            rel={afiliado ? 'sponsored noopener' : 'noopener'}
            className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-3"
          >
            Probar Tiendanube gratis →
          </a>
          {afiliado && (
            <p className="text-xs text-zinc-500 mt-3">
              Es un link de afiliado: si abrís tu tienda desde ahí, CalculadoraML recibe una comisión sin costo extra para vos.
            </p>
          )}
        </section>

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
          <p className="text-xs text-zinc-600 mt-6 [text-wrap:pretty]">
            Datos de Tiendanube verificados el {TN_VERIFICADO} en{' '}
            <a href={FUENTE_PLANES_TN} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
              planes y precios
            </a>{' '}
            y{' '}
            <a href={FUENTE_PAGO_NUBE} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
              Pago Nube
            </a>
            ; las tarifas de Pago Nube son &ldquo;a partir de&rdquo; (las mínimas) y se les suma IVA. Costos de Mercado
            Libre verificados el {COSTOS_VERIFICADOS} en la{' '}
            <a href={FUENTE_COSTOS} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
              ayuda oficial de Mercado Libre
            </a>
            . Pueden cambiar: confirmalos antes de decidir.
          </p>
        </section>

        <nav className="mt-10 max-w-3xl">
          <h2 className="font-bold text-zinc-300 mb-2">Seguí leyendo</h2>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">
                Calculadora de comisiones de Mercado Libre
              </Link>
            </li>
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
