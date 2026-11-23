// Landing de Black Friday de ticket alto (lib/black-friday-landings.ts), pensada
// para el celular (390 px): arriba de todo el producto principal con un botón
// grande «Ver en Mercado Libre»; después la lista corta, qué mirar, otros rubros
// y preguntas. Sin % de descuento, precios tachados, «mínimo histórico» ni cupones.
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import CtaFijoML from '@/components/CtaFijoML'
import { miniaturaML } from '@/lib/imagenml'
import { LANDINGS_BF, productosBF, type LandingBF, type ProductoBF } from '@/lib/black-friday-landings'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
/** '2026-11-22' → '22/11' */
const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)

function Foto({ p, tam, prioridad }: { p: ProductoBF; tam: number; prioridad?: boolean }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-xl bg-white" style={{ width: tam, height: tam }}>
      {p.img ? (
        // Fotos del CDN de ML, ya comprimidas: sin el optimizador de Vercel (igual que el resto del sitio).
        // eslint-disable-next-line @next/next/no-img-element
        <img src={miniaturaML(p.img)} alt="" width={tam} height={tam} loading={prioridad ? 'eager' : 'lazy'} className="h-full w-full object-contain p-1" />
      ) : (
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-3xl">🛒</span>
      )}
    </div>
  )
}

function Precio({ p, claro }: { p: ProductoBF; claro?: boolean }) {
  if (p.precio === null || !p.visto) {
    return <p className={`text-sm font-bold ${claro ? 'text-zinc-300' : 'text-zinc-400'}`}>Mirá el precio de hoy en Mercado Libre</p>
  }
  return (
    <p className="leading-tight">
      <span className="font-display text-xl font-black text-yellow-400">{pesos(p.precio)}</span>
      <span className={`block text-[11px] ${claro ? 'text-zinc-400' : 'text-zinc-500'}`}>Precio visto el {diaMes(p.visto)} · puede cambiar</span>
    </p>
  )
}

function Tarjeta({ p, slug, pos }: { p: ProductoBF; slug: string; pos: number }) {
  return (
    <li className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3" data-seccion={`bf_${slug}_item_${pos}`}>
      <a href={p.url} target="_blank" rel="sponsored nofollow noopener" className="flex gap-3">
        <Foto p={p} tam={96} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-zinc-50 leading-snug">{p.nombre}</p>
          <p className="text-xs text-zinc-400">{p.detalle}</p>
          {p.nota && <p className="mt-0.5 text-xs text-zinc-500">{p.nota}</p>}
          <div className="mt-1">
            <Precio p={p} />
          </div>
        </div>
      </a>
      <a
        href={p.url}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-yellow-400 px-4 text-base font-black text-black transition-colors hover:bg-yellow-300 active:scale-[0.98]"
      >
        Ver en Mercado Libre ↗
      </a>
    </li>
  )
}

export default function LandingBFPage({ l }: { l: LandingBF }) {
  const productos = productosBF(l)
  const [principal, ...resto] = productos
  const url = `${DEALS_URL}/mejores/${l.slug}`
  const otras = LANDINGS_BF.filter(x => x.slug !== l.slug)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Black Friday 2026', item: `${DEALS_URL}/black-friday` },
        { '@type': 'ListItem', position: 3, name: l.rubro, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: l.h1,
      itemListElement: productos.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.nombre, url: p.url })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: l.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <main className={principal ? 'min-h-screen pb-20 sm:pb-0' : 'min-h-screen'}>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-black/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <a href={DEALS_URL} className="font-display text-base font-extrabold tracking-tight flex items-center gap-2 whitespace-nowrap">
            <Image src="/personaje/avatar-64.webp" alt="Don Ofertín" width={28} height={28} className="rounded-full" />
            <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <Link href="/black-friday" className="text-xs font-black text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full whitespace-nowrap">
            Black Friday 27/11
          </Link>
        </div>
      </header>

      {/* Primera pantalla: marca amarillo + negro, Don Ofertín y el botón del principal */}
      <section className="bg-yellow-400 text-black" data-seccion={`bf_${l.slug}_hero`}>
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wider">Black Friday 2026 · viernes 27/11</p>
              <h1 className="mt-1 font-display text-[26px] sm:text-4xl font-black leading-[1.05] tracking-tight [text-wrap:balance]">
                {l.h1}
              </h1>
            </div>
            <Image src="/personaje/pulgar.webp" alt="Don Ofertín, el cazador de ofertas" width={64} height={79} className="shrink-0" priority />
          </div>

          {principal ? (
            <>
              <a href={principal.url} target="_blank" rel="sponsored nofollow noopener" className="mt-3 flex gap-3 rounded-2xl bg-black p-3">
                <Foto p={principal} tam={84} prioridad />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-wide text-yellow-400">🏆 La que recomendamos</p>
                  <p className="font-bold text-white leading-snug">{principal.nombre}</p>
                  <p className="text-xs text-zinc-400">{principal.detalle}</p>
                  <div className="mt-1">
                    <Precio p={principal} claro />
                  </div>
                </div>
              </a>
              <a
                href={principal.url}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="mt-3 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 text-lg font-black text-yellow-400 shadow-lg transition-transform active:scale-[0.98]"
              >
                Ver en Mercado Libre ↗
              </a>
            </>
          ) : (
            <a
              href={l.busqueda}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="mt-4 flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-black px-4 text-lg font-black text-yellow-400"
            >
              Ver en Mercado Libre ↗
            </a>
          )}
          <p className="mt-2 text-[11px] font-semibold text-black/70 [text-wrap:pretty]">
            Link de afiliado: pagás lo mismo que entrando directo a Mercado Libre. Confirmá el precio ahí antes de comprar.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="text-zinc-300 leading-relaxed [text-wrap:pretty]">{l.intro}</p>

        {resto.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Más opciones</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {resto.map((p, i) => (
                <Tarjeta key={p.id} p={p} slug={l.slug} pos={i + 2} />
              ))}
            </ul>
          </section>
        )}

        <a
          href={l.busqueda}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="mt-5 inline-block text-sm font-bold text-yellow-400 hover:text-yellow-300"
        >
          ¿Ninguno te convence? Ver todos los modelos en Mercado Libre ↗
        </a>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="font-display text-lg font-black mb-2">Qué mirar antes de comprar</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-zinc-300 leading-relaxed">
            {l.criterios.map(c => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <nav aria-label="Más Black Friday" className="mt-8" data-seccion={`bf_${l.slug}_rubros`}>
          <h2 className="font-display text-lg font-black mb-3">Más Black Friday 2026</h2>
          <ul className="flex flex-wrap gap-2">
            {otras.map(o => (
              <li key={o.slug}>
                <Link href={`/mejores/${o.slug}`} className="inline-flex min-h-[44px] items-center rounded-full bg-yellow-400 px-4 text-sm font-black text-black hover:bg-yellow-300">
                  {o.emoji} {o.rubro}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/black-friday" className="inline-flex min-h-[44px] items-center rounded-full border border-yellow-400/60 px-4 text-sm font-bold text-yellow-300 hover:border-yellow-400">
                🖤 Todo el Black Friday
              </Link>
            </li>
          </ul>
          {l.enlaces.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm">
              {l.enlaces.map(e => (
                <li key={e.href}>
                  <Link href={e.href} className="font-bold text-yellow-400 hover:underline">{e.texto} →</Link>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <section className="mt-8">
          <h2 className="font-display text-lg sm:text-xl font-black mb-3">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {l.faq.map(f => (
              <details key={f.q} className="group rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-zinc-100">
                  {f.q}
                  <span aria-hidden="true" className="shrink-0 text-yellow-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-zinc-500 leading-relaxed [text-wrap:pretty]">
          Elegimos estos productos revisando publicaciones de Mercado Libre Argentina; no los probamos. Los links son de
          afiliado: si comprás, podemos recibir una comisión y para vos el precio es el mismo. Precio, stock y cuotas pueden
          cambiar sin aviso.
        </p>
      </div>

      <Footer brand="ofertas" sinCupones />

      {principal && (
        <CtaFijoML
          titulo={principal.nombre}
          precio={principal.precio !== null ? pesos(principal.precio) : 'Ver precio'}
          url={principal.url}
          seccion={`bf_${l.slug}_fijo`}
        />
      )}
    </main>
  )
}
