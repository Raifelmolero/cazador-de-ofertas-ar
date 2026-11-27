import { cyberExtendido } from '@/lib/cupones'
import Link from 'next/link'
import { LANDINGS_CYBER } from '@/lib/cybertecno'
import { etapaCyber, aBlackFridayTrasCyber as bf, modoBF, textoModoBF, tituloLandingModoBF } from '@/lib/cybermonday'
import { busquedaML, conEtiqueta, ETIQUETA_JSONLD } from '@/lib/afiliado'
import { descripcionSeo, tituloSeo, MAX_TITULO } from '@/lib/seo'
import type { ProductWithMargins } from '@/lib/productos'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import AvisoBFRubro from '@/components/AvisoBFRubro'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { disponibilidadLD } from '@/lib/bf-jsonld'
import { COMPARATIVAS, MIN_PRODUCTOS_INDEXABLE, categoriaDe, getComparativa, indexable, productosDe } from '@/lib/comparativas'
import { getGuia } from '@/lib/guias'
import { getSeguidosPrincipales, seguidosDeCategoria, slugPorId } from '@/lib/seguimiento'
import { normalizar } from '@/lib/categorias'
import { CONTENIDO } from '@/lib/comparativas-contenido'
import DestacadoML, { elegirDestacado, elegirDestacadoNotebooks } from '@/components/DestacadoML'
import CtaFijoML from '@/components/CtaFijoML'
import SinOfertas from '@/components/SinOfertas'
import { enlacesAfines } from '@/lib/afines'
import { presupuestosConEquipos } from '@/lib/presupuesto'
import { getComparador } from '@/lib/comparador'
import { diasDesde, edadVieja } from '@/lib/frescura'
import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import { getLandingBF } from '@/lib/black-friday-landings'
import LandingBFPage from '@/components/black-friday/LandingBF'
import EnlaceNavidad from '@/components/EnlaceNavidad'
import { descripcionConNavidad, terminoBF } from '@/lib/navidad-post-bf'
import CtaOfertaDestacada from '@/components/CtaOfertaDestacada'
import EnlacesVerano from '@/components/EnlacesVerano'
import { cuadroVerano, getLandingVerano } from '@/lib/verano-ticket-alto'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const MAX_FILAS = 12

// Black Friday (26/11/2026): el modo del día (lib/cybermonday.ts, modoBF) cambia title, H1 y hero de
// las landings /mejores/black-friday-* sin esperar al deploy agrupado. Una regeneración por hora
// y por página como mucho, solo si alguien la visita (no gasta Build CPU).
export const revalidate = 3600

export function generateStaticParams() {
  return COMPARATIVAS.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  // Black Friday de ticket alto: landing curada para el celular (lib/black-friday-landings.ts).
  const bfl = getLandingBF(slug)
  if (bfl) {
    const url = `${DEALS_URL}/mejores/${bfl.slug}`
    // Modo del día (previa / hoy / últimas horas / terminó), resuelto en el render (ISR de 1 hora).
    const modo = modoBF()
    const titulo = tituloLandingModoBF(bfl.h1, bfl.titulo, modo)
    const descripcion = descripcionConNavidad(descripcionSeo(textoModoBF(bfl.descripcion, modo)), modo, bfl.rubro)
    return {
      title: { absolute: titulo },
      description: descripcion,
      keywords: bfl.keywords,
      metadataBase: new globalThis.URL(DEALS_URL),
      alternates: { canonical: url },
      openGraph: { title: titulo, description: descripcion, url, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
    }
  }
  const c = getComparativa(slug)
  if (!c) return {}
  const url = `${DEALS_URL}/mejores/${c.slug}`
  // "desde $X" (el más barato de la tabla de hoy): el precio en el título sube los clics.
  // Sin los que cuestan menos de un tercio de la mediana: son accesorios ("lavarropas
  // desde $5.300" eran pastillas limpiadoras).
  // Solo los que muestra la página: con todo el catálogo salía «desde» un modelo que no aparece.
  // 24/11: la tabla son los 12 de más ganancia (ticket alto), así que en ofertas-black-friday el
  // «desde» daba $4.399.990 aunque la sección «Por presupuesto» lista equipos mucho más baratos.
  // Ahora entran también esos: el «desde» es el más barato de todo lo que la página lista.
  const lista = productosDe(c)
  const mostrados = [...lista.slice(0, MAX_FILAS), ...(c.presupuestos ? armarTramos(lista, c.presupuestos).flatMap(t => t.items) : [])]
  const todos = mostrados.map(p => p.precio_actual).filter(n => n > 0).sort((a, b) => a - b)
  const mediana = todos[Math.floor(todos.length / 2)] ?? 0
  // Con tramos de presupuesto los baratos son a propósito (no accesorios): no se filtran.
  const precios = c.presupuestos ? todos : todos.filter(n => n >= mediana / 3)
  const esCyber = c.slug === 'ofertas-cyber-monday' || c.slug.startsWith('cyber-monday-')
  // T-002 (15/11): las de Cyber (muchas vistas, pocos clics) llevan además el año 2026 antes del «:».
  const anio = (t: string) => (esCyber && !/20\d\d/.test(t) ? t.replace(/^([^:]+)/, '$1 2026') : t)
  const base = anio((esCyber ? bf : (t: string) => t)(CONTENIDO[c.slug]?.titulo ?? c.titulo)).replace(/:\s*(comparativa de precios|precios y accesorios)$/i, '')
  // Con menos de 3 modelos el "desde" engaña (el único que hay puede ser el más caro).
  // Si no entra, se acorta el título antes del ":" en vez de cortar el precio
  // (en Google salían títulos terminados en "…: desde").
  const desde = precios.length >= MIN_PRODUCTOS_INDEXABLE ? `: desde ${precio(Math.min(...precios))}` : ''
  const corto = base.split(':')[0].trim()
  const opciones = [`${base}${desde} — Cazador de Ofertas AR`, `${base}${desde}`, `${corto}${desde}`]
  // Black Friday: tope de 60 (pedido del 24/11), el resto sigue con MAX_TITULO.
  const max = c.slug.includes('black-friday') ? 60 : MAX_TITULO
  // Verano ticket alto (27/11): title y description de temporada (lib/verano-ticket-alto.ts).
  const verano = getLandingVerano(c.slug)
  const titulo = verano?.seoTitulo ?? c.seoTitulo ?? opciones.find(o => o.length <= max) ?? tituloSeo(base, [n => n], max)
  const descripcionBase = esCyber ? bf(c.descripcion) : (verano?.seoDescripcion ?? c.descripcion)
  const descripcion = descripcionSeo(
    esCyber && precios.length >= MIN_PRODUCTOS_INDEXABLE && !/desde \$/.test(descripcionBase)
      ? `Desde ${precio(Math.min(...precios))} hoy en Mercado Libre. ${descripcionBase}`
      : descripcionBase,
  )
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
  const { slug } = await params
  const bfl = getLandingBF(slug)
  if (bfl) return <LandingBFPage l={bfl} />
  const c = getComparativa(slug)
  if (!c) notFound()

  const url = `${DEALS_URL}/mejores/${c.slug}`
  const esCyberPag = c.slug === 'ofertas-cyber-monday' || c.slug.startsWith('cyber-monday-')
  const tituloVis = esCyberPag ? bf(c.titulo) : c.titulo
  // Pasado el Cyber, sus comparativas (las que más clics traen de Google) mandan al Black Friday.
  const trasCyber = c.slug.startsWith('cyber-monday-') && etapaCyber(getScrapedAt()).etapa === 'despues'
    ? (getComparativa(c.slug.replace('cyber-monday-', 'black-friday-')) ? c.slug.replace('cyber-monday-', 'black-friday-') : 'ofertas-black-friday')
    : ''
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

  const contenidoBase = CONTENIDO[c.slug]
  // Pasado el Cyber, el cuerpo de sus comparativas también habla del Black Friday (misma dirección).
  const contenido = contenidoBase && esCyberPag
    ? {
        ...contenidoBase,
        secciones: contenidoBase.secciones.map(s => ({ ...s, titulo: bf(s.titulo), parrafos: s.parrafos.map(t => bf(t)) })),
        faq: contenidoBase.faq.map(f => ({ q: bf(f.q), a: bf(f.a) })),
      }
    : contenidoBase
  // Celulares, notebooks y smart TV tienen páginas «mejor … hasta $X»: las enlazamos para que Google las encuentre.
  const porPresupuesto = presupuestosConEquipos().filter(x => x.p.comparador === c.categoria)
  const comparador = porPresupuesto.length ? getComparador(porPresupuesto[0].p.comparador) : undefined
  const destacado = c.slug === 'black-friday-notebooks' ? elegirDestacadoNotebooks(productos) : elegirDestacado(productos)
  // Verano ticket alto (27/11): cuadro amarillo con botón a la ficha /precio (null si no hay 3 fichas).
  const esVerano = !!getLandingVerano(c.slug)
  const cuadro = esVerano ? cuadroVerano(c.slug) : null

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: tituloVis, item: url },
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
                    `. Comparamos ${productos.length} ${c.nombre} en oferta por precio y precio mínimo registrado; la tabla se actualiza a medida que cargamos ofertas nuevas.`,
                },
              },
            ]
          : []),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: tituloVis,
      url,
      description: c.descripcion,
      inLanguage: 'es-AR',
      dateModified: scrapedAt,
      isPartOf: { '@type': 'WebSite', name: 'Cazador de Ofertas AR', url: DEALS_URL },
    },
    ...(productos.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: tituloVis,
            numberOfItems: productos.length,
            itemListElement: productos.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: p.titulo,
                sku: p.id_ml,
                ...(p.url_imagen ? { image: p.url_imagen } : {}),
                offers: {
                  '@type': 'Offer',
                  price: p.precio_actual,
                  priceCurrency: 'ARS',
                  availability: disponibilidadLD(p.precio_actual),
                  itemCondition: 'https://schema.org/NewCondition',
                  url: conEtiqueta(p.url_producto, ETIQUETA_JSONLD),
                },
              },
            })),
          },
        ]
      : []),
  ]

  return (
    <main className={`lectura-movil min-h-screen ${productos.length ? 'pb-20 sm:pb-0' : ''}`}>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 sm:py-4 flex items-center justify-between gap-2">
          <a href={DEALS_URL} className="font-display text-base sm:text-lg font-extrabold tracking-tight flex min-h-11 min-w-0 items-center gap-2 leading-tight">
            {/* eslint-disable-next-line @next/next/no-img-element -- avatar local de 64 px, ya optimizado */}
            <img src="/personaje/avatar-64.webp" alt="Don Ofertín" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
            <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-base sm:text-xs font-bold text-yellow-400 border border-yellow-400/50 hover:border-yellow-300 px-3 rounded-full transition-colors whitespace-nowrap"
          >
            Canal ✈️
          </a>
        </div>
      </header>

      {/* Black Friday 27/11: link a la landing del rubro (lib/bf-enlaces.ts), se apaga tras el 30/11 */}
      <AvisoBFRubro ruta={`/mejores/${slug}`} />

      <article className="max-w-3xl mx-auto px-4 pt-3 pb-8 sm:py-12">
        <nav aria-label="Ruta" className="hidden sm:block text-xs text-zinc-500 mb-3">
          <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
          <span className="text-zinc-300">Comparativas</span>
        </nav>
        {/* «con descuento verificado» no va a la vista: las tarjetas ya no afirman ningún descuento */}
        <h1 className="font-display text-xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-3 [text-wrap:balance]">
          {tituloVis.replace(/:? (ofertas )?con descuento verificado/i, ': precios y ofertas')}
        </h1>
        {trasCyber && (
          <p className="text-sm text-zinc-200 bg-zinc-900 border border-yellow-400/30 rounded-xl px-4 py-3 mb-4">
            {terminoBF() ? (
              // Pasado el Black Friday (29/11), «el próximo evento es el Black Friday» quedaba viejo.
              <>
                El Cyber Monday y el Black Friday ya terminaron. Lo que viene es <strong>Navidad</strong>:{' '}
                <Link href="/regalos-navidad" className="text-yellow-400 underline">mirá los regalos por presupuesto</Link>.
              </>
            ) : (
              <>
                {cyberExtendido() ? 'Mercado Libre extendió el Cyber Monday (hoy hay cupones de hasta $80.000 en /cupones-mercado-libre).' : 'El Cyber Monday ya terminó.'} El próximo evento grande es el <strong>Black Friday (27/11)</strong>:{' '}
                <Link href={`/mejores/${trasCyber}`} className="text-yellow-400 underline">mirá qué conviene esperar</Link>.
              </>
            )}{' '}
            Los precios de abajo son los de hoy.
          </p>
        )}
        {/* Verano: el cuadro reemplaza al destacado de arriba (el destacado sigue en la barra fija del celular). */}
        {cuadro ? <CtaOfertaDestacada cta={cuadro} className="mb-6" /> : destacado && <DestacadoML producto={destacado} lista={productos} />}
        {/* El texto va después del primer producto */}
        <p className="text-base text-zinc-400 leading-relaxed mb-3 [text-wrap:pretty]">{c.intro}</p>
        <p className="text-base sm:text-xs text-zinc-400 mb-6">
          <LastUpdated scrapedAt={scrapedAt} /> · {productos.length} en la comparativa
        </p>
        {/* Del Black Friday a Navidad (27/11): link destacado a /regalos-navidad, debajo del primer producto */}
        <EnlaceNavidad seccion={`navidad_mejores_${c.slug}`} className="mb-6" />

        {esVerano && <EnlacesVerano seccion={`verano_enlaces_${c.slug}`} excluir={c.slug} titulo="Más para el verano" className="mb-6" />}

        <section id="comparativa" className="mb-10 scroll-mt-20">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Comparativa de precios de hoy</h2>
          {productos.length === 0 ? (
            <SinOfertas que={`de ${c.nombre}`} enlaces={enlacesAfines({ categoria: c.categoria })} />
          ) : (
            <>
            {/* Celular: tarjetas con foto y botón (la tabla dejaba el precio y la compra fuera de pantalla) */}
            <ol className="sm:hidden space-y-3">
              {productos.map(p => (
                <li key={p.id_ml} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
                  <div className="flex gap-3">
                    <div className="w-24 h-24 shrink-0 rounded-xl bg-white overflow-hidden">
                      {p.url_imagen && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={miniaturaML(p.url_imagen, 'chica')} alt="" width={96} height={96} sizes="96px" loading="lazy" decoding="async" className="w-full h-full object-contain p-1" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <a href={p.url_producto} rel="sponsored nofollow noopener" target="_blank" className="text-base leading-snug text-zinc-200 hover:text-yellow-400 line-clamp-2">
                        {nombreCorto(p.titulo)}
                      </a>
                      <p className="mt-1 font-display text-xl font-black leading-tight tabular-nums text-yellow-400">{precio(p.precio_actual)}</p>
                      <UltVerificacion fecha={p.precio_visto} />
                      {edadVieja(diasDesde(p.precio_visto)) && <p className="text-base text-amber-300">Confirmalo en ML</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href={p.url_producto} rel="sponsored nofollow noopener" target="_blank" className={`${BOTON_ML} flex-1`}>
                      Ver en Mercado Libre
                    </a>
                    {historial[p.id_ml] && (
                      <a href={`/precio/${historial[p.id_ml]}`} aria-label="Historial de precio" className="flex min-h-12 min-w-12 items-center justify-center rounded-xl border border-zinc-700 text-base font-bold text-zinc-300">
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
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Mínimo registrado</th>
                    <th className="px-3 py-2 font-semibold whitespace-nowrap">Comprar</th>
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
                        </span>
                      </td>
                      <td className="px-3 py-2 text-base text-zinc-100 font-semibold">
                        {precio(p.precio_actual)}
                        <span className="font-normal"><UltVerificacion fecha={p.precio_visto} /></span>
                        {edadVieja(diasDesde(p.precio_visto)) && <span className="block font-normal text-amber-300">Confirmalo en ML</span>}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-zinc-400">
                        {p.precio_minimo_registrado ? precio(p.precio_minimo_registrado) : '—'}
                      </td>
                      <td className="px-3 py-2">
                        <a href={p.url_producto} rel="sponsored nofollow noopener" target="_blank" className={BOTON_ML}>
                          Ver en Mercado Libre
                        </a>
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
            Cómo armamos esta comparativa: no probamos los productos. Comparamos precio e historial de
            precios que registramos revisando las ofertas de Mercado Libre. Los links son de afiliado: el precio
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
                      <li key={p.id_ml} className="flex items-center justify-between gap-3 text-base">
                        <a href={p.url_producto} rel="sponsored nofollow" target="_blank" className="flex min-h-11 min-w-0 items-center text-zinc-300 hover:text-yellow-400">
                          <span className="line-clamp-2">{nombreCorto(p.titulo)}</span>
                        </a>
                        <span className="whitespace-nowrap font-semibold text-zinc-100">{precio(p.precio_actual)}</span>
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
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{bf('Cyber Monday')} {new Date().getFullYear()} por rubro</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/black-friday"
                className="text-sm font-bold border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 rounded-xl px-4 py-2"
              >
                Fechas y cómo detectar inflados
              </Link>
              {LANDINGS_CYBER.filter(l => l.comparativa === c.slug).map(l => (
                <Link
                  key={l.slug}
                  href="/black-friday"
                  className="text-sm font-bold border border-cyan-400/40 hover:border-cyan-300 text-cyan-200 rounded-xl px-4 py-2"
                >
                  Precio de octubre por marca
                </Link>
              ))}
              {COMPARATIVAS.filter(x => (x.slug === 'ofertas-cyber-monday' || x.slug.startsWith('cyber-monday-')) && x.slug !== c.slug).map(x => (
                <a
                  key={x.slug}
                  href={`/mejores/${x.slug}`}
                  className="text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-4 py-2"
                >
                  {x.slug === 'ofertas-cyber-monday' ? 'Todas las ofertas' : x.nombre.replace(' en el Cyber Monday', '').replace(' en el Black Friday', '')}
                </a>
              ))}
            </div>
          </nav>
        )}

        {porPresupuesto.length > 0 && (
          <nav className="text-sm mb-8" data-seccion="mejores-presupuesto">
            <p className="font-bold text-zinc-300 mb-2">¿Tenés un presupuesto? Te decimos cuál conviene hoy</p>
            <ul className="flex flex-wrap gap-2">
              {porPresupuesto.map(x => (
                <li key={x.p.slug}>
                  <a href={`/mejor/${x.p.slug}`} className="inline-block border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-4 py-2">
                    Hasta ${x.p.texto}
                  </a>
                </li>
              ))}
              <li>
                <a href={`/comparador/${c.categoria}`} className="inline-block border border-yellow-400/60 hover:border-yellow-400 text-yellow-400 rounded-xl px-4 py-2">
                  Comparar todos{comparador ? ` los ${comparador.plural}` : ''}
                </a>
              </li>
            </ul>
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

      {/* Celular: barra fija que aparece al scrollear, con el destacado a mano */}
      {destacado && <CtaFijoML titulo={destacado.titulo} precio={precio(destacado.precio_actual)} url={destacado.url_producto} />}
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
