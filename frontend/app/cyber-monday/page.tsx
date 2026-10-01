// Landing del Cyber Monday: fechas (con fuente), cómo detectar descuentos
// inflados y las ofertas reales de hoy en los rubros del evento. Hub de las
// comparativas (/mejores/cyber-monday-*) y guías cyber (/guias/*cyber-monday*).
//
// Las fechas salen de lib/cybermonday.ts. Si ahí `oficial` es false, la página
// dice "a confirmar" y NO publica el JSON-LD de Event. Nada de datos inventados:
// productos, % de infladas y conteos salen del catálogo y del registro del bot.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import ExtensionCTA from '@/components/ExtensionCTA'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getOfertas, getScrapedAt } from '@/lib/productos'
import { COMPARATIVAS, getComparativa, productosDe } from '@/lib/comparativas'
import { GUIAS } from '@/lib/guias'

/** Guías de compra de ticket alto (lo que más vende por afiliados). */
const GUIAS_TICKET_ALTO = [
  'que-notebook-comprar',
  'que-celular-comprar-segun-presupuesto',
  'que-celular-gama-alta-comprar',
  'que-smart-tv-comprar',
  'que-freidora-de-aire-comprar',
  'que-colchon-comprar-firmeza-y-material',
]
import { getEstudio } from '@/lib/estudio'
import { getInfladas } from '@/lib/infladas'
import { slugPorId } from '@/lib/seguimiento'
import { BLACK_FRIDAY, CYBER_MONDAY as CM, etapaCyber } from '@/lib/cybermonday'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/cyber-monday`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'
const MAX_OFERTAS = 16

const FECHAS = CM.oficial ? `${CM.fechasTexto} de ${CM.año}` : `${CM.fechasTexto} de ${CM.año} (a confirmar)`
const TITULO = `Cyber Monday ${CM.año} en Argentina: fechas y ofertas reales`
const DESCRIPCION = CM.oficial
  ? `El Cyber Monday ${CM.año} es ${CM.fechasTexto} (fechas oficiales de la CACE). Cómo detectar descuentos inflados y ofertas de Mercado Libre verificadas contra el historial de precios.`
  : `Cuándo es el Cyber Monday ${CM.año} en Argentina (estimado: ${CM.fechasTexto}, a confirmar por la CACE), cómo detectar descuentos inflados y ofertas verificadas contra el historial de precios.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  keywords: [
    `cyber monday ${CM.año}`,
    `cyber monday ${CM.año} argentina`,
    'cuándo es el cyber monday',
    'cyber monday mercado libre',
    'ofertas cyber monday',
    'descuentos inflados cyber monday',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

/** "2026-09-27" → "27/09/2026" */
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')

export default function CyberMondayPage() {
  const scrapedAt = getScrapedAt().toISOString()
  const estudio = getEstudio()
  const infladas = getInfladas()
  const historial = slugPorId()
  const { etapa, dias } = etapaCyber()

  // Ofertas de hoy en los rubros del evento (misma selección que la
  // comparativa /mejores/ofertas-cyber-monday); si hoy no hay suficientes, las
  // de /hoy. Ya vienen ordenadas por ganancia esperada, igual que /hoy.
  const cyber = getComparativa('ofertas-cyber-monday')
  const deRubros = cyber ? productosDe(cyber) : []
  const ofertas = (deRubros.length >= 4 ? deRubros : getOfertas()).slice(0, MAX_OFERTAS)
  const ofertasLight: OfertaLight[] = ofertas.map(o => ({
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

  const comparativas = COMPARATIVAS.filter(c => c.slug === 'ofertas-cyber-monday' || c.slug.startsWith('cyber-monday-'))
  const blackFriday = getComparativa('ofertas-black-friday')
  const guias = GUIAS.filter(g => g.slug.includes('cyber-monday') || GUIAS_TICKET_ALTO.includes(g.slug))

  const pct = estudio.pctInfladas.toLocaleString('es-AR')
  const faqs = [
    {
      q: `¿Cuándo es el Cyber Monday ${CM.año} en Argentina?`,
      a: CM.oficial
        ? `El Cyber Monday ${CM.año} es ${CM.fechasTexto} de ${CM.año}: tres días de ofertas online. Son las fechas oficiales que anunció la Cámara Argentina de Comercio Electrónico (CACE), organizadora del evento, en su sitio cybermonday.com.ar.`
        : `La CACE todavía no anunció las fechas oficiales del Cyber Monday ${CM.año}. Nuestra estimación es ${CM.fechasTexto}, a confirmar en cybermonday.com.ar.`,
    },
    {
      q: '¿Quién organiza el Cyber Monday en Argentina?',
      a: 'La Cámara Argentina de Comercio Electrónico (CACE). El sitio oficial del evento es cybermonday.com.ar, donde se listan las marcas y tiendas que participan. Cazador de Ofertas AR no forma parte de la organización: revisamos las ofertas de Mercado Libre Argentina por nuestra cuenta, antes, durante y después del evento.',
    },
    {
      q: '¿Cómo sé si un descuento del Cyber Monday es real?',
      a: `Comparando el precio de ese día contra lo que el producto costó antes, no contra el precio tachado. En nuestro registro, el ${pct}% de las ofertas que revisamos en mercadolibre.com.ar/ofertas tenía el descuento inflado: el producto ya se había vendido al menos 5% más barato. Anotá los precios antes del evento, mirá el historial y, si tenés el link de una publicación, pegalo en nuestro verificador.`,
    },
    {
      q: `¿Cuándo es el Black Friday ${CM.año} en Argentina?`,
      a: `El ${BLACK_FRIDAY.fechasTexto} de ${CM.año}. A diferencia del Cyber Monday, en Argentina el Black Friday no tiene un organizador único: cada tienda arma sus promociones por su cuenta.`,
    },
    {
      q: '¿Conviene esperar al Cyber Monday para comprar?',
      a: 'Depende del producto. Si lo que buscás ya está en su precio más bajo registrado, esperar no suma. Si no, conviene anotar el precio de hoy y compararlo cuando arranque el evento: así sabés si la baja es real o si solo cambió el cartel. Sumá al cálculo envío, cuotas y reintegros con tope.',
    },
  ]

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Cyber Monday ${CM.año}`, item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    // Event solo con fechas oficiales (sin hora: la fuente da días, no horarios).
    ...(CM.oficial
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: `CyberMonday ${CM.año} Argentina`,
            description: `Evento de ofertas online organizado por la Cámara Argentina de Comercio Electrónico (CACE), ${CM.fechasTexto} de ${CM.año}.`,
            startDate: CM.inicio,
            endDate: CM.fin,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            location: { '@type': 'VirtualLocation', url: CM.fuente.url },
            organizer: { '@type': 'Organization', name: 'Cámara Argentina de Comercio Electrónico (CACE)', url: 'https://www.cace.org.ar/' },
            inLanguage: 'es-AR',
            url: CM.fuente.url,
          },
        ]
      : []),
    ...(ofertas.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Ofertas de hoy en los rubros del Cyber Monday ${CM.año}`,
            itemListElement: ofertas.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: p.url_producto })),
          },
        ]
      : []),
  ]

  const estado =
    etapa === 'antes'
      ? `Faltan ${dias} ${dias === 1 ? 'día' : 'días'}`
      : etapa === 'durante'
        ? 'Está en curso'
        : 'Ya terminó'

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
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(34,211,238,0.08) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Cyber Monday {CM.año}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
            {TITULO}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Cuándo es, quién lo organiza y cómo no caer en un descuento inflado. Abajo, las ofertas de hoy en los rubros
            del evento, cada una comparada contra el precio más bajo que registramos.
          </p>

          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.07] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              {CM.oficial ? 'Fechas oficiales' : 'Fechas estimadas: a confirmar'} · {estado}
            </p>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-zinc-50 [text-wrap:balance]">
              {CM.fechasTexto.charAt(0).toUpperCase() + CM.fechasTexto.slice(1)} de {CM.año}
            </p>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {CM.oficial ? (
                <>
                  Fuente:{' '}
                  <a href={CM.fuente.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:underline">
                    {CM.fuente.nombre}
                  </a>{' '}
                  (verificado el {fechaAR(CM.verificado)}). El{' '}
                  <Link href="/black-friday" className="font-semibold text-cyan-300 hover:underline">Black Friday</Link> es el{' '}
                  {BLACK_FRIDAY.fechasTexto}.
                </>
              ) : (
                <>
                  La CACE todavía no anunció las fechas. Confirmalas en{' '}
                  <a href={CM.fuente.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:underline">
                    {CM.fuente.nombre}
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Qué es el Cyber Monday</h2>
          <div className="space-y-3 text-zinc-400 leading-relaxed">
            <p>
              Es un evento de ofertas online que organiza la Cámara Argentina de Comercio Electrónico (CACE). Durante tres
              días, las marcas y tiendas que se suman publican descuentos y promociones de pago; la lista de participantes
              está en el sitio oficial, cybermonday.com.ar.
            </p>
            <p>
              El nombre viene del lunes posterior al Black Friday de Estados Unidos, pero en Argentina la fecha es otra:{' '}
              {FECHAS}. El Black Friday, en cambio, no tiene organizador acá: cae el{' '}
              {BLACK_FRIDAY.fechasTexto} y cada tienda arma sus promos por su cuenta (<Link href="/black-friday" className="text-yellow-400 hover:underline">todo sobre el Black Friday</Link>).
            </p>
            <p>
              Nosotros no somos parte del evento: revisamos las ofertas de Mercado Libre Argentina 3 veces por día, todo el
              año, y comparamos cada precio contra el historial que registramos.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cómo detectar un descuento inflado</h2>
          <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
            En las {estudio.revisadas.toLocaleString('es-AR')} ofertas de mercadolibre.com.ar/ofertas que revisamos desde el{' '}
            {fechaAR(estudio.desde)}, el <strong className="text-zinc-100">{pct}%</strong> tenía el precio tachado inflado:
            el producto ya se había vendido al menos 5% más barato antes. En una fecha especial, con más carteles de
            &quot;% OFF&quot; que nunca, conviene mirarlo con más cuidado todavía.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-400 leading-relaxed mb-5">
            <li>
              <strong className="text-zinc-200">Anotá los precios antes del evento.</strong> Armá tu lista unos días antes
              y guardá cuánto sale cada cosa: cuando arranque, sabés en dos segundos si bajó.
            </li>
            <li>
              <strong className="text-zinc-200">Ignorá el precio tachado.</strong> El &quot;antes&quot; lo pone quien vende;
              lo que cuenta es el precio de hoy contra lo que el producto costó de verdad las semanas previas.
            </li>
            <li>
              <strong className="text-zinc-200">Mirá el historial.</strong> Si ya estuvo igual o más barato en un día
              común, el descuento del evento no te ahorra nada.
            </li>
            <li>
              <strong className="text-zinc-200">Hacé la cuenta del precio final.</strong> Envío, cuotas sin interés de
              verdad y reintegros del banco, que suelen tener tope y fecha de acreditación.
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
      </article>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="max-w-3xl mx-auto sm:mx-0 mb-4">
          <h2 className="font-display text-xl sm:text-2xl font-black">Ofertas reales de hoy en los rubros del Cyber Monday</h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {etapa === 'antes'
              ? 'Todavía no son precios del evento: son las ofertas de hoy con descuento verificado. Sirven de referencia para comparar cuando arranque.'
              : etapa === 'durante'
                ? 'Las ofertas de hoy con descuento verificado contra el historial de precios.'
                : 'El evento ya terminó: estas son las ofertas de hoy con descuento verificado contra el historial de precios.'}{' '}
            <span className="text-zinc-500">
              <LastUpdated scrapedAt={scrapedAt} />.
            </span>
          </p>
        </div>
        {ofertas.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Estamos cazando las ofertas de hoy. Volvé en un rato o{' '}
            <a href={DEALS_URL} className="text-yellow-400 hover:underline">mirá todas las ofertas</a>.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ofertasLight.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
        <a href={DEALS_URL} className="mt-5 inline-block text-sm font-bold text-yellow-400 hover:text-yellow-300">
          Ver todas las ofertas de hoy, con buscador y filtros →
        </a>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        {comparativas.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Comparativas por rubro</h2>
            <p className="text-sm text-zinc-400 mb-3">Precio de hoy, descuento y mínimo registrado de cada producto.</p>
            <ul className="space-y-1.5">
              {comparativas.map(c => (
                <li key={c.slug}>
                  <a href={`/mejores/${c.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {c.titulo} →</a>
                </li>
              ))}
              {blackFriday && (
                <li>
                  <a href={`/mejores/${blackFriday.slug}`} className="font-bold text-yellow-400/80 hover:underline">🖤 {blackFriday.titulo} →</a>
                </li>
              )}
            </ul>
          </section>
        )}

        {guias.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Guías para elegir antes del evento</h2>
            <ul className="space-y-2">
              {guias.map(g => (
                <li key={g.slug}>
                  <a
                    href={`/guias/${g.slug}`}
                    className="block rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300 transition-colors"
                  >
                    {g.titulo} <span className="text-yellow-400">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center mb-10">
          <h2 className="font-display text-xl font-black mb-2">¿Querés las bajas reales apenas salen?</h2>
          <p className="text-sm text-zinc-400 mb-5">
            Durante el Cyber Monday publicamos las ofertas verificadas 3 veces por día, con alerta de mínimos históricos.
          </p>
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
