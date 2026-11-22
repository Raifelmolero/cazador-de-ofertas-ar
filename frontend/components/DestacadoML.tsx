import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

/** Subconjunto mínimo del producto que necesitan el destacado y el CTA fijo. */
export interface ProductoCTA {
  id_ml: string
  titulo: string
  precio_actual: number
  precio_anterior?: number
  descuento_pct?: number
  minimo_historico?: boolean
  relampago?: boolean
  url_producto: string
  url_imagen: string | null
  precio_visto?: string
  /** slug de /precio/[slug] si el producto tiene historial propio */
  historial?: string
}

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

/** Elige el destacado de una lista ya ordenada: dentro de los primeros 8, el que
 *  está en su mínimo histórico (dato real del seguimiento); si no hay, el primero. */
export function elegirDestacado<T extends ProductoCTA>(lista: T[]): T | undefined {
  return lista.slice(0, 8).find(p => p.minimo_historico) ?? lista[0]
}

/**
 * Producto destacado arriba del fold: foto, nombre corto, precio, fecha y un botón
 * grande. Server component: no suma JS al cliente. El clic lo cuentan
 * clarity.tsx (click_ml) y clics-ml.tsx (clic_ml, seccion="destacado").
 */
export default function DestacadoML({
  producto: p,
  rotulo = 'Nuestra elección de hoy',
}: {
  producto: ProductoCTA
  lista: ProductoCTA[]
  rotulo?: string
}) {
  return (
    <section
      aria-label={rotulo}
      data-seccion="destacado"
      data-ticket-alto={p.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
      className="mb-6 rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-3 sm:p-4"
    >
      <p className="mb-2 text-base font-extrabold leading-tight text-yellow-400">{rotulo}</p>
      <div className="flex gap-3 sm:gap-4">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white sm:h-36 sm:w-36">
          {p.url_imagen && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={miniaturaML(p.url_imagen, 'chica')} alt="" width={144} height={144} sizes="(min-width: 640px) 144px, 96px" loading="eager" fetchPriority="high" className="h-full w-full object-contain p-1.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-base font-semibold leading-snug text-zinc-100">{nombreCorto(p.titulo)}</p>
          <p className="mt-1 font-display text-2xl font-black leading-tight tabular-nums text-yellow-400 sm:text-3xl">{precio(p.precio_actual)}</p>
          <UltVerificacion fecha={p.precio_visto} />
        </div>
      </div>
      <a href={p.url_producto} target="_blank" rel="sponsored nofollow noopener" className={`${BOTON_ML} mt-3`}>
        Ver en Mercado Libre
      </a>
      <p className="mt-2 text-center text-sm text-zinc-400">Link de afiliado: pagás lo mismo. No probamos los productos.</p>
    </section>
  )
}
