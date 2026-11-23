// "Mejor aire acondicionado": guía de compra + ofertas verificadas (lib/mejor-aires.ts).
// Misma estructura que /mejor/[slug]: respuesta corta arriba (la que citan Google y las IAs),
// lista, enlaces internos, FAQ y JSON-LD. Esta ruta estática tiene prioridad sobre [slug].
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import AvisoBFRubro from '@/components/AvisoBFRubro'
import { AIRES_HOY, AIRES_VERIFICADO } from '@/lib/mejor-aires'
import { etapaBlackFriday } from '@/lib/cybermonday'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const URL_PAGINA = `${DEALS_URL}/mejor/aires-acondicionados`

const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const verificado = fechaAR(AIRES_VERIFICADO)
const masBarato = AIRES_HOY.reduce((a, b) => (b.precio < a.precio ? b : a))
const TITULO = 'Mejor aire acondicionado split inverter: cuál comprar y ofertas de hoy'

const DESC = descripcionSeo(
  `Cómo elegir un aire acondicionado: frigorías según los m², inverter vs on/off, consumo y cuándo conviene comprar. Ofertas verificadas el ${verificado}, desde ${pesos(masBarato.precio)}.`
)

export const metadata: Metadata = {
  title: tituloSeo(`Mejor aire acondicionado (${new Date().getFullYear()}): cuál comprar`, [s => `${s} y ofertas`, s => s]),
  description: DESC,
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL_PAGINA },
  openGraph: { title: TITULO, description: DESC, url: URL_PAGINA, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const RESUMEN = `Para un ambiente de hasta unos 20 m² alcanza un split de 2.500 a 3.000 frigorías; para 30 m², cerca de 4.500. Hoy (${verificado}) el más barato que verificamos es ${masBarato.titulo}, a ${pesos(masBarato.precio)}. Conviene que sea inverter: gasta menos luz que uno on/off y mantiene la temperatura más estable.`

const FAQS = [
  { q: '¿Cuántas frigorías necesito según los m²?', a: 'Como regla práctica, unas 100 a 150 frigorías por m², según cuánto sol recibe el ambiente, la altura del techo, cuántas personas lo usan y si hay cocina o equipos que dan calor. Orientativamente: hasta 15 m², 2.000 a 2.500 frigorías; hasta 20 m², 2.500 a 3.000; hasta 30 m², cerca de 4.500; más grande, 6.000 o más. Si dudás, es mejor pasarse un poco que quedarse corto: uno justo trabaja al máximo todo el día.' },
  { q: '¿Inverter o on/off?', a: 'El inverter regula la potencia del compresor en vez de prenderse y apagarse: consume menos, mantiene una temperatura más pareja y hace menos ruido. Cuesta más al comprarlo, pero se recupera con la factura de luz si lo usás muchas horas. El on/off es más barato y sirve para un uso ocasional.' },
  { q: '¿Cuánto consume un aire acondicionado?', a: 'Depende de la potencia (en watts) y de las horas de uso. Mirá la etiqueta de eficiencia (A o A++ es mejor) y calculá: potencia en kW × horas × precio del kWh. Podés hacer la cuenta con la calculadora de consumo eléctrico del sitio. El inverter suele gastar menos que el on/off de igual capacidad.' },
  { q: '¿Frío solo o frío/calor?', a: 'El frío/calor (bomba de calor) cuesta algo más pero te sirve también en invierno y suele ser más eficiente que una estufa eléctrica. Si vivís donde casi no hace frío, el de solo frío alcanza.' },
  { q: '¿Cuándo conviene comprar un aire acondicionado?', a: 'Antes de que arranque el calor fuerte: en noviembre y diciembre hay más stock y promociones (Black Friday el 27/11), y todavía no hay demoras de instalación como en enero. En plena ola de calor los precios y los turnos de instalación empeoran. Pedí siempre la instalación aparte: no suele estar incluida.' },
  { q: '¿Por qué no muestran el porcentaje de descuento?', a: 'Porque en varios aires el precio "antes" que muestra la publicación está inflado. Preferimos mostrar el precio real de hoy y compararlo entre vendedores. Los precios cambian todos los días: confirmalo en Mercado Libre antes de comprar.' },
  { q: '¿De dónde salen los precios?', a: `Los verificamos a mano en Mercado Libre Argentina el ${verificado}. Pueden haber cambiado desde entonces.` },
]

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
      { '@type': 'ListItem', position: 2, name: 'Mejores en oferta', item: `${DEALS_URL}/mejores` },
      { '@type': 'ListItem', position: 3, name: 'Aires acondicionados', item: URL_PAGINA },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITULO,
    itemListElement: AIRES_HOY.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.titulo, url: a.url })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
]

export default function MejorAiresPage() {
  const ordenados = [...AIRES_HOY].sort((a, b) => a.precio - b.precio)
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
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
            Alertas gratis
          </a>
        </div>
      </header>

      {/* Black Friday 27/11: link a la landing del rubro (lib/bf-enlaces.ts), se apaga tras el 30/11 */}
      <AvisoBFRubro ruta="/mejor/aires-acondicionados" />

      {etapaBlackFriday().etapa !== 'despues' && (
        <aside aria-label="Black Friday" className="max-w-5xl mx-auto px-4 pt-4">
          <Link
            href="/black-friday"
            className="block rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2.5 text-center transition-colors hover:border-yellow-400/60 sm:px-5 sm:py-3"
          >
            <span className="font-display text-sm font-black text-yellow-200 sm:text-base [text-wrap:balance]">
              🖤 Black Friday es el viernes 27/11: mirá las ofertas →
            </span>
          </Link>
        </aside>
      )}

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <Link href="/mejores" className="hover:text-yellow-400">Mejores en oferta</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Aires acondicionados</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{TITULO}</h1>
          <p className="max-w-3xl text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Cuántas frigorías necesitás, si te conviene inverter, cuánto consumen y cuándo comprar. Más {AIRES_HOY.length} aires en oferta en Mercado Libre Argentina, con el precio que verificamos el {verificado}.
          </p>
          <p className="mt-3 text-sm text-zinc-500">Precios verificados el {verificado}.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 px-5 py-4">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-2">Respuesta rápida</h2>
          <p className="text-zinc-200 leading-relaxed [text-wrap:pretty]">{RESUMEN}</p>
        </section>

        <section className="mb-10 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Frigorías según los m² (orientativo)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-zinc-400">
                  <th className="py-2 pr-4 font-semibold">Ambiente</th>
                  <th className="py-2 font-semibold">Frigorías</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-200">
                <tr><td className="py-2 pr-4">Hasta 15 m²</td><td>2.000 a 2.500</td></tr>
                <tr><td className="py-2 pr-4">Hasta 20 m²</td><td>2.500 a 3.000</td></tr>
                <tr><td className="py-2 pr-4">Hasta 30 m²</td><td>unas 4.500</td></tr>
                <tr><td className="py-2 pr-4">Más de 30 m²</td><td>6.000 o más</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-zinc-500">Sumá capacidad si el ambiente recibe mucho sol, tiene techo alto o hay mucha gente o equipos prendidos.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-1">Aires en oferta hoy ({ordenados.length})</h2>
          <p className="mb-3 text-xs text-zinc-500">Ordenados de menor a mayor precio. Verificados el {verificado}; la capacidad es la que dice cada publicación.</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ordenados.map(a => (
              <li key={a.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm">
                <a href={a.url} target="_blank" rel="noopener noreferrer sponsored" className="font-semibold text-zinc-100 hover:text-yellow-400 line-clamp-2">
                  {a.titulo}
                </a>
                <p className="text-xs text-zinc-400">{a.capacidad}</p>
                <p>
                  <strong className="text-yellow-400">{pesos(a.precio)}</strong>
                  <span className="ml-1 text-xs text-zinc-500">(visto el {verificado})</span>
                </p>
                {a.nota && <p className="text-xs text-zinc-500">{a.nota}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Seguí mirando</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/mejores/mejores-aires-acondicionados" className="font-bold text-yellow-400 hover:underline">❄️ Comparativa de aires con precio y mínimo registrado →</Link>
            </li>
            <li>
              <Link href="/calculadora-consumo-electrico" className="font-bold text-yellow-400 hover:underline">⚡ Calculadora de consumo eléctrico →</Link>
            </li>
            <li>
              <Link href="/black-friday" className="font-bold text-yellow-400 hover:underline">🖤 Ofertas de Black Friday →</Link>
            </li>
          </ul>
        </section>

        <section className="max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-bold text-zinc-100 mb-1">{f.q}</h3>
                <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer brand="ofertas" />
    </main>
  )
}
