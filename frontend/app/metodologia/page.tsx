// Metodología: cómo mide el bot (bot/cazador_bot.py) los precios y qué
// significa cada etiqueta del sitio. Todo lo que dice esta página está
// verificado contra el código del bot; las cifras salen de getEstudio() y del
// historial (se recalculan en cada build, o sea, con cada corrida del bot).
// Si cambia la lógica del bot (HIST_INFLATED_MARGIN, HIST_MIN_AGE_DAYS,
// CATEGORIAS_TICKET_ALTO, INFLADAS_MIN_RATIO, HIST_MAX_ITEMS), actualizar acá.
import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import { getEstudio } from '@/lib/estudio'
import { getHistorial } from '@/lib/historial'
import { DEALS_URL, MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'

const URL = `${DEALS_URL}/metodologia`
const TITULO = 'Metodología: cómo medimos precios y descuentos inflados'
const DESCRIPCION =
  'Cómo registra Cazador de Ofertas AR los precios de Mercado Libre Argentina: qué páginas recorre y cada cuánto, qué es un descuento inflado (umbral del 5% contra el mínimo registrado), qué es el mínimo histórico y qué limitaciones tienen los datos.'

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

// Mismas categorías que CATEGORIAS_TICKET_ALTO en bot/cazador_bot.py.
const CATEGORIAS_BOT = [
  'herramientas',
  'industrias y oficinas (gastronomía, embalaje)',
  'electrodomésticos y aires acondicionados',
  'hogar, muebles y jardín',
  'electrónica, audio y video',
  'accesorios para vehículos',
  'belleza y cuidado personal',
]

/** Páginas que lee cada pasada (bot/config.json); si no está, los valores actuales. */
function paginasBot() {
  const valores = { pages: 20, relampago_pages: 6, categoria_pages: 3 }
  try {
    const c = JSON.parse(fs.readFileSync(path.join(process.cwd(), '..', 'bot', 'config.json'), 'utf8'))
    for (const k of Object.keys(valores) as (keyof typeof valores)[]) {
      if (typeof c[k] === 'number') valores[k] = c[k]
    }
  } catch {
    // build fuera del repo: quedan los valores de arriba
  }
  return valores
}

const numero = (n: number) => n.toLocaleString('es-AR')
/** Fecha en que se publicó esta página (commit 8f857f4). */
const PUBLICADA = '2026-09-26'
/** ISO → "27/09/2026" en hora argentina */
const fechaAR = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
const fecha = (iso: string) => iso.split('-').reverse().join('/')
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const nombreMes = (ym: string) => `${MESES[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`

function Seccion({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 mb-10">
      <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{titulo}</h2>
      <div className="space-y-3 text-zinc-300 leading-relaxed [text-wrap:pretty]">{children}</div>
    </section>
  )
}

export default function MetodologiaPage() {
  const e = getEstudio()
  const productos = Object.keys(getHistorial()).length
  const p = paginasBot()
  // dateModified = última pasada del bot contada en las cifras de la página
  // (se recalculan en cada build, que dispara cada corrida del bot).
  const actualizada = e.ultima || null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: TITULO,
    description: DESCRIPCION,
    url: URL,
    mainEntityOfPage: URL,
    inLanguage: 'es-AR',
    datePublished: PUBLICADA,
    ...(actualizada ? { dateModified: actualizada } : {}),
    author: { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL },
    publisher: { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL },
    isPartOf: { '@id': WEBSITE_ID },
    about: ['Descuentos inflados en Mercado Libre Argentina', 'Historial de precios', 'Mínimo histórico de precio'],
  }

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Metodología</p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-5 [text-wrap:balance]">
          Cómo medimos los precios y los descuentos
        </h1>
        <p className="text-lg text-zinc-300 leading-relaxed mb-8 [text-wrap:pretty]">
          Todo lo que publicamos (las ofertas verificadas, el sello de mínimo histórico, los descuentos inflados y el
          estudio) sale de un mismo registro de precios que armamos nosotros. Acá contamos cómo se arma, qué quiere decir
          cada etiqueta y qué cosas estos datos no pueden decir.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            [numero(e.revisadas), 'ofertas revisadas'],
            [`${e.pctInfladas.toLocaleString('es-AR')}%`, 'con descuento inflado'],
            [numero(e.pasadas), 'pasadas'],
            [numero(productos), 'productos con precio registrado'],
          ].map(([n, t]) => (
            <div key={t} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="font-display text-2xl font-black tabular-nums">{n}</p>
              <p className="text-xs text-zinc-400 mt-1">{t}</p>
            </div>
          ))}
        </div>
        {e.desde && (
          <p className="-mt-7 mb-10 text-xs text-zinc-500">
            Datos del {fecha(e.desde)} al {fecha(e.hasta)}. Se recalculan solos con cada pasada.
            {actualizada && (
              <>
                {' '}
                Última actualización: <time dateTime={actualizada}>{fechaAR(actualizada)}</time>.
              </>
            )}
          </p>
        )}

        <Seccion id="fuentes" titulo="De dónde salen las ofertas">
          <p>
            Un programa recorre las páginas de ofertas de Mercado Libre Argentina (mercadolibre.com.ar/ofertas) tres
            veces por día. Las pasadas están programadas para las 12, las 17 y las 21, hora argentina, aunque a veces
            arrancan más tarde.
          </p>
          <p>Hoy, en cada pasada lee:</p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>las primeras {p.pages} páginas de mercadolibre.com.ar/ofertas;</li>
            {p.relampago_pages > 0 && <li>{p.relampago_pages} páginas de ofertas relámpago;</li>}
            {p.categoria_pages > 0 && (
              <li>
                las primeras {p.categoria_pages} páginas de las ofertas filtradas por {CATEGORIAS_BOT.length} categorías:{' '}
                {CATEGORIAS_BOT.slice(0, -1).join('; ')} y {CATEGORIAS_BOT[CATEGORIAS_BOT.length - 1]}.
              </li>
            )}
          </ul>
          <p>
            De cada tarjeta de oferta guardamos el título, el precio de hoy, el precio tachado y el porcentaje de descuento
            que muestra la publicación, la foto y el link. Si un producto aparece en más de una página, en esa pasada se
            cuenta una sola vez. No usamos el buscador de Mercado Libre ni vemos productos que no están en esas páginas.
          </p>
          {e.porMes.length > 1 && (
            <>
              <p>La cobertura fue creciendo con el tiempo:</p>
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-900 text-zinc-400 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Mes</th>
                      <th className="px-3 py-2 font-semibold">Pasadas</th>
                      <th className="px-3 py-2 font-semibold">Ofertas por pasada (promedio)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.porMes.map(m => (
                      <tr key={m.mes} className="border-t border-zinc-800">
                        <td className="px-3 py-2 text-zinc-300">{nombreMes(m.mes)}</td>
                        <td className="px-3 py-2 tabular-nums">{numero(m.pasadas)}</td>
                        <td className="px-3 py-2 tabular-nums">{numero(Math.round(m.revisadas / m.pasadas))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Seccion>

        <Seccion id="registro" titulo="Qué registramos de cada producto">
          <p>
            Cada producto se identifica por su código de Mercado Libre (el &quot;MLA…&quot; que aparece en el link). Para
            cada uno guardamos el precio más bajo que vimos y la fecha, el último precio y la primera fecha en que
            apareció en las ofertas. Hoy son {numero(productos)} productos. Guardamos hasta 6.000: si se pasa, salen
            primero los que hace más tiempo no vemos.
          </p>
        </Seccion>

        <Seccion id="inflado" titulo="Qué es un descuento inflado">
          <p>
            Marcamos una oferta como <strong className="text-red-400">inflada</strong> cuando el precio más bajo que
            registramos antes para ese producto está al menos 5% por debajo del precio de hoy. Por ejemplo: si hoy
            está a $100.000 y en una pasada anterior lo vimos a $94.000, está inflada; si lo vimos a $96.000, no.
          </p>
          <p>
            La comparación es contra nuestro propio registro, no contra el precio tachado: el &quot;antes&quot; y el
            porcentaje de descuento los informa la publicación y no los usamos para decidir. El margen del 5% deja afuera
            las variaciones chicas de precio.
          </p>
          <p>
            Las ofertas infladas no aparecen en la grilla del sitio ni las publicamos en nuestros canales. Las que tienen
            más diferencia se listan en{' '}
            <Link href="/descuentos-inflados" className="font-bold text-yellow-400 hover:text-yellow-300">
              Descuentos inflados de hoy
            </Link>
            , sin link de afiliado. En esa lista no mostramos los casos en que el mínimo registrado es menos de la mitad
            del precio de hoy: suelen ser otra variante del producto o una lectura con error. En el estudio sí se cuentan.
          </p>
          {e.desde && <p>Contamos descuentos inflados desde el {fecha(e.desde)}.</p>}
        </Seccion>

        <Seccion id="minimo-historico" titulo="Qué es el mínimo histórico">
          <p>
            Una oferta lleva el sello de <strong className="text-yellow-300">mínimo histórico</strong> cuando su precio
            de hoy es igual o menor al más bajo que registramos para ese producto, y lo venimos siguiendo desde hace al
            menos 3 días. Con menos historia todavía no sabemos si es barato de verdad.
          </p>
        </Seccion>

        <Seccion id="limitaciones" titulo="Limitaciones">
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              Solo vemos los productos que pasan por las páginas de ofertas que recorremos. Si un producto estuvo más
              barato mientras no figuraba ahí, no lo registramos: el &quot;mínimo registrado&quot; puede ser más alto que
              el mínimo real, y probablemente haya más descuentos inflados de los que contamos.
            </li>
            <li>
              Un producto que vemos por primera vez no tiene historia: no se puede clasificar como inflado ni como
              mínimo histórico.
            </li>
            <li>Miramos el precio como mucho 3 veces por día: lo que cambia entre una pasada y otra no queda registrado.</li>
            <li>
              Registramos el precio que muestra la tarjeta de la oferta. No incluye cupones, descuentos por medio de pago,
              cuotas ni envío, y puede corresponder a una variante o a un vendedor distinto del que ves al entrar.
            </li>
            <li>Si cambia el código de una publicación, para nosotros es un producto nuevo y arranca sin historia.</li>
            <li>
              El estudio cuenta apariciones: un producto que sigue en oferta varias pasadas se cuenta en cada una. Y como
              la cobertura creció, los meses no son del todo comparables entre sí.
            </li>
            <li>No sabemos por qué cambió un precio. Mostramos el dato, no juzgamos a quien vende.</li>
          </ul>
        </Seccion>

        <Seccion id="otros-porcentajes" titulo="¿Por qué otros sitios publican porcentajes distintos?">
          <p>
            Porque no hay una única forma de definir un descuento inflado, y cada definición da un número distinto.
            Algunas posibles:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              Comparar contra el precio promedio o la mediana de los últimos días o semanas, en vez de contra el mínimo.
            </li>
            <li>
              Usar otra ventana de tiempo: los últimos 30, 60 o 90 días, o toda la historia disponible. Nosotros usamos
              todo lo que registramos de cada producto.
            </li>
            <li>Usar otro umbral: cualquier diferencia, o márgenes más grandes o más chicos que nuestro 5%.</li>
            <li>Mirar otro universo: todo el catálogo, solo algunas categorías o solo las ofertas destacadas.</li>
            <li>Contar productos distintos en vez de apariciones, o revisar los precios con otra frecuencia.</li>
          </ul>
          <p>
            Con definiciones distintas, los porcentajes no se pueden comparar directamente. Por eso publicamos la nuestra
            completa.
          </p>
        </Seccion>

        <Seccion id="donde" titulo="Dónde usamos estos datos">
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li>
              <a href={`${DEALS_URL}/#verificador`} className="font-bold text-yellow-400 hover:text-yellow-300">
                El verificador
              </a>
              : pegás el link de una publicación y te dice si el precio es inflado, normal o el mínimo registrado.
            </li>
            <li>
              <a href={DEALS_URL} className="font-bold text-yellow-400 hover:text-yellow-300">
                Las ofertas de hoy
              </a>
              : solo las que no están infladas, con el sello de mínimo histórico cuando corresponde.
            </li>
            <li>
              <Link href="/descuentos-inflados" className="font-bold text-yellow-400 hover:text-yellow-300">
                Descuentos inflados de hoy
              </Link>
              : los casos de la última pasada con más diferencia.
            </li>
            <li>
              <Link href="/precio" className="font-bold text-yellow-400 hover:text-yellow-300">
                Historial de precios
              </Link>
              : una página por producto de ticket alto con su evolución diaria.
            </li>
            <li>
              <Link href="/estudio/descuentos-inflados-mercado-libre" className="font-bold text-yellow-400 hover:text-yellow-300">
                El estudio
              </Link>
              : cuántas de las ofertas revisadas tenían el descuento inflado, mes a mes.
            </li>
          </ul>
        </Seccion>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
