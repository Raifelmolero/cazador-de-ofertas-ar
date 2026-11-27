// Guía «Qué X comprar en Black Friday 2026» (lib/guias-bf-2026.ts), pensada para el
// celular (390 px): arriba la respuesta directa (la que citan Google y las IAs) y el
// recomendado con el botón grande de afiliado; después la tabla, las secciones, las
// preguntas y los links a la landing BF del rubro. Mismo estilo que LandingBF.
// Sin cifras de descuento ni precios tachados.
import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import CtaFijoML from '@/components/CtaFijoML'
import { BOTON_HERO, ChipEncabezadoBF, Foto, LineaConfianza, Precio, RespuestaCorta, Tarjeta, pesos } from '@/components/black-friday/LandingBF'
import TerminoBF from '@/components/black-friday/TerminoBF'
import EnlaceNavidad from '@/components/EnlaceNavidad'
import { ETIQUETA_MODO_BF, modoBF } from '@/lib/cybermonday'
import { excluidoDeCta } from '@/lib/cta-destacados'
import CanalWhatsAppBF from '@/components/black-friday/CanalWhatsAppBF'
import { breadcrumbLD, faqLD, itemListLD } from '@/lib/bf-jsonld'
import { getLandingBF, productosDeItems } from '@/lib/black-friday-landings'
import { fechasGuia, type Guia } from '@/lib/guias'
import { DEALS_URL, MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'

export default function GuiaBFPage({ g }: { g: Guia }) {
  if (!g.bf) return null
  const landing = getLandingBF(g.bf.landing)
  // Título, pregunta y respuesta ya vienen en el modo del día (getGuia de app/guias/[slug]/page.tsx).
  const modo = modoBF()
  // Sin BGH, Likon, HP, OMEN ni Victus (productosDeItems filtra marcas; excluidoDeCta suma ids sueltos).
  const productos = productosDeItems(g.bf.items).filter(p => !excluidoDeCta(p))
  const [principal, ...resto] = productos
  const url = `${DEALS_URL}/guias/${g.slug}`
  const fechas = fechasGuia(g.slug)
  const org = { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL }
  const seccion = `guiabf_${g.slug}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.titulo,
      description: g.seoDescripcion ?? g.descripcion,
      inLanguage: 'es-AR',
      mainEntityOfPage: url,
      datePublished: fechas.publicada,
      dateModified: fechas.modificada,
      author: org,
      publisher: org,
      isPartOf: { '@id': WEBSITE_ID },
    },
    breadcrumbLD([
      { name: 'Ofertas de hoy', item: DEALS_URL },
      { name: 'Black Friday 2026', item: `${DEALS_URL}/black-friday` },
      { name: g.titulo, item: url },
    ]),
    // Las mismas preguntas que se ven en la página: la principal (respuesta corta) y las de abajo.
    faqLD([{ q: g.pregunta, a: g.respuestaCorta }, ...(g.faq ?? [])]),
    // Product + Offer solo con precio visto hace 7 días o menos (productosDeItems); nada de ratings.
    ...(productos.length > 0 ? [itemListLD(g.titulo, url, productos)] : []),
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

      {/* Primera pantalla: la respuesta directa y el botón del recomendado */}
      <section className="bg-yellow-400 text-black" data-seccion={`${seccion}_hero`}>
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-5">
          <p className="text-[11px] font-black uppercase tracking-wider">Guía · {ETIQUETA_MODO_BF[modo]}</p>
          <h1 className="mt-1 font-display text-[26px] sm:text-4xl font-black leading-[1.05] tracking-tight [text-wrap:balance]">{g.titulo}</h1>
          <TerminoBF modo={modo} landing={g.bf.landing} className="mt-3" />

          <RespuestaCorta texto={g.respuestaCorta} actualizado={fechas.modificada} />

          {principal ? (
            <>
              <div className="mt-3 rounded-2xl bg-black p-3">
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
                <a
                  href={principal.url}
                  target="_blank"
                  rel="sponsored nofollow noopener"
                  aria-label={`Ver ${principal.nombre} en Mercado Libre`}
                  data-seccion={`${seccion}_boton`}
                  className={BOTON_HERO}
                >
                  <span className="whitespace-nowrap text-xl font-black leading-tight">Ver en Mercado Libre ↗</span>
                  <span className="mt-0.5 max-w-full truncate text-xs font-semibold text-black/70">{principal.nombre}</span>
                </a>
              </div>
              <LineaConfianza p={principal} claro />
            </>
          ) : (
            landing && (
              <div className="mt-4 rounded-2xl bg-black p-3">
                <a href={landing.busqueda} target="_blank" rel="sponsored nofollow noopener" data-seccion={`${seccion}_boton`} className={BOTON_HERO}>
                  <span className="whitespace-nowrap text-xl font-black leading-tight">Ver en Mercado Libre ↗</span>
                </a>
              </div>
            )
          )}
          <p className="mt-2 text-[11px] font-semibold text-black/70 [text-wrap:pretty]">
            Link de afiliado: pagás lo mismo que entrando directo a Mercado Libre. Confirmá el precio ahí antes de comprar.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-6">
        {/* Del Black Friday a Navidad (27/11): /regalos-navidad */}
        <EnlaceNavidad seccion={`navidad_${seccion}`} className="mb-6" />
        {resto.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Otras que elegimos</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {resto.map((p, i) => (
                <Tarjeta key={p.id} p={p} slug={`guia_${g.slug}`} pos={i + 2} />
              ))}
            </ul>
          </section>
        )}

        {g.tabla && (
          <section className="mb-8" aria-label={g.tabla.titulo}>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{g.tabla.titulo}</h2>
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-zinc-900 text-zinc-200">
                  <tr>
                    {g.tabla.columnas.map(c => (
                      <th key={c} scope="col" className="px-3 py-2 font-bold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  {g.tabla.filas.map(f => (
                    <tr key={f[0]} className="border-t border-zinc-800">
                      {f.map((v, j) =>
                        j === 0 ? (
                          <th key={j} scope="row" className="px-3 py-2 font-semibold text-zinc-200">
                            {v}
                          </th>
                        ) : (
                          <td key={j} className="px-3 py-2">
                            {v}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {g.secciones.map(s => (
          <section key={s.h} className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{s.h}</h2>
            <div className="space-y-3 text-zinc-400 leading-relaxed">
              {s.p.map(t => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
        ))}

        {g.cta && (
          <Link
            href={g.cta.href}
            data-seccion={`${seccion}_landing`}
            className="mb-8 flex min-h-[52px] items-center justify-center rounded-2xl bg-yellow-400 px-4 text-center font-black text-black hover:bg-yellow-300"
          >
            {g.cta.boton} →
          </Link>
        )}

        <CanalWhatsAppBF placement={`guia_${g.slug}`} className="mb-8" />

        {g.faq && g.faq.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Preguntas frecuentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-100 mb-1">{g.pregunta}</h3>
                <p className="text-zinc-400 leading-relaxed">{g.respuestaCorta}</p>
              </div>
              {g.faq.map(f => (
                <div key={f.q}>
                  <h3 className="font-bold text-zinc-100 mb-1">{f.q}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {g.enlaces && g.enlaces.length > 0 && (
          <nav aria-label="Más Black Friday" className="mb-8" data-seccion={`${seccion}_enlaces`}>
            <h2 className="font-display text-lg font-black mb-3">Más Black Friday 2026</h2>
            <ul className="flex flex-wrap gap-2">
              {g.enlaces.map(e => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-yellow-400/60 px-4 text-sm font-bold text-yellow-300 hover:border-yellow-400"
                  >
                    {e.texto} →
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <p className="text-xs text-zinc-500 leading-relaxed [text-wrap:pretty]">
          Elegimos estos productos revisando publicaciones de Mercado Libre Argentina; no los probamos. Los links son de
          afiliado: si comprás, podemos recibir una comisión y para vos el precio es el mismo. Precio, stock y cuotas pueden
          cambiar sin aviso.
        </p>
      </article>

      <Footer brand="ofertas" sinCupones />

      {principal && (
        <CtaFijoML
          titulo={principal.nombre}
          precio={principal.precio !== null ? pesos(principal.precio) : 'Ver precio'}
          url={principal.url}
          seccion={`${seccion}_fijo`}
        />
      )}
    </main>
  )
}
