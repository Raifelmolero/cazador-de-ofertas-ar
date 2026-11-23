// Bloque chico amarillo «Black Friday 27/11: lo que conviene» con link a la landing BF
// del rubro (lib/bf-enlaces.ts). Se apaga solo después del 30/11 por dos lados:
// - en el build: si ya pasó la fecha, ni siquiera va al HTML;
// - en el navegador (SoloHastaFinBF): las páginas son estáticas y se redeployan cada
//   3 días, así que sin esto el aviso podría quedar hasta el próximo deploy.
import Link from 'next/link'
import { avisoBFVigente, destinoBF } from '@/lib/bf-enlaces'
import SoloHastaFinBF from '@/components/SoloHastaFinBF'

export default function AvisoBFRubro({ ruta }: { ruta: string }) {
  const d = destinoBF(ruta)
  if (!d || !avisoBFVigente()) return null
  return (
    <SoloHastaFinBF>
      <aside aria-label="Black Friday" className="max-w-3xl mx-auto px-4 pt-4" data-seccion="aviso_bf_rubro">
        <Link
          href={`/mejores/${d.slug}`}
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl px-4 py-2.5 text-black"
          style={{ backgroundColor: '#FACC15' }}
        >
          <span className="font-display text-sm font-black sm:text-base">🖤 Black Friday 27/11: lo que conviene</span>
          <span className="text-sm font-bold underline underline-offset-2">{d.texto} →</span>
        </Link>
      </aside>
    </SoloHastaFinBF>
  )
}
