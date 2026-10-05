// Guía de cupones y códigos de descuento de Mercado Libre Argentina. Nace de
// la única búsqueda de Google que trajo un clic ("codigos descuento mercado
// libre"). Regla: NO se inventan códigos ni porcentajes. Todo dato de Mercado
// Libre sale de una página oficial leída en la fecha VERIFICADO (con curl);
// lo que no se pudo leer (páginas de ayuda que cargan por JS, "primera
// compra") se omite. Al actualizar, volver a leer las fuentes y cambiar la fecha.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { paginaML } from '@/lib/afiliado'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getOfertas, getScrapedAt } from '@/lib/productos'
import { slugPorId } from '@/lib/seguimiento'
import { DEALS_URL, ORG_ID, WEBSITE_ID } from '@/lib/marca'
import { getComparativa, indexable } from '@/lib/comparativas'
import { getCategoria, enCategoria } from '@/lib/categorias'

const URL = `${DEALS_URL}/cupones-mercado-libre`
const TITULO = 'Cupones y códigos de descuento de Mercado Libre Argentina: cómo usarlos'
const DESCRIPCION =
  'Cupones y códigos de descuento de Mercado Libre Argentina: dónde verlos, cómo usarlos, qué pasa con Meli+ y los bancos, y cómo saber si el descuento es real. Sin códigos inventados.'
/** Día en que se leyeron las fuentes oficiales citadas abajo. */
const VERIFICADO = '28/09/2026'
/** Última edición de esta guía (ISO, para JSON-LD y el texto visible). */
const MODIFICADO = '2026-09-29'
const MODIFICADO_TXT = '29/09/2026'
/** Comparativas de ticket alto: donde un cupón con tope rinde más. */
const TICKET_ALTO = ['mejores-aires-acondicionados', 'mejores-smart-tv', 'mejores-heladeras', 'mejores-lavarropas', 'mejores-notebooks', 'mejores-celulares']
const MAX_OFERTAS = 8

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: descripcionSeo(DESCRIPCION), url: URL, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const FUENTES = [
  { href: 'https://www.mercadolibre.com.ar/cupones', txt: 'mercadolibre.com.ar/cupones (pide iniciar sesión)' },
  { href: 'https://www.mercadolibre.com.ar/l/promociones', txt: 'mercadolibre.com.ar/l/promociones (legales de promociones vigentes)' },
  { href: 'https://www.mercadolibre.com.ar/ofertas/cuponera', txt: 'mercadolibre.com.ar/ofertas/cuponera (legales de una campaña de cupones)' },
  { href: 'https://developers.mercadolibre.com.ar/cupones-del-vendedor', txt: 'developers.mercadolibre.com.ar: campañas de cupones del vendedor' },
]

const FAQS = [
  {
    q: '¿Hay códigos de descuento de Mercado Libre que sirvan para todos?',
    a: 'No encontramos ninguno vigente publicado por Mercado Libre para todo el mundo. Los cupones se muestran por usuario en mercadolibre.com.ar/cupones (hay que iniciar sesión) y cada uno tiene sus condiciones. Desconfiá de páginas que listan "códigos" sin fuente: muchos son viejos o de otra campaña.',
  },
  {
    q: '¿Dónde veo los cupones que tengo disponibles?',
    a: 'En mercadolibre.com.ar/cupones, con tu cuenta iniciada (sin sesión, la página te manda al login). Ahí aparecen los cupones disponibles para tu usuario en ese momento.',
  },
  {
    q: '¿Cómo se usa un cupón de Mercado Libre?',
    a: 'Con tu cuenta iniciada, revisá en mercadolibre.com.ar/cupones qué cupones tenés y leé sus condiciones (vigencia, productos alcanzados y tope). Después comprá un producto alcanzado y, antes de confirmar el pago, verificá que el descuento figure en el resumen de la compra. Si no aparece, ese cupón no aplica a esa compra.',
  },
  {
    q: '¿El cupón descuenta el envío?',
    a: 'En las condiciones de campañas de cupones que publicó Mercado Libre que leímos, el descuento se calcula sobre el total de la compra sin incluir el envío. Cada cupón puede tener reglas propias: fijate en las suyas.',
  },
  {
    q: '¿Puedo usar dos cupones en la misma compra?',
    a: 'En general no. Las condiciones que publica Mercado Libre para sus campañas de cupones indican 1 cupón por transacción, y la documentación de cupones del vendedor dice que se permite un cupón por venta. Igual, lo que manda son las condiciones de cada cupón.',
  },
  {
    q: '¿Un cupón garantiza que el precio sea bueno?',
    a: 'No. El cupón descuenta sobre el precio publicado, y ese precio puede tener un "antes" inflado. Antes de pagar, pegá el link en el verificador de cazadordeofertas.com.ar para comparar el precio de hoy con el historial que registramos.',
  },
]

export default function CuponesPage() {
  const scrapedAt = getScrapedAt().toISOString()
  const historial = slugPorId()
  // Quien busca cupones es comprador de casa: sin equipamiento gastronómico industrial
  const gastro = getCategoria('equipamiento-gastronomico')
  const ofertas: OfertaLight[] = getOfertas()
    .filter(o => !gastro || !enCategoria(gastro, o.titulo))
    .slice(0, MAX_OFERTAS)
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

  const comparativas = TICKET_ALTO.map(getComparativa).filter(
    (c): c is NonNullable<typeof c> => !!c && indexable(c),
  )

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITULO,
      description: DESCRIPCION,
      inLanguage: 'es-AR',
      datePublished: '2026-09-28',
      dateModified: MODIFICADO,
      mainEntityOfPage: URL,
      author: { '@type': 'Organization', '@id': ORG_ID, name: 'Cazador de Ofertas AR', url: DEALS_URL },
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'Cazador de Ofertas AR', url: DEALS_URL },
      isPartOf: { '@id': WEBSITE_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  const a = 'text-yellow-400 hover:underline'
  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a href={DEALS_URL} className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full">
            Ver ofertas de hoy →
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <p className="text-xs font-bold tracking-widest text-yellow-400 mb-3">
          GUÍA · ACTUALIZADA EL <time dateTime={MODIFICADO}>{MODIFICADO_TXT}</time> · FUENTES LEÍDAS EL {VERIFICADO}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-6 [text-wrap:balance]">
          Cupones y códigos de descuento de Mercado Libre Argentina: cómo usarlos
        </h1>

        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 px-5 py-4 mb-8">
          <p className="text-xs font-bold text-yellow-400 mb-1">RESPUESTA CORTA</p>
          <p className="text-zinc-200 leading-relaxed">
            No hay un código mágico que sirva para todos. Los cupones de Mercado Libre se ven con tu cuenta en
            mercadolibre.com.ar/cupones, cada uno con sus condiciones, y en general se usa uno por compra. Acá no
            vas a encontrar códigos inventados: te explicamos dónde están los reales y cómo comprobar que el precio
            con descuento sea de verdad bajo.
          </p>
          <a
            href="#ofertas-hoy"
            className="mt-4 flex items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 transition-colors"
          >
            🔥 Ver las ofertas de hoy con descuento real ↓
          </a>
        </div>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3 text-zinc-100">1. La página oficial de cupones</h2>
            <p>
              Mercado Libre tiene una sección de cupones en{' '}
              <a href={paginaML('https://www.mercadolibre.com.ar/cupones')} rel="sponsored nofollow noopener" target="_blank" className={a}>mercadolibre.com.ar/cupones</a>.
              Sin sesión iniciada te redirige al login: los cupones son por usuario, así que dos personas pueden ver
              cupones distintos el mismo día. Revisala antes de pagar, no después.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3 text-zinc-100">Cómo usar un cupón de Mercado Libre, paso a paso</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Iniciá sesión y entrá a <a href={paginaML('https://www.mercadolibre.com.ar/cupones')} rel="sponsored nofollow noopener" target="_blank" className={a}>mercadolibre.com.ar/cupones</a> para ver los cupones de tu cuenta.</li>
              <li>Leé las condiciones de cada uno: vigencia, productos alcanzados y tope máximo de descuento.</li>
              <li>Elegí un producto que entre en esas condiciones y chequeá que el precio base sea bueno (abajo te decimos cómo).</li>
              <li>Antes de confirmar el pago, mirá el resumen de la compra: el descuento del cupón tiene que figurar ahí. Si no figura, ese cupón no aplica.</li>
              <li>Un cupón por compra: si tenés varios, usá el que más descuente para esa compra en particular.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3 text-zinc-100">2. Cómo son las condiciones de un cupón</h2>
            <p>
              Tomamos como ejemplo los legales publicados en{' '}
              <a href={paginaML('https://www.mercadolibre.com.ar/ofertas/cuponera')} rel="sponsored nofollow noopener" target="_blank" className={a}>la cuponera de Mercado Libre</a>{' '}
              (son de una campaña de 2022, ya vencida; no copiamos sus códigos porque no sirven). Ahí se ve la
              estructura típica: un plazo de vigencia, productos seleccionados, descuento sobre el total de la compra
              sin incluir el envío, un tope máximo de descuento por cupón y 1 cupón por transacción.
            </p>
            <p className="mt-3">
              Conclusión práctica: un cupón puede figurar disponible y no aplicar a lo que estás comprando. Leé
              vigencia, productos alcanzados y tope antes de armar la compra alrededor del cupón.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3 text-zinc-100">3. Cupones de vendedor</h2>
            <p>
              Según la{' '}
              <a href="https://developers.mercadolibre.com.ar/cupones-del-vendedor" rel="nofollow noopener" target="_blank" className={a}>documentación oficial para desarrolladores</a>,
              los vendedores pueden crear campañas de cupones, con o sin código; el descuento se suma a la promoción
              activa de la publicación y se permite un cupón por venta. Esa misma página aclara que, por ahora, esa
              campaña está disponible solo para Brasil, así que en Argentina no cuentes con encontrar cupones de este tipo.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3 text-zinc-100">4. Meli+, bancos y Mercado Pago</h2>
            <p>
              Muchos “descuentos” de Mercado Libre no son cupones sino beneficios por suscripción o por medio de pago.
              En la{' '}
              <a href={paginaML('https://www.mercadolibre.com.ar/l/promociones')} rel="sponsored nofollow noopener" target="_blank" className={a}>página de promociones</a>{' '}
              (leída el {VERIFICADO}) figuran, entre otros:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                Envío gratis con Meli+ en productos nuevos seleccionados desde $15.000 con la etiqueta MELI+ (con
                excepciones, por ejemplo Supermercado y Compras Internacionales).
              </li>
              <li>
                Prueba gratis de Meli+ Esencial por 1 mes, del 14/09/2026 al 18/10/2026, para quien nunca tuvo la
                suscripción; después se renueva sola al precio vigente si no la cancelás.
              </li>
              <li>
                Cuotas sin interés y reintegros con tarjetas de bancos puntuales, pagando a través de Mercado Pago.
                Cambian seguido (muchas vencen a fin de mes), así que no las detallamos: fijate en esa página qué
                está vigente para tu tarjeta el día que compres.
              </li>
            </ul>
            <p className="mt-3">
              Si vas a pagar en cuotas, la{' '}
              <a href="https://calculadoraml.com.ar/calculadora-cuotas-sin-interes" className={a}>calculadora de cuotas sin interés</a>{' '}
              te dice si conviene contra pagar de contado, y la de{' '}
              <a href="https://calculadoraml.com.ar/calculadora-envio-gratis" className={a}>envío gratis</a> cuánto te falta para no pagar envío.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3 text-zinc-100">5. Antes de usar el cupón: ¿el descuento es real?</h2>
            <p>
              Un cupón descuenta sobre el precio publicado. Si ese precio tiene un “antes” inflado, el cupón te hace
              sentir que ahorraste más de lo que ahorraste. Dos herramientas gratis del sitio:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>
                <Link href="/#verificador" className={a}>El verificador</Link>: pegás el link de la publicación y te dice si el
                precio de hoy es el mínimo que registramos, uno normal o un descuento inflado.
              </li>
              <li>
                <Link href="/descuentos-inflados" className={a}>Descuentos inflados de hoy</Link>: las ofertas de
                mercadolibre.com.ar/ofertas que ya vimos más baratas antes. La forma de medirlo está en la{' '}
                <Link href="/metodologia" className={a}>metodología</Link>.
              </li>
            </ul>
          </section>
        </div>
      </article>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="max-w-3xl mx-auto sm:mx-0 mb-4">
          <h2 id="ofertas-hoy" className="font-display text-xl sm:text-2xl font-black scroll-mt-20">Ofertas de hoy con descuento verificado</h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Precios de Mercado Libre comparados contra nuestro historial (no incluyen cupones). Los botones son links
            de afiliado: si comprás, Mercado Libre nos paga una comisión y a vos no te cuesta más.{' '}
            <span className="text-zinc-500">
              <LastUpdated scrapedAt={scrapedAt} />.
            </span>
          </p>
        </div>
        {ofertas.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Estamos cazando las ofertas de hoy. <a href={DEALS_URL} className={a}>Mirá todas las ofertas</a>.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ofertas.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
        <a href={DEALS_URL} className="mt-5 inline-block text-sm font-bold text-yellow-400 hover:text-yellow-300">
          Ver todas las ofertas de hoy, con buscador y filtros →
        </a>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-12">
        {comparativas.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-2">Donde un cupón rinde más: compras grandes</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Los cupones suelen tener un tope de descuento, así que conviene comparar bien el precio base de las compras
              caras. Estas comparativas muestran el precio de hoy contra el mínimo que registramos:
            </p>
            <ul className="text-sm space-y-1 list-disc pl-5 text-zinc-400">
              {comparativas.map(c => (
                <li key={c.slug}>
                  <Link href={`/mejores/${c.slug}`} className={a}>Mejores {c.nombre} en oferta</Link>
                </li>
              ))}
              <li>
                <Link href="/precio" className={a}>Historial de precios de productos de ticket alto</Link>
              </li>
              <li>
                <a href={DEALS_URL} className={a}>Todas las ofertas de hoy en Mercado Libre</a>
              </li>
            </ul>
          </section>
        )}
        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
        <div className="space-y-5">
          {FAQS.map(f => (
            <div key={f.q}>
              <h3 className="font-bold text-zinc-200 mb-1">{f.q}</h3>
              <p className="text-zinc-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-lg font-black mt-10 mb-2">Fuentes (leídas el {VERIFICADO})</h2>
        <ul className="text-sm space-y-1 list-disc pl-5 text-zinc-400">
          {FUENTES.map(f => (
            <li key={f.href}>
              <a href={f.href} rel="nofollow noopener" target="_blank" className={a}>{f.txt}</a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-zinc-500">
          Cazador de Ofertas AR no es Mercado Libre ni está afiliado a sus promociones: solo contamos lo que publican
          sus páginas oficiales. Las condiciones cambian; lo que vale es lo que diga Mercado Libre al pagar.
        </p>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
