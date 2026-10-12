'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'

const ASISTENTES = ['chatgpt', 'perplexity', 'copilot', 'gemini', 'claude']

/** Línea de contexto + camino corto a /precio-hoy para quien llega desde un
 *  asistente de IA (utm_source=chatgpt.com u otro). Mira la URL y el
 *  sessionStorage donde clarity.tsx guarda el utm_source. No renderiza nada
 *  para el resto de las visitas ni en el HTML estático. */
function vieneDeAsistente(): boolean {
  try {
    const url = new URLSearchParams(window.location.search).get('utm_source')
    const guardado = sessionStorage.getItem('utm_source')
    const fuente = (url || guardado || '').toLowerCase()
    return ASISTENTES.some(a => fuente.includes(a))
  } catch {
    // sessionStorage bloqueado: no mostramos nada
    return false
  }
}

const sinSuscripcion = () => () => {}

export default function DesdeAsistenteIA() {
  // false en servidor/hidratación, valor real en el cliente (sin mismatch)
  const visible = useSyncExternalStore(sinSuscripcion, vieneDeAsistente, () => false)

  if (!visible) return null

  return (
    <section aria-label="Atajo para quien busca un precio" className="max-w-3xl mx-auto px-4 pt-4">
      <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-200">
          ¿Buscás cuánto sale un producto hoy? Mirá el precio más bajo, la mediana y las ofertas con descuento real.
        </p>
        <Link
          href="/precio-hoy"
          className="shrink-0 text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-5 py-2"
        >
          Ver precio hoy →
        </Link>
      </div>
    </section>
  )
}
