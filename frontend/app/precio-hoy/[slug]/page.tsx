import Link from 'next/link'
import { descripcionSeo, tituloSeo } from '@/lib/seo'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { getCategoria } from '@/lib/categorias'
import { busquedaML } from '@/lib/afiliado'
import { diasDesde, edadVieja } from '@/lib/frescura'
import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import { sinOmen } from '@/lib/prioridades'
import DestacadoML from '@/components/DestacadoML'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import { PRECIOS_HOY, getPrecioHoy, mediana, ofertasDe, seguidosDe, art, precioHoyVisible, preciosHoyVisibles } from '@/lib/preciohoy'
import { precioActual } from '@/lib/seguimiento'
import { MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'
import TambienTeServira from '@/components/TambienTeServira'
import { extrasDeCategoria, relacionadosDePrecioHoy } from '@/lib/relacionados'

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
  const d = getScrapedAt()
  const cuando = `${MESES[d.getMonth()]} ${d.getFullYear()}`
  // El precio real en el título: en Google compite contra títulos genéricos (1.549
  // impresiones y 0 clics en iPhone la semana del 27/10 con el título sin precio).
  // El «desde $X» del título sale de precios vistos en la última semana (no de uno de hace dos).
  const vigentes = sinOmen(ofertasDe(p))
  const hoyOfertas = vigentes.filter(o => !edadVieja(diasDesde(o.precio_visto)))
  const precios = (hoyOfertas.length ? hoyOfertas : vigentes).map(o => o.precio_actual)
  const desde = precios.length ? ` desde ${precio(precios[0])}` : ''
  const t = tituloSeo(p.nombre, [
    n => `Precio de ${n} hoy${desde} en Argentina (${cuando})`,
    n => `${n}${desde}: precio hoy (${cuando})`,
    n => `Precio de ${n} hoy (${cuando})`,
  ])
  const description = descripcionSeo(precios.length
    ? `Desde ${precio(precios[0])}: ${art(p, true)} ${p.nombre} más barat${p.fem ? 'a' : 'o'} hoy en Mercado Libre (${precios.length} ofertas, ${cuando}). Rango, mediana e historial para llegar al Black Friday sin pagar de más.`
    : `Cuánto sale ${art(p, false)} ${p.nombre} hoy en Mercado Libre Argentina: precio más bajo, rango y mediana de las ofertas e historial de precios.`)
  return {
    title: t,
    description,
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    ...(precioHoyVisible(p) ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title: t, description, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

export default async function PrecioHoyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPrecioHoy((await params).slug)
  if (!p) notFound()

  const url = `${DEALS_URL}/precio-hoy/${p.slug}`
  const scrapedAt = getScrapedAt().toISOString()
  const hoy = fecha(scrapedAt)
  // Precio «de hoy» = visto en los últimos 7 días (lib/frescura). Los números de arriba (más barato,
  // mediana, cantidad) salen solo de esos; las de precio más viejo van al final de la tabla con su antigüedad.
  // Si no hay ninguna reciente, se muestran las que hay, dichas como lo que son: últimos precios vistos.
  const todas = sinOmen(ofertasDe(p))
  const recientes = todas.filter(o => !edadVieja(diasDesde(o.precio_visto)))
  const sinRecientes = recientes.length === 0 && todas.length > 0
  const ofertas = sinRecientes ? todas : recientes
  const viejas = sinRecientes ? [] : todas.filter(o => edadVieja(diasDesde(o.precio_visto)))
  const filasTabla = [...ofertas, ...viejas].slice(0, 10)
  const seguidos = sinOmen(seguidosDe(p)).sort((a, b) => precioActual(a) - precioActual(b))
  const precios = ofertas.map(o => o.precio_actual)
  const min = precios[0]
  const max = precios[precios.length - 1]
  const med = mediana(precios)
  const cat = p.categoria ? getCategoria(p.categoria) : undefined
  // Fichas de la categoría que no son de este producto genérico (ya listadas arriba)
  const referencia = med || mediana(seguidos.map(precioActual))
  const tambien = relacionadosDePrecioHoy(p.categoria, new Set(seguidos.map(x => x.id)), referencia, 4)
  const tambienExtras = extrasDeCategoria(p.categoria, p.slug)

  // El párrafo que un buscador o una IA puede citar tal cual
  const respuesta = ofertas.length
    ? `${sinRecientes ? 'Con los últimos precios que vimos' : 'Con los precios vistos en la última semana,'} ${art(p, true)} ${p.nombre} más barat${p.fem ? "a" : "o"} en oferta en Mercado Libre Argentina cuesta ${precio(min)}. ` +
      (ofertas.length > 1
        ? `Entre las ${ofertas.length} ofertas que relevamos, el precio va de ${precio(min)} a ${precio(max)}, con una mediana de ${precio(med)}.`
        : 'Es la única oferta de este producto que relevamos.')
    : seguidos.length
      ? `Hoy (${hoy}) no tenemos ${p.nombre} en oferta. El último precio que registramos del más barato que seguimos fue ${precio(precioActual(seguidos[0]))}.`
      : `Hoy (${hoy}) no tenemos ${p.nombre} en oferta.`

  const faqs = [
    { q: `¿Cuánto sale ${art(p, false)} ${p.nombre} hoy en Argentina?`, a: respuesta },
    { q: `¿Qué mirar antes de comprar ${art(p, false)} ${p.nombre}?`, a: p.consejo },
    {
      q: '¿De dónde salen estos precios?',
      a: 'Revisamos las ofertas de Mercado Libre y guardamos el precio de cada producto. En cada oferta mostramos el día en que vimos ese precio; puede cambiar.',
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: titulo(p.nombre),
      description: respuesta,
      url,
      inLanguage: 'es-AR',
      dateModified: scrapedAt,
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL },
      about: p.nombre,
    },
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
            description: respuesta,
            url,
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
    <main className={`lectura-movil min-h-screen ${ofertas.length ? 'pb-24 sm:pb-0' : ''}`}>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 sm:py-4">
          <a href={DEALS_URL} className="font-display text-base sm:text-lg font-extrabold tracking-tight flex min-h-11 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- avatar local de 64 px, ya optimizado */}
            <img src="/personaje/avatar-64.webp" alt="Don Ofertín" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
            <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 pt-3 pb-8 sm:py-12">
        <nav aria-label="Ruta" className="hidden sm:block text-xs text-zinc-500 mb-3">
          <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> /{' '}
          <Link href="/precio-hoy" className="hover:text-yellow-400">Precio hoy</Link> / <span className="text-zinc-300">{p.nombre}</span>
        </nav>
        <h1 className="font-display text-xl sm:text-4xl font-black leading-[1.1] tracking-tight mb-3 [text-wrap:balance]">
          {titulo(p.nombre)}
        </h1>
        {ofertas[0] && <DestacadoML producto={ofertas[0]} lista={ofertas} rotulo="El más barato que vimos" />}
        <p className="mb-6 inline-flex text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
          <LastUpdated scrapedAt={scrapedAt} />
        </p>

        {ofertas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
            {/* Clarity 21-23/10: este recuadro se tocaba como si fuera un botón */}
            <a
              href={ofertas[0].url_producto}
              data-seccion="preciohoy_minimo"
              target="_blank"
              rel="sponsored nofollow noopener"
              className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 hover:border-yellow-400/60 p-3 transition-colors"
            >
              <p className="text-xl sm:text-2xl font-black text-yellow-300">{precio(min)}</p>
              <p className="text-xs text-zinc-400 mt-1">{sinRecientes ? 'el más barato que vimos ↗' : 'el más barato de la semana ↗'}</p>
            </a>
            {/* Clarity 16-18/11: 7 clics muertos en /precio-hoy/smart-tv-55-pulgadas,
                se tocaban estos recuadros como botones. Ahora llevan a ML / a la tabla. */}
            <a
              href={busquedaML(p.busqueda)}
              data-seccion="preciohoy_mediana"
              target="_blank"
              rel="sponsored nofollow noopener"
              className="rounded-xl border border-zinc-800 bg-zinc-900 hover:border-yellow-400/60 p-3 transition-colors"
            >
              <p className="text-xl sm:text-2xl font-black">{precio(med)}</p>
              <p className="text-xs text-zinc-400 mt-1">mediana · ver todos ↗</p>
            </a>
            <a
              href="#los-mas-baratos"
              className="rounded-xl border border-zinc-800 bg-zinc-900 hover:border-yellow-400/60 p-3 transition-colors"
            >
              <p className="text-xl sm:text-2xl font-black">{ofertas.length}</p>
              <p className="text-xs text-zinc-400 mt-1">{sinRecientes ? 'ofertas vistas ↓' : 'ofertas de la semana ↓'}</p>
            </a>
          </div>
        )}

        <p className="text-lg text-zinc-200 leading-relaxed mb-5">{respuesta}</p>

        {/* Botón a ML arriba: en el celular el scroll medio es 25% (Clarity 21-23/10)
            y el botón de abajo de las tablas casi nadie lo ve. */}
        <div data-seccion="preciohoy_cta_arriba" className="mb-8 flex flex-col sm:flex-row gap-2">
          <a
            href={busquedaML(p.busqueda)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={
              ofertas[0]
                ? 'flex items-center justify-center text-center rounded-xl border border-yellow-400/40 hover:border-yellow-400 px-5 py-3 text-sm font-bold text-yellow-200 transition-colors'
                : 'flex items-center justify-center text-center rounded-xl bg-yellow-400 hover:bg-yellow-300 px-5 py-3.5 font-black text-black transition-colors'
            }
          >
            Ver todos los modelos en Mercado Libre ↗
          </a>
        </div>

        {ofertas.length > 0 && (
          <section id="los-mas-baratos" data-seccion="preciohoy_tabla" className="mb-8 scroll-mt-4">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Los más baratos</h2>
            {/* Tarjetas en vez de tabla: en el celular el botón quedaba fuera de pantalla */}
            <ul className="grid gap-3 sm:grid-cols-2">
              {filasTabla.map(o => (
                <li key={o.id_ml} className="min-w-0">
                  <a href={o.url_producto} rel="sponsored nofollow noopener" target="_blank" className="group flex h-full flex-col gap-2.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-2.5 hover:border-yellow-400">
                    <span className="flex gap-3">
                      <span className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                        {o.url_imagen && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={miniaturaML(o.url_imagen, 'chica')} alt="" width={96} height={96} sizes="96px" loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="line-clamp-2 text-base leading-snug text-zinc-100">{nombreCorto(o.titulo)}</span>
                        <span className="mt-1 font-display text-xl font-black leading-tight tabular-nums text-yellow-400">{precio(o.precio_actual)}</span>
                        <UltVerificacion fecha={o.precio_visto} />
                        {edadVieja(diasDesde(o.precio_visto)) && <span className="text-base text-amber-300">Confirmalo en ML</span>}
                      </span>
                    </span>
                    <span className={`${BOTON_ML} mt-auto`}>Ver en Mercado Libre</span>
                  </a>
                </li>
              ))}
            </ul>
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
                      <td className="px-3 py-2 whitespace-nowrap">
                        <a href={`/precio/${s.slug}`} className="block hover:text-yellow-400">{precio(precioActual(s))}</a>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-400">
                        <a href={`/precio/${s.slug}`} className="block hover:text-yellow-400">
                          {precio(s.min)} <span className="text-xs">({fecha(s.min_ts)})</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <TambienTeServira items={tambien} extras={tambienExtras} seccion="preciohoy_tambien" />

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
            {preciosHoyVisibles().filter(x => x.slug !== p.slug).map(x => (
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

      {/* Celular: la oferta más barata de hoy queda a mano mientras se compara */}
      {ofertas[0] && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-4 py-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-base text-zinc-300 truncate">{ofertas[0].titulo}</p>
            <p className="font-display text-lg font-black text-yellow-400 leading-tight">{precio(ofertas[0].precio_actual)}</p>
          </div>
          <a
            href={ofertas[0].url_producto}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="flex min-h-12 w-[52%] shrink-0 items-center justify-center rounded-xl bg-[#FACC15] px-2 text-center text-base font-black leading-tight text-black active:scale-[0.97] transition-transform"
          >
            Ver en Mercado Libre
          </a>
        </div>
      )}
    </main>
  )
}
