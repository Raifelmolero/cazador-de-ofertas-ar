'use client'

import { useEffect, useMemo, useState } from 'react'

function formatRelative(date: Date): string {
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffMin < 1) return 'hace menos de 1 minuto'
  if (diffMin < 60) return `hace ${diffMin} min`
  const h = Math.floor(diffMin / 60)
  if (h < 24) return `hace ${h} hora${h !== 1 ? 's' : ''}`
  const d = Math.floor(h / 24)
  return `hace ${d} día${d !== 1 ? 's' : ''}`
}

export default function LastUpdated({ scrapedAt }: { scrapedAt: string }) {
  const date = useMemo(() => new Date(scrapedAt), [scrapedAt])
  const [label, setLabel] = useState(formatRelative(date))

  useEffect(() => {
    const id = setInterval(() => setLabel(formatRelative(date)), 60_000)
    return () => clearInterval(id)
  }, [date])

  const isStale = Date.now() - date.getTime() > 48 * 3_600_000

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isStale ? 'bg-red-400' : 'bg-yellow-400 motion-safe:animate-pulse'}`} />
      <span className={isStale ? 'text-red-400' : undefined}>
        Actualizado {label}
      </span>
    </span>
  )
}
