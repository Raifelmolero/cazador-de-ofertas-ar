// Landing del Black Friday: fecha (con fuente), aclaración de que en Argentina
// no tiene organizador oficial, cómo detectar descuentos inflados y las ofertas
// reales de hoy. Hub de la comparativa /mejores/ofertas-black-friday.
//
// La fecha sale de lib/cybermonday.ts (BLACK_FRIDAY). No hay fecha "oficial" de
// Mercado Libre ni organizador: por eso NO se publica JSON-LD de Event. Nada de
// datos inventados: productos y % de infladas salen del catálogo y del bot.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import ExtensionCTA from '@/components/ExtensionCTA'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getOfertas, getScrapedAt } from '@/lib/productos'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { GUIAS } from '@/lib/guias'
import { getEstudio } from '@/lib/estudio'
import { getInfladas } from '@/lib/infladas'
import { slugPorId } from '@/lib/seguimiento'
import { BLACK_FRIDAY as BF, CYBER_MONDAY as CM, etapaBlackFriday } from '@/lib/cybermonday'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/black-friday`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'
const MAX_OFERTAS = 16

const TITULO = `Black Friday ${BF.año} en Argentina: fecha y ofertas reales`
const DESCRIPCION = `El Black Friday ${BF.año} es el ${BF.fechasTexto}. En Argentina no tiene organizador oficial: cada tienda arma sus promos. Cómo detectar descuentos inflados y ofertas de Mercado Libre verificadas contra el historial.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  keywords: [
    `black friday ${BF.año}`,
    `black friday ${BF.año} argentina`,
    'cuándo es el black friday',
    'black friday mercado libre',
    'ofertas black friday',
    'descuentos inflados black friday',
  ],
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

/** "2026-09-27" → "27/09/2026" */
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')

export default function BlackFridayPage() {
  const scrapedAt = getScrapedAt().toISOString()
  const estudio = getEstudio()
  const infladas = getInfladas()
  const historial = slugPorId()
  const { etapa, dias } = etapaBlackFriday()

  // Misma selección que /mejores/ofertas-black-friday; si hoy no alcanza, /hoy.
  const bf = getComparativa('ofertas-black-friday')
  const deRubros = bf ? productosDe(bf) : []
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

  const guias = GUIAS.filter(g => g.slug.includes('black-friday'))
  const pct = estudio.pctInfladas.toLocaleString('es-AR')

  const faqs = [
    {
      q: `¿Cuándo es el Black Friday ${BF.año} en Argentina?`,
      a: `El ${BF.fechasTexto} de ${BF.año}. El Black Friday es el viernes siguiente al Día de Acción de Gracias de Estados Unidos, que en ${BF.año} cae el jueves 26 de noviembre. En Argentina no hay una fecha oficial: algunas tiendas estiran sus promociones a varios días, así que conviene revisar las condiciones de cada una.`,
    },
    {
      q: '¿Quién organiza el Black Friday en Argentina?',
      a: 'Nadie en particular. A diferencia del Cyber Monday, que organiza la Cámara Argentina de Comercio Electrónico (CACE), el Black Friday en Argentina no tiene un organizador ni un sitio oficial: cada tienda decide si participa, qué días y con qué descuentos. Cazador de Ofertas AR no forma parte de ninguna organización: revisamos las ofertas de Mercado Libre Argentina por nuestra cuenta, todo el año.',
    },
    {
      q: '¿Cómo sé si un descuento del Black Friday es real?',
      a: `Comparando el precio de ese día contra lo que el producto costó antes, no contra el precio tachado. En nuestro registro, el ${pct}% de las ofertas que revisamos en mercadolibre.com.ar/ofertas tenía el descuento inflado: el producto ya se había vendido al menos 5% más barato. Anotá los precios antes, mirá el historial y, si tenés el link de una publicación, pegalo en nuestro verificador.`,
    },
    {
      q: '¿Qué conviene más: el Cyber Monday o el Black Friday?',
      a: `Depende del producto, no del evento. El Cyber Monday ${CM.año} es ${CM.fechasTexto} y reúne a las tiendas que se suman a la convocatoria de la CACE; el Black Friday llega unas semanas después y depende de cada tienda. Si lo que buscás ya está en su precio más bajo registrado, esperar no suma; si no, compará el precio de hoy con el de cada evento.`,
    },
  ]

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Black Friday ${BF.año}`, item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    // Sin Event: el Black Friday no tiene fecha oficial de Mercado Libre ni organizador en Argentina.
    ...(ofertas.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Ofertas de hoy con descuento verificado (referencia para el Black Friday ${BF.año})`,
            itemListElement: ofertas.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: p.url_producto })),
          },
        ]
      : []),
  ]

  const estado =
    etapa === 'antes' ? `Faltan ${dias} ${dias === 1 ? 'día' : 'días'}` : etapa === 'durante' ? 'Es hoy' : 'Ya pasó'

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
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Black Friday {BF.año}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
            {TITULO}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Cuándo es, por qué en Argentina no tiene organizador y cómo no caer en un descuento inflado. Abajo, las ofertas
            de hoy, cada una comparada contra el precio más bajo que registramos.
          </p>

          <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-900/80 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Fecha de referencia · {estado}</p>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-black text-zinc-50 [text-wrap:balance]">
              {BF.fechasTexto.charAt(0).toUpperCase() + BF.fechasTexto.slice(1)} de {BF.año}
            </p>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Es el viernes siguiente al Día de Acción de Gracias de EE.UU. Fuente:{' '}
              <a href={BF.fuente.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-300 hover:underline">
                {BF.fuente.nombre}
              </a>{' '}
              (verificado el {fechaAR(BF.verificado)}). En Argentina no hay fecha oficial: cada tienda define sus días.
            </p>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Qué es el Black Friday en Argentina</h2>
          <div className="space-y-3 text-zinc-400 leading-relaxed">
            <p>
              Nació en Estados Unidos como el día de descuentos que sigue a Acción de Gracias. En Argentina se replica, pero
              sin organizador: no lo convoca la CACE ni ninguna cámara, no tiene sitio oficial ni lista de participantes.
              Cada tienda decide si se suma, qué días y con qué promociones.
            </p>
            <p>
              Por eso no publicamos una lista de &quot;tiendas que participan&quot;: no hay una fuente oficial que la
              confirme. Lo que sí podemos mostrarte es el precio real de cada producto en Mercado Libre y si el descuento
              es verdadero.
            </p>
            <p>
              El evento con fechas oficiales en Argentina es el{' '}
              <Link href="/cyber-monday" className="text-yellow-400 hover:underline">
                Cyber Monday {CM.año}
              </Link>{' '}
              ({CM.fechasTexto}), organizado por la CACE, unas semanas antes.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cómo detectar un descuento inflado</h2>
          <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
            En las {estudio.revisadas.toLocaleString('es-AR')} ofertas de mercadolibre.com.ar/ofertas que revisamos desde el{' '}
            {fechaAR(estudio.desde)}, el <strong className="text-zinc-100">{pct}%</strong> tenía el precio tachado inflado:
            el producto ya se había vendido al menos 5% más barato antes. En el Black Friday, con carteles de &quot;% OFF&quot;
            por todos lados, conviene mirarlo con lupa.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-400 leading-relaxed mb-5">
            <li>
              <strong className="text-zinc-200">Anotá los precios antes.</strong> Guardá cuánto sale cada cosa unos días
              antes: el viernes sabés en dos segundos si bajó.
            </li>
            <li>
              <strong className="text-zinc-200">Ignorá el precio tachado.</strong> El &quot;antes&quot; lo pone quien vende;
              lo que cuenta es lo que el producto costó de verdad las semanas previas.
            </li>
            <li>
              <strong className="text-zinc-200">Mirá el historial.</strong> Si ya estuvo igual o más barato en un día
              común (o en el Cyber Monday), el Black Friday no te ahorra nada.
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
          <h2 className="font-display text-xl sm:text-2xl font-black">Ofertas reales de hoy</h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            {etapa === 'durante'
              ? 'Las ofertas de hoy con descuento verificado contra el historial de precios.'
              : 'No son precios del Black Friday: son las ofertas de hoy con descuento verificado contra el historial. Sirven de referencia para comparar.'}{' '}
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
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Más para comparar</h2>
          <ul className="space-y-2">
            {bf && (
              <li>
                <a href={`/mejores/${bf.slug}`} className="font-bold text-yellow-400 hover:underline">🖤 {bf.titulo} →</a>
              </li>
            )}
            {guias.map(g => (
              <li key={g.slug}>
                <a href={`/guias/${g.slug}`} className="font-bold text-yellow-400 hover:underline">📘 {g.titulo} →</a>
              </li>
            ))}
            <li>
              <Link href="/cyber-monday" className="font-bold text-yellow-400 hover:underline">
                💻 Cyber Monday {CM.año}: fechas oficiales y ofertas →
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center mb-10">
          <h2 className="font-display text-xl font-black mb-2">¿Querés las bajas reales apenas salen?</h2>
          <p className="text-sm text-zinc-400 mb-5">
            Publicamos las ofertas verificadas 3 veces por día, con alerta de mínimos históricos.
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
