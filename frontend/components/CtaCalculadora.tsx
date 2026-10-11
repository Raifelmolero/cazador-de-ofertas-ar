// Caja de acción contextual: va justo debajo del resultado de una calculadora o
// dentro de una guía. Un botón principal a Mercado Libre (link de afiliado, con
// rel sponsored) y enlaces internos a la comparativa / landing relacionada.
// El clic a ML lo mide Clarity solo (listener global en app/clarity.tsx).

export interface EnlaceCta {
  href: string
  texto: string
}

export default function CtaCalculadora({
  titulo,
  texto,
  ml,
  internos = [],
  nota,
  className = '',
}: {
  titulo: string
  texto?: string
  /** Botón principal: link de afiliado de ML (busquedaML / url de producto). */
  ml: EnlaceCta
  /** Comparativas, landings o guías del sitio. */
  internos?: EnlaceCta[]
  nota?: string
  className?: string
}) {
  return (
    <aside className={`rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-4 sm:p-5 ${className}`}>
      <p className="font-display text-lg font-black text-zinc-50 [text-wrap:balance]">{titulo}</p>
      {texto && <p className="mt-1 text-sm text-zinc-400 [text-wrap:pretty]">{texto}</p>}
      <a
        href={ml.href}
        target="_blank"
        rel="sponsored nofollow noopener"
        className="mt-3 flex items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 text-center font-black text-black hover:bg-yellow-300 transition-colors"
      >
        {ml.texto} ↗
      </a>
      {internos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {internos.map(e => (
            <li key={e.href}>
              <a
                href={e.href}
                className="block rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:border-yellow-400"
              >
                {e.texto} →
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-zinc-500">
        {nota ?? 'Link de afiliado de Mercado Libre: si comprás, ganamos una comisión y el precio para vos es el mismo.'}
      </p>
    </aside>
  )
}
