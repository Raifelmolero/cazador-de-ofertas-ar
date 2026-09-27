// Landing de Navidad (25/12) y Reyes (6/1) en Argentina. Regalos en oferta HOY
// por rango de precio y por destinatario, cuenta regresiva, aviso de que los
// precios de hoy no son los de diciembre, cómo detectar descuentos inflados y
// links a Black Friday, Cyber Monday, nichos y comparativas.
//
// Nada inventado: los productos salen de la comparativa /mejores/regalos-de-navidad
// más categorías regalables (juguetes, gamer, perfumes, electro de cocina,
// herramientas, bicicletas); el destinatario se deriva de la categoría.
// Sin JSON-LD de Event: Navidad no es un evento con organizador.
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
import { CYBER_MONDAY, BLACK_FRIDAY } from '@/lib/cybermonday'
import { getEstudio } from '@/lib/estudio'
import { getInfladas } from '@/lib/infladas'
import { slugPorId } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/regalos-navidad`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'
const AÑO = 2026
const NAVIDAD = '2026-12-25'
/** Reyes Magos: 6 de enero del año siguiente. */
const REYES = '2027-01-06'
const POR_RANGO = 8
const POR_DESTINATARIO = 4

const RANGOS = [
  { id: 'hasta-50000', titulo: 'Hasta $50.000', min: 0, max: 50000 },
  { id: '50000-a-150000', titulo: 'De $50.000 a $150.000', min: 50000, max: 150000 },
  { id: 'mas-de-150000', titulo: 'Más de $150.000', min: 150000, max: Infinity },
] as const

/** Destinatario derivado de la categoría del producto (sin adivinar por título). */
const DESTINATARIOS: { id: string; titulo: string; emoji: string; categorias: string[] }[] = [
  { id: 'para-chicos', titulo: 'Para chicos', emoji: '🧸', categorias: ['bebes-y-jugueteria', 'bicicletas'] },
  { id: 'para-gamers', titulo: 'Para gamers', emoji: '🎮', categorias: ['gamer'] },
  { id: 'para-papa-y-mama', titulo: 'Para papá y mamá', emoji: '🎁', categorias: ['perfumes', 'herramientas-electricas'] },
  { id: 'para-la-casa', titulo: 'Para la casa', emoji: '🏠', categorias: ['electro-de-cocina', 'freidoras-de-aire'] },
]

const LINKS_RUBROS = [
  { href: '/bebes-y-jugueteria', nombre: 'Bebés y juguetería' },
  { href: '/gamer', nombre: 'Gamer' },
  { href: '/tecno', nombre: 'Tecno' },
  { href: '/herramientas', nombre: 'Herramientas' },
  { href: '/pequenos-electrodomesticos', nombre: 'Pequeños electrodomésticos' },
  { href: '/hogar', nombre: 'Hogar' },
  { href: '/categoria/perfumes', nombre: 'Perfumes' },
  { href: '/categoria/bicicletas', nombre: 'Bicicletas' },
]

const COMPARATIVAS_REL = [
  'regalos-de-navidad',
  'mejores-perfumes',
  'mejores-monitores-gamer',
  'mejores-freidoras-de-aire',
  'mejores-taladros',
  'cyber-monday-auriculares',
]

const TITULO = `Regalos de Navidad ${AÑO}: ofertas reales por presupuesto`
const DESCRIPCION = `Ideas de regalo para Navidad ${AÑO} y Reyes en Argentina: ofertas de Mercado Libre por presupuesto y por destinatario (chicos, gamers, papá y mamá, la casa), con el descuento verificado contra el historial de precios.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  keywords: [
    `regalos de navidad ${AÑO}`,
    'qué regalar en navidad',
    'regalos navidad mercado libre',
    'regalos de reyes',
    'ofertas navidad argentina',
    'regalos para chicos navidad',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Días hasta una fecha (hora argentina; el sitio se rebuildea 3×/día). */
function diasHasta(fecha: string, ahora = new Date()): number {
  return Math.ceil((new Date(`${fecha}T00:00:00-03:00`).getTime() - ahora.getTime()) / 86_400_000)
}

export default function RegalosNavidadPage() {
  const scrapedAt = getScrapedAt().toISOString()
  const estudio = getEstudio()
  const infladas = getInfladas()
  const historial = slugPorId()
  const dias = diasHasta(NAVIDAD)
  const diasReyes = diasHasta(REYES)

  const comp = getComparativa('regalos-de-navidad')
  const deCategoria = new Map<string, string>() // id_ml → slug de categoría
  const porCategoria = DESTINATARIOS.flatMap(d => d.categorias).flatMap(s => {
    const c = getCategoria(s)
    const ofertas = c ? ofertasDeCategoria(c) : []
    for (const o of ofertas) if (!deCategoria.has(o.id_ml)) deCategoria.set(o.id_ml, s)
    return ofertas
  })
  const vistos = new Set<string>()
  const regalos: ProductWithMargins[] = [...(comp ? productosDe(comp) : []), ...porCategoria].filter(p =>
    vistos.has(p.id_ml) ? false : (vistos.add(p.id_ml), true),
  )
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
  // Ya vienen ordenados por ganancia esperada (igual que /hoy).
  const rangos = RANGOS.map(r => {
    const todos = regalos.filter(p => p.precio_actual >= r.min && p.precio_actual < r.max)
    return { ...r, total: todos.length, productos: todos.slice(0, POR_RANGO) }
  })
  const destinatarios = DESTINATARIOS.map(d => {
    const todos = regalos.filter(p => d.categorias.includes(deCategoria.get(p.id_ml) ?? ''))
    return { ...d, total: todos.length, productos: todos.slice(0, POR_DESTINATARIO) }
  })
  const mostrados = rangos.flatMap(r => r.productos)
  const comparativas = COMPARATIVAS_REL.map(s => getComparativa(s)).filter(c => c !== undefined)
  const pct = estudio.pctInfladas.toLocaleString('es-AR')

  const faqs = [
    {
      q: `¿Cuándo conviene comprar los regalos de Navidad ${AÑO}?`,
      a: `Navidad es el viernes 25 de diciembre de ${AÑO} (los regalos se abren a la medianoche del 24) y Reyes el miércoles 6 de enero de ${AÑO + 1}. En Mercado Libre conviene tener el pedido hecho al menos una semana antes: la última semana los envíos se cargan. Mirá la fecha de entrega estimada antes de pagar.`,
    },
    {
      q: '¿Conviene comprar en Black Friday o Cyber Monday para Navidad?',
      a: `Puede convenir, pero no siempre. El Cyber Monday ${CYBER_MONDAY.año} es ${CYBER_MONDAY.fechasTexto} y el Black Friday el ${BLACK_FRIDAY.fechasTexto}: comprar ahí te da margen para que llegue. Pero que haya evento no garantiza que el precio sea el más bajo: algunas publicaciones suben el precio antes para mostrar un descuento mayor. Lo prudente es anotar hoy el precio del regalo que te interesa, compararlo con el del evento y con el de diciembre, y revisar la política de cambios, porque comprás con más de un mes de anticipación.`,
    },
    {
      q: '¿Cómo sé si el descuento de un regalo es real?',
      a: `Comparando el precio de hoy contra lo que el producto costó antes, no contra el precio tachado. En nuestro registro, el ${pct}% de las ofertas que revisamos en mercadolibre.com.ar/ofertas tenía el descuento inflado: el producto ya se había vendido al menos 5% más barato. Cada regalo de esta página muestra su mínimo registrado.`,
    },
    {
      q: '¿Los precios de esta página son los de diciembre?',
      a: 'No. Son las ofertas de hoy, actualizadas 3 veces por día. Los precios cambian y una oferta de hoy puede no estar en diciembre: usá la página para ver qué hay en cada presupuesto y comparar, y verificá el precio el día que compres.',
    },
  ]

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Regalos de Navidad ${AÑO}`, item: URL },
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
            name: `Regalos de Navidad ${AÑO} en oferta`,
            itemListElement: mostrados.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: p.url_producto })),
          },
        ]
      : []),
  ]

  const estado =
    dias > 1 ? `Faltan ${dias} días` : dias === 1 ? 'Es mañana' : dias === 0 ? 'Es hoy' : diasReyes >= 0 ? 'Se vienen los Reyes' : 'Ya pasó'

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
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Regalos de Navidad {AÑO}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
            {TITULO}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Juguetes, consolas, perfumes, herramientas, bicicletas y electro de cocina, separados por presupuesto y por
            destinatario. Cada regalo está comparado contra el precio más bajo que registramos, así sabés si el descuento
            es de verdad.
          </p>

          <div className="mt-6 rounded-2xl border border-green-400/30 bg-green-500/[0.07] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-green-300">Navidad · {estado}</p>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-zinc-50 [text-wrap:balance]">
              Viernes 25 de diciembre de {AÑO}
            </p>
            <p className="mt-1 text-sm text-zinc-300">
              Reyes: miércoles 6 de enero de {AÑO + 1}
              {diasReyes > 0 ? ` (faltan ${diasReyes} días)` : ''}.
            </p>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              <strong className="text-zinc-200">Ojo:</strong> estos son los precios de hoy, no los de diciembre. Usalos para
              ver qué hay en cada presupuesto y comparar; el día que compres, verificá el precio otra vez.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {rangos.map(r => (
                <a key={r.id} href={`#${r.id}`} className="text-xs font-bold rounded-full border border-green-400/30 px-3 py-1 text-green-200 hover:border-green-400/60">
                  {r.titulo} ({r.total})
                </a>
              ))}
              {destinatarios.map(d => (
                <a key={d.id} href={`#${d.id}`} className="text-xs font-bold rounded-full border border-zinc-700 px-3 py-1 text-zinc-300 hover:border-green-400/60">
                  {d.titulo} ({d.total})
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {rangos.map(r => (
        <section key={r.id} id={r.id} className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
          <div className="max-w-3xl mb-4">
            <h2 className="font-display text-xl sm:text-2xl font-black">🎄 Regalos {r.titulo.toLowerCase()}</h2>
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
                <OfertaCard key={o.id_ml} producto={light(o)} priority={r.id === 'hasta-50000' && i < 4} />
              ))}
            </div>
          )}
        </section>
      ))}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <h2 className="font-display text-xl sm:text-2xl font-black mb-1">Regalos según para quién es</h2>
        <p className="text-sm text-zinc-400">Agrupados por la categoría del producto: las mejores ofertas de hoy de cada grupo.</p>
        {destinatarios.map(d => (
          <div key={d.id} id={d.id} className="pt-6 scroll-mt-20">
            <h3 className="font-display text-lg font-black mb-3">
              {d.emoji} {d.titulo} <span className="text-sm font-semibold text-zinc-500">({d.total} hoy)</span>
            </h3>
            {d.productos.length === 0 ? (
              <p className="text-sm text-zinc-500">Hoy no hay ofertas en este grupo. Volvé en unas horas.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {d.productos.map(o => (
                  <OfertaCard key={o.id_ml} producto={light(o)} />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8">
        <Link href="/mejores/regalos-de-navidad" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
          Ver la comparativa completa de regalos de Navidad, con el mínimo registrado de cada uno →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">¿Black Friday, Cyber Monday o diciembre?</h2>
          <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
            Antes de Navidad hay dos eventos grandes: el <strong className="text-zinc-200">Cyber Monday</strong> (
            {CYBER_MONDAY.fechasTexto}) y el <strong className="text-zinc-200">Black Friday</strong> ({BLACK_FRIDAY.fechasTexto}).
            Comprar ahí te da margen de envío, pero un evento no garantiza el mejor precio: anotá hoy lo que cuesta el
            regalo que te interesa y comparalo después.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/cyber-monday" className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-5 py-2.5 transition-colors">
              Cyber Monday {CYBER_MONDAY.año} →
            </Link>
            <Link href="/black-friday" className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-5 py-2.5 transition-colors">
              Black Friday {BLACK_FRIDAY.año} →
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cómo no caer en un descuento inflado</h2>
          <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
            En las {estudio.revisadas.toLocaleString('es-AR')} ofertas de mercadolibre.com.ar/ofertas que revisamos desde el{' '}
            {fechaAR(estudio.desde)}, el <strong className="text-zinc-100">{pct}%</strong> tenía el precio tachado inflado:
            el producto ya se había vendido al menos 5% más barato antes. En las fiestas, con más carteles de
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
              <strong className="text-zinc-200">Consolas y tecno, de tienda oficial.</strong> Revisá la garantía antes de
              pagar.
            </li>
            <li>
              <strong className="text-zinc-200">Juguetes y bicis: edad y rodado.</strong> Chequeá la edad recomendada y el
              rodado según quién lo va a usar.
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
            {comparativas.map(c => (
              <li key={c.slug}>
                <a href={`/mejores/${c.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {c.titulo} →</a>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-2 text-sm text-zinc-400">Ofertas por rubro:</p>
          <div className="flex flex-wrap gap-2">
            {LINKS_RUBROS.map(n => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-semibold rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
              >
                {n.nombre}
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
