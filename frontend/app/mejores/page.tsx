import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { COMPARATIVAS, indexable } from '@/lib/comparativas'
import { DEALS_URL, MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'

const url = `${DEALS_URL}/mejores`
const TITULO = 'Mejores en oferta: comparativas de precios — Cazador de Ofertas AR'
const DESCRIPCION =
  'Comparativas de los mejores productos en oferta en Mercado Libre Argentina: aires, smart TV, heladeras, colchones, notebooks y más, con historial de precios.'

export const metadata: Metadata = {
  metadataBase: new URL(DEALS_URL),
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: url },
  openGraph: { title: TITULO, description: DESCRIPCION, url, type: 'website', locale: 'es_AR', siteName: MARCA },
}

// Índice de comparativas indexables (las mismas que lista el sitemap).
export default function MejoresIndex() {
  const items = COMPARATIVAS.filter(indexable)
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: TITULO,
      description: DESCRIPCION,
      url,
      inLanguage: 'es-AR',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Mejores en oferta', item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Comparativas en oferta',
      itemListElement: items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.titulo,
        url: `${DEALS_URL}/mejores/${c.slug}`,
      })),
    },
  ]
  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
          Mejores en oferta: comparativas
        </h1>
        <p className="text-zinc-400 mb-8">
          Comparamos precio, descuento y el mínimo que registramos de cada producto en Mercado Libre Argentina. No son
          reseñas. Antes de decidir, mirá las{' '}
          <a href="/guias" className="underline text-yellow-400">
            guías de compra
          </a>
          .
        </p>
        <ul className="space-y-3">
          {items.map(c => (
            <li key={c.slug} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <a href={`/mejores/${c.slug}`} className="font-bold text-zinc-50 hover:text-yellow-400">
                {c.titulo}
              </a>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{c.descripcion}</p>
            </li>
          ))}
        </ul>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
