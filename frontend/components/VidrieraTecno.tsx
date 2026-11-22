import Image from 'next/image'
import Link from 'next/link'
import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import type { ItemTecno } from '@/lib/vidrieratecno'

const precio = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Fila de celulares y notebooks de ticket alto (lib/vidrieratecno) con link de
 *  afiliado a ML. El clic lo cuenta clics-ml.tsx con la `seccion` propia y
 *  ticket_alto=si. Server component: no suma JS. En el celular es una fila con
 *  scroll lateral (una tarjeta y pico a la vista) para no empujar el resto. */
export default function VidrieraTecno({
  items,
  titulo,
  bajada,
  seccion,
  id,
  cupon,
  comparadores = true,
  atajos,
  columnas = 'sm:grid-cols-3',
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
  const links = atajos ?? (comparadores ? [
    { href: '/comparador/celulares', texto: '📱 Comparar celulares' },
    { href: '/comparador/notebooks', texto: '💻 Comparar notebooks' },
  ] : [])
  return (
    <section aria-labelledby={id} data-seccion={seccion} className={className}>
      <h2 id={id} className="font-display text-lg sm:text-xl font-black">
        {titulo}
      </h2>
      {bajada && <p className="mt-0.5 text-base text-zinc-400">{bajada}</p>}
      <ul className={`mt-2 -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:px-0 ${columnas}`}>
        {items.map(o => (
          <li key={o.id_ml} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <a
              href={o.url_producto}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-ticket-alto=""
              className="group flex h-full flex-col rounded-2xl border border-yellow-400/30 bg-zinc-900 p-2.5 transition-colors hover:border-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <span className="relative block h-36 overflow-hidden rounded-xl bg-white">
                {o.url_imagen ? (
                  <Image src={miniaturaML(o.url_imagen, 'chica')} alt="" fill unoptimized sizes="(min-width: 640px) 33vw, 72vw" className="object-contain p-1.5" />
                ) : (
                  <span className="flex h-full items-center justify-center text-3xl text-zinc-300">{o.tipo === 'celular' ? '📱' : '💻'}</span>
                )}
              </span>
              <span className="mt-2 line-clamp-2 text-base font-medium leading-snug text-zinc-100">{nombreCorto(o.titulo)}</span>
              <span className="mt-1 font-display text-xl font-black leading-tight tabular-nums text-yellow-400">{precio(o.precio_actual)}</span>
              {cupon && (
                <span className="text-base font-bold tabular-nums text-green-300">
                  Con {cupon.codigo}: {precio(o.precio_actual - cupon.descuento)}
                </span>
              )}
              <UltVerificacion fecha={o.precio_visto} />
              <span className="mt-auto pt-2">
                <span className={BOTON_ML}>Ver en Mercado Libre</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {links.length > 0 && (
        <p className="mt-1 flex flex-wrap gap-x-4 text-base font-bold">
          {links.map(a => (
            <Link key={a.href} href={a.href} className="inline-flex min-h-11 items-center text-yellow-400 hover:text-yellow-300">{a.texto} →</Link>
          ))}
        </p>
      )}
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">
        Nuevos y de marcas conocidas. Links de afiliado: pagás lo mismo que entrando directo a Mercado Libre.
      </p>
    </section>
  )
}
