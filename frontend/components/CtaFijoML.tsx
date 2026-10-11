'use client'

import { useEffect, useState } from 'react'

/**
 * Barra fija en celular: aparece al scrollear (el destacado de arriba ya es el
 * CTA mientras se ve) y deja el botón a mano durante toda la lectura.
 * El clic sale como link a ML normal: lo cuentan clarity.tsx y clics-ml.tsx.
 */
export default function CtaFijoML({
  titulo,
  precio,
  url,
  desde = 380,
}: {
  titulo: string
  precio: string
  url: string
  desde?: number
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > desde)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [desde])

  return (
    <div
      data-seccion="cta-fijo"
      aria-hidden={!visible}
      className={`sm:hidden fixed inset-x-0 bottom-0 z-20 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 transition-transform duration-200 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-zinc-500 truncate">🏆 {titulo}</p>
        <p className="font-display text-lg font-black text-yellow-400 leading-tight">{precio}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="sponsored nofollow noopener"
        tabIndex={visible ? 0 : -1}
        className="shrink-0 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black active:scale-[0.97] transition-transform"
      >
        Ver en ML 🛒
      </a>
    </div>
  )
}
