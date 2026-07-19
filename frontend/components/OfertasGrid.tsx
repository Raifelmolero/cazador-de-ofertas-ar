'use client'

import { useMemo, useState } from 'react'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const CHIPS = [
  { id: 'all', label: 'Todas' },
  { id: 'low', label: '📉 Mínimo histórico' },
  { id: 'half', label: '50% OFF o más' },
  { id: 'cheap', label: 'Hasta $100.000' },
] as const

type ChipId = (typeof CHIPS)[number]['id']

function pasaChip(o: OfertaLight, chip: ChipId) {
  if (chip === 'low') return !!o.minimo_historico
  if (chip === 'half') return (o.descuento_pct ?? 0) >= 50
  if (chip === 'cheap') return o.precio_actual <= 100_000
  return true
}

export default function OfertasGrid({
  ofertas,
  telegramUrl,
}: {
  ofertas: OfertaLight[]
  telegramUrl: string
}) {
  const [q, setQ] = useState('')
  const [chip, setChip] = useState<ChipId>('all')

  const counts = useMemo(() => {
    const c: Record<ChipId, number> = { all: ofertas.length, low: 0, half: 0, cheap: 0 }
    for (const o of ofertas) {
      if (pasaChip(o, 'low')) c.low++
      if (pasaChip(o, 'half')) c.half++
      if (pasaChip(o, 'cheap')) c.cheap++
    }
    return c
  }, [ofertas])

  const nq = normalizar(q.trim())
  const filtrando = chip !== 'all' || nq !== ''
  const visibles = useMemo(
    () =>
      filtrando
        ? ofertas.filter(o => pasaChip(o, chip) && (!nq || normalizar(o.titulo).includes(nq)))
        : ofertas,
    [ofertas, chip, nq, filtrando]
  )

  return (
    <>
      {/* Búsqueda + filtros */}
      <div className="mb-4 sm:mb-5 space-y-3">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar entre las ofertas de hoy… (ej: colchón, aire, bici)"
          aria-label="Buscar ofertas"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400/60 focus-visible:ring-1 focus-visible:ring-yellow-400/60 transition-colors"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CHIPS.map(c => {
            const activo = chip === c.id
            const n = counts[c.id]
            if (c.id !== 'all' && n === 0) return null
            return (
              <button
                key={c.id}
                onClick={() => setChip(activo && c.id !== 'all' ? 'all' : c.id)}
                aria-pressed={activo}
                className={`shrink-0 text-xs font-bold rounded-full px-3.5 py-2 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  activo
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {c.label} <span className={activo ? 'text-black/60' : 'text-zinc-500'}>({n})</span>
              </button>
            )
          })}
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 mb-4">
            Nada con ese filtro por ahora 🎯 — el catálogo cambia 3 veces por día.
          </p>
          <button
            onClick={() => {
              setQ('')
              setChip('all')
            }}
            className="text-sm font-bold bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-white rounded-xl px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Ver todas las ofertas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtrando ? (
            visibles.map(o => <OfertaCard key={o.id_ml} producto={o} />)
          ) : (
            <>
              <OfertaCard producto={visibles[0]} featured priority />
              {visibles.slice(1, 7).map((o, i) => (
                <OfertaCard key={o.id_ml} producto={o} priority={i < 3} />
              ))}

              {/* CTA intercalado: después de 101 tarjetas nadie llega al del final */}
              {visibles.length > 7 && (
                <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-yellow-400 rounded-2xl px-5 py-4 sm:px-6 my-1">
                  <p className="text-black font-extrabold text-sm sm:text-base text-center sm:text-left [text-wrap:balance]">
                    📲 Las 3 mejores del día van directo al canal de Telegram, gratis
                  </p>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-black text-yellow-400 font-bold text-sm rounded-xl px-5 py-2.5 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    Unirme al canal ✈️
                  </a>
                </div>
              )}

              {visibles.slice(7).map(o => (
                <OfertaCard key={o.id_ml} producto={o} />
              ))}
            </>
          )}
        </div>
      )}
    </>
  )
}
