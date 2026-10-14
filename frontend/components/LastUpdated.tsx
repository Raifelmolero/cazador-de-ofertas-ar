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

// Fecha fija en hora argentina (UTC-3), sin depender de Intl/locale del entorno.
function fechaAbsoluta(date: Date): string {
  const d = new Date(date.getTime() - 3 * 3_600_000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `el ${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)} a las ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`
}

export default function LastUpdated({ scrapedAt }: { scrapedAt: string }) {
  const date = useMemo(() => new Date(scrapedAt), [scrapedAt])
  // Un solo "ahora" en estado, que el intervalo refresca: leer el reloj durante
  // el render es impuro (Next 16 lo marca) y además daba dos lecturas distintas
  // para el texto y para el semáforo.
  // Inicia en null: servidor y primer render del cliente emiten el mismo texto
  // (fecha absoluta, determinista); el "hace X min" aparece tras montar.
  const [ahora, setAhora] = useState<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setAhora(Date.now()), 0)
    const id = setInterval(() => setAhora(Date.now()), 60_000)
    return () => {
      clearTimeout(t)
      clearInterval(id)
    }
  }, [])

  const label = ahora === null ? fechaAbsoluta(date) : formatRelative(date, ahora)
  // Ofertas cargadas a mano: la fecha envejece sin que eso sea un problema.
  // El rojo queda para más de 7 días sin revisar nada.
  const isStale = ahora !== null && ahora - date.getTime() > 7 * 24 * 3_600_000

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isStale ? 'bg-red-400' : 'bg-yellow-400 motion-safe:animate-pulse'}`} />
      <span className={isStale ? 'text-red-400' : undefined}>
        Última revisión {label}
      </span>
    </span>
  )
}
