'use client'

// Aviso chico después de un clic a Mercado Libre (rediseño 27/11): «¿Querés enterarte primero
// de la próxima?». Nunca frena el clic (el link ya se abrió en otra pestaña cuando aparece),
// no es modal, se cierra con la X y sale una sola vez por sesión (sessionStorage).
// Lo dispara clics-ml.tsx con el evento `cz:clic-ml` después de contar el clic.
import { useEffect, useState } from 'react'
import SeguirRedes from '@/components/SeguirRedes'

const CLAVE = 'cz_aviso_seguir'

/** `dosBarras`: en la home, la barra inferior + el CtaFijoML; en /precio, solo la barra (con el botón adentro). */
export default function AvisoSeguir({ dosBarras = false }: { dosBarras?: boolean }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const mostrar = () => {
      try {
        if (sessionStorage.getItem(CLAVE)) return
        sessionStorage.setItem(CLAVE, '1')
      } catch {
        return // sin storage no hay forma de no repetirlo: mejor no mostrarlo
      }
      // Un respiro: que la pestaña de ML se abra primero y el aviso esté al volver.
      window.setTimeout(() => setVisible(true), 600)
    }
    window.addEventListener('cz:clic-ml', mostrar)
    return () => window.removeEventListener('cz:clic-ml', mostrar)
  }, [])

  if (!visible) return null
  return (
    <div
      role="status"
      aria-live="polite"
      // Celular: encima de la barra inferior y de la barra de compra; escritorio: abajo a la izquierda.
      className={`aviso-entra fixed inset-x-3 z-40 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[23rem] ${
        dosBarras ? 'bottom-[calc(8.5rem+env(safe-area-inset-bottom))]' : 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]'
      }`}
    >
      <div className="rounded-2xl border border-zinc-700 bg-zinc-900/95 p-3.5 shadow-2xl shadow-black/60 backdrop-blur-md">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <p className="text-sm font-bold leading-snug text-zinc-100">
            ¿Querés enterarte primero de la próxima? <span className="text-yellow-400">Seguinos</span>
          </p>
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Cerrar aviso"
            className="-m-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl leading-none text-zinc-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            ×
          </button>
        </div>
        <SeguirRedes variante="chico" donde="aviso_post_clic" />
      </div>
    </div>
  )
}
