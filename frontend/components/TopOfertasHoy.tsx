import Image from 'next/image'
import { miniaturaML } from '@/lib/imagenml'
import type { OfertaLight } from '@/components/OfertaCard'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

const precio = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Las 3 primeras ofertas de hoy (mismo orden que la grilla) justo debajo del
 *  hero: en celular antes la primera tarjeta con botón aparecía recién después
 *  de 4 filas de atajos. Una fila = un solo link a Mercado Libre (el mismo
 *  url_producto con etiqueta de afiliado que usa la grilla; el clic lo cuenta
 *  clics-ml.tsx con seccion="top3_home"). Datos reales, sin textos inventados. */
export default function TopOfertasHoy({
  ofertas,
  titulo = '🎯 3 ofertas destacadas de hoy',
  seccion = 'top3_home',
  id = 'top3-hoy',
}: {
  ofertas: OfertaLight[]
  titulo?: string
  seccion?: string
  id?: string
}) {
  const top = ofertas.slice(0, 3)
  if (top.length === 0) return null
  return (
    <section aria-labelledby={id} data-seccion={seccion} className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <h2 id={id} className="font-display text-base sm:text-xl font-black mb-2">
        {titulo}
      </h2>
      <ul className="grid gap-2.5 md:grid-cols-3">
        {top.map((o, i) => {
          const ahorro = o.precio_anterior != null ? o.precio_anterior - o.precio_actual : 0
          return (
            <li key={o.id_ml}>
              <a
                href={o.url_producto}
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-ticket-alto={o.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
                className="group flex h-full items-stretch gap-3 rounded-2xl border border-yellow-400/30 bg-zinc-900 p-2.5 transition-colors hover:border-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                  {o.url_imagen ? (
                    <Image src={miniaturaML(o.url_imagen, 'chica')} alt="" fill unoptimized priority={i === 0} sizes="96px" className="object-contain p-1.5" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-3xl text-zinc-300">📦</span>
                  )}
                  {o.descuento_pct != null && (
                    <span className="absolute left-1 top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[11px] font-extrabold text-white">
                      {o.descuento_pct}% OFF
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="line-clamp-2 text-[13px] font-medium leading-snug text-zinc-100">{o.titulo}</span>
                  <span className="mt-1 flex flex-wrap items-baseline gap-x-2 tabular-nums">
                    <span className="font-display text-lg font-black leading-tight text-yellow-400">{precio(o.precio_actual)}</span>
                    {o.precio_anterior != null && (
                      <span className="text-xs text-zinc-500 line-through">{precio(o.precio_anterior)}</span>
                    )}
                  </span>
                  {o.minimo_historico ? (
                    <span className="text-[11px] font-extrabold text-yellow-300">📉 Precio más bajo que registramos</span>
                  ) : ahorro > 0 ? (
                    <span className="text-[11px] font-semibold text-green-400">Ahorrás {precio(ahorro)}</span>
                  ) : null}
                  <span className="mt-auto pt-1.5 text-sm font-extrabold text-yellow-400 group-hover:text-yellow-300">
                    Ver en Mercado Libre ↗
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        Descuentos verificados contra el historial de precios. Los links son de afiliado: pagás lo mismo que entrando directo a Mercado Libre.
      </p>
    </section>
  )
}
