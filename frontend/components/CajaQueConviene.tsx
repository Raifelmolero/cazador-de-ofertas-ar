import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import type { ItemConviene } from '@/lib/queconviene'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

// Caja chica de 1-3 productos con precio y botón a ML para la primera
// pantalla (home y guías que entran de Google). Componente de servidor: sin JS,
// sin fetch; la imagen es la miniatura del CDN de ML, sin optimizador.
// El link es el url_producto del catálogo, igual que en las demás fichas: el
// clic lo reetiqueta a `sitio` y lo cuenta clics-ml.tsx (data-seccion).

const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

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
    <section aria-label={titulo} data-seccion={seccion} className={`rounded-2xl border border-yellow-400/40 bg-zinc-900 p-2.5 sm:p-4 ${className}`}>
      <p className="mb-2 text-base font-bold leading-tight text-yellow-400">{titulo}</p>
      <ul className={`grid gap-2.5 ${items.length > 1 ? 'sm:grid-cols-3' : ''}`}>
        {items.map((it, i) => (
          <li key={it.id} data-ticket-alto={it.precio >= TICKET_ALTO_DESDE ? '' : undefined} className="flex min-w-0 flex-col gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
            <span className="flex gap-3 sm:flex-col">
              <span className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-white sm:w-full">
                {it.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={miniaturaML(it.img, 'chica')}
                    alt=""
                    width={96}
                    height={96}
                    sizes="96px"
                    // Solo la primera está seguro en la primera pantalla
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    className="h-full w-full object-contain p-1"
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="line-clamp-2 text-base leading-snug text-zinc-100">{nombreCorto(it.titulo)}</span>
                <span className="mt-1 font-display text-xl font-black leading-tight tabular-nums text-yellow-400">{pesos(it.precio)}</span>
                <UltVerificacion fecha={it.visto} />
              </span>
            </span>
            <a href={it.url} target="_blank" rel="sponsored nofollow noopener" className={`${BOTON_ML} mt-auto`}>
              Ver en Mercado Libre
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">El precio puede cambiar. Link de afiliado: pagás lo mismo.</p>
    </section>
  )
}
