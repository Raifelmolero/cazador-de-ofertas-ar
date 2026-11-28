// Piezas comunes de las tarjetas de producto. Sin hooks: sirven en servidor y en cliente.
// Van en components/ y no en lib/ porque Tailwind solo busca clases en app/ y components/.

/** Botón a Mercado Libre: amarillo de marca, texto negro, 48 px de alto. Para un <a> o un <span> dentro del link. */
export const BOTON_ML =
  'presionable flex min-h-12 w-full items-center justify-center rounded-xl bg-[#FACC15] px-2 py-2 text-center text-base font-extrabold leading-tight text-black hover:bg-yellow-300 group-hover:bg-yellow-300 group-active:scale-[0.97] motion-reduce:group-active:scale-100'

/**
 * Badge de veracidad (rediseño 27/11). Solo con datos propios:
 * - `minimo`: el bot lo marcó en su precio más bajo registrado (≥ 3 días de historial).
 * - `vsPromedio`: % por debajo de nuestro promedio (lib/lectura-precio, ≥ 5 %).
 * Sin ninguno de los dos, no hay badge: nunca uno «de relleno».
 */
export function BadgeVeracidad({ minimo, vsPromedio, className = '' }: { minimo?: boolean; vsPromedio?: number; className?: string }) {
  if (minimo)
    return (
      <span className={`brillo-minimo inline-flex items-center gap-1 rounded-md bg-emerald-400 px-1.5 py-0.5 text-[13px] font-black leading-tight text-emerald-950 ${className}`}>
        Mínimo histórico
      </span>
    )
  if (vsPromedio)
    return (
      <span className={`inline-flex items-center gap-1 rounded-md bg-sky-300 px-1.5 py-0.5 text-[13px] font-black leading-tight text-sky-950 ${className}`}>
        Buen precio
      </span>
    )
  return null
}

/** «−12 % vs. su promedio»: el único % que muestra la tarjeta (el tachado de ML no se usa). */
export function VsPromedio({ pct }: { pct?: number }) {
  if (!pct) return null
  return (
    <span className="block text-sm font-bold leading-snug text-emerald-300 tabular-nums">
      −{pct}% vs. su promedio
    </span>
  )
}

/** Mini gráfico del precio (SVG inline, sin librerías). Último punto marcado. Decorativo: el dato va en texto. */
export function MiniGrafico({ puntos, className = '' }: { puntos?: number[]; className?: string }) {
  if (!puntos || puntos.length < 3) return null
  const W = 72
  const H = 22
  const lo = Math.min(...puntos)
  const hi = Math.max(...puntos)
  const r = hi - lo || 1
  const x = (i: number) => 2 + (i * (W - 4)) / (puntos.length - 1)
  const y = (v: number) => H - 3 - ((v - lo) * (H - 6)) / r
  const d = puntos.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const ultimo = puntos[puntos.length - 1]
  const baja = ultimo <= puntos[0]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" className={`shrink-0 overflow-visible ${className}`}>
      <polyline points={d} fill="none" stroke={baja ? '#6ee7b7' : '#a1a1aa'} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(puntos.length - 1)} cy={y(ultimo)} r="2.5" fill="#facc15" />
    </svg>
  )
}

/**
 * «últ. verificación dd/mm». Recibe solo `precio_visto`, la fecha en que se leyó el precio en ML.
 * No pasarle `ultimo_visto` del seguimiento: se renueva cada día aunque el precio no se relea.
 */
export function UltVerificacion({ fecha }: { fecha?: string | null }) {
  const m = fecha ? /^\d{4}-(\d{2})-(\d{2})/.exec(fecha) : null
  if (!m) return null
  return (
    <span className="block text-base leading-snug text-zinc-300">
      últ. verificación <span className="whitespace-nowrap">{m[2]}/{m[1]}</span>
    </span>
  )
}
