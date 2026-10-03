// Landing del Día de la Madre (Argentina: tercer domingo de octubre; en 2026,
// domingo 18/10). Regalos en oferta HOY por rango de precio, cuenta regresiva,
// cómo detectar descuentos inflados y links a comparativa, guía y categorías.
//
// Nada inventado: los productos salen de la comparativa
// /mejores/regalos-dia-de-la-madre (keywords regalables) más las categorías
// perfumes y electro de cocina, y de las comparativas por rubro (desde $30.000); los rangos se
// calculan sobre esos precios y el % de infladas sale del registro del bot.
// Sin JSON-LD de Event: el Día de la Madre no es un evento con organizador.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import ExtensionCTA from '@/components/ExtensionCTA'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getScrapedAt, type ProductWithMargins } from '@/lib/productos'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { getCategoria, ofertasDeCategoria } from '@/lib/categorias'
import { GUIAS } from '@/lib/guias'
import { getEstudio } from '@/lib/estudio'
import { getInfladas } from '@/lib/infladas'
import { slugPorId } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/dia-de-la-madre`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'
const AÑO = 2026
/** Tercer domingo de octubre de 2026 (el 1/10/2026 es jueves → 4, 11, 18). */
const FECHA = '2026-10-18'
const FECHA_TEXTO = 'domingo 18 de octubre'
const POR_RANGO = 8

const RANGOS = [
  { id: 'hasta-100000', titulo: 'Hasta $100.000', min: 0, max: 100000 },
  { id: '100000-a-300000', titulo: 'De $100.000 a $300.000', min: 100000, max: 300000 },
  { id: 'mas-de-300000', titulo: 'Más de $300.000', min: 300000, max: Infinity },
] as const

const CATEGORIAS_REGALO = [
  { slug: 'perfumes', nombre: 'Perfumes' },
  { slug: 'electro-de-cocina', nombre: 'Electro de cocina' },
  { slug: 'freidoras-de-aire', nombre: 'Freidoras de aire' },
  { slug: 'aspiradoras', nombre: 'Aspiradoras' },
  { slug: 'cocinas-y-hornos', nombre: 'Cocinas y hornos' },
  { slug: 'colchones', nombre: 'Colchones y sommiers' },
]

/** Guías de compra para regalos de ticket alto (lo que más se vendió). */
const GUIAS_REGALO = [
  'que-regalar-el-dia-de-la-madre',
  'que-notebook-comprar',
  'que-celular-comprar-segun-presupuesto',
  'que-smart-tv-comprar',
  'que-lavarropas-comprar',
  'que-lavavajillas-comprar',
  'que-colchon-comprar-firmeza-y-material',
  'que-freidora-de-aire-comprar',
]

/** Regalos de ticket medio/alto por rubro: cada uno sale de su comparativa
 *  (catálogo del día); si hoy no hay ofertas de un rubro, no se muestra. */
const RUBROS_REGALO = [
  { comp: 'mejores-notebooks', titulo: 'Notebooks', emoji: '💻' },
  { comp: 'mejores-celulares', titulo: 'Celulares', emoji: '📱' },
  { comp: 'mejores-smart-tv', titulo: 'Smart TV', emoji: '📺' },
  { comp: 'mejores-lavarropas', titulo: 'Lavarropas', emoji: '🧺' },
  { comp: 'mejores-lavavajillas', titulo: 'Lavavajillas', emoji: '🍽️' },
  { comp: 'mejores-colchones', titulo: 'Colchones', emoji: '🛏️' },
  { comp: 'mejores-perfumes', titulo: 'Perfumes', emoji: '🌸' },
  { comp: 'mejores-cafeteras', titulo: 'Cafeteras', emoji: '☕' },
  { comp: 'mejores-freidoras-de-aire', titulo: 'Freidoras de aire', emoji: '🍟' },
  { comp: 'mejores-batidoras', titulo: 'Batidoras', emoji: '🍰' },
  { comp: 'mejores-aspiradoras', titulo: 'Aspiradoras', emoji: '🧹' },
  { comp: 'mejores-tablets', titulo: 'Tablets', emoji: '📱' },
  { comp: 'mejores-smartwatch', titulo: 'Smartwatch', emoji: '⌚' },
  { comp: 'mejores-planchitas-y-secadores-de-pelo', titulo: 'Planchitas y secadores de pelo', emoji: '💇' },
  { comp: 'mejores-colchones-2-plazas', titulo: 'Colchones 2 plazas y queen', emoji: '🛏️' },
  { comp: 'mejores-sommiers', titulo: 'Sommiers y conjuntos', emoji: '🛏️' },
  { comp: 'mejores-muebles-de-jardin', titulo: 'Muebles de jardín y gazebos', emoji: '🌿' },
] as const
const POR_RUBRO = 4

const TITULO = `Regalos para el Día de la Madre ${AÑO}: ofertas reales por presupuesto`
const DESCRIPCION = `El Día de la Madre ${AÑO} en Argentina es el ${FECHA_TEXTO}. Ideas de regalo en oferta en Mercado Libre por rango de precio (hasta $100.000, de $100.000 a $300.000 y más de $300.000: notebooks, celulares, smart TV, lavarropas, colchones), con el descuento verificado contra el historial.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  keywords: [
    `día de la madre ${AÑO}`,
    `regalos día de la madre ${AÑO}`,
    'qué regalar el día de la madre',
    'cuándo es el día de la madre argentina',
    'regalos día de la madre mercado libre',
    'ofertas día de la madre',
  ],
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Días hasta el Día de la Madre (hora argentina; el sitio se rebuildea 3×/día). */
function diasHasta(ahora = new Date()): number {
  const fin = new Date(`${FECHA}T00:00:00-03:00`).getTime()
  return Math.ceil((fin - ahora.getTime()) / 86_400_000)
}

export default function DiaDeLaMadrePage() {
  const scrapedAt = getScrapedAt().toISOString()
  const estudio = getEstudio()
  const infladas = getInfladas()
  const historial = slugPorId()
  const dias = diasHasta()

  const comp = getComparativa('regalos-dia-de-la-madre')
  // Comparativa de regalos + categorías regalables enteras (perfumes, electro
  // de cocina), sin repetidos.
  const vistos = new Set<string>()
  const regalos: ProductWithMargins[] = [
    ...(comp ? productosDe(comp) : []),
    ...['perfumes', 'electro-de-cocina'].flatMap(s => {
      const c = getCategoria(s)
      return c ? ofertasDeCategoria(c) : []
    }),
  ].filter(p => (vistos.has(p.id_ml) ? false : (vistos.add(p.id_ml), true)))
  const light = (o: ProductWithMargins): OfertaLight => ({
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
  })
  // Ya vienen ordenados por ganancia esperada (igual que /hoy). Los rangos
  // altos suman los rubros de ticket alto (notebooks, celulares, TV, etc.).
  const deRubros = RUBROS_REGALO.flatMap(r => {
    const c = getComparativa(r.comp)
    return c ? productosDe(c) : []
  })
  const pool = [...regalos, ...deRubros].filter((p, i, a) => a.findIndex(x => x.id_ml === p.id_ml) === i)
  const rangos = RANGOS.map(r => {
    const todos = pool.filter(p => p.precio_actual >= r.min && p.precio_actual < r.max)
    return { ...r, total: todos.length, productos: todos.slice(0, POR_RANGO) }
  })
  // Por rubro, solo ticket medio/alto (≥ $30.000): lo que más comisión deja.
  const rubros = RUBROS_REGALO.flatMap(r => {
    const c = getComparativa(r.comp)
    if (!c) return []
    const todos = productosDe(c).filter(p => p.precio_actual >= 30000)
    return todos.length ? [{ ...r, slug: c.slug, compTitulo: c.titulo, total: todos.length, productos: todos.slice(0, POR_RUBRO) }] : []
  })
  const mostrados = [...rangos.flatMap(r => r.productos), ...rubros.flatMap(r => r.productos)].filter(
    (p, i, a) => a.findIndex(x => x.id_ml === p.id_ml) === i,
  )

  const guias = GUIAS_REGALO.map(s => GUIAS.find(g => g.slug === s)).filter(g => g !== undefined)
  const pct = estudio.pctInfladas.toLocaleString('es-AR')

  const faqs = [
    {
      q: `¿Cuándo es el Día de la Madre ${AÑO} en Argentina?`,
      a: `El ${FECHA_TEXTO} de ${AÑO}. En Argentina se celebra siempre el tercer domingo de octubre.`,
    },
    {
      q: '¿Con cuánta anticipación conviene comprar el regalo?',
      a: `Cuanto antes, mejor. Mercado Libre muestra en cada publicación la fecha de entrega estimada para tu código postal antes de pagar: esa es la única referencia confiable. Fijate que diga una fecha anterior al ${FECHA_TEXTO}.`,
    },
    {
      q: '¿Cómo sé si el descuento de un regalo es real?',
      a: `Comparando el precio de hoy contra lo que el producto costó antes, no contra el precio tachado. En nuestro registro, el ${pct}% de las ofertas que revisamos en mercadolibre.com.ar/ofertas tenía el descuento inflado: el producto ya se había vendido al menos 5% más barato. Cada regalo de esta página muestra su mínimo registrado.`,
    },
    {
      q: '¿Qué regalar según el presupuesto?',
      a: 'Depende de lo que haya en oferta ese día: en esta página separamos las ofertas regalables de hoy en tres rangos: hasta $100.000 (perfumes, cuidado personal, electro de cocina), de $100.000 a $300.000 (freidoras, celulares, colchones) y más de $300.000 (notebooks, smart TV, lavarropas). Para los regalos grandes tenemos guías de compra que explican qué mirar en cada uno.',
    },
    {
      q: `¿Hasta cuándo conviene pedir el regalo para que llegue el ${FECHA_TEXTO}?`,
      a: `No hay una fecha única: depende del vendedor, del tipo de envío y de tu código postal. Antes de pagar, Mercado Libre muestra la fecha estimada de entrega; elegí una publicación cuya fecha sea anterior al ${FECHA_TEXTO}. En productos grandes (colchones, lavarropas, smart TV) revisala con más cuidado.`,
    },
    {
      q: '¿Qué regalos grandes hay en oferta para el Día de la Madre?',
      a: 'En esta página mostramos, por rubro, las ofertas de hoy desde $30.000 en notebooks, celulares, smart TV, lavarropas, colchones, perfumes, cafeteras, freidoras de aire, batidoras, aspiradoras, tablets, smartwatch, planchitas y secadores de pelo, colchones, sommiers y muebles de jardín. Solo aparecen los rubros que hoy tienen ofertas, y cada rubro enlaza a su comparativa completa.',
    },
  ]

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Día de la Madre ${AÑO}`, item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...(mostrados.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Regalos en oferta para el Día de la Madre ${AÑO}`,
            itemListElement: mostrados.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: p.url_producto })),
          },
        ]
      : []),
  ]

  const estado = dias > 1 ? `Faltan ${dias} días` : dias === 1 ? 'Es mañana' : dias === 0 ? 'Es hoy' : 'Ya pasó'

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
            Alertas gratis
          </a>
        </div>
      </header>

      <section
        className="border-b border-zinc-900 px-4 py-8 sm:py-12"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(244,114,182,0.08) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Día de la Madre {AÑO}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
            {TITULO}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Desde perfumes y electro de cocina hasta notebooks, celulares, smart TV, lavarropas y colchones, separados por presupuesto. Cada regalo está
            comparado contra el precio más bajo que registramos, así sabés si el descuento es de verdad.
          </p>

          <div className="mt-6 rounded-2xl border border-pink-400/30 bg-pink-500/[0.07] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-pink-300">Tercer domingo de octubre · {estado}</p>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-zinc-50 [text-wrap:balance]">
              Domingo 18 de octubre de {AÑO}
            </p>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {dias > 7
                ? 'Si comprás en Mercado Libre, apuntá a tenerlo pedido una semana antes: mirá la fecha de entrega antes de pagar.'
                : dias >= 0
                  ? 'Queda poco: priorizá envío Full o retiro y chequeá la fecha de entrega antes de pagar.'
                  : 'Igual te dejamos los regalos en oferta de hoy, con el descuento verificado.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {rangos.map(r => (
                <a key={r.id} href={`#${r.id}`} className="text-xs font-bold rounded-full border border-pink-400/30 px-3 py-1 text-pink-200 hover:border-pink-400/60">
                  {r.titulo} ({r.total})
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {rangos.map(r => (
        <section key={r.id} id={r.id} className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
          <div className="max-w-3xl mb-4">
            <h2 className="font-display text-xl sm:text-2xl font-black">🎁 Regalos {r.titulo.toLowerCase()}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {r.total === 0
                ? 'Hoy no hay ofertas regalables en este rango. Volvé en unas horas: revisamos 3 veces por día.'
                : r.total > r.productos.length
                  ? `Las ${r.productos.length} mejores de ${r.total} ofertas de hoy en este rango.`
                  : `${r.total} ${r.total === 1 ? 'oferta' : 'ofertas'} de hoy en este rango.`}{' '}
              {r.productos.length > 0 && <>Desde {pesos(Math.min(...r.productos.map(p => p.precio_actual)))}. </>}
              <span className="text-zinc-500">
                <LastUpdated scrapedAt={scrapedAt} />.
              </span>
            </p>
          </div>
          {r.productos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {r.productos.map((o, i) => (
                <OfertaCard key={o.id_ml} producto={light(o)} priority={r.id === 'hasta-100000' && i < 4} />
              ))}
            </div>
          )}
        </section>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8">
        <Link href="/mejores/regalos-dia-de-la-madre" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
          Ver la comparativa completa de regalos, con el mínimo registrado de cada uno →
        </Link>
      </div>

      {rubros.length > 0 && (
        <section id="por-rubro" className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 scroll-mt-20">
          <div className="max-w-3xl mb-2">
            <h2 className="font-display text-xl sm:text-2xl font-black">Regalos grandes por rubro</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Si la idea es un regalo que dure (o armar una vaquita entre hermanos), estas son las ofertas de hoy desde
              $30.000 en cada rubro, con el mínimo registrado de cada una.
            </p>
          </div>
          {rubros.map(r => (
            <div key={r.comp} className="pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="font-display text-lg font-black">
                  {r.emoji} {r.titulo} <span className="text-sm font-semibold text-zinc-500">({r.total} en oferta)</span>
                </h3>
                <Link href={`/mejores/${r.slug}`} className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
                  Comparar todos →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {r.productos.map(o => (
                  <OfertaCard key={o.id_ml} producto={light(o)} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <article className="max-w-3xl mx-auto px-4 pb-10">
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cómo no caer en un descuento inflado</h2>
          <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
            En las {estudio.revisadas.toLocaleString('es-AR')} ofertas de mercadolibre.com.ar/ofertas que revisamos desde el{' '}
            {fechaAR(estudio.desde)}, el <strong className="text-zinc-100">{pct}%</strong> tenía el precio tachado inflado:
            el producto ya se había vendido al menos 5% más barato antes. En fechas de regalo, con más carteles de
            &quot;% OFF&quot;, vale la pena mirar dos veces.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-400 leading-relaxed mb-5">
            <li>
              <strong className="text-zinc-200">Ignorá el precio tachado.</strong> Lo pone quien vende; lo que importa es
              cuánto costó de verdad las semanas previas.
            </li>
            <li>
              <strong className="text-zinc-200">Mirá el historial.</strong> Si ya estuvo igual o más barato en un día
              común, el descuento no te ahorra nada.
            </li>
            <li>
              <strong className="text-zinc-200">Perfumes, de tienda oficial.</strong> Evitás réplicas y la devolución es
              más simple.
            </li>
            <li>
              <strong className="text-zinc-200">Hacé la cuenta final.</strong> Envío, cuotas sin interés de verdad y
              reintegros con tope.
            </li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <a
              href={`${DEALS_URL}/#verificador`}
              className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-5 py-2.5 transition-colors"
            >
              Verificar un descuento
            </a>
            <Link
              href="/descuentos-inflados"
              className="inline-block text-sm font-bold border border-red-500/40 hover:border-red-400 text-red-300 rounded-xl px-5 py-2.5 transition-colors"
            >
              {infladas.casos.length > 0 ? `Los descuentos inflados de hoy (${infladas.casos.length})` : 'Los descuentos inflados de hoy'}
            </Link>
            <Link
              href="/metodologia"
              className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-5 py-2.5 transition-colors"
            >
              Cómo lo medimos
            </Link>
          </div>
          <ExtensionCTA className="mt-5" />
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Más para elegir el regalo</h2>
          <ul className="space-y-2">
            {comp && (
              <li>
                <a href={`/mejores/${comp.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {comp.titulo} →</a>
              </li>
            )}
            {RUBROS_REGALO.map(r => getComparativa(r.comp)).filter(c => c !== undefined).map(c => (
              <li key={c.slug}>
                <a href={`/mejores/${c.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {c.titulo} →</a>
              </li>
            ))}
            {guias.map(g => (
              <li key={g.slug}>
                <a href={`/guias/${g.slug}`} className="font-bold text-yellow-400 hover:underline">📖 {g.titulo} →</a>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-2 text-sm text-zinc-400">Ofertas por categoría:</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS_REGALO.map(c => (
              <a
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="text-sm font-semibold rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
              >
                {c.nombre}
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center mb-10">
          <h2 className="font-display text-xl font-black mb-2">¿Querés los regalos que bajan de verdad?</h2>
          <p className="text-sm text-zinc-400 mb-5">Publicamos las ofertas verificadas 3 veces por día, con alerta de mínimos históricos.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold bg-green-500 hover:bg-green-400 text-black rounded-xl px-6 py-2.5 transition-colors"
            >
              Seguir en WhatsApp 💬
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5 transition-colors"
            >
              Unirme al canal ✈️
            </a>
          </div>
        </section>

        <section>
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
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
