'use client'

import { useState } from 'react'
import { CARGO_MAX, CARGO_MIN, CARGO_REFERENCIA, CUOTAS } from '@/lib/costosml'
import { calcularCuotas } from '@/lib/cuotas'

const ars = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const coma = (n: number, d = 2) => n.toFixed(d).replace('.', ',')

const OPCIONES = CUOTAS.filter(c => c.pct > 0)

export default function CalculadoraCuotas() {
  const [precio, setPrecio] = useState('40000')
  const [id, setId] = useState('6')
  const [cargoPct, setCargoPct] = useState(CARGO_REFERENCIA)

  const p = parseFloat(precio) || 0
  const r = calcularCuotas(p, id, cargoPct)
  const op = CUOTAS.find(c => c.id === id)!

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <label className="block">
          <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Precio de venta</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 select-none">$</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl py-2.5 text-white pl-7 pr-3"
            />
          </div>
        </label>
        <fieldset>
          <legend className="block text-xs text-zinc-400 mb-1.5 font-medium">Cuotas que querés ofrecer</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {OPCIONES.map(x => (
              <button
                key={x.id}
                type="button"
                aria-pressed={id === x.id}
                onClick={() => setId(x.id)}
                className={`rounded-xl border px-3 py-2.5 text-sm text-left ${
                  id === x.id ? 'border-yellow-400 bg-yellow-400/10 text-white font-bold' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {x.nombre}
                <span className="block text-xs font-normal text-zinc-500">{coma(x.pct, 1)}% del precio</span>
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="block text-xs text-zinc-400 mb-1.5 font-medium">
            Cargo por vender de tu categoría: <b className="text-yellow-400">{coma(cargoPct)}%</b>
          </span>
          <input
            type="range"
            min={CARGO_MIN}
            max={CARGO_MAX}
            step={0.01}
            value={cargoPct}
            onChange={ev => setCargoPct(parseFloat(ev.target.value))}
            className="w-full accent-yellow-400"
          />
        </label>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6" aria-live="polite">
        {r ? (
          <>
            <div className="rounded-xl p-4 text-center bg-red-500/10 border border-red-500/30">
              <p className="text-xs text-zinc-400">Ofrecer {op.nombre.toLowerCase()} te cuesta</p>
              <p className="font-display text-4xl font-black text-red-300">{ars(r.costoCuotas)}</p>
              <p className="text-sm text-zinc-400 mt-1">por venta · {coma(r.pctCuotas, 1)}% de {ars(p)}</p>
            </div>
            <dl className="space-y-2.5 text-sm mt-6">
              <div className="flex justify-between"><dt className="text-zinc-400">Te deposita ML sin cuotas propias</dt><dd>{ars(r.recibisSin)}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-400">Te deposita ML con las cuotas</dt><dd className="text-red-300">{ars(r.recibisCon)}</dd></div>
            </dl>
            <div className="rounded-xl p-4 text-center bg-emerald-500/10 border border-emerald-500/30 mt-6">
              <p className="text-xs text-zinc-400">Para cobrar lo mismo que sin cuotas, publicá a</p>
              <p className="font-display text-4xl font-black text-emerald-300">{ars(r.precioIgual)}</p>
              <p className="text-sm text-zinc-400 mt-1">+{coma(r.subaPct, 1)}% sobre {ars(p)}</p>
            </div>
          </>
        ) : (
          <p className="text-zinc-400">Poné un precio mayor a 0.</p>
        )}
        <p className="text-xs text-zinc-600 mt-4 [text-wrap:pretty]">
          Antes del envío y de tus impuestos. Incluye el cargo por vender y el costo fijo por unidad (tabla de Envíos Flex, solo
          debajo de $33.000). El costo de las cuotas puede variar por categoría y promociones: confirmalo en el simulador de ML.
        </p>
      </div>
    </section>
  )
}
