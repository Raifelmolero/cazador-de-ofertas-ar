// Lander del Black Friday 2026 (previa → Día D → después), según el brief
// EQUIPO-GROK/BRIEF-WEB-PREVIA-BF.md. Orden fijo: hero con cuenta regresiva,
// cómo detectar un descuento inflado, categorías foco, top de 10 (solo
// marcadores de data/black-friday-previa.json), CTA de mitad, FAQ, aviso de
// afiliado y cierre. Sticky de WhatsApp en el celular.
//
// Reglas: nada de precios sin reconfirmar el mismo día, nada de preventa ni
// extensión inventadas, y sin JSON-LD de Event (no hay organizador oficial).
import Link from 'next/link'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { EXTENSION_PUBLICADA, EXTENSION_URL } from '@/components/ExtensionCTA'
import { getEstudio } from '@/lib/estudio'
import { BLACK_FRIDAY as BF } from '@/lib/cybermonday'
import { faseBF, getDatosBF, slotPublicable, type FaseBF } from '@/lib/black-friday-previa'
import CuentaRegresivaBF from '@/components/black-friday/CuentaRegresivaBF'
import EventosBF from '@/components/black-friday/EventosBF'
import StickyWhatsAppBF from '@/components/black-friday/StickyWhatsAppBF'
import TarjetaBF from '@/components/black-friday/TarjetaBF'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getOfertas } from '@/lib/productos'
import { ticketAltoPrimero } from '@/lib/ofertashoy'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { slugPorId } from '@/lib/seguimiento'

const MAX_RESPALDO = 12

/** Respaldo cuando black-friday-previa.json no tiene slots: la grilla automática
 *  de ofertas de hoy del bot (rubros Black Friday si hay, si no el catálogo). */
function ofertasRespaldo(): OfertaLight[] {
  const bf = getComparativa('ofertas-black-friday')
  const deBF = bf ? productosDe(bf) : []
  const historial = slugPorId()
  return ticketAltoPrimero(deBF.length >= 4 ? deBF : getOfertas())
    .slice(0, MAX_RESPALDO)
    .map(o => ({
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
}

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/black-friday`
const VERIFICADOR_URL = `${DEALS_URL}/#verificador`
const AFILIADOS_ML_URL = 'https://www.mercadolibre.com.ar/l/afiliados'

/** Title y description según la fase (el sitio se rebuildea 3×/día). El de
 *  Día D solo después del OK de las 19:00 (`ok_dia_d` en el JSON). */
function textosSeo(fase: FaseBF, okDiaD: boolean) {
  if (fase !== 'previa' && okDiaD) {
    return {
      titulo: 'Black Friday 2026 (27/11): ofertas de Mercado Libre verificadas hoy',
      descripcion:
        'Black Friday 2026: viernes 27 de noviembre. Ofertas de Mercado Libre de hoy, verificadas contra el historial de precios. El precio se reconfirma el mismo día. Pagás lo mismo que entrando directo a ML.',
    }
  }
  return {
    titulo: 'Black Friday 2026 Argentina: viernes 27/11, ofertas verificadas',
    descripcion:
      'Black Friday 2026 en Argentina: viernes 27 de noviembre. Armá tu lista, sumate al canal y mirá ofertas de Mercado Libre verificadas contra el historial. El precio se reconfirma el mismo día.',
  }
}

export function generateMetadata(): Metadata {
  const { titulo, descripcion } = textosSeo(faseBF(), getDatosBF().ok_dia_d)
  return {
    // Textos finales del brief, sin recortar (el de Día D tiene 67 caracteres).
    title: { absolute: titulo },
    description: descripcion,
    keywords: [
      `black friday ${BF.año}`,
      `black friday ${BF.año} argentina`,
      'cuándo es el black friday',
      'black friday mercado libre',
      'ofertas black friday',
      'descuentos inflados black friday',
    ],
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: URL },
    openGraph: { title: titulo, description: descripcion, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

/** "2026-07-19" → "19 de julio de 2026" */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const fechaLarga = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

const CATEGORIAS_A = [
  { nombre: 'Notebooks', detalle: 'prioridad: 16 GB de RAM o más', href: '/mejores/black-friday-notebooks', id: 'notebooks' },
  { nombre: 'Celulares', detalle: 'gama media y alta vigente', href: '/mejores/black-friday-celulares', id: 'celulares' },
  { nombre: 'Smart TV', detalle: '50 o 55 pulgadas, como referencia', href: '/mejores/black-friday-smart-tv', id: 'smart_tv' },
  { nombre: 'Aires acondicionados', detalle: 'split inverter; las frigorías, según el ambiente', href: '/guias/que-aire-acondicionado-comprar', id: 'aires' },
]
const CATEGORIAS_B = [
  { nombre: 'Belleza y cuidado personal', detalle: 'kits de skincare, protector solar' },
  { nombre: 'Hogar, muebles y jardín', detalle: 'colchón 2 plazas, por ejemplo' },
  { nombre: 'Ropa y accesorios', detalle: 'zapatillas, mallas, verano' },
  { nombre: 'Juegos y juguetes', detalle: 'para adelantar regalos de Navidad' },
]

const btnWA = 'inline-flex items-center justify-center rounded-xl bg-green-500 hover:bg-green-400 px-6 py-3 text-sm font-bold text-black transition-colors'
const btnSec = 'inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-yellow-400 px-6 py-3 text-sm font-bold text-zinc-100 transition-colors'
const h2 = 'font-display text-2xl sm:text-3xl font-black mb-3 [text-wrap:balance]'
const linkTxt = 'font-semibold text-yellow-400 hover:underline'

export default function BlackFridayPage() {
  const datos = getDatosBF()
  const wa = datos.link_canal_whatsapp.trim()
  const tg = datos.link_canal_telegram.trim()
  const estudio = getEstudio()
  const pct = estudio.pctInfladas.toLocaleString('es-AR')

  // Slots vacíos (sin nombre) no se renderizan; los cargados pero no reconfirmados
  // hoy se muestran sin precio. El navegador lo vuelve a chequear (TarjetaBF).
  const slots = datos.slots.filter(s => s.nombre)
  const publicables = slots.filter(s => slotPublicable(s))
  // JSON vacío → la página no queda sin productos: grilla automática del bot.
  const respaldo = slots.length === 0 ? ofertasRespaldo() : []

  const faqs = [
    {
      q: '¿Cuándo es el Black Friday 2026 en Argentina?',
      a: 'El viernes 27 de noviembre de 2026. Es el viernes siguiente al Día de Acción de Gracias de Estados Unidos (jueves 26 de noviembre). En Argentina no hay un organizador ni una fecha oficial de preventa: cada tienda decide si se suma y por cuántos días. La fecha de referencia que usamos acá es el viernes 27.',
    },
    {
      q: '¿Quién organiza el Black Friday en Argentina?',
      a: 'Nadie en particular. A diferencia del Cyber Monday, que organiza la Cámara Argentina de Comercio Electrónico (CACE), el Black Friday no tiene sitio oficial ni lista de participantes. Cazador de Ofertas AR no forma parte de ninguna organización: revisamos las ofertas de Mercado Libre Argentina por nuestra cuenta, todo el año.',
    },
    {
      q: '¿El Cyber Monday es el lunes 30 de noviembre?',
      a: 'No. El Cyber Monday que organiza la CACE en 2026 fue del lunes 2 al miércoles 4 de noviembre, y ya pasó. El lunes 30 es el Cyber Monday del calendario internacional. Si ese día Mercado Libre o alguna tienda publica una vigencia, la vamos a contrastar; no la damos por hecha de antemano.',
    },
    {
      q: '¿Va a haber preventa o se va a extender el fin de semana?',
      a: 'Puede haber promociones antes o después del 27, porque cada tienda arma la suya, y Mercado Libre dijo que puede haber ofertas antes y después. No tenemos una fecha oficial de preventa ni de extensión, así que no vamos a anunciar una. Si aparece algo, lo publicamos ese mismo día, con el precio reconfirmado.',
    },
    {
      q: '¿Cómo sé si un descuento del Black Friday es real?',
      a: `Comparando el precio de ese día contra lo que el producto costó antes, no contra el precio tachado. En nuestro registro, el ${pct} % de las ofertas que revisamos tenía el descuento inflado: el producto ya se había vendido al menos 5 % más barato. Anotá los precios antes, mirá el historial y, si tenés el link, pegalo en el verificador.`,
    },
    {
      q: '¿Conviene esperar al 27 o comprar ahora?',
      a: 'Si lo que querés ya está hoy en su precio más bajo registrado, esperar no te suma nada y corrés el riesgo de que se agote. Si no está en su mínimo y no lo necesitás ya, esperar puede convenir. Mirá el historial del producto antes de decidir.',
    },
    {
      q: '¿Las cuotas sin interés convienen?',
      a: 'Convienen si el precio en cuotas es el mismo que en un pago. Multiplicá la cuota por la cantidad de cuotas: si el total da más que el precio publicado, hay interés escondido.',
    },
    {
      q: '¿Cazador de Ofertas AR cobra algo o hay que registrarse?',
      a: 'No: el sitio es gratis y no requiere registro. Se sostiene con links de afiliado de Mercado Libre. El precio para quien compra es el mismo que comprando directo en Mercado Libre.',
    },
    {
      q: '¿A qué hora publican?',
      a: 'Raifel publica a las 19:00, hora Argentina. El canal de WhatsApp es el lugar más rápido para ver la tanda del día. Esta página se actualiza cuando hay un hallazgo reconfirmado; siempre mirá la hora de reconfirmación.',
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
    // Sin Event: el Black Friday no tiene organizador ni fecha oficial en Argentina.
    ...(publicables.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Hallazgos reconfirmados hoy para el Black Friday ${BF.año}`,
            itemListElement: publicables.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.nombre })),
          },
        ]
      : []),
  ]

  return (
    <main className="min-h-screen pb-20 sm:pb-0">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <EventosBF />

      <header className="sticky top-0 z-20 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a href="#top" className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
            Ver el top
          </a>
        </div>
      </header>

      {/* 4.1 Hero */}
      <section
        className="border-b border-zinc-900 px-4 py-8 sm:py-12"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Black Friday {BF.año}</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-300">Black Friday 2026 en Argentina</p>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight [text-wrap:balance]">
            Viernes 27 de noviembre: el descuento, verificado
          </h1>
          <CuentaRegresivaBF horaActualizacion={datos.hora_actualizacion_pagina} estadoEvento={datos.estado_evento} />
          <p className="mt-6 text-zinc-300 leading-relaxed [text-wrap:pretty]">
            El Black Friday en Argentina es el viernes 27 de noviembre de 2026. No tiene organizador ni fecha oficial de
            preventa: cada tienda decide si se suma y por cuántos días. Acá anotamos precios de antes, comparamos contra el
            historial y te mostramos solo lo que cierra de verdad. El precio que ves se reconfirma el mismo día.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" data-bf-evento="cta_whatsapp" data-bf-placement="hero" className={btnWA}>
                Sumate al canal de WhatsApp
              </a>
            )}
            <a href="#como-detectar" className={btnSec}>
              Ver cómo detectamos un descuento trucho
            </a>
            {tg && (
              <a href={tg} target="_blank" rel="noopener noreferrer" data-bf-evento="cta_telegram" data-bf-placement="hero" className={btnSec}>
                Avisame por Telegram
              </a>
            )}
          </div>
          <p className="mt-3 text-sm text-zinc-400 [text-wrap:pretty]">
            Gratis. Te avisamos a las 19:00, hora Argentina, cuando hay una oferta verificada. El precio para vos es el
            mismo que entrando directo a Mercado Libre.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">
        {/* 4.2 Cómo detectar */}
        <section id="como-detectar" className="scroll-mt-20 py-10 border-b border-zinc-900">
          <h2 className={h2}>Cómo detectar un descuento inflado</h2>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            En las ofertas de Mercado Libre Argentina que venimos revisando desde el {fechaLarga(estudio.desde)}, el{' '}
            <strong className="text-zinc-100">{pct} %</strong> tenía el precio tachado inflado: ese mismo producto ya se
            había vendido al menos 5 % más barato. En el Black Friday, con carteles de &quot;% OFF&quot; por todos lados,
            conviene mirarlo con lupa. El criterio completo está en nuestra{' '}
            <Link href="/metodologia" data-bf-evento="click_metodologia" className={linkTxt}>
              metodología
            </Link>
            .
          </p>
          <ol className="mt-5 list-decimal pl-5 space-y-3 text-zinc-400 leading-relaxed">
            <li>
              <strong className="text-zinc-100">Anotá los precios antes.</strong> Guardá cuánto sale cada cosa unos días
              antes: el viernes sabés en dos segundos si bajó de verdad.
            </li>
            <li>
              <strong className="text-zinc-100">Ignorá el precio tachado.</strong> El &quot;antes&quot; lo pone quien
              vende. Lo que cuenta es lo que el producto costó las semanas previas.
            </li>
            <li>
              <strong className="text-zinc-100">Mirá el historial y el mínimo histórico.</strong> Si ya estuvo igual o más
              barato en un día común, o en el Cyber Monday, el Black Friday no te ahorra nada. El sello de mínimo
              histórico lo usamos cuando el precio de hoy es el más bajo que registramos y lo venimos siguiendo desde hace
              al menos 3 días.
            </li>
            <li>
              <strong className="text-zinc-100">Hacé la cuenta del precio final.</strong> Envío, cuotas que sean sin
              interés de verdad (cuota × cantidad = precio publicado) y reintegros del banco, que suelen tener tope.
            </li>
          </ol>
          <p className="mt-5 text-zinc-400 leading-relaxed [text-wrap:pretty]">
            ¿Tenés el link de una publicación? Pegalo en el{' '}
            <a href={VERIFICADOR_URL} data-bf-evento="click_verificar" className={linkTxt}>
              verificador
            </a>{' '}
            y te decimos si el descuento es real.
            {EXTENSION_PUBLICADA && (
              <>
                {' '}Si preferís verlo en la ficha de Mercado Libre, instalá la{' '}
                <a href={EXTENSION_URL} target="_blank" rel="noopener noreferrer" data-bf-evento="click_extension" className={linkTxt}>
                  extensión gratis para Chrome, Brave y Edge
                </a>
                .
              </>
            )}
          </p>
        </section>

        {/* 4.3 Categorías foco */}
        <section id="categorias" className="scroll-mt-20 py-10 border-b border-zinc-900">
          <h2 className={h2}>Qué vamos a cazar</h2>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            No perseguimos cualquier góndola. Estas son las categorías que vamos a mirar de acá al 27, mezclando ticket
            alto con rubros que suelen tener buena rotación. Lo que entra a la lista pasa por el historial; lo que no
            cierra, no se publica.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="font-display text-lg font-black text-zinc-100">Ticket alto: tecnología y electro</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {CATEGORIAS_A.map(c => (
                  <li key={c.id}>
                    <a href={c.href} data-bf-evento="click_categoria" data-bf-categoria={c.id} className={linkTxt}>
                      {c.nombre} →
                    </a>{' '}
                    <span className="text-zinc-500">({c.detalle})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="font-display text-lg font-black text-zinc-100">Rubros de buena rotación</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {CATEGORIAS_B.map(c => (
                  <li key={c.nombre}>
                    <span className="font-semibold text-zinc-200">{c.nombre}</span>{' '}
                    <span className="text-zinc-500">({c.detalle})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-5 text-sm text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Estas categorías son la guía de búsqueda, no una promesa de descuento. Si el 27 no hay una baja real, no la
            vamos a vestir de oferta.
          </p>
        </section>
      </div>

      {/* 4.4 Top de productos */}
      <section id="top" data-seccion="top_black_friday" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 py-10 border-b border-zinc-900">
        <div className="max-w-3xl">
          <h2 className={h2}>El top de ahora (precios reconfirmados el mismo día)</h2>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Esta no es una lista eterna ni un catálogo de preventa. Son hallazgos de ahora, verificados contra el
            historial. Si un precio, el stock o las cuotas cambian, la ficha se baja o se actualiza. Abajo de cada uno ves
            cuándo se reconfirmó.
          </p>
          <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
            {datos.grilla_fecha && datos.grilla_hora
              ? `Actualizado el ${datos.grilla_fecha} a las ${datos.grilla_hora} (hora Argentina). `
              : ''}
            Precios reconfirmados el mismo día. Los links son de afiliado: pagás lo mismo que entrando directo a Mercado
            Libre.
          </p>
        </div>
        {slots.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((s, i) => (
              <TarjetaBF key={s.slot} s={s} publicableEnBuild={slotPublicable(s)} prioridad={i === 0} />
            ))}
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-zinc-400">
              Todavía no hay hallazgos reconfirmados hoy para esta lista. Mientras tanto, mirá las ofertas verificadas del día.
            </p>
            {respaldo.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {respaldo.map((o, i) => (
                  <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
                ))}
              </div>
            )}
          </>
        )}
        <p className="mt-6 max-w-3xl text-sm text-zinc-400 leading-relaxed [text-wrap:pretty]">
          Ver todas las{' '}
          <a href={DEALS_URL} data-bf-evento="click_ofertas_hoy" className={linkTxt}>
            ofertas de hoy, con buscador y filtros
          </a>
          . También podés mirar{' '}
          <a href="/cupones-mercado-libre" data-bf-evento="click_cupones" className={linkTxt}>
            cupones de Mercado Libre
          </a>
          : un cupón descuenta sobre el precio publicado, así que primero fijate que el precio sea bueno.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-4">
        {/* 4.5 CTA de mitad */}
        {wa && (
          <section className="my-10 rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-8 text-center">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-2">¿Querés la tanda del día, apenas sale?</h2>
            <p className="text-sm text-zinc-300 mb-5 [text-wrap:pretty]">
              Raifel publica a las 19:00, hora Argentina, solo hallazgos reconfirmados. Sumate al canal y dejá las
              notificaciones prendidas.
            </p>
            <a href={wa} target="_blank" rel="noopener noreferrer" data-bf-evento="cta_whatsapp" data-bf-placement="mid" className={btnWA}>
              Sumate al canal de WhatsApp
            </a>
          </section>
        )}

        {/* 4.6 FAQ */}
        <section className="py-10 border-b border-zinc-900">
          <h2 className={h2}>Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faqs.map(f => (
              <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400 rounded">
                  {f.q}
                  <span aria-hidden="true" className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 4.7 Aviso de afiliado */}
        <section className="py-10 border-b border-zinc-900">
          <h2 className={h2}>Transparencia</h2>
          <div className="space-y-3 text-sm text-zinc-400 leading-relaxed [text-wrap:pretty]">
            <p>
              Participamos del{' '}
              <a href={AFILIADOS_ML_URL} target="_blank" rel="noopener noreferrer" className={linkTxt}>
                Programa de Afiliados de Mercado Libre
              </a>
              . Si comprás a través de nuestros links, podemos recibir una comisión. Para vos el precio es el mismo que
              entrando directo a Mercado Libre: no pagás de más por usar este sitio.
            </p>
            <p>
              Solo recomendamos productos nuevos de vendedores con reputación verde, cuando la ficha entra en el programa.
              No modificamos los links de afiliado. Los precios, el stock y las cuotas pueden cambiar sin aviso: verificá el
              precio final en Mercado Libre antes de comprar. En cada hallazgo de esta página indicamos cuándo se
              reconfirmó.
            </p>
            <p>
              Cazador de Ofertas AR no vende los productos ni procesa pagos. La compra se hace siempre en Mercado Libre,
              bajo sus términos.
            </p>
          </div>
        </section>

        {/* 4.8 Cierre */}
        <section className="my-10 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-2">¿Querés las bajas reales apenas salen?</h2>
          <p className="text-sm text-zinc-400 mb-5 [text-wrap:pretty]">
            Publicamos las ofertas verificadas a diario. El viernes 27, a las 19:00 hora Argentina, la tanda sale primero en
            el canal.
          </p>
          {wa && (
            <>
              <a href={wa} target="_blank" rel="noopener noreferrer" data-bf-evento="cta_whatsapp" data-bf-placement="footer" className={btnWA}>
                Sumate al canal de WhatsApp
              </a>
              <p className="mt-3 text-xs text-zinc-500">
                El viernes 27 la tanda sale primero acá. El precio para vos es el mismo que en Mercado Libre.
              </p>
            </>
          )}
          {tg && (
            <p className="mt-4 text-sm">
              <a href={tg} target="_blank" rel="noopener noreferrer" data-bf-evento="cta_telegram" data-bf-placement="footer" className={linkTxt}>
                También estamos en Telegram
              </a>
            </p>
          )}
        </section>
      </div>

      <Footer brand="ofertas" />
      {wa && <StickyWhatsAppBF href={wa} />}
    </main>
  )
}
