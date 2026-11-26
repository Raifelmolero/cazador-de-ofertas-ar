// Bloque chico amarillo «Black Friday 27/11: lo que conviene» con link a la landing BF
// del rubro (lib/bf-enlaces.ts) y otro a /black-friday. El texto sigue el modo del día
// (lib/cybermonday.ts, modoBF: previa / hoy / últimas horas / terminó). Se apaga solo
// después del 30/11 por dos lados:
// - en el render (ISR): si ya pasó la fecha, ni siquiera va al HTML;
// - en el navegador (SoloHastaFinBF): por si el HTML cacheado es de antes del corte.
import Link from 'next/link'
import { avisoBFVigente, destinoBF } from '@/lib/bf-enlaces'
import { modoBF, type ModoBF } from '@/lib/cybermonday'
import SoloHastaFinBF from '@/components/SoloHastaFinBF'

const TITULO: Record<ModoBF, string> = {
  previa: '🖤 Black Friday 27/11: lo que conviene',
  hoy: '🔥 Black Friday HOY: lo que conviene',
  ultimas: '⏳ Últimas horas del Black Friday',
  termino: 'Terminó el Black Friday: lo que sigue conviniendo',
}

export default function AvisoBFRubro({ ruta }: { ruta: string }) {
  const d = destinoBF(ruta)
  if (!d || !avisoBFVigente()) return null
  const modo = modoBF()
  return (
    <SoloHastaFinBF>
      <aside aria-label="Black Friday" className="max-w-3xl mx-auto px-4 pt-4" data-seccion="aviso_bf_rubro">
        <div className="rounded-xl px-4 py-2.5 text-black" style={{ backgroundColor: '#FACC15' }}>
          <Link
            href={`/mejores/${d.slug}`}
            data-bf-landing={d.slug}
            className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1"
          >
            <span className="font-display text-sm font-black sm:text-base">{TITULO[modo]}</span>
            <span className="text-sm font-bold underline underline-offset-2">{d.texto} →</span>
          </Link>
          <Link href="/black-friday" className="inline-flex min-h-8 items-center text-xs font-bold text-black/80 underline underline-offset-2">
            Todo el Black Friday 2026 →
          </Link>
        </div>
      </aside>
    </SoloHastaFinBF>
  )
}
