// Landing de Black Friday de ticket alto (lib/black-friday-landings.ts), pensada
// para el celular (390 px): arriba de todo el producto principal con un botón
// grande «Ver en Mercado Libre»; después la lista corta, qué mirar, otros rubros
// y preguntas. Sin cifras de descuento ni precios tachados.
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import CtaFijoML from '@/components/CtaFijoML'
import CanalWhatsAppBF from '@/components/black-friday/CanalWhatsAppBF'
import { miniaturaML } from '@/lib/imagenml'
import { LANDINGS_BF, actualizadoBF, productosBF, type LandingBF, type ProductoBF } from '@/lib/black-friday-landings'
import { breadcrumbLD, faqLD, itemListLD } from '@/lib/bf-jsonld'
import { fechaAR } from '@/lib/bf-guias'
import { CHIP_MODO_BF, DESTACADOS_MODO_BF, ETIQUETA_MODO_BF, modoBF, textoModoBF, type ModoBF } from '@/lib/cybermonday'
import { destacadosLandingBF, excluidoDeCta } from '@/lib/cta-destacados'
import TerminoBF from '@/components/black-friday/TerminoBF'
import EnlaceNavidad from '@/components/EnlaceNavidad'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Botón grande de la primera pantalla (landings y guías BF): amarillo de marca #FACC15, texto
 *  negro, 48 px de alto como mínimo, sobre la tarjeta negra del recomendado. */
export const BOTON_HERO =
  'mt-3 flex min-h-12 w-full flex-col items-center justify-center rounded-xl bg-[#FACC15] px-4 py-2 text-center text-black shadow-lg transition-transform hover:bg-yellow-300 active:scale-[0.98]'
/** '2026-11-22' → '22/11' */
const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)

export function Foto({ p, tam, prioridad }: { p: ProductoBF; tam: number; prioridad?: boolean }) {
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

export function Precio({ p, claro }: { p: ProductoBF; claro?: boolean }) {
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

/** Debajo del botón: «Tienda oficial» solo si el dato existe (tiendaOficial); envío y cuotas nunca los
 *  afirmamos, se miran en la publicación. */
export function LineaConfianza({ p, claro }: { p: ProductoBF; claro?: boolean }) {
  return (
    <p className={`mt-1.5 text-center text-xs ${claro ? 'text-black/70' : 'text-zinc-400'}`}>
      {p.tiendaOficial && <span className="font-bold">✔ Tienda oficial · </span>}
      Envío y cuotas: mirá en ML
    </p>
  )
}

/** Respuesta corta (la que citan Google y las IAs) + «Actualizado el». */
export function RespuestaCorta({ texto, actualizado }: { texto: string; actualizado: string }) {
  return (
    <div className="mt-3 rounded-2xl bg-black/90 px-4 py-3 text-zinc-100">
      <p className="text-[11px] font-black uppercase tracking-wide text-yellow-400">Respuesta corta</p>
      <p className="mt-1 text-[15px] leading-relaxed [text-wrap:pretty]">{texto}</p>
      <p className="mt-1.5 text-[11px] text-zinc-400">
        Actualizado el <time dateTime={actualizado}>{fechaAR(actualizado)}</time>
      </p>
    </div>
  )
}

export function Tarjeta({ p, slug, pos }: { p: ProductoBF; slug: string; pos: number }) {
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
      {/* Botón de afiliado: ancho completo y 48 px de alto como mínimo (dedo en el celular). */}
      <a
        href={p.url}
        target="_blank"
        rel="sponsored nofollow noopener"
        aria-label={`Ver ${p.nombre} en Mercado Libre`}
        data-seccion={`bf_${slug}_item_${pos}_boton`}
        className="mt-3 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-yellow-400 px-4 text-base font-black text-black transition-colors hover:bg-yellow-300 active:scale-[0.98]"
      >
        Ver en Mercado Libre ↗
      </a>
      <LineaConfianza p={p} />
    </li>
  )
}

/** Botón del encabezado (landings y guías BF): a /black-friday mientras dura; después, a las ofertas de hoy. */
export function ChipEncabezadoBF({ modo }: { modo: ModoBF }) {
  const clase = 'text-xs font-black text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full whitespace-nowrap'
  if (modo === 'termino') {
    return (
      <a href={DEALS_URL} className={clase}>
        {CHIP_MODO_BF[modo]}
      </a>
    )
  }
  return (
    <Link href="/black-friday" className={clase}>
      {CHIP_MODO_BF[modo]}
    </Link>
  )
}

/** Cuadro de destacados de arriba de todo (26/11/2026): el 2.º y 3.º recomendados, cada uno con su
 *  botón #FACC15 de 48 px a la publicación de ML (link de afiliado). Sin descuentos ni tachados. */
export function OtrosDestacados({ productos, seccion, desde }: { productos: ProductoBF[]; seccion: string; desde: number }) {
  if (productos.length === 0) return null
  return (
    <ul className="mt-2 grid gap-2 sm:grid-cols-2">
      {productos.map((p, i) => (
        <li key={p.id} className="rounded-2xl bg-black p-3">
          <a href={p.url} target="_blank" rel="sponsored nofollow noopener" className="flex gap-3">
            <Foto p={p} tam={64} />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white leading-snug">{p.nombre}</p>
              <p className="text-xs text-zinc-400">{p.detalle}</p>
              <div className="mt-1">
                <Precio p={p} claro />
              </div>
            </div>
          </a>
          <a
            href={p.url}
            target="_blank"
            rel="sponsored nofollow noopener"
            aria-label={`Ver ${p.nombre} en Mercado Libre`}
            data-seccion={`${seccion}_destacado_${desde + i}`}
            data-mla={p.id}
            className={BOTON_HERO}
          >
            <span className="whitespace-nowrap text-lg font-black leading-tight">Ver en Mercado Libre ↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function LandingBFPage({ l }: { l: LandingBF }) {
  // Modo del día (lib/cybermonday.ts): previa / hoy / últimas horas / terminó. Se evalúa en el render (ISR).
  const modo = modoBF()
  const h1 = textoModoBF(l.h1, modo)
  // Sin BGH, Likon, HP, OMEN ni Victus (productosDeItems ya filtra marcas; excluidoDeCta suma ids sueltos).
  const productos = productosBF(l).filter(p => !excluidoDeCta(p))
  const destacados = destacadosLandingBF(productos)
  const [principal, ...otrosDestacados] = destacados
  const enDestacados = new Set(destacados.map(p => p.id))
  const resto = productos.filter(p => !enDestacados.has(p.id))
  const url = `${DEALS_URL}/mejores/${l.slug}`
  const otras = LANDINGS_BF.filter(x => x.slug !== l.slug)
  const actualizado = actualizadoBF(productos)

  // JSON-LD (lib/bf-jsonld.ts): Product + Offer solo con precio visto hace 7 días o menos; nada de ratings.
  const jsonLd = [
    breadcrumbLD([
      { name: 'Ofertas de hoy', item: DEALS_URL },
      { name: 'Black Friday 2026', item: `${DEALS_URL}/black-friday` },
      { name: l.rubro, item: url },
    ]),
    ...(productos.length > 0 ? [itemListLD(h1, url, productos)] : []),
    // Las mismas preguntas que se ven en la página (Google pide que coincidan).
    faqLD(l.faq),
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
          <ChipEncabezadoBF modo={modo} />
        </div>
      </header>

      {/* Primera pantalla: marca amarillo + negro, Don Ofertín y el cuadro de destacados con sus botones */}
      <section className="bg-yellow-400 text-black" data-seccion={`bf_${l.slug}_hero`}>
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wider">{ETIQUETA_MODO_BF[modo]}</p>
              <h1 className="mt-1 font-display text-[26px] sm:text-4xl font-black leading-[1.05] tracking-tight [text-wrap:balance]">
                {h1}
              </h1>
            </div>
            <Image src="/personaje/pulgar.webp" alt="Don Ofertín, el cazador de ofertas" width={64} height={79} className="shrink-0" priority />
          </div>

          <TerminoBF modo={modo} landing={l.slug} className="mt-3" />

          {principal ? (
            <section aria-label={DESTACADOS_MODO_BF[modo]} data-seccion={`bf_${l.slug}_destacados`} className="mt-3">
              <h2 className="mb-1.5 text-sm font-black uppercase tracking-wide">{DESTACADOS_MODO_BF[modo]}</h2>
              <div className="rounded-2xl bg-black p-3">
                <a href={principal.url} target="_blank" rel="sponsored nofollow noopener" className="flex gap-3">
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
                {/* Botón principal (patrón «oferta destacada»: #FACC15, texto negro, 48 px como mínimo):
                    link de afiliado del recomendado (productosBF descarta los que no lo tienen).
                    En 390 px: texto grande en una sola línea y debajo, chico, qué producto abre. */}
                <a
                  href={principal.url}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  aria-label={`Ver ${principal.nombre} en Mercado Libre`}
                  data-seccion={`bf_${l.slug}_boton`}
                  className={BOTON_HERO}
                >
                  <span className="whitespace-nowrap text-xl font-black leading-tight">Ver en Mercado Libre ↗</span>
                  <span className="mt-0.5 max-w-full truncate text-xs font-semibold text-black/70">{principal.nombre}</span>
                </a>
              </div>
              <LineaConfianza p={principal} claro />
              <OtrosDestacados productos={otrosDestacados} seccion={`bf_${l.slug}`} desde={2} />
            </section>
          ) : (
            <div className="mt-4 rounded-2xl bg-black p-3">
              <a href={l.busqueda} target="_blank" rel="sponsored nofollow noopener" data-seccion={`bf_${l.slug}_boton`} className={BOTON_HERO}>
                <span className="whitespace-nowrap text-xl font-black leading-tight">Ver en Mercado Libre ↗</span>
              </a>
            </div>
          )}
          <p className="mt-2 text-[11px] font-semibold text-black/70 [text-wrap:pretty]">
            Link de afiliado: pagás lo mismo que entrando directo a Mercado Libre. Confirmá el precio ahí antes de comprar.
          </p>

          <RespuestaCorta texto={l.respuestaCorta} actualizado={actualizado} />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Del Black Friday a Navidad (27/11): /regalos-navidad, sin cambiar la URL de la landing */}
        <EnlaceNavidad seccion={`navidad_${l.slug}`} className="mb-6" />
        <p className="text-zinc-300 leading-relaxed [text-wrap:pretty]">{l.intro}</p>

        {resto.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Más opciones</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {resto.map((p, i) => (
                <Tarjeta key={p.id} p={p} slug={l.slug} pos={i + destacados.length + 1} />
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

        <CanalWhatsAppBF placement={`landing_${l.slug}`} className="mt-6" />

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
