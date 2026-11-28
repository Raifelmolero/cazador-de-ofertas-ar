'use client'

// Tablero de la Oficina. Arranca con el JSON horneado en el build y, en el
// navegador, lo refresca cada 5 min desde raw.githubusercontent.com (repo
// público, CORS abierto). Así no hace falta un deploy ni una función de Vercel.

import { useEffect, useState, useSyncExternalStore } from 'react'
import Equipo from './Equipo'
import Estado from './Estado'
import Panel from './Panel'
import {
  type DatosOficina,
  type Depto,
  type PanelOficina,
  validoPanel,
  esDeDia,
  haceCuanto,
  horaBA,
  resumen,
  salud,
  TURNO_DIA,
} from './salud'

const URL_DATOS =
  'https://raw.githubusercontent.com/Raifelmolero/cazador-de-ofertas-ar/main/frontend/data/oficina.json'
const URL_PANEL =
  'https://raw.githubusercontent.com/Raifelmolero/cazador-de-ofertas-ar/main/frontend/data/oficina-panel.json'
const REFRESCO_MS = 5 * 60 * 1000

function suscribirMinuto(onChange: () => void) {
  const t = setInterval(onChange, 60000)
  return () => clearInterval(t)
}

function valido(x: unknown): x is DatosOficina {
  const d = x as DatosOficina
  return !!d && typeof d.generado === 'string' && Array.isArray(d.departamentos) && d.departamentos.length > 0
}

const fmtHora = (ahora: number) =>
  new Date(ahora).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

const fmtFechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

export default function Tablero({ inicial, panelInicial }: { inicial: DatosOficina; panelInicial: PanelOficina }) {
  const [datos, setDatos] = useState<DatosOficina>(inicial)
  const [panel, setPanel] = useState<PanelOficina>(panelInicial)
  const [envivo, setEnvivo] = useState(false)
  const ahora = useSyncExternalStore(
    suscribirMinuto,
    () => Math.floor(Date.now() / 60000) * 60000,
    () => null,
  )

  useEffect(() => {
    let vivo = true
    const traer = async () => {
      try {
        const r = await fetch(URL_DATOS, { cache: 'no-cache' })
        if (!r.ok) throw new Error(String(r.status))
        const j: unknown = await r.json()
        if (vivo && valido(j)) {
          setDatos(j)
          setEnvivo(true)
        }
        // El panel de decisión es un segundo archivo; si falta (o aún no está en main) se queda el del build.
        const rp = await fetch(URL_PANEL, { cache: 'no-cache' })
        if (rp.ok) {
          const jp: unknown = await rp.json()
          if (vivo && validoPanel(jp)) setPanel(jp)
        }
      } catch {
        // Sin red o GitHub caído: se queda con lo que ya hay (el del build).
        if (vivo) setEnvivo(false)
      }
    }
    traer()
    const t = setInterval(traer, REFRESCO_MS)
    return () => {
      vivo = false
      clearInterval(t)
    }
  }, [])

  const deptos = datos.departamentos
  const res = ahora === null ? null : resumen(deptos, ahora)
  const hora = ahora === null ? null : horaBA(ahora)
  const dia = hora === null ? true : esDeDia(hora)

  // Línea de tiempo: la última actividad de cada departamento, de más nueva a más vieja.
  const eventos = deptos
    .filter((d) => d.ultima_actividad)
    .map((d) => ({ d, t: new Date(d.ultima_actividad as string).getTime() }))
    .sort((a, b) => b.t - a.t)

  return (
    <>
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Cazador de Ofertas AR</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Oficina de agentes</h1>

        <Panel p={panel} ahora={ahora} />

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Salud</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {res ? (
                <>
                  <span className="text-emerald-400">{res.ok} OK</span>
                  <span className="mx-2 text-zinc-600">/</span>
                  <span className={res.revisar ? 'text-red-400' : 'text-zinc-500'}>{res.revisar} a revisar</span>
                </>
              ) : (
                <span className="text-zinc-500">…</span>
              )}
            </p>
            {res && res.pausa > 0 && (
              <p className="mt-0.5 text-xs text-amber-300">{res.pausa} en pausa (sin pedidos recientes)</p>
            )}
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Datos</p>
            <p className="mt-1 text-2xl font-bold">
              {ahora === null ? '…' : haceCuanto(ahora - new Date(datos.generado).getTime())}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">
              {envivo ? 'En vivo desde GitHub' : 'Copia del último deploy'} · generado {fmtFechaHora(datos.generado)}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">Buenos Aires</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{ahora === null ? '…' : fmtHora(ahora)}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{dia ? 'Turno de día' : 'Turno de noche'}</p>
          </div>
        </div>

        <Turnos hora={hora} />
      </header>

      <Equipo e={panel.equipo} a={panel.automatizaciones} ahora={ahora} />

      <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Línea de tiempo</h2>
        <ol className="mt-3 space-y-2 border-l border-zinc-800 pl-4">
          {eventos.map(({ d, t }) => (
            <li key={d.id} className="relative text-sm">
              <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-amber-400" />
              <span className="mr-2" aria-hidden>{d.emoji}</span>
              <span className="font-semibold">{d.nombre}</span>
              <span className="text-zinc-400">
                {' · '}
                {descripcionEvento(d)}
                {' · '}
                {d.ultima_actividad && d.ultima_actividad.length > 10
                  ? ahora === null
                    ? ''
                    : haceCuanto(ahora - t)
                  : d.ultima_actividad}
              </span>
            </li>
          ))}
          {deptos.some((d) => d.sin_registro) && (
            <li className="relative text-sm text-zinc-500">
              <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-sky-400" />
              <span className="mr-2" aria-hidden>👁️</span>
              Guardia: corre sola cada 2 h y cada 15 min, pero no deja registro de cada pasada.
            </li>
          )}
        </ol>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deptos.map((d, i) => (
          <Tarjeta key={d.id} d={d} i={i} ahora={ahora} />
        ))}
      </div>
    </>
  )
}

function descripcionEvento(d: Depto): string {
  if (d.id === 'publicacion') return d.ultimo_trabajo ? `último post: ${d.ultimo_trabajo}` : 'último post'
  if (d.id === 'auditoria') return 'último chequeo'
  if (d.id === 'analisis') return 'última medición'
  return 'última entrega'
}

function Turnos({ hora }: { hora: number | null }) {
  return (
    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">Turnos (hora de Buenos Aires)</p>
      <div className="relative mt-3 flex h-7 overflow-hidden rounded-lg text-[11px] font-semibold">
        <div className="grid place-items-center bg-sky-400/10 text-sky-300" style={{ width: `${(TURNO_DIA.desde / 24) * 100}%` }}>
          Guardia
        </div>
        <div
          className="grid place-items-center bg-amber-400/20 text-amber-300"
          style={{ width: `${((TURNO_DIA.hasta - TURNO_DIA.desde) / 24) * 100}%` }}
        >
          Bot + Claude + Grok
        </div>
        <div className="grid place-items-center bg-sky-400/10 text-sky-300" style={{ width: `${((24 - TURNO_DIA.hasta) / 24) * 100}%` }}>
          Guardia
        </div>
        {hora !== null && (
          <span
            aria-hidden
            className="absolute top-0 h-full w-0.5 bg-white"
            style={{ left: `${(hora / 24) * 100}%` }}
          />
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        De noche ({TURNO_DIA.hasta}:00 a {TURNO_DIA.desde}:00) solo trabaja la guardia: Vigilante y alertas.
        De día suman el bot, Claude y Grok.
      </p>
    </div>
  )
}

function Tarjeta({ d, i, ahora }: { d: Depto; i: number; ahora: number | null }) {
  const nivel = ahora === null ? null : salud(d, ahora).nivel
  const borde =
    nivel === 'revisar' ? 'border-red-500/50' : nivel === 'pausa' ? 'border-amber-400/30' : 'border-zinc-800'
  const badge = d.badge ?? (d.automatico ? 'Automático' : 'A demanda')
  return (
    <section
      className={`rise-in flex flex-col rounded-2xl border ${borde} bg-zinc-900/70 p-5 ${d.proximamente ? 'opacity-60' : ''}`}
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
            d.automatico ? 'bg-amber-400/15 text-amber-300' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="mt-3">
        <Estado depto={d} ahora={ahora} />
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
  )
}
