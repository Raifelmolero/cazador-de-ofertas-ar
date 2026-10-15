'use client'
import { useEffect, useState } from 'react'

/** Cuenta regresiva hasta las 00:00 (hora argentina) del día del evento. Render
 *  inicial sin reloj (mismo texto que el build) para no romper la hidratación;
 *  después tickea cada minuto. Pasada la fecha no muestra nada. */
export default function CuentaRegresivaEvento({ fecha, nombre }: { fecha: string; nombre: string }) {
  const [ms, setMs] = useState<number | null>(null)
  useEffect(() => {
    const fin = new Date(`${fecha}T00:00:00-03:00`).getTime()
    const tick = () => setMs(fin - Date.now())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [fecha])

  if (ms === null || ms <= 0) return null
  const d = Math.floor(ms / 86_400_000)
  const h = Math.floor((ms % 86_400_000) / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return (
    <p className="mt-4 inline-block rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300">
      ⏰ Faltan {d} {d === 1 ? 'día' : 'días'}, {h} h y {m} min para el {nombre}
    </p>
  )
}
