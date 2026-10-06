import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getScrapedAt } from '@/lib/productos'
import { slugPorId } from '@/lib/seguimiento'
import { descripcionSeo, tituloSeo } from '@/lib/seo'
import { DEALS_URL } from '@/lib/marca'
import { LANDINGS, bajasDeLaSemana, getLanding, indexableLanding, productosLanding } from '@/lib/landings'

const MAX = 24

export function generateStaticParams() {
  return LANDINGS.map(l => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = getLanding((await params).slug)
  if (!l) return {}
  const url = `${DEALS_URL}/ofertas/${l.slug}`
  const titulo = tituloSeo(l.titulo, [n => `${n} — Cazador de Ofertas AR`, n => n])
  const descripcion = descripcionSeo(l.descripcion)
  return {
    title: titulo,
    description: descripcion,
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    ...(indexableLanding(l) ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title: titulo, description: descripcion, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const l = getLanding((await params).slug)
  if (!l) notFound()
  const url = `${DEALS_URL}/ofertas/${l.slug}`
  const scrapedAt = getScrapedAt().toISOString()
  const productos = productosLanding(l)
  const bajas = l.tipo === 'bajaron' ? bajasDeLaSemana() : []
  const total = l.tipo === 'bajaron' ? bajas.length : productos.length
  const historial = slugPorId()
  const light: OfertaLight[] = productos.slice(0, MAX).map(o => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    historial: historial[o.id_ml],
  }))
  const items =
    l.tipo === 'bajaron'
      ? bajas.slice(0, MAX).map(b => ({ name: b.s.titulo, url: `${DEALS_URL}/precio/${b.s.slug}` }))
      : productos.slice(0, MAX).map(p => ({ name: p.titulo, url: p.url_producto }))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: l.nombre, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: l.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...(items.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: l.h1,
            url,
            numberOfItems: total,
            itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })),
          },
        ]
      : []),
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">{l.nombre}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{l.h1}</h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">{l.intro}</p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
            <LastUpdated scrapedAt={scrapedAt} /> · {total} {total === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {total === 0 ? (
          <p className="text-center text-zinc-400 py-10">
            Hoy no hay productos que cumplan este criterio. La lista se actualiza 3 veces por día;{' '}
            <a href={DEALS_URL} className="text-yellow-400 hover:underline">mirá todas las ofertas de hoy</a>.
          </p>
        ) : l.tipo === 'bajaron' ? (
          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400 text-left">
                <tr>
                  <th className="px-3 py-2 font-semibold">Producto</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Antes (7 días)</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Hoy</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Baja</th>
                </tr>
              </thead>
              <tbody>
                {bajas.slice(0, MAX).map(b => (
                  <tr key={b.s.id} className="border-t border-zinc-800 align-top">
                    <td className="px-3 py-2 text-zinc-300">
                      <a href={`/precio/${b.s.slug}`} className="hover:text-yellow-400">{b.s.titulo}</a>
                      <a href={b.s.url} target="_blank" rel="sponsored nofollow noopener" className="block text-[11px] font-bold text-yellow-400/80 mt-1">Ver oferta en ML ↗</a>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-500">{precio(b.antes)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-zinc-100 font-semibold">{precio(b.hoy)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-emerald-400 font-bold">-{b.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {light.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Qué tener en cuenta</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 leading-relaxed">
            {l.criterios.map(t => <li key={t}>{t}</li>)}
          </ul>
          <p className="text-xs text-zinc-500 mt-3">
            Datos de nuestro seguimiento propio de Mercado Libre (3 revisiones por día). Los links son de afiliado: el precio para vos es el mismo.{' '}
            <Link href="/metodologia" className="text-yellow-400/80 hover:text-yellow-400">Metodología</Link>
          </p>
        </section>

        {l.categoria && (
          <p className="mb-8 text-sm text-zinc-300">
            <a href={`/categoria/${l.categoria}`} className="font-bold text-yellow-400 hover:underline">Ver toda la categoría →</a>
            {l.categoria === 'aire-acondicionado' && (
              <> · <a href="/calculadora-frigorias" className="font-bold text-yellow-400 hover:underline">Calculadora de frigorías</a> · <Link href="/mejores/mejores-aires-acondicionados" className="font-bold text-yellow-400 hover:underline">Comparativa de aires</Link></>
            )}
            {l.categoria === 'colchones' && (
              <> · <Link href="/mejores/mejores-colchones-2-plazas" className="font-bold text-yellow-400 hover:underline">Colchones de 2 plazas</Link> · <Link href="/mejores/mejores-sommiers" className="font-bold text-yellow-400 hover:underline">Sommiers</Link></>
            )}
          </p>
        )}

        <section className="mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {l.faq.map(f => (
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
          <p className="font-bold text-zinc-300 mb-2">Más listas</p>
          <ul className="space-y-1.5">
            {LANDINGS.filter(x => x.slug !== l.slug && indexableLanding(x)).map(x => (
              <li key={x.slug}><a href={`/ofertas/${x.slug}`} className="text-yellow-400/80 hover:text-yellow-400">{x.titulo}</a></li>
            ))}
            <li><Link href="/mejores" className="text-yellow-400/80 hover:text-yellow-400">Comparativas de los mejores productos</Link></li>
          </ul>
        </nav>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
