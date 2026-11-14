'use client'
import { useSyncExternalStore } from 'react'
import { reconfirmadoTexto, slotPublicable, type SlotBF } from '@/lib/black-friday-previa'

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
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{s.categoria}</p>
        {s.nombre && <p className="mt-2 text-sm font-semibold text-zinc-300 line-clamp-3">{s.nombre}</p>}
        <p className="mt-3 text-sm text-zinc-400">Aún no reconfirmamos el precio de hoy.</p>
      </div>
    )
  }

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-4" data-ticket-alto>
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-white">
        {s.img && (
          // eslint-disable-next-line @next/next/no-img-element -- fotos del CDN de ML, sin optimizador (ver CLAUDE.md)
          <img
            src={s.img}
            alt={s.nombre}
            width={500}
            height={500}
            loading={prioridad ? 'eager' : 'lazy'}
            fetchPriority={prioridad ? 'high' : undefined}
            className="h-full w-full object-contain"
          />
        )}
        {s.descuento && (
          <span className="absolute left-2 top-2 rounded-lg bg-yellow-400 px-2 py-0.5 text-xs font-black text-black">{s.descuento}</span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-zinc-100 line-clamp-3">{s.nombre}</h3>
      {s.precio_antes && <p className="mt-2 text-xs text-zinc-500 line-through">{s.precio_antes}</p>}
      <p className="font-display text-2xl font-black text-zinc-50">{s.precio}</p>
      {s.ahorro && <p className="text-xs font-semibold text-green-400">Ahorrás {s.ahorro}</p>}
      {s.cuotas && <p className="mt-1 text-xs text-zinc-400">{s.cuotas}</p>}
      {s.sello_minimo && (
        <p className="mt-2 inline-block self-start rounded-lg bg-green-500/15 px-2 py-1 text-xs font-bold text-green-300">
          📉 El precio más bajo que registramos
        </p>
      )}
      <p className="mt-2 text-xs text-zinc-500">
        Última revisión el {reconfirmadoTexto(s.reconfirmado)} (hora Argentina). El precio se reconfirma el mismo día.
      </p>
      <div className="mt-auto pt-3">
        <a
          href={s.link_afiliado}
          target="_blank"
          rel="sponsored noopener noreferrer"
          data-bf-evento="click_ml"
          data-bf-slot={String(s.slot)}
          data-bf-mla={s.mla || undefined}
          className="block w-full rounded-xl bg-yellow-400 hover:bg-yellow-300 px-4 py-2.5 text-center text-sm font-bold text-black transition-colors"
        >
          Ver en Mercado Libre ↗
        </a>
      </div>
    </article>
  )
}
