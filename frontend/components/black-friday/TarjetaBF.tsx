'use client'
import { useSyncExternalStore } from 'react'
import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import { BOTON_ML, UltVerificacion } from '@/components/PartesTarjeta'
import { slotPublicable, type SlotBF } from '@/lib/black-friday-previa'

const sinSuscripcion = () => () => {}

/** Tarjeta de un slot del top (brief §5). El sitio se rebuildea 3×/día, así que
 *  además del chequeo del build se vuelve a mirar en el navegador si el precio
 *  se reconfirmó HOY (hora Argentina): si no, no se muestra precio. Nunca uno de ayer. */
export default function TarjetaBF({ s, publicableEnBuild, prioridad }: { s: SlotBF; publicableEnBuild: boolean; prioridad: boolean }) {
  // Servidor: lo del build. Navegador: el reloj de quien mira.
  const publicable = useSyncExternalStore(
    sinSuscripcion,
    () => slotPublicable(s),
    () => publicableEnBuild,
  )

  if (!publicable) {
    return (
      <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-base font-bold text-zinc-400">{s.categoria}</p>
        {s.nombre && <p className="mt-2 text-base font-semibold text-zinc-300 line-clamp-2">{nombreCorto(s.nombre)}</p>}
        <p className="mt-3 text-base text-zinc-400">Aún no reconfirmamos el precio de hoy.</p>
      </div>
    )
  }

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-3" data-ticket-alto>
      <div className="mb-3 h-40 overflow-hidden rounded-xl bg-white sm:h-56">
        {s.img && (
          // eslint-disable-next-line @next/next/no-img-element -- fotos del CDN de ML, sin optimizador (ver CLAUDE.md)
          <img
            src={miniaturaML(s.img)}
            alt={s.nombre}
            width={500}
            height={500}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading={prioridad ? 'eager' : 'lazy'}
            className="h-full w-full object-contain"
          />
        )}
      </div>
      <h3 className="text-base font-semibold text-zinc-100 line-clamp-2">{nombreCorto(s.nombre)}</h3>
      <p className="mt-1 font-display text-2xl font-black text-yellow-400">{s.precio}</p>
      <UltVerificacion fecha={s.reconfirmado} />
      <div className="mt-auto pt-3">
        <a
          href={s.link_afiliado}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-bf-evento="click_ml"
          data-bf-slot={String(s.slot)}
          data-bf-mla={s.mla || undefined}
          className={BOTON_ML}
        >
          Ver en Mercado Libre
        </a>
      </div>
    </article>
  )
}
