'use client'

// El sitio es estático: el "hace X" y el semáforo se calculan en el navegador
// para que no queden congelados en la hora del último deploy.

import { useSyncExternalStore } from 'react'

function suscribirMinuto(onChange: () => void) {
  const t = setInterval(onChange, 60000)
  return () => clearInterval(t)
}

function haceCuanto(ms: number): string {
  const min = Math.round(ms / 60000)
  if (min < 60) return `hace ${min} min`
  const h = Math.round(min / 60)
  if (h < 48) return `hace ${h} h`
  return `hace ${Math.round(h / 24)} días`
}

export default function Estado({
  ultima,
  automatico,
  proximamente,
  ventanaHoras = 12,
}: {
  ultima: string | null
  automatico: boolean
  proximamente?: boolean
  ventanaHoras?: number
}) {
  // Reloj de minuto en minuto; en el server es null para no romper la hidratación.
  const ahora = useSyncExternalStore(
    suscribirMinuto,
    () => Math.floor(Date.now() / 60000) * 60000,
    () => null,
  )

  let color = 'bg-zinc-500'
  let texto = 'En espera'
  let detalle = ultima ? '' : 'Sin actividad todavía'

  if (proximamente) {
    texto = 'Próximamente'
    detalle = 'Se suma en las próximas semanas'
  } else if (ultima && ahora !== null) {
    const ms = ahora - new Date(ultima).getTime()
    detalle = `Última actividad ${haceCuanto(ms)}`
    if (automatico) {
      // Pasada la ventana esperada (12 h el bot, 26 h la auditoría) es una falla.
      const ok = ms < ventanaHoras * 3600 * 1000
      color = ok ? 'bg-emerald-400' : 'bg-red-500'
      texto = ok ? 'Trabajando' : 'Revisar: sin actividad'
    } else {
      texto = 'Listo, espera tarea'
      color = 'bg-amber-400'
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${color}`}>
        {texto === 'Trabajando' && (
          <span className={`absolute inset-0 animate-ping rounded-full ${color} opacity-60`} />
        )}
      </span>
      <span className="font-semibold text-white">{texto}</span>
      {detalle && <span className="text-zinc-400">· {detalle}</span>}
    </div>
  )
}
