import Image from 'next/image'
import { miniaturaML } from '@/lib/imagenml'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'
import { topConcurso } from '@/lib/topconcurso'

const precio = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
const diaMes = (iso: string) => iso.slice(5).split('-').reverse().join('/')

/** Top del concurso en /hoy y /black-friday: precio y fecha de lectura. El % sale solo si es real. */
export default function TopConcurso({ seccion, id }: { seccion: string; id: string }) {
  const top = topConcurso()
  if (top.length === 0) return null
  return (
    <section aria-labelledby={id} data-seccion={seccion} className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <h2 id={id} className="font-display text-lg sm:text-xl font-black mb-2">
        🏆 Top del finde
      </h2>
      <ul className="grid gap-2.5 md:grid-cols-3">
        {top.map((o, i) => (
          <li key={o.id_ml}>
            <a
              href={o.url_producto}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-ticket-alto={o.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
              className="group flex h-full flex-col gap-2.5 rounded-2xl border border-[#FACC15]/30 bg-zinc-900 p-2.5 hover:border-[#FACC15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]"
            >
              <span className="flex gap-3">
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                  {o.url_imagen && (
                    <Image src={miniaturaML(o.url_imagen, 'chica')} alt="" fill unoptimized priority={i === 0} sizes="96px" className="object-contain p-1.5" />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="line-clamp-2 text-base font-medium leading-snug text-zinc-100">{o.titulo}</span>
                  <span className="mt-1 flex flex-wrap items-baseline gap-x-2 tabular-nums">
                    <span className="font-display text-xl font-black text-[#FACC15]">{precio(o.precio_actual)}</span>
                    {o.descuento_pct != null && <span className="text-base font-bold text-green-400">{o.descuento_pct}% real</span>}
                  </span>
                  {o.precio_visto && <span className="text-base text-zinc-300">verificado {diaMes(o.precio_visto)}</span>}
                </span>
              </span>
              <span className="mt-auto flex min-h-12 items-center justify-center rounded-xl bg-[#FACC15] px-4 text-center text-base font-extrabold text-black group-hover:brightness-110">
                Ver en Mercado Libre
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        El precio puede cambiar. Los links son de afiliado: pagás lo mismo que entrando directo a Mercado Libre.
      </p>
    </section>
  )
}
