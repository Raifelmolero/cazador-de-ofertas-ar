'use client'
import { useEffect, useState } from 'react'

/** Cuenta regresiva real hasta el día (00:00 hora argentina). Render inicial =
 *  días calculados en el build (sin salto de hidratación); después tickea cada
 *  minuto. Pasado el día no muestra nada (la página muestra el fallback). */
export default function CuentaRegresivaMadre({ fecha, diasBuild }: { fecha: string; diasBuild: number }) {
  const [ms, setMs] = useState<number | null>(null)
  useEffect(() => {
    const fin = new Date(`${fecha}T00:00:00-03:00`).getTime()
    const tick = () => setMs(fin - Date.now())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [fecha])

  if (ms === null) {
    if (diasBuild <= 0) return null
    return <p className="mt-3 text-sm font-bold text-pink-200">⏰ {diasBuild === 1 ? 'Falta 1 día' : `Faltan ${diasBuild} días`}</p>
  }
  if (ms <= 0) return null
  const d = Math.floor(ms / 86_400_000)
  const h = Math.floor((ms % 86_400_000) / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return (
    <p className="mt-3 text-sm font-bold text-pink-200">
      ⏰ Faltan {d} {d === 1 ? 'día' : 'días'}, {h} h y {m} min
    </p>
  )
}
