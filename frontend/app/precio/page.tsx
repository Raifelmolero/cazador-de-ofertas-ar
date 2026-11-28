import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import TopOfertasHoy from '@/components/TopOfertasHoy'
import { ofertasHoyLight } from '@/lib/ofertashoy'
import { CATEGORIAS } from '@/lib/categorias'
import { categoriaDeSeguido, getSeguido, getSeguidosPrincipales, type Seguido } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: 'Historial de precios Mercado Libre 2026: ¿el descuento es real?',
  description:
    'Comprobá si el descuento de Mercado Libre es real: historial 2026 en Argentina y el precio más bajo que registramos. Notebooks, colchones, cafeteras y más.',
  keywords: [
    'historial de precios mercado libre',
    'precio más bajo mercado libre argentina',
    'descuento real mercado libre',
  ],
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: `${DEALS_URL}/precio` },
}

/** Fichas de ticket alto / Navidad que ya tienen historial (ticket-alto.md). Sin precios acá. */
const FICHAS_DESTACADAS = [
  'arbol-navidad-frondoso-1-80-mt-854-puntas-pe-mla80722855',
  'honey-whale-k6s-moto-bicicleta-electrica-para-adultos-1080w-mla63138453',
  'auto-a-bateria-utv-can-am-4x4-ruedas-de-mlau184160328',
  'colchon-viggo-cuarzo-140x190-cm-resortes-pocket-400-kg-mla80159945',
  'monopatin-electrico-adultos-vortex-xt3-45km-plegable-luces-mla82543778',
  'notebook-lenovo-ideapad-slim-3-con-ryzen-5-16-mla77766168',
]

export default function PreciosIndex() {
  const grupos = new Map<string, Seguido[]>()
  for (const s of getSeguidosPrincipales()) {
    const nombre = categoriaDeSeguido(s)?.nombre ?? 'Otros'
    grupos.set(nombre, [...(grupos.get(nombre) ?? []), s])
  }
  const ofertasHoy = ofertasHoyLight()
  const orden = [...CATEGORIAS.map(c => c.nombre), 'Otros'].filter(n => grupos.has(n))
  const destacadas = FICHAS_DESTACADAS.map(slug => getSeguido(slug)).filter((s): s is Seguido => Boolean(s))
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
        <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3 mt-6">
          <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a>{' '}
          <span aria-hidden="true">/</span> <span className="text-zinc-300">Historial de precios</span>
        </nav>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
          Historial de precios de Mercado Libre
        </h1>
        <p className="text-zinc-400 mb-4">
          Mercado Libre está saturado: acá filtramos. En cada ficha ves el precio de hoy, el más bajo
          que registramos y desde cuándo lo seguimos, para comprobar si el descuento es real.
        </p>
        <p className="text-sm text-zinc-400 mb-8">
          Para regalos de Navidad, andá a{' '}
          <a href="/regalos-navidad" className="font-semibold text-yellow-400 hover:underline">
            /regalos-navidad
          </a>
          . Los precios de un rubro completo están en{' '}
          <a href="/precio-hoy" className="font-semibold text-yellow-400 hover:underline">
            /precio-hoy
          </a>
          .
        </p>
        {destacadas.length > 0 && (
          <section className="mb-8" aria-label="Fichas destacadas de Navidad y ticket alto">
            <h2 className="font-display text-xl font-black mb-2">Navidad y ticket alto</h2>
            <ul className="space-y-1.5 text-sm">
              {destacadas.map(s => (
                <li key={s.slug}>
                  <a href={`/precio/${s.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
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
