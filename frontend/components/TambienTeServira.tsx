import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import type { EnlaceExtra, ItemRelacionado } from '@/lib/relacionados'

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

/**
 * "También te puede servir": 3-4 fichas internas (/precio/...) de la misma
 * categoría y ticket parecido, en oferta hoy primero, más atajos a la
 * comparativa o al precio de hoy. Server component, sin JS en el cliente.
 */
export default function TambienTeServira({
  items,
  extras = [],
  seccion = 'tambien_te_servira',
  titulo = 'También te puede servir',
}: {
  items: ItemRelacionado[]
  extras?: EnlaceExtra[]
  seccion?: string
  titulo?: string
}) {
  if (items.length === 0 && extras.length === 0) return null
  return (
    <section aria-label={titulo} data-seccion={seccion} className="mb-8">
      <p className="mb-2 text-base font-bold text-yellow-400">{titulo}</p>
      {items.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map(it => (
            <li key={it.href} className="min-w-0">
              <a
                href={it.href}
                className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-2.5 transition-colors hover:border-yellow-400/50"
              >
                <span className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                  {it.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={miniaturaML(it.img, 'chica')} alt="" width={80} height={80} sizes="80px" loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-base font-medium leading-snug text-zinc-200">{nombreCorto(it.titulo)}</span>
                  <span className="mt-0.5 block text-lg font-black tabular-nums text-zinc-50">{precio(it.precio)}</span>
                  <span className="block text-base font-bold text-yellow-400">Ver historial →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {extras.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {extras.map(e => (
            <a
              key={e.href}
              href={e.href}
              className="inline-flex min-h-11 items-center rounded-full border border-zinc-700 px-4 py-2 text-base font-bold text-zinc-200 transition-colors hover:border-yellow-400"
            >
              {e.texto}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
