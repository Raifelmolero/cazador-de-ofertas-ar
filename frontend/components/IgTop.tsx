import Image from 'next/image'
import Link from 'next/link'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'
import type { OfertaLight } from '@/components/OfertaCard'

// Primer pantallazo de /ig (mobile 375x667): las 3 ofertas más fuertes del día
// con botón directo a Mercado Libre + accesos a los rubros que más venden.
// Todo con datos reales de productos_rentables.json; nada inventado.

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

const RUBROS = [
  { href: '/mejores/mejores-celulares', texto: '📱 Celulares' },
  { href: '/mejores/mejores-notebooks', texto: '💻 Notebooks' },
  { href: '/mejores/mejores-smart-tv', texto: '📺 TV' },
  { href: '/categoria/herramientas-electricas', texto: '🔧 Herramientas' },
  { href: '/mejores/mejores-colchones', texto: '🛏️ Colchones' },
  { href: '/categoria/electro-de-cocina', texto: '🍳 Electrodomésticos' },
]

export default function IgTop({ top }: { top: OfertaLight[] }) {
  return (
    <>
      {top.length > 0 && (
        <section aria-label="Las ofertas más fuertes de hoy" data-seccion="ig-top" className="max-w-3xl mx-auto px-4">
          <ul className="space-y-2">
            {top.map((o, i) => (
              <li key={o.id_ml}>
                <a
                  href={o.url_producto}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  data-ticket-alto={o.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
                  className="flex items-stretch gap-3 rounded-2xl border border-yellow-400/40 bg-zinc-900 p-2 active:scale-[0.99] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  <div className="relative w-[72px] h-[72px] shrink-0 rounded-xl bg-white overflow-hidden self-center">
                    {o.url_imagen ? (
                      <Image src={o.url_imagen} alt="" fill priority={i === 0} unoptimized className="object-contain p-1" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-2xl">📦</span>
                    )}
                    {o.descuento_pct != null && (
                      <span className="absolute top-0 left-0 rounded-br-lg bg-red-600 px-1.5 text-[11px] font-extrabold text-white">
                        {o.descuento_pct}% OFF
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="text-[13px] font-medium leading-snug text-zinc-200 line-clamp-2">{o.titulo}</p>
                    <p className="mt-0.5 tabular-nums">
                      <span className="font-display text-lg font-black text-yellow-400">{precio(o.precio_actual)}</span>
                      {o.precio_anterior != null && (
                        <span className="ml-2 text-xs text-zinc-500 line-through">{precio(o.precio_anterior)}</span>
                      )}
                    </p>
                  </div>
                  <span className="self-center shrink-0 rounded-xl bg-yellow-400 px-3 py-2.5 text-sm font-extrabold text-black shadow-[0_2px_0_rgba(0,0,0,0.35)]">
                    Ver en ML ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Rubros que más se compran" className="max-w-3xl mx-auto px-4 pt-3">
        <ul className="grid grid-cols-3 gap-2">
          {RUBROS.map(r => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="flex h-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-1 text-center text-[13px] font-bold leading-tight text-yellow-300 active:scale-[0.98] transition-transform"
              >
                {r.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
