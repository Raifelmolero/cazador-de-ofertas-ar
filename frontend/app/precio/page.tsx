import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import TopOfertasHoy from '@/components/TopOfertasHoy'
import { ofertasHoyLight } from '@/lib/ofertashoy'
import { CATEGORIAS } from '@/lib/categorias'
import { categoriaDeSeguido, getSeguidosPrincipales, type Seguido } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: 'Historial de precios Mercado Libre 2026: precio más bajo hoy',
  description:
    'Buscá cualquier producto de Mercado Libre Argentina y mirá su historial de precios 2026 y el precio más bajo registrado: notebooks, cafeteras, heladeras y más.',
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: `${DEALS_URL}/precio` },
}

export default function PreciosIndex() {
  const grupos = new Map<string, Seguido[]>()
  for (const s of getSeguidosPrincipales()) {
    const nombre = categoriaDeSeguido(s)?.nombre ?? 'Otros'
    grupos.set(nombre, [...(grupos.get(nombre) ?? []), s])
  }
  const ofertasHoy = ofertasHoyLight()
  const orden = [...CATEGORIAS.map(c => c.nombre), 'Otros'].filter(n => grupos.has(n))
  // Índice de fichas: migas + lista de las páginas de historial (sin precios,
  // que viven en cada ficha y cambian a diario).
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Historial de precios', item: `${DEALS_URL}/precio` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Historial de precios de Mercado Libre Argentina',
      url: `${DEALS_URL}/precio`,
      itemListElement: orden
        .flatMap(n => grupos.get(n)!)
        .slice(0, 50)
        .map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.titulo, url: `${DEALS_URL}/precio/${s.slug}` })),
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <a href={DEALS_URL} className="font-display text-lg font-extrabold">
          🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
        </a>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight mt-6 mb-4">
          Historial de precios
        </h1>
        <p className="text-zinc-400 mb-8">
          Productos de Mercado Libre Argentina que seguimos: precio de hoy, precio más bajo registrado
          y desde cuándo los seguimos.
        </p>
        <div className="-mx-4 mb-8">
          <TopOfertasHoy ofertas={ofertasHoy} seccion="top3_precio" id="top3-precio" />
        </div>
        {orden.map(n => (
          <section key={n} className="mb-8">
            <h2 className="font-display text-xl font-black mb-2">{n}</h2>
            <ul className="space-y-1.5 text-sm">
              {grupos.get(n)!.map(s => (
                <li key={s.id}>
                  <a href={`/precio/${s.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
