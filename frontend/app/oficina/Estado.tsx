'use client'

// Semáforo de un departamento. El sitio es estático: se calcula en el
// navegador con el reloj actual, así no queda congelado en el último deploy.

import type { Depto, Nivel } from './salud'
import { salud } from './salud'

const COLOR: Record<Nivel, string> = {
  ok: 'bg-emerald-400',
  revisar: 'bg-red-500',
  pausa: 'bg-amber-400',
  espera: 'bg-amber-400',
  guardia: 'bg-sky-400',
  pronto: 'bg-zinc-500',
}

export default function Estado({ depto, ahora }: { depto: Depto; ahora: number | null }) {
  // En el server `ahora` es null: se pinta neutro para no romper la hidratación.
  const s = ahora === null ? null : salud(depto, ahora)
  const nivel: Nivel = s?.nivel ?? 'pronto'
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${COLOR[nivel]}`}>
        {(nivel === 'ok' || nivel === 'guardia') && (
          <span className={`absolute inset-0 animate-ping rounded-full ${COLOR[nivel]} opacity-60`} />
        )}
      </span>
      <span className="font-semibold text-white">{s?.texto ?? 'Cargando…'}</span>
      {s?.detalle && <span className="text-zinc-400">· {s.detalle}</span>}
    </div>
  )
}
