// Bloque «oferta destacada» para la primera pantalla de las páginas que entran de
// Google y casi no mandan clics a ML (lib/cta-destacados.ts). Componente de servidor,
// sin JS propio. Mobile-first: botón de 48 px, amarillo de marca (#FACC15) con texto
// negro (BOTON_ML). Fotos chicas del CDN de ML sin optimizador (ver CLAUDE.md).
// Sin cifras de descuento ni tachados: precio solo si se vio
// hace 7 días o menos, con la fecha en que se vio.
// El clic lo mide app/clics-ml.tsx: `clic_ml` con data-seccion y, por data-evento, el
// evento propio de cada página.
import { miniaturaML } from '@/lib/imagenml'
import type { CtaDestacado } from '@/lib/cta-destacados'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

export default function CtaOfertaDestacada({ cta, className = '' }: { cta: CtaDestacado | null; className?: string }) {
  if (!cta || cta.productos.length === 0) return null
  return (
    <section
      aria-label={cta.titulo}
      data-seccion={cta.seccion}
      data-cta-destacado=""
      className={`rounded-2xl border border-[#FACC15]/50 bg-zinc-900 p-2.5 sm:p-4 ${className}`}
    >
      <h2 className="mb-2 font-display text-lg font-black leading-tight text-[#FACC15] [text-wrap:balance]">{cta.titulo}</h2>
      <ul className={`grid gap-2.5 ${cta.productos.length > 1 ? 'sm:grid-cols-3' : ''}`}>
        {cta.productos.map((p, i) => (
          <li key={p.id} className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
            <span className="flex gap-3 sm:flex-col">
              <span className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white sm:h-24 sm:w-full">
                {p.img && (
                  // eslint-disable-next-line @next/next/no-img-element -- fotos del CDN de ML, sin optimizador (ver CLAUDE.md)
                  <img
                    src={miniaturaML(p.img, 'chica')}
                    alt={p.nombre}
                    width={96}
                    height={96}
                    sizes="96px"
                    // Solo la primera está seguro en la primera pantalla
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    decoding="async"
                    className="h-full w-full object-contain p-1"
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-base font-bold leading-snug text-zinc-100">{p.nombre}</span>
                <span className="text-sm leading-snug text-zinc-400">{p.detalle}</span>
                {p.precio !== null && (
                  <>
                    <span className="mt-1 font-display text-xl font-black leading-tight tabular-nums text-[#FACC15]">{pesos(p.precio)}</span>
                    <UltVerificacion fecha={p.visto} />
                  </>
                )}
              </span>
            </span>
            {cta.destinoInterno ? (
              // Cuadro de las calculadoras: página interna del sitio de ofertas, sin link de afiliado
              // a ML (la etiqueta calcml no convertía: 0 ventas). El clic de compra lo hace el sitio.
              <a href={cta.destinoInterno(p)} data-evento={cta.evento} data-mla={p.id} className={`${BOTON_ML} mt-auto`}>
                Ver ofertas →
              </a>
            ) : (
              <a
                href={p.url}
                target="_blank"
                rel="sponsored nofollow noopener"
                data-evento={cta.evento}
                data-mla={p.id}
                className={`${BOTON_ML} mt-auto`}
              >
                Ver en Mercado Libre
              </a>
            )}
          </li>
        ))}
      </ul>
      <a href={cta.verMas.href} className="mt-2 flex min-h-12 items-center justify-center rounded-xl border-2 border-[#FACC15] px-4 text-center font-black text-[#FACC15] hover:bg-[#FACC15]/10">
        {cta.verMas.texto} →
      </a>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {cta.destinoInterno
          ? 'El precio puede cambiar: confirmalo en la publicación.'
          : 'El precio puede cambiar: confirmalo en la publicación. Link de afiliado: pagás lo mismo.'}
      </p>
    </section>
  )
}
