// Piezas comunes de las tarjetas de producto. Sin hooks: sirven en servidor y en cliente.
// Van en components/ y no en lib/ porque Tailwind solo busca clases en app/ y components/.

/** Botón a Mercado Libre: amarillo de marca, texto negro, 48 px de alto. Para un <a> o un <span> dentro del link. */
export const BOTON_ML =
  'flex min-h-12 w-full items-center justify-center rounded-xl bg-[#FACC15] px-2 py-2 text-center text-base font-extrabold leading-tight text-black transition-colors hover:bg-yellow-300 group-hover:bg-yellow-300'

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
