import Image from 'next/image'
import Link from 'next/link'
import { miniaturaML } from '@/lib/imagenml'
import type { ItemTecno } from '@/lib/vidrieratecno'

const precio = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Fila de celulares y notebooks de ticket alto (lib/vidrieratecno) con link de
 *  afiliado a ML. El clic lo cuenta clics-ml.tsx con la `seccion` propia y
 *  ticket_alto=si. Server component: no suma JS. En el celular es una fila con
 *  scroll lateral (2 tarjetas y media a la vista) para no empujar el resto. */
export default function VidrieraTecno({
  items,
  titulo,
  bajada,
  seccion,
  id,
  cupon,
  comparadores = true,
  atajos,
  columnas = 'sm:grid-cols-3 lg:grid-cols-6',
  className = 'max-w-7xl mx-auto px-4 sm:px-6 pt-4',
}: {
  items: ItemTecno[]
  titulo: string
  bajada?: string
  seccion: string
  id: string
  /** cupón vigente: muestra el precio con el descuento aplicado */
  cupon?: { codigo: string; descuento: number }
  comparadores?: boolean
  /** links propios debajo de la fila (reemplazan a los de los comparadores) */
  atajos?: { href: string; texto: string }[]
  /** columnas de la grilla desde sm (en el celular siempre es fila con scroll) */
  columnas?: string
  className?: string
}) {
  if (items.length < 2) return null
  return (
    <section aria-labelledby={id} data-seccion={seccion} className={className}>
      <h2 id={id} className="font-display text-base sm:text-xl font-black">
        {titulo}
      </h2>
      {bajada && <p className="mt-0.5 text-xs text-zinc-400">{bajada}</p>}
      <ul className={`mt-2 -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:px-0 ${columnas}`}>
        {items.map(o => (
          <li key={o.id_ml} className="w-[40%] shrink-0 snap-start sm:w-auto">
            <a
              href={o.url_producto}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-ticket-alto=""
              className="group flex h-full flex-col rounded-2xl border border-sky-400/30 bg-zinc-900 p-2 transition-colors hover:border-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <span className="relative block aspect-square overflow-hidden rounded-xl bg-white">
                {o.url_imagen ? (
                  <Image src={miniaturaML(o.url_imagen, 'chica')} alt="" fill unoptimized sizes="(min-width: 1024px) 180px, 40vw" className="object-contain p-1.5" />
                ) : (
                  <span className="flex h-full items-center justify-center text-3xl text-zinc-300">{o.tipo === 'celular' ? '📱' : '💻'}</span>
                )}
                {o.descuento_pct != null && (
                  <span className="absolute left-1 top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[11px] font-extrabold text-white">
                    {o.descuento_pct}% OFF
                  </span>
                )}
              </span>
              <span className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-zinc-100">{o.titulo}</span>
              <span className="mt-1 font-display text-base font-black leading-tight tabular-nums text-yellow-400">{precio(o.precio_actual)}</span>
              {cupon && (
                <span className="text-[11px] font-bold tabular-nums text-green-300">
                  Con {cupon.codigo}: {precio(o.precio_actual - cupon.descuento)}
                </span>
              )}
              {o.minimo_historico ? (
                <span className="text-[11px] font-extrabold leading-tight text-yellow-300">📉 El más bajo que registramos</span>
              ) : o.precio_anterior != null && o.precio_anterior > o.precio_actual ? (
                <span className="text-[11px] font-semibold text-green-400">Ahorrás {precio(o.precio_anterior - o.precio_actual)}</span>
              ) : null}
              <span className="mt-auto pt-1.5 text-xs font-extrabold text-sky-300 group-hover:text-sky-200">Ver en Mercado Libre ↗</span>
            </a>
          </li>
        ))}
      </ul>
      {atajos ? (
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold">
          {atajos.map(a => (
            <Link key={a.href} href={a.href} className="text-sky-300 hover:text-sky-200">{a.texto} →</Link>
          ))}
        </p>
      ) : comparadores && (
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold">
          <Link href="/comparador/celulares" className="text-sky-300 hover:text-sky-200">📱 Comparar celulares →</Link>
          <Link href="/comparador/notebooks" className="text-sky-300 hover:text-sky-200">💻 Comparar notebooks →</Link>
        </p>
      )}
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
        Nuevos, de marcas conocidas, con el descuento verificado contra nuestro historial de precios. Links de afiliado: pagás lo mismo que entrando directo a Mercado Libre.
      </p>
    </section>
  )
}
