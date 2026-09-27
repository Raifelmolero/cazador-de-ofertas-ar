'use client'

import { useState } from 'react'
import { CARGO_MAX, CARGO_MIN, CARGO_REFERENCIA, UMBRAL_COSTO_FIJO, calcular } from '@/lib/costosml'
import { AYUDA_COSTOS_ENVIO, PESO_MAX_TABLA, REPUTACIONES, costoEnvioGratis, type Reputacion } from '@/lib/enviogratis'

const ars = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const coma = (n: number, d = 2) => n.toFixed(d).replace('.', ',')

const inputCls =
  'w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl py-2.5 text-white'

function Campo({
  label,
  ayuda,
  value,
  onChange,
  prefijo,
}: {
  label: string
  ayuda?: string
  value: string
  onChange: (v: string) => void
  prefijo: string
}) {
  return (
    <label className="block">
      <span className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 select-none">{prefijo}</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${inputCls} ${prefijo.length > 1 ? 'pl-10' : 'pl-7'} pr-3`}
        />
      </div>
      {ayuda && <span className="block text-xs text-zinc-600 mt-1">{ayuda}</span>}
    </label>
  )
}

export default function CalculadoraEnvioGratis() {
  const [precio, setPrecio] = useState('40000')
  const [peso, setPeso] = useState('0.8')
  const [rep, setRep] = useState<Reputacion>('verde')
  const [cargoPct, setCargoPct] = useState(CARGO_REFERENCIA)

  const p = parseFloat(precio) || 0
  const kg = parseFloat(peso.replace(',', '.')) || 0
  const e = costoEnvioGratis(p, kg, rep)
  const r = e ? calcular({ precio: p, cargoPct, cuotasPct: 0, envio: e.costo, costo: 0 }) : null

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <Campo label="Precio de venta" value={precio} onChange={setPrecio} prefijo="$" />
        <Campo
          label="Peso del paquete ya embalado"
          ayuda="ML compara el peso físico con el volumétrico (por las medidas de la caja) y cobra el mayor: poné el más alto."
          value={peso}
          onChange={setPeso}
          prefijo="kg"
        />
        <fieldset>
          <legend className="block text-xs text-zinc-400 mb-1.5 font-medium">Color de tu reputación</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {REPUTACIONES.map(x => (
              <button
                key={x.id}
                type="button"
                aria-pressed={rep === x.id}
                onClick={() => setRep(x.id)}
                className={`rounded-xl border px-3 py-2.5 text-sm text-left ${
                  rep === x.id ? 'border-yellow-400 bg-yellow-400/10 text-white font-bold' : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {x.nombre}
                <span className="block text-xs font-normal text-zinc-500">
                  {x.descDesde33 ? `${x.descMenos33}% / ${x.descDesde33}% de descuento` : 'Sin descuento'}
                </span>
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
        {kg > PESO_MAX_TABLA ? (
          <p className="text-zinc-300 [text-wrap:pretty]">
            Para paquetes de más de {PESO_MAX_TABLA} kg no tenemos la tabla cargada (la oficial sigue hasta más de 180 kg).
            Consultá el costo en la{' '}
            <a href={AYUDA_COSTOS_ENVIO} target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline">
              ayuda de Mercado Libre
            </a>
            .
          </p>
        ) : e && r ? (
          <>
            <p
              className={`text-sm rounded-xl p-3 mb-4 ${
                e.obligatorio ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-200' : 'bg-zinc-800/60 text-zinc-300'
              }`}
            >
              {e.obligatorio
                ? `Desde ${ars(UMBRAL_COSTO_FIJO)} el envío gratis es obligatorio en productos nuevos y lo pagás vos (con descuento según tu reputación).`
                : `Debajo de ${ars(UMBRAL_COSTO_FIJO)} el envío gratis es opcional. Esto es lo que te cuesta si lo ofrecés.`}
            </p>
            <div className="rounded-xl p-4 text-center bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs text-zinc-400">El envío gratis te cuesta</p>
              <p className="font-display text-4xl font-black text-emerald-300">{ars(e.costo)}</p>
              <p className="text-sm text-zinc-400 mt-1">
                por unidad · {e.fila}
                {e.descuentoPct ? ` · ${e.descuentoPct}% de descuento sobre ${ars(e.sinDescuento)}` : ' · sin descuento'}
              </p>
            </div>
            <h2 className="font-bold text-zinc-300 mt-6 mb-3 text-sm">Cuánto te queda a {ars(p)}</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-zinc-400">Precio de venta</dt><dd>{ars(p)}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-400">Cargo por vender ({coma(cargoPct)}%)</dt><dd className="text-red-300">−{ars(r.cargo)}</dd></div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">Costo fijo por unidad{p >= UMBRAL_COSTO_FIJO ? ' (no aplica)' : ''}</dt>
                <dd className="text-red-300">−{ars(r.fijo)}</dd>
              </div>
              <div className="flex justify-between"><dt className="text-zinc-400">Envío gratis</dt><dd className="text-red-300">−{ars(e.costo)}</dd></div>
              <div className="flex justify-between border-t border-zinc-800 pt-2.5 font-bold text-emerald-300"><dt>Te deposita Mercado Libre</dt><dd>{ars(r.recibis)}</dd></div>
            </dl>
            <p className="text-xs text-zinc-500 mt-3">
              ML y el envío se llevan {ars(r.totalML + e.costo)} ({coma(p > 0 ? ((r.totalML + e.costo) / p) * 100 : 0, 1)}% del precio),
              antes de tu costo e impuestos.
            </p>
          </>
        ) : (
          <p className="text-zinc-400">Poné un precio y un peso mayor a 0.</p>
        )}
        <p className="text-xs text-zinc-600 mt-4 [text-wrap:pretty]">
          Productos nuevos, sin cuotas propias. Moda (zapatillas, camperas, etc.), usados y publicaciones gratuitas tienen tablas
          propias. El costo fijo usa la tabla de Envíos Flex.
        </p>
      </div>
    </section>
  )
}
