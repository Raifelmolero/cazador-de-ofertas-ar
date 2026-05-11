'use client'

import { useState } from 'react'

interface Props {
  precioML: number
  comisionArs: number
  iibbArs: number
  envioArs: number
}

export default function ProfitCalculator({ precioML, comisionArs, iibbArs, envioArs }: Props) {
  const [costo, setCosto] = useState('')

  const costoNum = parseFloat(costo) || 0
  const totalDescuentos = comisionArs + iibbArs + envioArs + costoNum
  const gananciaNeta = precioML - totalDescuentos
  const roi = costoNum > 0 ? (gananciaNeta / costoNum) * 100 : null
  const isPositive = gananciaNeta >= 0

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-white mb-1">Calculadora de Ganancia</h2>
      <p className="text-sm text-gray-500 mb-6">
        Ingresá tu costo de adquisición para ver la ganancia neta real.
      </p>

      {/* Input */}
      <div className="mb-6">
        <label className="block text-xs text-gray-400 mb-2 font-medium">
          Tu costo de adquisición (ARS)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold select-none">
            $
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={costo}
            onChange={e => setCosto(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-4 text-white text-2xl font-bold placeholder-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Result: placeholder until user enters cost */}
      {costoNum === 0 ? (
        <div className="rounded-xl p-6 border border-gray-800 bg-gray-800/30 flex flex-col items-center justify-center gap-2 text-center min-h-[120px]">
          <p className="text-gray-300 font-medium">Ingresá tu costo para calcular ganancia</p>
          <p className="text-xs text-gray-600">El ROI y la ganancia neta aparecerán aquí</p>
        </div>
      ) : (
        <div className={`rounded-xl p-5 border transition-colors duration-300 ${
          isPositive
            ? 'bg-emerald-950/40 border-emerald-800/60'
            : 'bg-red-950/40 border-red-800/60'
        }`}>
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Ganancia neta estimada</p>
              <p className={`text-4xl font-bold tabular-nums ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '' : '-'}${Math.abs(Math.round(gananciaNeta)).toLocaleString('es-AR')}
              </p>
            </div>
            {roi !== null && (
              <div className={`text-center px-4 py-3 rounded-xl border ${
                isPositive
                  ? 'bg-emerald-400/10 border-emerald-700/40 text-emerald-300'
                  : 'bg-red-400/10 border-red-700/40 text-red-300'
              }`}>
                <p className="text-xs opacity-70 mb-0.5">ROI</p>
                <p className="text-2xl font-bold tabular-nums">{roi.toFixed(0)}%</p>
              </div>
            )}
          </div>

          {/* Breakdown rows */}
          <div className="space-y-2 text-sm border-t border-gray-800/50 pt-4">
            <div className="flex justify-between text-gray-400">
              <span>Precio de venta ML</span>
              <span className="text-white font-medium tabular-nums">
                +${precioML.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tu costo</span>
              <span className="text-red-400 tabular-nums">
                -${Math.round(costoNum).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Comisión ML (15%)</span>
              <span className="text-red-400 tabular-nums">
                -${Math.round(comisionArs).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Retención IIBB (3%)</span>
              <span className="text-red-400 tabular-nums">
                -${Math.round(iibbArs).toLocaleString('es-AR')}
              </span>
            </div>
            {envioArs > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Costo de envío</span>
                <span className="text-red-400 tabular-nums">
                  -${Math.round(envioArs).toLocaleString('es-AR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
