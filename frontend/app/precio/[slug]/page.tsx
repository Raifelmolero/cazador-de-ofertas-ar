import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import { COMPARATIVAS } from '@/lib/comparativas'
import {
  categoriaDeSeguido,
  getSeguido,
  getSeguidos,
  precioActual,
  seguidosDeCategoria,
  vigente,
  type Seguido,
} from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'

export function generateStaticParams() {
  return getSeguidos().map(s => ({ slug: s.slug }))
}

function nombreCorto(s: Seguido) {
  return s.titulo.split(/\s+/).slice(0, 8).join(' ')
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getSeguido((await params).slug)
  if (!s) return {}
  const url = `${DEALS_URL}/precio/${s.slug}`
  const titulo = `${nombreCorto(s)}: historial de precios y precio más bajo`
  const descripcion = `Precio de hoy, precio más bajo registrado (${precio(s.min)} el ${fecha(s.min_ts)}) e historial de ${nombreCorto(s)} en Mercado Libre Argentina. Seguido desde ${fecha(s.desde)}.`
  return {
    title: `${titulo} — Cazador de Ofertas AR`,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description: descripcion,
      url,
      type: 'website',
      locale: 'es_AR',
      siteName: 'Cazador de Ofertas AR',
      ...(s.img ? { images: [{ url: s.img }] } : {}),
    },
  }
}

export default async function PrecioPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getSeguido((await params).slug)
  if (!s) notFound()

  const url = `${DEALS_URL}/precio/${s.slug}`
  const hoy = precioActual(s)
  const enOferta = vigente(s)
  const enMinimo = enOferta && hoy <= s.min
  const sobreMin = Math.round(((hoy - s.min) / s.min) * 100)
  const descuentoLista = s.precio_lista > hoy ? Math.round((1 - hoy / s.precio_lista) * 100) : 0
  const cat = categoriaDeSeguido(s)
  const comparativa = cat ? COMPARATIVAS.find(c => c.categoria === cat.slug) : undefined
  const relacionados = cat ? seguidosDeCategoria(cat.slug).filter(x => x.id !== s.id).slice(0, 8) : []
  const nombre = nombreCorto(s)

  const veredicto = !enOferta
    ? `Hoy no lo vemos en oferta en Mercado Libre. El último precio que registramos fue ${precio(hoy)} (${fecha(s.ultimo_visto)}); el más bajo, ${precio(s.min)} el ${fecha(s.min_ts)}.`
    : enMinimo
      ? `Hoy está en el precio más bajo que registramos desde que lo seguimos (${fecha(s.desde)}): ${precio(hoy)}.`
      : `Hoy cuesta ${precio(hoy)}, un ${sobreMin}% más que el mínimo que registramos (${precio(s.min)} el ${fecha(s.min_ts)}).`

  const faqs = [
    {
      q: `¿Cuál es el precio más bajo de ${nombre}?`,
      a: `El precio más bajo que registramos en Mercado Libre Argentina es ${precio(s.min)}, el ${fecha(s.min_ts)}. Revisamos el precio 3 veces por día desde el ${fecha(s.desde)}.`,
    },
    {
      q: `¿Conviene comprar ${nombre} hoy?`,
      a: veredicto +
        (enOferta && !enMinimo ? ' Si no te urge, puede convenir esperar a que vuelva a bajar.' : ''),
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        ...(cat ? [{ '@type': 'ListItem', position: 2, name: cat.nombre, item: `${DEALS_URL}/categoria/${cat.slug}` }] : []),
        { '@type': 'ListItem', position: cat ? 3 : 2, name: nombre, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...(enOferta
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: s.titulo,
            ...(s.img ? { image: s.img } : {}),
            offers: {
              '@type': 'Offer',
              price: hoy,
              priceCurrency: 'ARS',
              availability: 'https://schema.org/InStock',
              url: s.url,
              validFrom: s.ultimo_visto,
              priceValidUntil: s.ultimo_visto,
              description: veredicto,
            },
          },
        ]
      : []),
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
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

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
          <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a>
          {cat && (
            <>
              {' '}
              <span aria-hidden="true">/</span>{' '}
              <a href={`/categoria/${cat.slug}`} className="hover:text-yellow-400">
                {cat.nombre}
              </a>
            </>
          )}{' '}
          <span aria-hidden="true">/</span> <span className="text-zinc-300">Historial de precios</span>
        </nav>

        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          {s.img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.img}
              alt={s.titulo}
              width={160}
              height={160}
              className="w-40 h-40 object-contain bg-white rounded-xl p-2 shrink-0"
            />
          )}
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-black leading-tight tracking-tight mb-2 [text-wrap:balance]">
              {s.titulo}: historial de precios
            </h1>
            <p className="text-sm text-zinc-500">Seguimos este precio en Mercado Libre 3 veces por día desde el {fecha(s.desde)}.</p>
          </div>
        </div>

        <section
          className={`rounded-2xl border p-5 mb-6 ${
            enMinimo ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-900'
          }`}
        >
          <p className="font-bold text-zinc-100 mb-1">
            {enMinimo ? '📉 Buen momento para comprar' : enOferta ? '¿Es buen precio?' : 'Hoy no está en oferta'}
          </p>
          <p className="text-zinc-300 leading-relaxed">{veredicto}</p>
          {s.relampago && enOferta && (
            <p className="text-sm font-bold text-blue-400 mt-2">⚡ Es una oferta relámpago: dura pocas horas o hasta agotar stock.</p>
          )}
          <a
            href={s.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="mt-4 inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-3"
          >
            {enOferta ? `Ver a ${precio(hoy)} en Mercado Libre 🛒` : 'Ver precio actual en Mercado Libre'}
          </a>
        </section>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-sm">
          <Dato label={enOferta ? 'Precio hoy' : 'Último precio'} valor={precio(hoy)} />
          <Dato label="Más bajo registrado" valor={precio(s.min)} sub={fecha(s.min_ts)} />
          <Dato label="Precio de lista" valor={precio(s.precio_lista)} sub={descuentoLista ? `${descuentoLista}% OFF` : undefined} />
          <Dato label="Seguido desde" valor={fecha(s.desde)} />
        </dl>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Evolución del precio</h2>
          {s.serie.length >= 2 ? (
            <Grafico serie={s.serie} min={s.min} />
          ) : (
            <p className="text-sm text-zinc-500">
              Empezamos a guardar la serie diaria el {fecha(s.serie[0][0])}; el gráfico aparece a partir del segundo día.
              Mientras tanto, el precio más bajo que registramos es {precio(s.min)} ({fecha(s.min_ts)}).
            </p>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q}>
                <h3 className="font-bold text-zinc-100 mb-1">{f.q}</h3>
                <p className="text-zinc-400 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {(comparativa || cat) && (
          <p className="mb-8 space-x-4 text-sm">
            {comparativa && (
              <a href={`/mejores/${comparativa.slug}`} className="font-bold text-yellow-400 hover:underline">
                📊 Comparativa de {comparativa.nombre}
              </a>
            )}
            {cat && (
              <a href={`/categoria/${cat.slug}`} className="font-bold text-yellow-400 hover:underline">
                Ofertas de {cat.nombre.toLowerCase()} hoy →
              </a>
            )}
          </p>
        )}

        {relacionados.length > 0 && (
          <nav className="text-sm">
            <p className="font-bold text-zinc-300 mb-2">Historial de precios de productos parecidos</p>
            <ul className="space-y-1.5">
              {relacionados.map(r => (
                <li key={r.id}>
                  <a href={`/precio/${r.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                    {nombreCorto(r)}
                  </a>{' '}
                  <span className="text-zinc-500">— mínimo {precio(r.min)}</span>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <p className="text-xs text-zinc-600 mt-10">
          Los precios los registra nuestro bot revisando Mercado Libre Argentina; pueden cambiar en cualquier momento.
          El link es de afiliado: el precio para vos es el mismo.
        </p>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}

function Dato({ label, valor, sub }: { label: string; valor: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="font-bold text-zinc-100">{valor}</dd>
      {sub && <dd className="text-xs text-zinc-500">{sub}</dd>}
    </div>
  )
}

function Grafico({ serie, min }: { serie: [string, number][]; min: number }) {
  const W = 600
  const H = 200
  const P = 8
  const precios = serie.map(p => p[1])
  const lo = Math.min(...precios, min)
  const hi = Math.max(...precios)
  const rango = hi - lo || 1
  const x = (i: number) => P + (i * (W - 2 * P)) / (serie.length - 1)
  const y = (v: number) => H - P - ((v - lo) * (H - 2 * P)) / rango
  const puntos = serie.map((p, i) => `${x(i)},${y(p[1])}`).join(' ')
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-xl bg-zinc-900 border border-zinc-800" role="img" aria-label="Evolución del precio">
        <line x1={P} x2={W - P} y1={y(min)} y2={y(min)} stroke="#10b981" strokeDasharray="4 4" strokeWidth="1" />
        <polyline points={puntos} fill="none" stroke="#facc15" strokeWidth="2.5" />
      </svg>
      <figcaption className="flex justify-between text-xs text-zinc-500 mt-1">
        <span>{fecha(serie[0][0])}</span>
        <span className="text-emerald-500">- - mínimo {precio(min)}</span>
        <span>{fecha(serie[serie.length - 1][0])}</span>
      </figcaption>
    </figure>
  )
}

function precio(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

function fecha(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}
