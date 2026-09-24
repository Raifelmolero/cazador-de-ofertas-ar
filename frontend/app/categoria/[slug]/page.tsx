import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { CATEGORIAS, getCategoria, ofertasDeCategoria } from '@/lib/categorias'
import { GUIAS } from '@/lib/guias'
import { COMPARATIVAS } from '@/lib/comparativas'
import { seguidosDeCategoria } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'

export function generateStaticParams() {
  return CATEGORIAS.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategoria((await params).slug)
  if (!c) return {}
  const url = `${DEALS_URL}/categoria/${c.slug}`
  const titulo = `${c.titulo} — Cazador de Ofertas AR`
  return {
    title: titulo,
    description: c.descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description: c.descripcion,
      url,
      type: 'website',
      locale: 'es_AR',
      siteName: 'Cazador de Ofertas AR',
    },
  }
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategoria((await params).slug)
  if (!c) notFound()

  const url = `${DEALS_URL}/categoria/${c.slug}`
  const ofertas = ofertasDeCategoria(c)
  const scrapedAt = getScrapedAt().toISOString()
  const minimos = ofertas.filter(o => o.minimo_historico).length
  // Tabla de precios de referencia: solo productos con ≥1 día de historia
  // propia (el dato que nadie más tiene y que buscadores/IAs pueden citar).
  const conHistoria = ofertas
    .filter(o => o.precio_minimo_registrado && o.seguimiento_desde && o.seguimiento_desde < scrapedAt.slice(0, 10))
    .slice(0, 15)

  const ofertasLight: OfertaLight[] = ofertas.map(o => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
  }))

  // Igual que /hoy: las ofertas se refrescan 3 veces por día, así que valen hasta hoy
  const validUntil = new Date()
  validUntil.setHours(23, 59, 59, 0)
  const priceValidUntil = validUntil.toISOString().slice(0, 10)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: c.nombre, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    ...(ofertas.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: c.titulo,
            url,
            numberOfItems: ofertas.length,
            dateModified: scrapedAt,
            itemListElement: ofertas.slice(0, 20).map((o, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: o.titulo,
                description: `${o.titulo} en oferta en Mercado Libre Argentina${o.descuento_pct ? ` con ${o.descuento_pct}% OFF` : ''}${o.minimo_historico ? ', en su precio más bajo registrado' : ''}.`,
                ...(o.url_imagen ? { image: o.url_imagen } : {}),
                offers: {
                  '@type': 'Offer',
                  price: Math.round(o.precio_actual),
                  priceCurrency: 'ARS',
                  availability: 'https://schema.org/InStock',
                  itemCondition: 'https://schema.org/NewCondition',
                  priceValidUntil,
                  validFrom: scrapedAt,
                  url: o.url_producto,
                },
              },
            })),
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

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">{c.nombre}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
            {c.titulo}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">{c.intro}</p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
            <LastUpdated scrapedAt={scrapedAt} /> · {ofertas.length} {ofertas.length === 1 ? 'oferta' : 'ofertas'}
            {minimos > 0 && <> · {minimos} en mínimo histórico</>}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {ofertas.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-10">
            <p className="text-zinc-300 font-semibold mb-2">
              Hoy no hay {c.nombre.toLowerCase()} en el catálogo 🎯
            </p>
            <p className="text-sm text-zinc-500 mb-5">
              Las ofertas cambian 3 veces por día. Mirá todas las de hoy o sumate al canal para enterarte apenas aparece una.
            </p>
            <a
              href={DEALS_URL}
              className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5 transition-colors"
            >
              Ver todas las ofertas de hoy
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ofertasLight.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        {conHistoria.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-2">
              Precios de referencia: {c.nombre.toLowerCase()}
            </h2>
            <p className="text-sm text-zinc-500 mb-4">
              Precio de hoy contra el más bajo que registramos desde que seguimos cada producto
              (revisamos Mercado Libre 3 veces por día). Si el precio de hoy es igual al mínimo, es
              el mejor momento que vimos para comprarlo.
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400 text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Producto</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Hoy</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Mínimo registrado</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Seguido desde</th>
                  </tr>
                </thead>
                <tbody>
                  {conHistoria.map(o => (
                    <tr key={o.id_ml} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-zinc-300">
                        <a href={o.url_producto} rel="sponsored nofollow" target="_blank" className="hover:text-yellow-400">
                          {o.titulo}
                        </a>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-100 font-semibold">{precio(o.precio_actual)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {precio(o.precio_minimo_registrado!)}
                        {o.precio_actual <= o.precio_minimo_registrado! && (
                          <span className="ml-1 text-emerald-400 text-xs font-bold">← hoy</span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-500">{fecha(o.seguimiento_desde!)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {COMPARATIVAS.filter(x => x.categoria === c.slug).map(x => (
          <p key={x.slug} className="mb-8">
            <a href={`/mejores/${x.slug}`} className="font-bold text-yellow-400 hover:underline">
              📊 {x.titulo} →
            </a>
          </p>
        ))}

        {seguidosDeCategoria(c.slug).length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">
              Historial de precios: {c.nombre.toLowerCase()}
            </h2>
            <ul className="space-y-1.5 text-sm">
              {seguidosDeCategoria(c.slug).slice(0, 30).map(s => (
                <li key={s.id}>
                  <a href={`/precio/${s.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {c.guia.map(s => (
          <section key={s.h} className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{s.h}</h2>
            <div className="space-y-3 text-zinc-400 leading-relaxed">
              {s.p.map(t => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {c.faqs.map(f => (
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

        <nav className="text-sm">
          <p className="font-bold text-zinc-300 mb-2">Más categorías</p>
          <ul className="flex flex-wrap gap-2 mb-6">
            {CATEGORIAS.filter(x => x.slug !== c.slug).map(x => (
              <li key={x.slug}>
                <a
                  href={`/categoria/${x.slug}`}
                  className="block rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:border-yellow-400/40 hover:text-yellow-300 transition-colors"
                >
                  {x.nombre}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-bold text-zinc-300 mb-2">Guías para comprar mejor</p>
          <ul className="space-y-1.5">
            {GUIAS.map(g => (
              <li key={g.slug}>
                <a href={`/guias/${g.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                  {g.titulo}
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

function precio(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

function fecha(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
