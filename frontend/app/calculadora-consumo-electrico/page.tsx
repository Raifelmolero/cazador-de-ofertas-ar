import type { Metadata } from 'next'
import Link from 'next/link'
import CalculadoraConsumo, { type OfertaEquipo } from '@/components/CalculadoraConsumo'
import Footer from '@/components/Footer'
import { busquedaML } from '@/lib/afiliado'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { EQUIPOS } from '@/lib/consumo'
import { descripcionSeo, tituloSeo } from '@/lib/seo'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/calculadora-consumo-electrico`
const TITULO = 'Calculadora de consumo eléctrico: kWh y costo por aparato'
const DESCRIPCION =
  'Calculá cuántos kWh por mes gasta tu aire, heladera, freidora, termotanque o estufa y cuánto cuesta con tu precio del kWh. Qué es la etiqueta A+.'

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} | Cazador de Ofertas`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const FAQS = [
  {
    q: '¿Cómo calculo el consumo eléctrico de un electrodoméstico?',
    a: 'Multiplicá la potencia en watts por las horas de uso por día y por los días de uso en el mes, y dividí por 1000: el resultado son kWh por mes. Por ejemplo, una estufa de 2000 W usada 4 horas por día durante 30 días consume 2000 × 4 × 30 ÷ 1000 = 240 kWh.',
  },
  {
    q: '¿Cuánto cuesta por mes?',
    a: 'Multiplicá los kWh por el precio del kWh que figura en tu factura. No publicamos tarifas porque cambian según la distribuidora, la categoría, el nivel de subsidio y el escalón de consumo; además la factura suma cargos fijos e impuestos.',
  },
  {
    q: '¿Cuánto consume una heladera por mes?',
    a: 'Depende del modelo: el dato confiable es el consumo anual en kWh que figura en su etiqueta de eficiencia energética. Dividilo por 12 para tener el consumo mensual. Como el compresor corta y arranca, la potencia de placa no sirve para calcularlo multiplicando por 24 horas.',
  },
  {
    q: '¿Cuánto consume un aire acondicionado?',
    a: 'Un equipo de unas 3.000 frigorías suele tomar alrededor de 1.000 a 1.200 W con el compresor andando (estimación orientativa; mirá la etiqueta de tu equipo). Usado 6 horas por día durante un mes, son unos 200 kWh. Los inverter consumen menos porque bajan la potencia al llegar a la temperatura.',
  },
  {
    q: '¿Qué significa la etiqueta de eficiencia energética A, A+ o A++?',
    a: 'Es la etiqueta obligatoria en Argentina para heladeras, aires acondicionados, lavarropas y otros equipos. La letra compara el consumo del equipo con uno de referencia de su mismo tipo y tamaño, según la norma IRAM de cada producto: cuanto más cerca de A (o de A+++), menos consume. La etiqueta también informa el consumo en kWh (por año en heladeras), que es el número a usar en esta calculadora.',
  },
]

function ofertasPorEquipo(): Record<string, OfertaEquipo[]> {
  const out: Record<string, OfertaEquipo[]> = {}
  for (const e of EQUIPOS) {
    const c = e.comparativa ? getComparativa(e.comparativa) : null
    if (!c) continue
    out[e.id] = productosDe(c)
      .slice(0, 6)
      .map(p => ({ id: p.id_ml, titulo: p.titulo, precio: p.precio_actual, descuento: p.descuento_pct ?? null, url: p.url_producto }))
  }
  return out
}

export default function CalculadoraConsumoPage() {
  const ofertas = ofertasPorEquipo()
  const busquedas = Object.fromEntries(EQUIPOS.map(e => [e.id, busquedaML(e.busqueda)]))
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora de consumo eléctrico',
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
          Calculadora de consumo eléctrico: ¿cuánto gasta cada aparato?
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-3xl [text-wrap:pretty]">
          Elegí un electrodoméstico o cargá sus watts, las horas por día y los días de uso. Te decimos cuántos kWh consume
          por mes y, si ponés el precio del kWh de tu factura, cuánto te cuesta. Abajo, las ofertas de hoy de ese equipo.
        </p>

        <CalculadoraConsumo ofertas={ofertas} busquedas={busquedas} />

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Cómo calculamos</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 leading-relaxed">
            <li>
              <strong className="text-zinc-200">Fórmula (exacta):</strong> kWh = watts × horas ÷ 1000. Por mes, multiplicamos
              por los días de uso.
            </li>
            <li>
              <strong className="text-zinc-200">Potencias de cada equipo (estimación orientativa):</strong> los valores que
              precargamos son típicos, no de una norma. Reemplazalos por la potencia de la etiqueta o placa de tu equipo.
            </li>
            <li>
              <strong className="text-zinc-200">Equipos con compresor o termostato</strong> (heladera, aire, estufa,
              termotanque) no consumen su potencia máxima todo el tiempo: usá el consumo en kWh de la etiqueta o las horas en
              que realmente está andando.
            </li>
            <li>
              <strong className="text-zinc-200">Costo:</strong> solo con el precio del kWh que cargues vos. No incluye cargo fijo
              ni impuestos.
            </li>
          </ul>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">La etiqueta de eficiencia energética</h2>
          <p className="text-zinc-400 leading-relaxed mb-3">
            En Argentina, heladeras, freezers, aires acondicionados, lavarropas, lámparas, termotanques y otros equipos deben
            llevar la etiqueta de eficiencia energética, basada en normas IRAM para cada producto. La letra (de A a G, con
            A+, A++ y A+++ en algunos productos) compara el consumo del equipo con el de uno de referencia de su tipo y
            tamaño: cuanto más arriba en la escala, menos energía gasta para hacer lo mismo.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Más útil que la letra es el número: la etiqueta informa el consumo en kWh (por año en heladeras). Cargalo en la
            calculadora para comparar dos modelos antes de comprar. Para elegir el tamaño del aire, usá la{' '}
            <Link href="/calculadora-frigorias" className="text-yellow-400 hover:underline">
              calculadora de frigorías
            </Link>
            , y mirá las comparativas de{' '}
            <Link href="/mejores/mejores-aires-acondicionados" className="text-yellow-400 hover:underline">
              aires acondicionados
            </Link>{' '}
            y{' '}
            <Link href="/mejores/mejores-heladeras" className="text-yellow-400 hover:underline">
              heladeras
            </Link>{' '}
            en oferta.
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
                  href="https://www.argentina.gob.ar/economia/energia/eficiencia-energetica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-400"
                >
                  Secretaría de Energía: eficiencia energética y etiquetado
                </a>
              </li>
              <li>
                <a href="https://www.iram.org.ar/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                  IRAM: normas de etiquetado de eficiencia energética por producto
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
