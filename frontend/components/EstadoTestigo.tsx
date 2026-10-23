// Precio de hoy contra el precio testigo de octubre (lib/cybertecno.ts): antes
// del evento dice cuánto está arriba del mínimo; durante y después, el veredicto.
import type { FilaTecno } from '@/lib/cybertecno'

/** "2026-09-27" → "27/09" */
const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)
const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`

export default function EstadoTestigo({ f, etapa }: { f: FilaTecno; etapa: 'antes' | 'durante' | 'despues' }) {
  if (!f.hoy) return <span className="text-zinc-500">Hoy no está en oferta · visto el {diaMes(f.testigo.ult)}</span>
  const hoy = f.hoy.precio_actual
  if (etapa === 'antes') {
    const pct = Math.round((hoy / f.testigo.min - 1) * 100)
    return (
      <span>
        Hoy <strong className="text-zinc-100">{pesos(hoy)}</strong>{' '}
        {pct <= 2 ? (
          <span className="text-emerald-300">· en su precio más bajo</span>
        ) : (
          <span className="text-amber-300">· {pct} % arriba de su mínimo</span>
        )}
      </span>
    )
  }
  const txt = f.veredicto === 'bajo' ? '✅ Bajó de verdad' : f.veredicto === 'igual' ? '➖ Igual que en octubre' : '⚠️ Estaba más barato antes'
  const color = f.veredicto === 'bajo' ? 'text-emerald-300' : f.veredicto === 'igual' ? 'text-zinc-300' : 'text-amber-300'
  return (
    <span>
      Hoy <strong className="text-zinc-100">{pesos(hoy)}</strong> <span className={color}>· {txt}</span>
    </span>
  )
}
