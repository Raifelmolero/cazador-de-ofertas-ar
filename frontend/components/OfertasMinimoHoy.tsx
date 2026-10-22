import { getOfertas } from '@/lib/productos'

/**
 * Fila de ofertas del día en su precio más bajo registrado, con link de
 * afiliado. Para páginas que no muestran productos propios (estudio,
 * datos, índices). Server component: no suma JS al cliente.
 */
export default function OfertasMinimoHoy({
  titulo = '🔥 HOY EN SU PRECIO MÁS BAJO',
  cantidad = 8,
}: {
  titulo?: string
  cantidad?: number
}) {
  const ofertas = getOfertas().filter(p => p.minimo_historico).slice(0, cantidad)
  if (ofertas.length === 0) return null
  return (
    <section className="mx-auto max-w-5xl px-4 my-10" aria-label="Ofertas de hoy">
      <p className="text-xs font-bold tracking-widest text-yellow-400 mb-1">{titulo}</p>
      <p className="text-xs text-zinc-500 mb-3">
        Ofertas reales: hoy están en el precio más bajo que registramos. Links de afiliado de Mercado Libre: no cambian tu precio.
      </p>
      <ul className="flex gap-3 overflow-x-auto pb-1 snap-x">
        {ofertas.map(p => (
          <li key={p.id_ml} className="snap-start shrink-0 w-40 rounded-2xl border border-zinc-800 bg-zinc-900 p-2">
            <a href={p.url_producto} rel="sponsored nofollow noopener" target="_blank" className="block">
              <div className="h-28 rounded-xl bg-white overflow-hidden">
                {p.url_imagen && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.url_imagen} alt="" loading="lazy" className="w-full h-full object-contain p-1" />
                )}
              </div>
              <p className="mt-2 text-xs text-zinc-300 line-clamp-2">{p.titulo}</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="font-black text-zinc-50">${p.precio_actual.toLocaleString('es-AR')}</span>
                {p.descuento_pct != null && <span className="text-[11px] font-bold text-red-400">-{p.descuento_pct}%</span>}
              </p>
              <span className="mt-2 block rounded-lg bg-yellow-400 py-1.5 text-center text-xs font-black text-black">Ver en ML ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
