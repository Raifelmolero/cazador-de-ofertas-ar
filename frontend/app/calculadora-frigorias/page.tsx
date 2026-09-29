import type { Metadata } from 'next'
import Link from 'next/link'
import CalculadoraFrigorias, { type AireOferta } from '@/components/CalculadoraFrigorias'
import Footer from '@/components/Footer'
import { busquedaML } from '@/lib/afiliado'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { BTU_POR_FRIGORIA, FRIGORIAS_POR_KW, btuAFrigorias, frigoriasDelTitulo } from '@/lib/frigorias'
import { descripcionSeo, tituloSeo } from '@/lib/seo'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/calculadora-frigorias`
const TITULO = 'Calculadora de frigorías: qué aire acondicionado necesito'
const DESCRIPCION =
  'Calculá las frigorías de tu aire acondicionado según m², altura, sol, personas y equipos. Convertí frigorías, BTU y kW y mirá aires en oferta de ese tamaño.'

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} | Cazador de Ofertas`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const miles = (n: number) => Math.round(n).toLocaleString('es-AR')
const bpf = BTU_POR_FRIGORIA.toFixed(3).replace('.', ',')

const FAQS = [
  {
    q: '¿Cómo se calcula el aire acondicionado para un ambiente?',
    a: 'Una estimación orientativa muy usada en Argentina es multiplicar el volumen (m² × altura del techo) por 50 frigorías. Después se suma entre 10% y 20% si el ambiente recibe mucho sol o es último piso, unas 100 frigorías por cada persona más allá de dos y 0,86 frigorías por cada watt de equipos prendidos. Luego se elige el tamaño comercial inmediatamente superior.',
  },
  {
    q: '¿Cuántas frigorías por metro cuadrado necesito?',
    a: `Con techo de 2,60 m, la regla de 50 frigorías por m³ da unas 130 frigorías por m² (con 2,50 m, 125). Así, 20 m² piden unas 2.600 frigorías: un equipo de 2.750 o 3.000. Es una estimación orientativa, no una norma.`,
  },
  {
    q: '¿Cuántas frigorías son 18000 BTU?',
    a: `18.000 BTU/h son ${miles(btuAFrigorias(18000))} frigorías/h, porque 1 frigoría/h equivale a ${bpf} BTU/h. Por eso los equipos de 18.000 BTU se venden como de 4.500 frigorías. 12.000 BTU son unas ${miles(btuAFrigorias(12000))} frigorías (equipos de 3.000) y 9.000 BTU unas ${miles(btuAFrigorias(9000))} (2.250).`,
  },
  {
    q: '¿Cómo paso de frigorías a kW?',
    a: `1 kW son ${FRIGORIAS_POR_KW.toFixed(2).replace('.', ',')} frigorías/h. Un equipo de 3.000 frigorías tiene unos ${(3000 / FRIGORIAS_POR_KW).toFixed(2).replace('.', ',')} kW (3.500 W) de capacidad de frío; no confundir con lo que consume de electricidad, que es bastante menos.`,
  },
  {
    q: '¿Qué tamaño de aire acondicionado compro?',
    a: 'Los tamaños comerciales habituales son 2.250, 2.750, 3.000, 3.500, 4.500, 5.500 y 6.000 frigorías. Elegí el primero que supere tu cálculo. Si pasás de 6.000, suele convenir dividir el ambiente en dos equipos o pedir un cálculo profesional.',
  },
]

function airesEnOferta(): AireOferta[] {
  const c = getComparativa('mejores-aires-acondicionados')
  if (!c) return []
  return productosDe(c).flatMap(p => {
    const frig = frigoriasDelTitulo(p.titulo)
    if (!frig || frig < 1500 || frig > 12000) return []
    return [{ id: p.id_ml, titulo: p.titulo, precio: p.precio_actual, descuento: p.descuento_pct ?? null, url: p.url_producto, frig }]
  })
}

export default function CalculadoraFrigoriasPage() {
  const aires = airesEnOferta()
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de frigorías',
      url: URL,
      description: DESCRIPCION,
      applicationCategory: 'UtilitiesApplication',
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
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-3 [text-wrap:balance]">
          Calculadora de frigorías: ¿qué aire acondicionado necesito?
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Poné los metros del ambiente, la altura del techo, cuánto sol le da, cuántas personas suelen estar y los equipos
          que quedan prendidos. Te decimos cuántas frigorías necesitás, su equivalente en BTU y kW, el tamaño de equipo a
          comprar y qué aires de ese tamaño están en oferta hoy.
        </p>

        <CalculadoraFrigorias aires={aires} busqueda={busquedaML('aire acondicionado split')} />

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Cómo calculamos</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 leading-relaxed">
            <li>
              <strong className="text-zinc-200">Conversiones (exactas):</strong> 1 frigoría/h = 1 kcal/h = {bpf} BTU/h, y 1 kW ={' '}
              {FRIGORIAS_POR_KW.toFixed(2).replace('.', ',')} frigorías/h. Salen de las definiciones de la caloría internacional
              (4,1868 J) y del BTU (1055,056 J) publicadas por el NIST.
            </li>
            <li>
              <strong className="text-zinc-200">Carga base (estimación orientativa):</strong> m² × altura × 50 frigorías. Es la
              regla práctica que usan vendedores e instaladores en Argentina; no encontramos una norma oficial que la fije.
            </li>
            <li>
              <strong className="text-zinc-200">Sol (orientativo):</strong> +10% con sol normal y +20% con mucho sol, orientación
              norte/oeste, ventanales o último piso.
            </li>
            <li>
              <strong className="text-zinc-200">Personas (orientativo):</strong> +100 frigorías por cada persona más allá de dos
              (una persona en reposo libera unos 100-120 W de calor).
            </li>
            <li>
              <strong className="text-zinc-200">Equipos (físico):</strong> toda la electricidad que consume un aparato termina
              en calor: cada watt suma 0,86 frigorías.
            </li>
          </ul>
          <p className="text-sm text-zinc-500 mt-3">
            Para ambientes con mucho vidrio, techos de chapa, cocinas o locales comerciales, pedí un cálculo de carga térmica
            a un instalador matriculado. Más detalle en la{' '}
            <Link href="/guias/cuantas-frigorias-necesito-aire-acondicionado" className="text-yellow-400 hover:underline">
              guía de cuántas frigorías necesito
            </Link>{' '}
            y en la{' '}
            <Link href="/mejores/mejores-aires-acondicionados" className="text-yellow-400 hover:underline">
              comparativa de aires en oferta
            </Link>
            .
          </p>
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
          <div className="text-xs text-zinc-600 mt-6 space-y-1">
            <p>Fuentes:</p>
            <ul className="list-disc pl-5">
              <li>
                <a
                  href="https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-400"
                >
                  NIST SP 811, apéndice B: factores de conversión (BTU y caloría internacional)
                </a>
              </li>
              <li>
                <a href="https://es.wikipedia.org/wiki/Frigor%C3%ADa" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                  Frigoría (definición: 1 kcal/h de frío)
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <Footer brand="ofertas" />
    </main>
  )
}
