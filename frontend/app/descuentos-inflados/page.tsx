// Descuentos inflados del día: las ofertas de mercadolibre.com.ar/ofertas cuyo
// precio de hoy está al menos 5% arriba del mínimo que registramos antes. Sale
// de frontend/data/infladas.json (lo escribe el bot en cada corrida).
//
// Tono de dato, nunca acusatorio: no sabemos por qué cambió un precio. Y sin
// links de afiliado en estos productos (no se gana con un descuento que acá se
// dice que no es real): solo un link plano a ML con rel="nofollow".
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ExtensionCTA from '@/components/ExtensionCTA'
import Footer from '@/components/Footer'
import { getEstudio } from '@/lib/estudio'
import { categoriaDe, diaMes, getInfladas, pesos, type CasoInflado } from '@/lib/infladas'
import { slugPorId } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/descuentos-inflados`
const TITULO = 'Descuentos inflados de hoy en Mercado Libre'
const DESCRIPCION =
  'Ofertas de hoy en Mercado Libre Argentina cuyo precio tachado anuncia un descuento, pero que ya registramos al menos 5% más baratas antes. Datos propios, actualizados 3 veces por día.'

export const metadata: Metadata = {
  title: `${TITULO} — Cazador de Ofertas AR`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const FAQS = [
  {
    q: '¿Qué es un descuento inflado?',
    a: 'Es una oferta cuyo porcentaje de descuento se calcula contra un precio tachado ("antes") más alto que el precio que el producto tuvo hace poco. La marcamos como inflada cuando ya habíamos registrado ese mismo producto al menos 5% más barato en una pasada anterior.',
  },
  {
    q: '¿Quiere decir que no conviene comprarlo?',
    a: 'No necesariamente. El precio de hoy puede ser bueno igual: lo que mostramos es que el descuento anunciado es más grande que la baja respecto de lo que registramos. Los precios cambian por muchas razones (una promoción que terminó, cambios de stock o de vendedor), así que es un dato para comparar, no un juicio sobre quien vende.',
  },
  {
    q: '¿De dónde salen estos casos?',
    a: 'De mercadolibre.com.ar/ofertas: un programa la recorre 3 veces por día y guarda el precio de cada producto. En cada pasada comparamos el precio de hoy contra el mínimo que registramos antes, y acá listamos las ofertas con más diferencia. El detalle completo está en la página de metodología.',
  },
  {
    q: '¿Cómo reviso una oferta que no está en esta lista?',
    a: 'Pegá el link de la publicación en el verificador de cazadordeofertas.com.ar: te dice si el precio de hoy es el más bajo que registramos, si es un precio normal o si el descuento está inflado. Si el producto nunca pasó por las ofertas que revisamos, no tenemos historial para compararlo.',
  },
]

/** "2026-09-26T22:57:05+00:00" → "26/09 19:57" (hora argentina) */
function horaArgentina(iso: string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: 'numeric',
      month: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map(x => [x.type, x.value.padStart(2, '0')])
  )
  return `${p.day}/${p.month} ${p.hour}:${p.minute}`
}

export default function DescuentosInfladosPage() {
  const { actualizado, fecha, detectadas, casos } = getInfladas()
  const estudio = getEstudio()
  const historial = slugPorId()
  const cuando = actualizado ? horaArgentina(actualizado) : null

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">
          Datos propios{cuando ? ` · última pasada ${cuando} hs` : ''}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-5 [text-wrap:balance]">
          {TITULO}
        </h1>
        <p className="text-lg text-zinc-300 leading-relaxed mb-4 [text-wrap:pretty]">
          Ofertas que hoy están en mercadolibre.com.ar/ofertas con un precio tachado, pero que en pasadas anteriores
          registramos al menos 5% más baratas. El porcentaje anunciado se calcula contra un &quot;antes&quot; más alto
          que el precio que el producto tuvo hace poco.
        </p>
        <p className="text-sm text-zinc-500 leading-relaxed mb-8">
          Es un dato, no una acusación: los precios cambian por muchas razones y no sabemos cuál fue en cada caso. Por
          eso estos productos no llevan link de afiliado: no ganamos nada si los comprás.
        </p>
        <ExtensionCTA className="-mt-4 mb-8" />

        {detectadas != null && detectadas > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-display text-3xl font-black text-red-400 tabular-nums">{detectadas.toLocaleString('es-AR')}</p>
              <p className="text-xs text-zinc-400 mt-1">
                ofertas infladas en la última pasada{fecha ? ` (${diaMes(fecha)})` : ''}
                {casos.length > 0 && casos.length < detectadas ? `; acá van las ${casos.length} con más diferencia` : ''}
              </p>
            </div>
            <Link
              href="/estudio/descuentos-inflados-mercado-libre"
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-yellow-400/50"
            >
              <p className="font-display text-3xl font-black tabular-nums">{estudio.pctInfladas.toLocaleString('es-AR')}%</p>
              <p className="text-xs text-zinc-400 mt-1 group-hover:text-zinc-300">
                de las {estudio.revisadas.toLocaleString('es-AR')} ofertas revisadas
                {estudio.desde ? ` desde el ${diaMes(estudio.desde, fecha)}` : ''} tenían el descuento inflado → ver el estudio
              </p>
            </Link>
          </div>
        )}

        <h2 className="sr-only">Casos de hoy</h2>
        {casos.length > 0 ? (
          <ol className="space-y-4 mb-10">
            {casos.map(c => (
              <Caso key={c.id} caso={c} fecha={fecha} historial={historial[c.id]} />
            ))}
          </ol>
        ) : (
          <SinCasos detectadas={detectadas} cuando={cuando} />
        )}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 mb-10">
          <h2 className="font-display text-xl font-black mb-2">¿Tenés el link de una oferta?</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            Pegalo en el verificador y te decimos si el precio de hoy es el más bajo que registramos, si es normal o si el
            descuento está inflado.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`${DEALS_URL}/#verificador`}
              className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-5 py-2.5 transition-colors"
            >
              Verificar un descuento
            </a>
            <a
              href={DEALS_URL}
              className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 rounded-xl px-5 py-2.5 transition-colors"
            >
              Ver las ofertas de hoy con descuento real
            </a>
          </div>
        </section>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cómo lo medimos</h2>
        <div className="space-y-3 text-zinc-400 leading-relaxed mb-10">
          <p>
            Tres veces por día recorremos las ofertas de Mercado Libre y guardamos el precio de cada producto. Si ya
            habíamos registrado ese producto al menos 5% más barato que hoy, la oferta queda marcada como inflada y no
            aparece en la grilla del sitio. Un producto que vemos por primera vez no tiene historia y no se puede
            clasificar.
          </p>
          <p>
            <Link href="/metodologia" className="font-bold text-yellow-400 hover:text-yellow-300">
              Metodología completa: fuentes, umbral y limitaciones →
            </Link>
          </p>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {FAQS.map(f => (
            <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}

function Caso({ caso: c, fecha, historial }: { caso: CasoInflado; fecha: string | null; historial?: string }) {
  const categoria = categoriaDe(c.titulo)
  return (
    <li id={c.id} className="scroll-mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white sm:h-24 sm:w-24">
          {c.img ? (
            <Image src={c.img} alt={c.titulo} fill unoptimized className="object-contain p-1.5" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl text-zinc-300" aria-hidden="true">📦</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-snug text-zinc-100 line-clamp-2 sm:text-base">{c.titulo}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-300 [text-wrap:pretty]">
            El precio tachado dice <span className="text-zinc-400 line-through">{pesos(c.precio_tachado)}</span>{' '}
            <span className="font-bold text-red-400">(-{c.descuento_anunciado}% anunciado)</span>, pero el{' '}
            <strong className="text-zinc-50">{diaMes(c.minimo_fecha, fecha)}</strong> lo registramos a{' '}
            <strong className="text-zinc-50 tabular-nums">{pesos(c.minimo_registrado)}</strong>.
          </p>
          <p className="mt-1 text-xs text-zinc-500 tabular-nums">
            Hoy: {pesos(c.precio_hoy)} · ya estuvo {c.diferencia_pct}% más barato
            {c.visto_desde ? ` · lo seguimos desde el ${diaMes(c.visto_desde, fecha)}` : ''}
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold">
            {historial && (
              <Link href={`/precio/${historial}`} className="text-yellow-400/90 hover:text-yellow-300">
                📈 Historial de precio
              </Link>
            )}
            {categoria ? (
              <Link href={`/categoria/${categoria.slug}`} className="text-yellow-400/90 hover:text-yellow-300">
                Ofertas de {categoria.nombre.toLowerCase()} con descuento verificado →
              </Link>
            ) : (
              <a href={`${DEALS_URL}/#verificador`} className="text-yellow-400/90 hover:text-yellow-300">
                Verificar otra oferta →
              </a>
            )}
            {c.url && (
              <a href={c.url} target="_blank" rel="nofollow noopener noreferrer" className="text-zinc-500 hover:text-zinc-300">
                Ver la publicación en ML ↗
              </a>
            )}
          </p>
        </div>
        {/* Columna propia (no absoluta): el sello nunca tapa el texto */}
        <span
          aria-hidden="true"
          className="stamp hidden h-fit shrink-0 self-start rotate-[-9deg] rounded-md border-[3px] border-red-500 px-2 py-0.5 font-display text-sm font-black tracking-widest text-red-400 sm:block"
        >
          INFLADO
        </span>
      </div>
    </li>
  )
}

function SinCasos({ detectadas, cuando }: { detectadas: number | null; cuando: string | null }) {
  let texto: string
  if (detectadas == null) {
    texto =
      'La lista se arma sola con cada pasada por las ofertas de Mercado Libre, 3 veces por día. Todavía no hay una pasada con estos datos: volvé en unas horas.'
  } else if (detectadas === 0) {
    texto = `En la última pasada${cuando ? ` (${cuando} hs)` : ''} no encontramos descuentos inflados en las ofertas que revisamos.`
  } else {
    texto = `En la última pasada${cuando ? ` (${cuando} hs)` : ''} marcamos ${detectadas.toLocaleString('es-AR')} ofertas como infladas, pero ninguna pasó los controles para mostrarla acá (por ejemplo, cuando el precio anterior parece ser de otra variante del producto).`
  }
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 px-5 py-10 text-center mb-10">
      <p className="font-display text-xl font-black text-zinc-100 mb-2">Hoy no hay casos para mostrar</p>
      <p className="mx-auto max-w-lg text-sm leading-relaxed text-zinc-400">{texto}</p>
    </div>
  )
}
