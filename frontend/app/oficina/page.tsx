// Oficina de agentes (tarjeta #21 de Trello): una sala por departamento con
// qué está haciendo cada uno. Los datos salen de frontend/data/oficina.json,
// que arma bot/tools/oficina.py en cada corrida del bot (sin gastar tokens).
// Página interna: no se indexa ni aparece en el sitemap.

import type { Metadata } from 'next'
import oficina from '@/data/oficina.json'
import Estado from './Estado'

export const metadata: Metadata = {
  title: 'Oficina de agentes',
  robots: { index: false, follow: false },
}

interface Metrica {
  label: string
  valor: number
  delta?: number
}
interface Depto {
  id: string
  nombre: string
  emoji: string
  descripcion: string
  automatico: boolean
  frecuencia: string
  ultima_actividad: string | null
  agentes: { nombre: string; tarea: string }[]
  metricas: Metrica[]
  metricas_titulo?: string
  ultimo_trabajo?: string | null
  entregas?: { fecha: string; titulo: string }[]
  proximamente?: boolean
  ventana_horas?: number
}

const deptos = oficina.departamentos as Depto[]

export default function OficinaPage() {
  const activos = deptos.filter((d) => !d.proximamente).length
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Cazador de Ofertas AR
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Oficina de agentes</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {activos} departamentos en marcha. Se actualiza sola con cada corrida del bot.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deptos.map((d, i) => (
          <section
            key={d.id}
            className={`rise-in flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 ${
              d.proximamente ? 'opacity-60' : ''
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  <span aria-hidden className="mr-2">{d.emoji}</span>
                  {d.nombre}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">{d.descripcion}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  d.automatico ? 'bg-emerald-400/15 text-emerald-300' : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {d.automatico ? '24/7' : 'A demanda'}
              </span>
            </div>

            <div className="mt-3">
              <Estado ultima={d.ultima_actividad} automatico={d.automatico} proximamente={d.proximamente} ventanaHoras={d.ventana_horas} />
              <p className="mt-1 text-xs text-zinc-500">Frecuencia: {d.frecuencia}</p>
            </div>

            {d.agentes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {d.agentes.map((a) => (
                  <li key={a.nombre} className="flex items-center gap-3 rounded-xl bg-zinc-950/60 p-3">
                    <span
                      aria-hidden
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-400/15 text-sm font-bold text-amber-300"
                    >
                      {a.nombre.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{a.nombre}</p>
                      <p className="truncate text-xs text-zinc-400">{a.tarea}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {d.metricas.length > 0 && (
              <div className="mt-4">
                {d.metricas_titulo && <p className="mb-2 text-xs text-zinc-500">{d.metricas_titulo}</p>}
                <dl className="grid grid-cols-2 gap-2">
                  {d.metricas.map((m) => (
                    <div key={m.label} className="rounded-lg bg-zinc-950/60 px-3 py-2">
                      <dt className="truncate text-[11px] text-zinc-400">{m.label}</dt>
                      <dd className="text-lg font-bold tabular-nums">
                        {m.valor.toLocaleString('es-AR')}
                        {m.delta !== undefined && m.delta !== 0 && (
                          <span className={`ml-1 text-xs ${m.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {m.delta > 0 ? '+' : ''}
                            {m.delta}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {d.ultimo_trabajo && (
              <p className="mt-4 text-xs text-zinc-400">
                Último trabajo: <span className="text-zinc-200">{d.ultimo_trabajo}</span>
              </p>
            )}

            {d.entregas && d.entregas.length > 0 && (
              <div className="mt-4">
                <p className="mb-1 text-xs text-zinc-500">Últimas entregas</p>
                <ul className="space-y-1 text-sm">
                  {d.entregas.map((e) => (
                    <li key={e.fecha + e.titulo} className="flex gap-2">
                      {e.fecha && <span className="shrink-0 tabular-nums text-zinc-500">{e.fecha.slice(5)}</span>}
                      <span className="truncate first-letter:uppercase">{e.titulo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs text-zinc-500">
        Datos generados {new Date(oficina.generado).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}.
      </p>
    </main>
  )
}
