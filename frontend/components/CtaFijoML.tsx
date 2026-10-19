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
  seccion = 'cta-fijo',
}: {
  titulo: string
  precio: string
  url: string
  desde?: number
  seccion?: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    // Se esconde cerca del footer para no tapar sus links.
    const onScroll = () => {
      const footer = document.querySelector('footer')
      const cercaFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false
      setVisible(window.scrollY > desde && !cercaFooter)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [desde])

  return (
    <div
      data-seccion={seccion}
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
