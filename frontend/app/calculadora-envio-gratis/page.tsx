import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import CalculadoraEnvioGratis from '@/components/CalculadoraEnvioGratis'
import Footer from '@/components/Footer'
import { ENVIO_GRATIS_VERDE, ENVIO_GRATIS_VERIFICADO, UMBRAL_COSTO_FIJO } from '@/lib/costosml'
import { AYUDA_COSTOS_ENVIO, REPUTACIONES } from '@/lib/enviogratis'
import { CALC_URL } from '@/lib/vender'

const URL = `${CALC_URL}/calculadora-envio-gratis`
const ars = (n: number) => `$${n.toLocaleString('es-AR')}`
const umbral = ars(UMBRAL_COSTO_FIJO)
const f03 = ENVIO_GRATIS_VERDE[0]
const TITULO = '¿Cuánto me cuesta el envío gratis en Mercado Libre? Calculadora 2026'
const DESCRIPCION = `Calculá cuánto pagás por el envío gratis en Mercado Libre Argentina según el precio, el peso y tu reputación (verde, amarilla o naranja/roja), y cuánto te queda después de la comisión. Desde ${umbral} es obligatorio. Tablas oficiales verificadas el ${ENVIO_GRATIS_VERIFICADO}.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — CalculadoraML`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const FAQS = [
  {
    q: '¿Desde qué precio es obligatorio el envío gratis en Mercado Libre?',
    a: `En productos nuevos desde ${umbral} el envío gratis viene incluido y el costo lo pagás vos, con un descuento según tu reputación. Por debajo de ${umbral} es opcional.`,
  },
  {
    q: '¿Cuánto cuesta el envío gratis con reputación verde?',
    a: `Hasta 0,3 kg pagás ${ars(f03.menos33)} en productos de menos de ${umbral} (30% de descuento), ${ars(f03.de33a50)} de ${umbral} a $49.999 y ${ars(f03.desde50)} desde $50.000 (50% de descuento). Sube con el peso.`,
  },
  {
    q: '¿Cómo cambia el costo con la reputación?',
    a: 'Con reputación verde, MercadoLíder o sin reputación tenés 30% de descuento debajo de $33.000 y 50% desde $33.000. Con amarilla, 20% y 40%. Con naranja o roja no hay descuento: pagás el doble que con verde.',
  },
  {
    q: '¿Qué peso se usa, el real o el volumétrico?',
    a: 'Mercado Libre compara el peso físico del paquete ya embalado con el volumétrico (calculado con las medidas de la caja) y cobra el mayor. Si tu caja es grande y liviana, el volumétrico puede subir el costo.',
  },
  {
    q: '¿Y si el paquete pesa más de 10 kg?',
    a: 'Esta calculadora cubre hasta 10 kg. La tabla oficial sigue hasta más de 180 kg: consultala en la ayuda de Mercado Libre sobre costos de envíos gratis.',
  },
]

export default function CalculadoraEnvioGratisPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de envío gratis de Mercado Libre',
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
          ¿Cuánto me cuesta el envío gratis en Mercado Libre?
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Poné el precio, el peso del paquete y el color de tu reputación: te decimos si el envío gratis es obligatorio (desde{' '}
          {umbral}), cuánto te cobra Mercado Libre por él y cuánto te deposita después de la comisión. Con las tablas oficiales
          verificadas el {ENVIO_GRATIS_VERIFICADO}.
        </p>

        <CalculadoraEnvioGratis />

        <p className="mt-6 text-sm text-zinc-400 max-w-3xl">
          ¿Querés sumar tu costo y ver tu ganancia?{' '}
          <Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">
            Usá la calculadora de comisiones
          </Link>{' '}
          o{' '}
          <Link href="/calculadora-precio-de-venta" className="text-yellow-400 hover:underline">
            calculá a cuánto publicar
          </Link>
          . Más detalle en la guía{' '}
          <Link href="/vender/envio-gratis-mercado-libre-cuanto-paga-el-vendedor" className="text-yellow-400 hover:underline">
            envío gratis: cuánto paga el vendedor
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
            <p>Fuentes (ayuda oficial de Mercado Libre, leídas el {ENVIO_GRATIS_VERIFICADO}):</p>
            <ul className="list-disc pl-5">
              <li>
                <a href="https://www.mercadolibre.com.ar/ayuda/16467" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                  Funcionamiento de los envíos gratis
                </a>
              </li>
              <li>
                <a href={AYUDA_COSTOS_ENVIO} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                  Costos de ofrecer envíos gratis
                </a>
              </li>
              {REPUTACIONES.map(r => (
                <li key={r.id}>
                  <a href={r.fuente} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                    Tabla de costos, reputación {r.nombre.toLowerCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
