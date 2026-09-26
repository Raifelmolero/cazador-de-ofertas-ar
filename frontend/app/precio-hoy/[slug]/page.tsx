import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { getCategoria } from '@/lib/categorias'
import { busquedaML } from '@/lib/afiliado'
import { PRECIOS_HOY, getPrecioHoy, mediana, ofertasDe, seguidosDe } from '@/lib/preciohoy'
import { precioActual } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')
const fecha = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/')

export function generateStaticParams() {
  return PRECIOS_HOY.map(p => ({ slug: p.slug }))
}

function titulo(nombre: string) {
  const d = getScrapedAt()
  return `Precio de ${nombre} hoy en Argentina (${MESES[d.getMonth()]} ${d.getFullYear()})`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPrecioHoy((await params).slug)
  if (!p) return {}
  const url = `${DEALS_URL}/precio-hoy/${p.slug}`
  const t = titulo(p.nombre)
  const description = `Cuánto sale un ${p.nombre} hoy en Mercado Libre Argentina: precio más bajo, rango y mediana de las ofertas con descuento real, más el historial de precios que registramos.`
  return {
    title: `${t} — Cazador de Ofertas AR`,
    description,
    alternates: { canonical: url },
    openGraph: { title: t, description, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

export default async function PrecioHoyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPrecioHoy((await params).slug)
  if (!p) notFound()

  const url = `${DEALS_URL}/precio-hoy/${p.slug}`
  const scrapedAt = getScrapedAt().toISOString()
  const hoy = fecha(scrapedAt)
  const ofertas = ofertasDe(p)
  const seguidos = seguidosDe(p).sort((a, b) => precioActual(a) - precioActual(b))
  const precios = ofertas.map(o => o.precio_actual)
  const min = precios[0]
  const max = precios[precios.length - 1]
  const med = mediana(precios)
  const cat = p.categoria ? getCategoria(p.categoria) : undefined

  // El párrafo que un buscador o una IA puede citar tal cual
  const respuesta = ofertas.length
    ? `Hoy (${hoy}) el ${p.nombre} más barato en oferta en Mercado Libre Argentina cuesta ${precio(min)}. ` +
      (ofertas.length > 1
        ? `Entre las ${ofertas.length} ofertas con descuento real que relevamos, el precio va de ${precio(min)} a ${precio(max)}, con una mediana de ${precio(med)}.`
        : 'Es la única oferta con descuento real de este producto que relevamos hoy.')
    : seguidos.length
      ? `Hoy (${hoy}) no hay ${p.nombre} con descuento real en mercadolibre.com.ar/ofertas. El último precio que registramos del más barato que seguimos fue ${precio(precioActual(seguidos[0]))}.`
      : `Hoy (${hoy}) no hay ${p.nombre} con descuento real en mercadolibre.com.ar/ofertas.`

  const faqs = [
    { q: `¿Cuánto sale un ${p.nombre} hoy en Argentina?`, a: respuesta },
    { q: `¿Qué mirar antes de comprar un ${p.nombre}?`, a: p.consejo },
    {
      q: '¿De dónde salen estos precios?',
      a: 'Revisamos las ofertas de mercadolibre.com.ar/ofertas tres veces por día y guardamos el precio de cada producto. Acá solo aparecen ofertas con descuento real: descartamos las que ya habíamos visto más baratas antes.',
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Precio hoy', item: `${DEALS_URL}/precio-hoy` },
        { '@type': 'ListItem', position: 3, name: p.nombre, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...(ofertas.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.nombre,
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'ARS',
              lowPrice: Math.round(min),
              highPrice: Math.round(max),
              offerCount: ofertas.length,
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

      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
          <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> /{' '}
          <a href="/precio-hoy" className="hover:text-yellow-400">Precio hoy</a> / <span className="text-zinc-300">{p.nombre}</span>
        </nav>
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight mb-4 [text-wrap:balance]">
          {titulo(p.nombre)}
        </h1>
        <p className="mb-6 inline-flex text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
          <LastUpdated scrapedAt={scrapedAt} />
        </p>

        {ofertas.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3">
              <p className="text-xl sm:text-2xl font-black text-yellow-300">{precio(min)}</p>
              <p className="text-xs text-zinc-400 mt-1">el más barato hoy</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xl sm:text-2xl font-black">{precio(med)}</p>
              <p className="text-xs text-zinc-400 mt-1">mediana</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
              <p className="text-xl sm:text-2xl font-black">{ofertas.length}</p>
              <p className="text-xs text-zinc-400 mt-1">ofertas reales hoy</p>
            </div>
          </div>
        )}

        <p className="text-lg text-zinc-200 leading-relaxed mb-8">{respuesta}</p>

        {ofertas.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Los más baratos hoy</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400 text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Producto</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Precio hoy</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Descuento</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertas.slice(0, 10).map(o => (
                    <tr key={o.id_ml} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-zinc-300">
                        <a href={o.url_producto} rel="sponsored nofollow" target="_blank" className="hover:text-yellow-400">
                          {o.titulo}
                        </a>
                        {o.minimo_historico && <span className="ml-1 text-emerald-400 text-xs font-bold">mínimo histórico</span>}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold">{precio(o.precio_actual)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-400">{o.descuento_pct ? `${o.descuento_pct}% OFF` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {seguidos.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Historial de precios</h2>
            <p className="text-sm text-zinc-500 mb-3">
              Modelos que seguimos todos los días: último precio y el más bajo que registramos.
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400 text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Producto</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Último precio</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Mínimo registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {seguidos.slice(0, 15).map(s => (
                    <tr key={s.id} className="border-t border-zinc-800">
                      <td className="px-3 py-2">
                        <a href={`/precio/${s.slug}`} className="text-yellow-400/80 hover:text-yellow-400">{s.titulo}</a>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{precio(precioActual(s))}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-400">
                        {precio(s.min)} <span className="text-xs">({fecha(s.min_ts)})</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href={busquedaML(p.busqueda)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5"
          >
            Ver todos los modelos en Mercado Libre ↗
          </a>
          {cat && (
            <a href={`/categoria/${cat.slug}`} className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 rounded-xl px-6 py-2.5">
              Ofertas de {cat.nombre.toLowerCase()}
            </a>
          )}
        </div>

        <section className="mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faqs.map(f => (
              <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <nav className="text-sm">
          <p className="font-bold text-zinc-300 mb-2">Precio hoy de otros productos</p>
          <ul className="flex flex-wrap gap-2">
            {PRECIOS_HOY.filter(x => x.slug !== p.slug).map(x => (
              <li key={x.slug}>
                <a href={`/precio-hoy/${x.slug}`} className="block rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-yellow-300">
                  {x.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
