// Enlaces internos a las comparativas de verano de ticket alto (lib/verano-ticket-alto.ts).
// Liviano a propósito: solo links internos, sin productos ni datos (sirve en la home, en
// /regalos-navidad, en las calculadoras y en las mismas landings). Server component, sin JS.
// El clic a ML ocurre después, dentro de la landing o de la ficha /precio, con la etiqueta `sitio`.
import Link from 'next/link'
import { LANDINGS_VERANO } from '@/lib/verano-ticket-alto'

export default function EnlacesVerano({
  titulo = 'Para el verano: lo que más conviene mirar',
  seccion,
  slugs,
  excluir,
  className = '',
}: {
  titulo?: string
  /** data-seccion (lo cuenta app/clics-ml.tsx en las vistas de sección) */
  seccion: string
  /** solo estas landings, en este orden (por defecto, las 5) */
  slugs?: string[]
  /** la landing actual, para no enlazarse a sí misma */
  excluir?: string
  className?: string
}) {
  const lista = (slugs ? slugs.map(s => LANDINGS_VERANO.find(l => l.slug === s)).filter(l => l !== undefined) : LANDINGS_VERANO).filter(
    l => l.slug !== excluir,
  )
  if (!lista.length) return null
  return (
    <nav aria-label={titulo} data-seccion={seccion} className={className}>
      <p className="mb-2 font-display text-lg font-black leading-tight text-zinc-100">{titulo}</p>
      <ul className="flex flex-wrap gap-2">
        {lista.map(l => (
          <li key={l.slug}>
            <Link
              href={`/mejores/${l.slug}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-[#FACC15]/50 px-4 text-sm font-bold text-[#FACC15] hover:bg-[#FACC15]/10"
            >
              <span aria-hidden="true">{l.emoji}</span> {l.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
