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
      <p className="text-xs font-bold tracking-widest text-yellow-400 mb-2">👀 {titulo.toUpperCase()}</p>
      {items.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map(it => (
            <li key={it.href}>
              <a
                href={it.href}
                className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-2.5 transition-colors hover:border-yellow-400/50"
              >
                <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  {it.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.img} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium leading-snug text-zinc-200 line-clamp-2">{it.titulo}</span>
                  <span className="mt-0.5 flex flex-wrap items-baseline gap-x-2 tabular-nums">
                    <span className="font-black text-zinc-50">{precio(it.precio)}</span>
                    {it.enMinimo ? (
                      <span className="text-[11px] font-extrabold text-yellow-300">📉 en su mínimo</span>
                    ) : it.enOferta ? (
                      <span className="text-[11px] font-bold text-emerald-400">en oferta hoy</span>
                    ) : null}
                  </span>
                  <span className="text-xs font-bold text-yellow-400">Ver historial y precio →</span>
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
              className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-200 transition-colors hover:border-yellow-400"
            >
              {e.texto}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
