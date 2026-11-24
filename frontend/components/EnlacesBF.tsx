// Bloque compacto de enlaces internos a /black-friday y a las landings /mejores/black-friday-*
// (lib/bf-enlaces.ts, ENLACES_BF_POR_RUTA): una sola fila con scroll horizontal en el celular,
// así no empuja el contenido ni rompe el ancho de la página. Sin precios, porcentajes ni cupones.
// Se apaga después del 30/11 igual que AvisoBFRubro: en el build y en el navegador.
import Link from 'next/link'
import { avisoBFVigente, ordenEnlacesBF } from '@/lib/bf-enlaces'
import { LANDINGS_BF } from '@/lib/black-friday-landings'
import SoloHastaFinBF from '@/components/SoloHastaFinBF'

const CHIP =
  'inline-flex min-h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-zinc-700 px-3 text-sm font-bold text-zinc-200 hover:border-[#FACC15] hover:text-[#FACC15]'

export default function EnlacesBF({ ruta, className = '' }: { ruta: string; className?: string }) {
  if (!avisoBFVigente()) return null
  const porSlug = new Map(LANDINGS_BF.map(l => [l.slug, l]))
  const landings = ordenEnlacesBF(ruta, [...porSlug.keys()]).map(s => porSlug.get(s)!)
  if (landings.length === 0) return null
  return (
    <SoloHastaFinBF>
      <nav aria-label="Black Friday 2026 por rubro" data-seccion="enlaces_bf" className={`min-w-0 ${className}`}>
        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
          <li className="shrink-0">
            <Link href="/black-friday" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-[#FACC15] px-3 text-sm font-black text-black hover:bg-yellow-300">
              🖤 Black Friday 2026 →
            </Link>
          </li>
          {landings.map(l => (
            <li key={l.slug} className="shrink-0">
              <Link href={`/mejores/${l.slug}`} className={CHIP}>
                <span aria-hidden="true">{l.emoji}</span> {l.rubro}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SoloHastaFinBF>
  )
}
