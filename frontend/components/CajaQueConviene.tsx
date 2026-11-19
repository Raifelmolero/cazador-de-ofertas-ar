import { miniaturaML } from '@/lib/imagenml'
import type { ItemConviene } from '@/lib/queconviene'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

// Caja chica de 1-3 productos con precio y botón «Ver en ML» para la primera
// pantalla (home y guías que entran de Google). Componente de servidor: sin JS,
// sin fetch; la imagen es la miniatura del CDN de ML, sin optimizador.
// El link es el url_producto del catálogo, igual que en las demás fichas: el
// clic lo reetiqueta a `sitio` y lo cuenta clics-ml.tsx (data-seccion).

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Título corto: lo que va antes del primer « - » o « | », cortado en palabra. */
function tituloCorto(t: string, max = 60): string {
  const base = t.split(/\s[-|–]\s/)[0].trim()
  if (base.length <= max) return base
  const cortado = base.slice(0, max)
  return `${cortado.slice(0, cortado.lastIndexOf(' ') > 30 ? cortado.lastIndexOf(' ') : max)}…`
}

export default function CajaQueConviene({
  items,
  titulo = 'La que conviene hoy',
  seccion,
  className = '',
}: {
  items: ItemConviene[]
  titulo?: string
  /** data-seccion para el evento clic_ml */
  seccion: string
  className?: string
}) {
  if (items.length === 0) return null
  return (
    <section aria-label={titulo} data-seccion={seccion} className={`rounded-2xl border border-yellow-400/40 bg-zinc-900 p-3 sm:p-4 ${className}`}>
      <p className="mb-2 text-xs font-bold tracking-widest text-yellow-400 uppercase">✅ {titulo}</p>
      <ul className={`grid gap-2 ${items.length > 1 ? 'sm:grid-cols-3' : ''}`}>
        {items.map(it => (
          <li key={it.id} data-ticket-alto={it.precio >= TICKET_ALTO_DESDE ? '' : undefined} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-2 sm:flex-col sm:items-stretch">
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white sm:h-24 sm:w-full">
              {it.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={miniaturaML(it.img, 'chica')} alt="" width={96} height={96} className="h-full w-full object-contain p-1" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              {it.rubro && <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{it.rubro}</span>}
              <span className="line-clamp-2 text-[13px] leading-snug text-zinc-200">{tituloCorto(it.titulo)}</span>
              <span className="mt-0.5 flex items-baseline gap-1.5 tabular-nums">
                <span className="font-display text-base font-black text-yellow-400">{pesos(it.precio)}</span>
                {it.descuento != null && it.descuento > 0 && <span className="text-[11px] font-bold text-red-400">-{it.descuento}%</span>}
              </span>
              {it.minimo_historico && <span className="text-[11px] font-semibold text-yellow-300">📉 Precio más bajo que registramos</span>}
            </span>
            <a
              href={it.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="shrink-0 rounded-lg bg-yellow-400 px-3 py-2 text-center text-xs font-black text-black transition-colors hover:bg-yellow-300 sm:mt-auto"
            >
              Ver en ML ↗
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
        Precio visto en Mercado Libre en los últimos días y verificado contra el historial. Link de afiliado: pagás lo mismo.
      </p>
    </section>
  )
}
