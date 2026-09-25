import { busquedaML } from '@/lib/afiliado'
import type { ProductWithMargins } from '@/lib/productos'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { COMPARATIVAS, categoriaDe, getComparativa, productosDe } from '@/lib/comparativas'
import { getGuia } from '@/lib/guias'
import { slugPorId } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const MAX_FILAS = 12

export function generateStaticParams() {
  return COMPARATIVAS.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getComparativa((await params).slug)
  if (!c) return {}
  const url = `${DEALS_URL}/mejores/${c.slug}`
  const titulo = `${c.titulo} — Cazador de Ofertas AR`
  return {
    title: titulo,
    description: c.descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description: c.descripcion,
      url,
      type: 'article',
      locale: 'es_AR',
      siteName: 'Cazador de Ofertas AR',
    },
  }
}

export default async function ComparativaPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getComparativa((await params).slug)
  if (!c) notFound()

  const url = `${DEALS_URL}/mejores/${c.slug}`
  // Ya vienen ordenados por ganancia esperada (ticket × comisión), igual que /hoy.
  const todos = productosDe(c)
  const productos = todos.slice(0, MAX_FILAS)
  const tramos = c.presupuestos ? armarTramos(todos, c.presupuestos) : []
  const scrapedAt = getScrapedAt().toISOString()
  const cat = categoriaDe(c)
  const guia = c.guia ? getGuia(c.guia) : undefined
  const historial = slugPorId()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: c.titulo, item: url },
      ],
    },
    ...(productos.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: c.titulo,
            itemListElement: productos.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.titulo,
              url: p.url_producto,
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

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
          <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
          <span className="text-zinc-300">Comparativas</span>
        </nav>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
          {c.titulo}
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">{c.intro}</p>
        <p className="inline-flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 mb-8">
          <LastUpdated scrapedAt={scrapedAt} /> · {productos.length} en la comparativa
        </p>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Comparativa de precios de hoy</h2>
          {productos.length === 0 ? (
            <p className="text-zinc-400">
              Hoy no hay {c.nombre} en oferta con descuento verificado. La tabla se actualiza 3 veces por día;{' '}
              <a href={DEALS_URL} className="text-yellow-400 hover:underline">
                mirá todas las ofertas de hoy
              </a>
              .
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-400 text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Producto</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Precio hoy</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Descuento</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Mínimo registrado</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr key={p.id_ml} className="border-t border-zinc-800 align-top">
                      <td className="px-3 py-2 text-zinc-500">{i + 1}</td>
                      <td className="px-3 py-2 text-zinc-300">
                        <a href={p.url_producto} rel="sponsored nofollow" target="_blank" className="hover:text-yellow-400">
                          {p.titulo}
                        </a>
                        <span className="block mt-1 space-x-2">
                          {p.relampago && <span className="text-[11px] font-bold text-blue-400">⚡ Relámpago</span>}
                          {historial[p.id_ml] && (
                            <a href={`/precio/${historial[p.id_ml]}`} className="text-[11px] font-bold text-zinc-400 hover:text-yellow-400">
                              📈 Historial
                            </a>
                          )}
                          {p.minimo_historico && (
                            <span className="text-[11px] font-bold text-yellow-400">📉 Mínimo histórico</span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-100 font-semibold">{precio(p.precio_actual)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-red-400 font-bold">
                        {p.descuento_pct != null ? `${p.descuento_pct}% OFF` : '—'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-400">
                        {p.precio_minimo_registrado ? precio(p.precio_minimo_registrado) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {cat && (
            <a
              href={busquedaML(cat.keywords[0])}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-block text-sm font-bold text-yellow-400 hover:text-yellow-300"
            >
              ¿Ninguno te convence? Ver todos los modelos en Mercado Libre ↗
            </a>
          )}
          <p className="text-xs text-zinc-500 mt-3">
            Cómo armamos esta comparativa: no probamos los productos. Comparamos precio, descuento e historial de
            precios que registramos revisando Mercado Libre 3 veces por día. Los links son de afiliado: el precio
            para vos es el mismo.
          </p>
        </section>

        {tramos.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Por presupuesto</h2>
            <div className="space-y-6">
              {tramos.map(t => (
                <div key={t.titulo}>
                  <h3 className="font-bold text-zinc-200 mb-2">{t.titulo}</h3>
                  <ul className="space-y-1.5">
                    {t.items.map(p => (
                      <li key={p.id_ml} className="flex items-baseline justify-between gap-3 text-sm">
                        <a href={p.url_producto} rel="sponsored nofollow" target="_blank" className="text-zinc-300 hover:text-yellow-400 line-clamp-1">
                          {p.titulo}
                        </a>
                        <span className="whitespace-nowrap font-semibold text-zinc-100">
                          {precio(p.precio_actual)}
                          {p.descuento_pct != null && <span className="ml-2 text-red-400">-{p.descuento_pct}%</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Qué comparar antes de comprar</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 leading-relaxed">
            {c.criterios.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {(cat || guia) && (
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center mb-10">
            <p className="font-display text-xl font-black mb-4">¿Querés ver todas las opciones?</p>
            <div className="flex flex-wrap justify-center gap-3">
              {cat && (
                <a
                  href={`/categoria/${cat.slug}`}
                  className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5"
                >
                  Todas las ofertas de {cat.nombre.toLowerCase()} 🎯
                </a>
              )}
              {guia && (
                <a
                  href={`/guias/${guia.slug}`}
                  className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-6 py-2.5"
                >
                  Leer la guía de compra
                </a>
              )}
            </div>
          </section>
        )}

        <nav className="text-sm">
          <p className="font-bold text-zinc-300 mb-2">Otras comparativas</p>
          <ul className="space-y-1.5">
            {COMPARATIVAS.filter(x => x.slug !== c.slug).map(x => (
              <li key={x.slug}>
                <a href={`/mejores/${x.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                  {x.titulo}
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

/** Top 4 por tramo de precio (ya vienen ordenados por ganancia esperada). */
function armarTramos(todos: ProductWithMargins[], cortes: number[]) {
  const limites = [0, ...cortes, Infinity]
  return limites.slice(0, -1).map((desde, i) => {
    const hasta = limites[i + 1]
    const titulo =
      desde === 0 ? `Hasta ${precio(hasta)}`
      : hasta === Infinity ? `Más de ${precio(desde)}`
      : `De ${precio(desde)} a ${precio(hasta)}`
    const items = todos.filter(p => p.precio_actual > desde && p.precio_actual <= hasta).slice(0, 4)
    return { titulo, items }
  }).filter(t => t.items.length > 0)
}
