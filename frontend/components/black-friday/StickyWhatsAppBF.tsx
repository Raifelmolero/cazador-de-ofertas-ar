'use client'
import { useEffect, useState, useSyncExternalStore } from 'react'

const CLAVE = 'cz_bf_sticky_cerrado'
const sinSuscripcion = () => () => {}
const leerCerrado = () => {
  try {
    return sessionStorage.getItem(CLAVE) === '1'
  } catch {
    return false
  }
}

/** Barra fija abajo, solo en el celular (brief §6). Aparece al scrollear, se
 *  achica a un chip mientras el top de productos está en pantalla (para no tapar
 *  «Ver en Mercado Libre») y se cierra con la X por el resto de la sesión. */
export default function StickyWhatsAppBF({ href }: { href: string }) {
  const [visible, setVisible] = useState(false)
  const [cerradoAhora, setCerradoAhora] = useState(false)
  const cerradoAntes = useSyncExternalStore(sinSuscripcion, leerCerrado, () => true)
  const cerrado = cerradoAhora || cerradoAntes
  const [enTop, setEnTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const top = document.getElementById('top')
    let io: IntersectionObserver | undefined
    if (top && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([en]) => setEnTop(en.isIntersecting), { threshold: 0 })
      io.observe(top)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  if (cerrado || !visible) return null

  const cerrar = () => {
    setCerradoAhora(true)
    try {
      sessionStorage.setItem(CLAVE, '1')
    } catch {}
  }

  if (enTop) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-bf-evento="cta_whatsapp"
        data-bf-placement="sticky"
        className="sm:hidden fixed bottom-3 left-3 z-30 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-black shadow-lg"
      >
        💬 Canal
      </a>
    )
  }

  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-3 py-2">
      <div className="flex items-center gap-2">
        <p className="flex-1 text-xs font-semibold text-zinc-200">Canal de WhatsApp · tandas 19:00</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-bf-evento="cta_whatsapp"
          data-bf-placement="sticky"
          className="rounded-xl bg-green-500 hover:bg-green-400 px-4 py-2 text-sm font-bold text-black"
        >
          Sumate
        </a>
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar aviso del canal de WhatsApp"
          className="h-9 w-9 shrink-0 rounded-lg text-zinc-400 hover:text-zinc-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
