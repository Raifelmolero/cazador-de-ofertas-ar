'use client'

import { useState } from 'react'
import { CARGO_MAX, CARGO_MIN, CUOTAS, UMBRAL_COSTO_FIJO, calcular } from '@/lib/costosml'

const ars = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function Campo({
  label,
  ayuda,
  value,
  onChange,
}: {
  label: string
  ayuda?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 select-none">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl pl-7 pr-3 py-2.5 text-white"
        />
      </div>
      {ayuda && <span className="block text-xs text-zinc-600 mt-1">{ayuda}</span>}
    </label>
  )
}

export default function CalculadoraComisiones() {
  const [precio, setPrecio] = useState('50000')
  const [costo, setCosto] = useState('25000')
  const [envio, setEnvio] = useState('0')
  const [cargoPct, setCargoPct] = useState(14)
  const [cuotasId, setCuotasId] = useState('sin')

  const cuotasPct = CUOTAS.find(c => c.id === cuotasId)?.pct ?? 0
  const p = parseFloat(precio) || 0
  const r = calcular({
    precio: p,
    cargoPct,
    cuotasPct,
    envio: parseFloat(envio) || 0,
    costo: parseFloat(costo) || 0,
  })
  const positivo = r.ganancia >= 0

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <Campo label="Precio de venta en Mercado Libre" value={precio} onChange={setPrecio} />
        <Campo
          label="Tu costo del producto"
          ayuda="Lo que te sale comprarlo o fabricarlo."
          value={costo}
          onChange={setCosto}
        />
        <label className="block">
          <span className="block text-xs text-zinc-400 mb-1.5 font-medium">
            Cargo por vender de tu categoría: <b className="text-yellow-400">{cargoPct.toFixed(2).replace('.', ',')}%</b>
          </span>
          <input
            type="range"
            min={CARGO_MIN}
            max={CARGO_MAX}
            step={0.01}
            value={cargoPct}
            onChange={e => setCargoPct(parseFloat(e.target.value))}
            className="w-full accent-yellow-400"
          />
          <span className="block text-xs text-zinc-600 mt-1">
            Va de {String(CARGO_MIN).replace('.', ',')}% a {String(CARGO_MAX).replace('.', ',')}% según la categoría y tu provincia.
          </span>
        </label>
        <label className="block">
          <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Cuotas que ofrecés</span>
          <select
            value={cuotasId}
            onChange={e => setCuotasId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl px-3 py-2.5 text-white"
          >
            {CUOTAS.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
                {c.pct ? ` (+${String(c.pct).replace('.', ',')}%)` : ''}
              </option>
            ))}
          </select>
        </label>
        <Campo
          label="Envío que pagás vos (opcional)"
          ayuda="Si ofrecés envío gratis, poné lo que te cobra ML por el envío de ese producto."
          value={envio}
          onChange={setEnvio}
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6">
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between"><dt className="text-zinc-400">Precio de venta</dt><dd>{ars(p)}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-400">Cargo por vender ({cargoPct.toFixed(2).replace('.', ',')}%)</dt><dd className="text-red-300">−{ars(r.cargo)}</dd></div>
          {r.cuotas > 0 && (
            <div className="flex justify-between"><dt className="text-zinc-400">Costo por cuotas ({String(cuotasPct).replace('.', ',')}%)</dt><dd className="text-red-300">−{ars(r.cuotas)}</dd></div>
          )}
          <div className="flex justify-between">
            <dt className="text-zinc-400">Costo fijo por unidad{p >= UMBRAL_COSTO_FIJO ? ' (no aplica)' : ''}</dt>
            <dd className="text-red-300">−{ars(r.fijo)}</dd>
          </div>
          {parseFloat(envio) > 0 && (
            <div className="flex justify-between"><dt className="text-zinc-400">Envío</dt><dd className="text-red-300">−{ars(parseFloat(envio))}</dd></div>
          )}
          <div className="flex justify-between border-t border-zinc-800 pt-2.5 font-bold">
            <dt>Te queda de Mercado Libre</dt><dd>{ars(r.recibis)}</dd>
          </div>
          <div className="flex justify-between"><dt className="text-zinc-400">Tu costo</dt><dd className="text-red-300">−{ars(parseFloat(costo) || 0)}</dd></div>
        </dl>
        <div className={`mt-5 rounded-xl p-4 text-center ${positivo ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <p className="text-xs text-zinc-400">Ganancia por venta (antes de tus impuestos)</p>
          <p className={`font-display text-3xl font-black ${positivo ? 'text-emerald-300' : 'text-red-300'}`}>{ars(r.ganancia)}</p>
          {r.margenPct !== null && (
            <p className="text-sm text-zinc-400 mt-1">
              Margen sobre el precio: {r.margenPct.toFixed(1).replace('.', ',')}% · ML se lleva {ars(r.totalML)}
            </p>
          )}
        </div>
        <p className="text-xs text-zinc-600 mt-4 [text-wrap:pretty]">
          Estimación con los costos publicados por Mercado Libre. El costo fijo usa la tabla de Envíos Flex;
          con Full o correo varía un poco según el peso. No incluye impuestos propios de tu condición fiscal.
        </p>
      </div>
    </section>
  )
}
