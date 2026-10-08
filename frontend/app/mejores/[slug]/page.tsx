import { busquedaML } from '@/lib/afiliado'
import { descripcionSeo, tituloSeo } from '@/lib/seo'
import type { ProductWithMargins } from '@/lib/productos'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { COMPARATIVAS, categoriaDe, getComparativa, indexable, productosDe } from '@/lib/comparativas'
import { getGuia } from '@/lib/guias'
import { getSeguidosPrincipales, seguidosDeCategoria, slugPorId } from '@/lib/seguimiento'
import { normalizar } from '@/lib/categorias'
import { CONTENIDO } from '@/lib/comparativas-contenido'

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
  // "desde $X" (el más barato de la tabla de hoy): el precio en el título sube los clics.
  const precios = productosDe(c).map(p => p.precio_actual).filter(n => n > 0)
  const base = (CONTENIDO[c.slug]?.titulo ?? c.titulo).replace(/:\s*(comparativa de precios|precios y accesorios)$/i, '')
  const conPrecio = precios.length ? `${base}: desde ${precio(Math.min(...precios))}` : base
  const titulo = tituloSeo(conPrecio, [n => `${n} — Cazador de Ofertas AR`, n => n])
  const descripcion = descripcionSeo(c.descripcion)
  return {
    title: titulo,
    description: descripcion,
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    ...(indexable(c) ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title: titulo,
      description: descripcion,
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
  // Modelos con historial propio que entran en esta comparativa y no aparecen
  // ya en la tabla (misma regla de categoría + keywords + exclusiones).
  const enTabla = new Set(productos.map(p => p.id_ml))
  const kws = (c.keywords ?? []).map(normalizar)
  const fuera = (c.excluir ?? []).map(normalizar)
  const conHistorial = (cat ? seguidosDeCategoria(cat.slug) : kws.length ? getSeguidosPrincipales() : [])
    .filter(x => !enTabla.has(x.id))
    .filter(x => {
      const t = normalizar(x.titulo)
      return (!kws.length || kws.some(k => t.includes(k))) && !fuera.some(f => t.includes(f))
    })
    .sort((a, b) => a.min - b.min || a.slug.localeCompare(b.slug))
    .slice(0, productos.length < 3 ? 10 : 6) // tabla flaca: más modelos con historial para que no quede vacía

  const contenido = CONTENIDO[c.slug]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: c.titulo, item: url },
      ],
    },
    {
      // Preguntas que un buscador o una IA puede citar textual.
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `¿Qué conviene mirar antes de comprar ${c.nombre}?`,
          acceptedAnswer: { '@type': 'Answer', text: c.criterios.join(' ') },
        },
        ...(contenido?.faq ?? []).map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
        ...(productos.length > 0
          ? [
              {
                '@type': 'Question',
                name: `¿Cuál es la mejor oferta de ${c.nombre} hoy en Mercado Libre?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text:
                    `Hoy la primera de nuestra comparativa es ${productos[0].titulo} a ${precio(productos[0].precio_actual)}` +
                    (productos[0].descuento_pct != null ? ` (${productos[0].descuento_pct}% OFF)` : '') +
                    `. Comparamos ${productos.length} ${c.nombre} en oferta por precio, descuento y precio mínimo registrado; la tabla se actualiza 3 veces por día.`,
                },
              },
            ]
          : []),
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
    <main className={productos.length ? 'min-h-screen pb-20 sm:pb-0' : 'min-h-screen'}>
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
            <>
            {/* Celular: tarjetas con foto y botón (la tabla dejaba el precio y la compra fuera de pantalla) */}
            <ol className="sm:hidden space-y-3">
              {productos.map((p, i) => (
                <li key={p.id_ml} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
                  <div className="flex gap-3">
                    <div className="relative w-24 h-24 shrink-0 rounded-xl bg-white overflow-hidden">
                      {p.url_imagen && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.url_imagen} alt="" loading={i < 2 ? 'eager' : 'lazy'} className="w-full h-full object-contain p-1" />
                      )}
                      <span className="absolute top-1 left-1 rounded-full bg-zinc-900 px-1.5 text-[11px] font-bold text-zinc-200">#{i + 1}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-zinc-200 line-clamp-2">{p.titulo}</p>
                      <p className="mt-1 flex items-baseline gap-2">
                        <span className="font-display text-lg font-black text-zinc-50">{precio(p.precio_actual)}</span>
                        {p.descuento_pct != null && <span className="text-xs font-bold text-red-400">{p.descuento_pct}% OFF</span>}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {p.minimo_historico
                          ? '📉 En su mínimo histórico'
                          : p.precio_minimo_registrado
                            ? `Mínimo registrado: ${precio(p.precio_minimo_registrado)}`
                            : ' '}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={p.url_producto}
                      rel="sponsored nofollow noopener"
                      target="_blank"
                      className="flex-1 rounded-xl bg-yellow-400 px-3 py-2.5 text-center text-sm font-black text-black"
                    >
                      Ver oferta en ML ↗
                    </a>
                    {historial[p.id_ml] && (
                      <a href={`/precio/${historial[p.id_ml]}`} aria-label="Historial de precio" className="rounded-xl border border-zinc-700 px-3 py-2.5 text-sm font-bold text-zinc-300">
                        📈
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-zinc-800">
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
            </>
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

        {conHistorial.length > 0 && (
          <nav className="mb-10 text-sm">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Historial de precios de otros modelos</h2>
            <ul className="space-y-1.5">
              {conHistorial.map(x => (
                <li key={x.id}>
                  <a href={`/precio/${x.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                    {x.titulo.split(/\s+/).slice(0, 8).join(' ')}
                  </a>{' '}
                  <span className="text-zinc-500">— mínimo {precio(x.min)}</span>
                </li>
              ))}
            </ul>
          </nav>
        )}

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

        {c.categoria === 'aire-acondicionado' && (
          <p className="mb-10 text-sm bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300">
            ¿No sabés cuántas frigorías necesitás?{' '}
            <a href="/calculadora-frigorias" className="font-bold text-yellow-400 hover:underline">
              Usá la calculadora de frigorías
            </a>{' '}
            (m², altura, sol y personas) y te mostramos los aires en oferta de ese tamaño.
          </p>
        )}

        {(c.categoria === 'aire-acondicionado' || c.categoria === 'heladeras') && (
          <p className="mb-10 text-sm bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-300">
            ¿Cuánta luz va a gastar?{' '}
            <a href="/calculadora-consumo-electrico" className="font-bold text-yellow-400 hover:underline">
              Calculá el consumo eléctrico
            </a>{' '}
            en kWh por mes y su costo con tu precio del kWh.
          </p>
        )}

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Qué comparar antes de comprar</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 leading-relaxed">
            {c.criterios.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        {contenido?.secciones.map(s => (
          <section key={s.titulo} className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{s.titulo}</h2>
            <div className="space-y-3 text-zinc-400 leading-relaxed">
              {s.parrafos.map(t => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
        ))}

        {contenido && contenido.faq.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Preguntas frecuentes</h2>
            <dl className="space-y-4">
              {contenido.faq.map(f => (
                <div key={f.q}>
                  <dt className="font-bold text-zinc-200">{f.q}</dt>
                  <dd className="text-zinc-400 leading-relaxed mt-1">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {(c.slug === 'ofertas-cyber-monday' || c.slug.startsWith('cyber-monday-')) && (
          <nav className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cyber Monday {new Date().getFullYear()} por rubro</h2>
            <div className="flex flex-wrap gap-2">
              <a
                href="/cyber-monday"
                className="text-sm font-bold border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 rounded-xl px-4 py-2"
              >
                Fechas y cómo detectar inflados
              </a>
              {COMPARATIVAS.filter(x => (x.slug === 'ofertas-cyber-monday' || x.slug.startsWith('cyber-monday-')) && x.slug !== c.slug).map(x => (
                <a
                  key={x.slug}
                  href={`/mejores/${x.slug}`}
                  className="text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-4 py-2"
                >
                  {x.slug === 'ofertas-cyber-monday' ? 'Todas las ofertas' : x.nombre.replace(' en el Cyber Monday', '')}
                </a>
              ))}
            </div>
          </nav>
        )}

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

        {c.enlaces && c.enlaces.length > 0 && (
          <nav className="text-sm mb-8">
            <p className="font-bold text-zinc-300 mb-2">Completá el setup</p>
            <ul className="flex flex-wrap gap-2">
              {c.enlaces.map(e => (
                <li key={e.href}>
                  <a href={e.href} className="inline-block border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-4 py-2">
                    {e.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
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

      {/* Celular: la #1 de la comparativa queda a mano mientras se baja por la lista */}
      {productos[0] && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-zinc-500 truncate">🏆 #1: {productos[0].titulo}</p>
            <p className="font-display text-lg font-black text-yellow-400 leading-tight">{precio(productos[0].precio_actual)}</p>
          </div>
          <a
            href={productos[0].url_producto}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="shrink-0 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black active:scale-[0.97] transition-transform"
          >
            Ver en ML 🛒
          </a>
        </div>
      )}
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
