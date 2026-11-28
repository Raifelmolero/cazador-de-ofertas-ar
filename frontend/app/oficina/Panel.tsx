'use client'

// Bloque de decisión pensado para el celular: plata, canales, PRs que esperan
// el OK de Raifel y cupos. Lo que no se midió se dice («sin dato»); un dato
// viejo se marca en ámbar con su antigüedad. Nada de semanas escritas a mano:
// las etiquetas salen de las fechas del JSON.

import type { ReactNode } from 'react'
import { edadDias, haceCuanto, pesos, rangoCorto, type Cupo, type PanelOficina } from './salud'

const SIN = <span className="text-zinc-500">sin dato</span>

function Edad({ medido, ahora }: { medido: string | null; ahora: number | null }) {
  if (!medido) return <span className="text-xs text-red-400">sin fecha de medición</span>
  if (ahora === null) return null
  const d = edadDias(medido, ahora) ?? 0
  const viejo = d >= 2
  return (
    <span className={`text-xs ${viejo ? 'text-amber-300' : 'text-zinc-500'}`}>
      {viejo ? `⚠ dato de hace ${d} días` : `medido ${haceCuanto(ahora - new Date(medido).getTime())}`}
    </span>
  )
}

function Tarjeta({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{titulo}</h2>
      {children}
    </section>
  )
}

function Barra({ pct, color = 'bg-amber-400' }: { pct: number | null; color?: string }) {
  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-valuenow={pct ?? undefined} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, pct ?? 0))}%` }} />
    </div>
  )
}

function Plata({ titulo, rango, ganancia, meta, medido, fuente, ahora, extra }: {
  titulo: string
  rango: string
  ganancia: number | null
  meta: number
  medido: string | null
  fuente: string
  ahora: number | null
  extra?: string
}) {
  const pct = ganancia === null ? null : (ganancia / meta) * 100
  return (
    <Tarjeta titulo={`${titulo} · ${rango}`}>
      <p className="mt-1 text-3xl font-bold tabular-nums">{ganancia === null ? SIN : pesos(ganancia)}</p>
      <p className="text-xs text-zinc-400">
        {pct === null ? 'sin dato' : `${pct.toFixed(0)} %`} de {pesos(meta)}
        {ganancia !== null && ganancia < meta && ` · faltan ${pesos(meta - ganancia)}`}
        {extra ? ` · ${extra}` : ''}
      </p>
      <Barra pct={pct} color={pct !== null && pct >= 100 ? 'bg-emerald-400' : 'bg-amber-400'} />
      <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-zinc-500">
        <span>{fuente}</span>
        <Edad medido={medido} ahora={ahora} />
      </p>
    </Tarjeta>
  )
}

function CupoFila({ nombre, c, ahora }: { nombre: string; c: Cupo; ahora: number | null }) {
  const pct = c.pct_semana
  const color = pct === null ? 'bg-zinc-600' : pct >= 85 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-emerald-400'
  return (
    <li>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold">{nombre}</span>
        <span className="tabular-nums">
          {pct === null ? SIN : `${pct} % de la semana`}
          {c.pct_sesion != null && <span className="text-zinc-400"> · sesión {c.pct_sesion} %</span>}
        </span>
      </div>
      <Barra pct={pct} color={color} />
      <p className="mt-1 flex flex-wrap gap-x-2 text-xs text-zinc-500">
        {c.reinicia && <span>se renueva {c.reinicia.slice(8, 10)}/{c.reinicia.slice(5, 7)}</span>}
        {c.tope && <span>tope {c.tope}</span>}
        <Edad medido={c.medido} ahora={ahora} />
      </p>
    </li>
  )
}

export default function Panel({ p, ahora }: { p: PanelOficina; ahora: number | null }) {
  const { semana, mes, canales, prs_esperando: prs, cupos } = p
  const maxClics = Math.max(1, ...canales.items.map((i) => i.clics ?? 0))
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Plata
        titulo="Semana"
        rango={rangoCorto(semana.desde, semana.hasta)}
        ganancia={semana.ganancia}
        meta={p.metas.semana}
        medido={semana.medido}
        fuente={semana.fuente}
        ahora={ahora}
        extra={semana.clics != null ? `${semana.clics.toLocaleString('es-AR')} clics` : undefined}
      />
      <Plata
        titulo="Mes"
        rango={rangoCorto(mes.desde, mes.hasta)}
        ganancia={mes.ganancia}
        meta={p.metas.mes}
        medido={mes.medido}
        fuente={mes.fuente}
        ahora={ahora}
      />

      <Tarjeta titulo={`Clics por canal · ${rangoCorto(canales.desde, canales.hasta)}`}>
        <ul className="mt-2 space-y-2">
          {canales.items.map((c) => (
            <li key={c.n} className="text-sm">
              <div className="flex justify-between gap-2">
                <span>{c.n}</span>
                <span className="tabular-nums text-zinc-300">
                  {c.clics === null ? SIN : `${c.clics.toLocaleString('es-AR')} clics`}
                  {c.ventas != null && <span className="text-zinc-500"> · {c.ventas} ventas</span>}
                </span>
              </div>
              {c.clics !== null && (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-sky-400" style={{ width: `${(c.clics / maxClics) * 100}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs"><Edad medido={canales.medido} ahora={ahora} /></p>
      </Tarjeta>

      <Tarjeta titulo={`PRs esperando tu OK · ${prs.items.length}`}>
        <ul className="mt-2 space-y-2">
          {prs.items.map((r) => (
            <li key={r.n} className="text-sm">
              <a
                href={`https://github.com/Raifelmolero/cazador-de-ofertas-ar/pull/${r.n}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-amber-300 underline-offset-2 hover:underline"
              >
                #{r.n}
              </a>{' '}
              <span className="text-zinc-300">{r.titulo}</span>
              {r.nota && <span className="block text-xs text-zinc-500">{r.nota}</span>}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs"><Edad medido={prs.medido} ahora={ahora} /></p>
      </Tarjeta>

      <div className="sm:col-span-2">
        <Tarjeta titulo="Cupos (uso de Grok, Claude y Vercel)">
          <ul className="mt-2 grid gap-4 sm:grid-cols-3">
            <CupoFila nombre="Grok" c={cupos.grok} ahora={ahora} />
            <CupoFila nombre="Claude" c={cupos.claude} ahora={ahora} />
            <CupoFila nombre="Vercel" c={cupos.vercel} ahora={ahora} />
          </ul>
        </Tarjeta>
      </div>
    </div>
  )
}
