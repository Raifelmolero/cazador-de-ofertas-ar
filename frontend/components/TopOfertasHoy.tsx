import Image from 'next/image'
import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import type { OfertaLight } from '@/components/OfertaCard'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'
import { elegirTop } from '@/lib/top3'

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
  n = 3,
  tal_cual = false,
}: {
  ofertas: OfertaLight[]
  n?: number
  /** la lista ya viene elegida y ordenada (mezcla de categorías): no reordenar por descuento */
  tal_cual?: boolean
  titulo?: string
  seccion?: string
  id?: string
}) {
  const top = tal_cual ? ofertas.slice(0, n) : elegirTop(ofertas, n)
  if (top.length === 0) return null
  return (
    <section aria-labelledby={id} data-seccion={seccion} className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <h2 id={id} className="font-display text-lg sm:text-xl font-black mb-2">
        {titulo}
      </h2>
      <ul className="grid gap-2.5 md:grid-cols-3">
        {top.map(o => (
          <li key={o.id_ml} className="min-w-0">
            <a
              href={o.url_producto}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-ticket-alto={o.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
              className="group flex h-full flex-col gap-2.5 rounded-2xl border border-yellow-400/30 bg-zinc-900 p-2.5 transition-colors hover:border-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <span className="flex gap-3">
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                  {o.url_imagen ? (
                    <Image src={miniaturaML(o.url_imagen, 'chica')} alt="" fill unoptimized sizes="96px" className="object-contain p-1.5" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-3xl text-zinc-300">📦</span>
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="line-clamp-2 text-base font-medium leading-snug text-zinc-100">{nombreCorto(o.titulo)}</span>
                  <span className="mt-1 font-display text-xl font-black leading-tight tabular-nums text-yellow-400">{precio(o.precio_actual)}</span>
                  <UltVerificacion fecha={o.precio_visto} />
                </span>
              </span>
              <span className={`${BOTON_ML} mt-auto`}>Ver en Mercado Libre</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        El precio puede cambiar. Links de afiliado: pagás lo mismo que entrando directo a Mercado Libre.
      </p>
    </section>
  )
}
