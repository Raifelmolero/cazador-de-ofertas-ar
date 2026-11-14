'use client'
import { useEffect, useState } from 'react'
import { FIN_BF, INICIO_BF } from '@/lib/black-friday-previa'

/** Cuenta regresiva al viernes 27/11/2026 00:00 (America/Buenos_Aires), con
 *  segundos. El primer render (servidor) muestra guiones con el mismo tamaño
 *  para no mover el layout ni romper la hidratación. Tres estados: antes, Día D
 *  y después (sin vender extensión). Todo en texto, nada de canvas. */
export default function CuentaRegresivaBF({
  horaActualizacion,
  estadoEvento,
}: {
  horaActualizacion: string
  estadoEvento: string
}) {
  const [ahora, setAhora] = useState<number | null>(null)
  useEffect(() => {
    const tick = () => setAhora(Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const inicio = new Date(INICIO_BF).getTime()
  const fin = new Date(FIN_BF).getTime()
  const caja = 'mt-6 min-h-[7.5rem] rounded-2xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-4'

  if (ahora !== null && ahora >= inicio && ahora < fin) {
    return (
      <div className={caja} role="status">
        <p className="font-display text-3xl sm:text-4xl font-black text-yellow-300">Es el Día D</p>
        {horaActualizacion && (
          <p className="mt-2 text-sm text-zinc-300">
            Ofertas reconfirmadas hoy, a las {horaActualizacion} (hora Argentina)
          </p>
        )}
      </div>
    )
  }
  if (ahora !== null && ahora >= fin) {
    return (
      <div className={caja} role="status">
        <p className="font-display text-2xl sm:text-3xl font-black text-yellow-300">
          {estadoEvento || 'Ofertas verificadas de hoy'}
        </p>
      </div>
    )
  }

  const ms = ahora === null ? null : Math.max(0, inicio - ahora)
  const d = ms === null ? null : Math.floor(ms / 86_400_000)
  const dos = (n: number | null) => (n === null ? '--' : String(n).padStart(2, '0'))
  const h = ms === null ? null : Math.floor((ms % 86_400_000) / 3_600_000)
  const m = ms === null ? null : Math.floor((ms % 3_600_000) / 60_000)
  const s = ms === null ? null : Math.floor((ms % 60_000) / 1000)

  return (
    <div className={caja}>
      {/* Lectores de pantalla: solo los días, sin anunciar cada segundo. */}
      <p className="sr-only">{d === null ? '' : `Faltan ${d} ${d === 1 ? 'día' : 'días'} para el Black Friday`}</p>
      <p aria-hidden="true" className="font-display text-3xl sm:text-5xl font-black text-yellow-300 tabular-nums">
        Faltan {d === null ? '--' : d} {d === 1 ? 'día' : 'días'} {dos(h)}:{dos(m)}:{dos(s)}
      </p>
      <p className="mt-2 text-sm text-zinc-300">Empieza el viernes 27/11 a las 00:00, hora Argentina</p>
    </div>
  )
}
