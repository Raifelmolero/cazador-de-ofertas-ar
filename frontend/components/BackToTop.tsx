'use client'

import { useEffect, useState } from 'react'

/** Botón flotante para volver arriba: aparece tras scrollear ~2 pantallas.
 *  Con 100+ ofertas, volver al buscador desde abajo era una remada. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 1600)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
      }}
      aria-label="Volver arriba"
      className="fixed bottom-5 right-4 z-20 w-11 h-11 rounded-full bg-yellow-400 text-black text-xl font-black shadow-lg shadow-black/40 hover:bg-yellow-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      ↑
    </button>
  )
}
