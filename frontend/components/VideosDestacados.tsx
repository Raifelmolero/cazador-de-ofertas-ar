'use client'

import { useEffect, useRef } from 'react'
import type { OfertaLight } from '@/components/OfertaCard'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

const precio = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** El video arranca recién cuando entra en pantalla y se pausa al salir:
 *  no carga nada hasta que se ve (no pesa en la primera pintura). */
function Video({ id, poster }: { id: string; poster: string | null }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = `/videos/${id}.mp4`
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [id])
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster ?? undefined}
      aria-label="Video corto del producto"
      className="w-full aspect-[9/16] object-cover bg-black"
    />
  )
}

export default function VideosDestacados({ ofertas }: { ofertas: OfertaLight[] }) {
  if (ofertas.length === 0) return null
  return (
    <section data-seccion="video" className="max-w-3xl mx-auto px-4 pt-2 pb-6">
      <h2 className="font-display text-lg font-black mb-3 text-center">🎬 Las cazas de hoy en video</h2>
      <div className={`grid gap-3 ${ofertas.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'}`}>
        {ofertas.map(o => (
          <a
            key={o.id_ml}
            href={o.url_producto}
            target="_blank"
            rel="noopener noreferrer sponsored"
            data-ticket-alto={o.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
            className="group block rounded-2xl overflow-hidden border border-yellow-400/40 bg-zinc-900 hover:border-yellow-400 transition-colors"
          >
            <div className="relative">
              <Video id={o.id_ml} poster={o.url_imagen} />
              {o.descuento_pct != null && (
                <span className="absolute top-2 left-2 text-[11px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full">
                  {o.descuento_pct}% OFF
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 leading-snug">{o.titulo}</p>
              <p className="mt-1 font-display text-lg font-black text-yellow-400 tabular-nums">{precio(o.precio_actual)}</p>
              <span className="mt-2 block text-center text-sm font-extrabold bg-yellow-400 text-black rounded-xl py-2.5 group-hover:bg-yellow-300">
                Comprar en ML ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
