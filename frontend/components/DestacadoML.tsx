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
  /** slug de /precio/[slug] si el producto tiene historial propio */
  historial?: string
}

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

/** Elige el destacado de una lista ya ordenada: dentro de los primeros 8, el que
 *  está en su mínimo histórico (dato real del seguimiento); si no hay, el primero. */
export function elegirDestacado<T extends ProductoCTA>(lista: T[]): T | undefined {
  return lista.slice(0, 8).find(p => p.minimo_historico) ?? lista[0]
}

/** Motivos que se muestran: solo datos que existen en el producto. */
function motivos(p: ProductoCTA, lista: ProductoCTA[]) {
  const m: string[] = []
  if (p.minimo_historico) m.push('📉 En su precio más bajo registrado')
  if (p.descuento_pct != null) m.push(`${p.descuento_pct}% OFF`)
  if (p.relampago) m.push('⚡ Oferta relámpago: dura pocas horas')
  // "Más barato" solo es honesto si compara al menos 3 productos de la misma lista
  const precios = lista.map(x => x.precio_actual).filter(n => n > 0)
  if (precios.length >= 3 && p.precio_actual === Math.min(...precios)) m.push('💲 El más barato de la lista')
  if (p.historial) m.push('📈 Con historial de precio propio')
  return m
}

/**
 * Producto destacado arriba del fold: foto, precio, motivos reales y un botón
 * grande. Server component: no suma JS al cliente. El clic lo cuentan
 * clarity.tsx (click_ml) y clics-ml.tsx (clic_ml, seccion="destacado").
 */
export default function DestacadoML({
  producto: p,
  lista,
  rotulo = 'Nuestra elección de hoy',
}: {
  producto: ProductoCTA
  lista: ProductoCTA[]
  rotulo?: string
}) {
  const razones = motivos(p, lista).slice(0, 4)
  return (
    <section
      aria-label={rotulo}
      data-seccion="destacado"
      data-ticket-alto={p.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
      className="mb-8 rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-4"
    >
      <p className="text-[11px] font-extrabold uppercase tracking-wide text-yellow-400 mb-3">🏆 {rotulo}</p>
      <div className="flex gap-4">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl bg-white overflow-hidden">
          {p.url_imagen && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.url_imagen} alt="" loading="eager" className="w-full h-full object-contain p-1.5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base text-zinc-100 font-semibold line-clamp-3">{p.titulo}</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-2xl sm:text-3xl font-black text-zinc-50">{precio(p.precio_actual)}</span>
            {p.precio_anterior != null && p.precio_anterior > p.precio_actual && (
              <span className="text-xs text-zinc-500 line-through">{precio(p.precio_anterior)}</span>
            )}
          </p>
        </div>
      </div>
      {razones.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {razones.map(r => (
            <li key={r} className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[11px] font-bold text-zinc-200">
              {r}
            </li>
          ))}
        </ul>
      )}
      <a
        href={p.url_producto}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="mt-4 block w-full rounded-xl bg-yellow-400 hover:bg-yellow-300 px-4 py-3.5 text-center text-base font-black text-black active:scale-[0.98] transition"
      >
        Ver precio en Mercado Libre ↗
      </a>
      <p className="mt-2 text-[11px] text-zinc-500 text-center">
        El precio para vos es el mismo: el link es de afiliado. Elegido por datos de hoy, no probamos los productos.
      </p>
    </section>
  )
}
