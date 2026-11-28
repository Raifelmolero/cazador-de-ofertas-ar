'use client'

// Sección #agentes: el equipo de 5 (director + 4) y las automatizaciones.
// Vida Personal y Asesor Financiero se nombran aparte: no son del negocio.

import { haceCuanto, type PanelOficina } from './salud'

const PUNTO = { ok: 'bg-emerald-400', alerta: 'bg-amber-400', pausa: 'bg-zinc-500' } as const

export default function Equipo({ e, a, ahora }: { e: PanelOficina['equipo']; a: PanelOficina['automatizaciones']; ahora: number | null }) {
  const equipo = [e.director, ...e.agentes]
  const alertas = a.items.filter((i) => i.e === 'alerta').length
  return (
    <section id="agentes" className="mb-8 scroll-mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Equipo de agentes · {equipo.length}</h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {equipo.map((m, i) => (
          <li key={m.nombre} className="rounded-xl bg-zinc-950/60 p-3">
            <p className="text-sm font-semibold">
              {m.nombre}
              {i === 0 && <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] text-amber-300">director</span>}
            </p>
            <p className="text-xs text-zinc-400">{m.rol}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {m.ultima && ahora !== null ? `Última actividad ${haceCuanto(ahora - new Date(m.ultima).getTime())}` : 'Última actividad: sin dato'}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-zinc-500">
        Aparte, no son del negocio: {e.aparte.join(' y ')}.
      </p>

      <details className="mt-4 rounded-xl bg-zinc-950/60 p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          Automatizaciones · {a.items.length}
          {alertas > 0 && <span className="ml-2 text-amber-300">{alertas} con alerta</span>}
        </summary>
        <ul className="mt-3 space-y-2">
          {a.items.map((i) => (
            <li key={i.n} className="flex gap-2 text-sm">
              <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PUNTO[i.e]}`} />
              <span className="min-w-0">
                <span className="font-semibold">{i.n}</span>
                <span className="text-zinc-400"> · {i.t} · {i.c}</span>
                {i.nota && <span className="block text-xs text-amber-300/80">{i.nota}</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-zinc-500">
          {a.medido && ahora !== null ? `Estado leído ${haceCuanto(ahora - new Date(a.medido).getTime())}` : 'Estado: sin fecha'}
        </p>
      </details>
    </section>
  )
}
