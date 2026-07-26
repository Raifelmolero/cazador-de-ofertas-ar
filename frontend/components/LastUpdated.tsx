'use client'

import { useEffect, useMemo, useState } from 'react'

function formatRelative(date: Date, ahora: number): string {
  const diffMin = Math.floor((ahora - date.getTime()) / 60000)
  if (diffMin < 1) return 'hace menos de 1 minuto'
  if (diffMin < 60) return `hace ${diffMin} min`
  const h = Math.floor(diffMin / 60)
  if (h < 24) return `hace ${h} hora${h !== 1 ? 's' : ''}`
  const d = Math.floor(h / 24)
  return `hace ${d} día${d !== 1 ? 's' : ''}`
}

export default function LastUpdated({ scrapedAt }: { scrapedAt: string }) {
  const date = useMemo(() => new Date(scrapedAt), [scrapedAt])
  // Un solo "ahora" en estado, que el intervalo refresca: leer el reloj durante
  // el render es impuro (Next 16 lo marca) y además daba dos lecturas distintas
  // para el texto y para el semáforo.
  const [ahora, setAhora] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const label = formatRelative(date, ahora)
  const isStale = ahora - date.getTime() > 48 * 3_600_000

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isStale ? 'bg-red-400' : 'bg-yellow-400 motion-safe:animate-pulse'}`} />
      <span className={isStale ? 'text-red-400' : undefined}>
        Actualizado {label}
      </span>
    </span>
  )
}
