'use client'

import { useState } from 'react'
import { EQUIPOS, calcularConsumo, wattsDesdeKwhAnio } from '@/lib/consumo'

export interface OfertaEquipo {
  id: string
  titulo: string
  precio: number
  descuento: number | null
  url: string
}

const num = (s: string) => parseFloat(s.replace(',', '.')) || 0
const dec = (n: number, d = 1) => n.toLocaleString('es-AR', { maximumFractionDigits: d })
const ars = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`
const inputCls =
  'w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl px-3 py-2.5 text-white'

function Campo({ label, ayuda, value, onChange }: { label: string; ayuda?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</span>
      <input type="text" inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} className={inputCls} />
      {ayuda && <span className="block text-xs text-zinc-600 mt-1">{ayuda}</span>}
    </label>
  )
}

const aTexto = (n: number) => String(n).replace('.', ',')

export default function CalculadoraConsumo({
  ofertas,
  busquedas,
}: {
  ofertas: Record<string, OfertaEquipo[]>
  busquedas: Record<string, string>
}) {
  const [equipo, setEquipo] = useState(EQUIPOS[0].id)
  const [watts, setWatts] = useState(aTexto(EQUIPOS[0].watts))
  const [horas, setHoras] = useState(aTexto(EQUIPOS[0].horas))
  const [dias, setDias] = useState(aTexto(EQUIPOS[0].dias))
  const [precio, setPrecio] = useState('')
  const [kwhAnio, setKwhAnio] = useState('')

  const elegir = (id: string) => {
    const e = EQUIPOS.find(x => x.id === id)
    setEquipo(id)
    if (!e) return
    setWatts(aTexto(e.watts))
    setHoras(aTexto(e.horas))
    setDias(aTexto(e.dias))
  }
  const eq = EQUIPOS.find(x => x.id === equipo)
  const r = calcularConsumo(num(watts), num(horas), num(dias), num(precio))
  const lista = (ofertas[equipo] ?? []).slice(0, 6)

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <fieldset>
            <legend className="block text-xs text-zinc-400 mb-1.5 font-medium">Electrodoméstico</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EQUIPOS.map(e => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => elegir(e.id)}
                  aria-pressed={equipo === e.id}
                  className={`rounded-xl border px-2 py-2 text-left text-xs font-bold ${equipo === e.id ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  {e.nombre}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setEquipo('otro')}
                aria-pressed={equipo === 'otro'}
                className={`rounded-xl border px-2 py-2 text-left text-xs font-bold ${equipo === 'otro' ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
              >
                Otro (cargo los watts)
              </button>
            </div>
            {eq && <p className="text-xs text-zinc-500 mt-2">Estimación orientativa: {eq.nota}</p>}
          </fieldset>
          <div className="grid grid-cols-3 gap-4">
            <Campo label="Potencia (W)" ayuda="Etiqueta o placa" value={watts} onChange={setWatts} />
            <Campo label="Horas por día" value={horas} onChange={setHoras} />
            <Campo label="Días al mes" value={dias} onChange={setDias} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Precio del kWh ($, opcional)" ayuda="Está en tu factura de luz" value={precio} onChange={setPrecio} />
            <div>
              <Campo label="¿Tenés kWh/año de la etiqueta?" ayuda="Lo pasamos a W medios" value={kwhAnio} onChange={setKwhAnio} />
              {num(kwhAnio) > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setWatts(aTexto(Math.round(wattsDesdeKwhAnio(num(kwhAnio)) * 10) / 10))
                    setHoras('24')
                    setDias('30')
                  }}
                  className="mt-1 text-xs text-yellow-400 hover:underline"
                >
                  Usar {dec(wattsDesdeKwhAnio(num(kwhAnio)))} W × 24 h
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-5 sm:p-6" aria-live="polite">
          <p className="text-xs text-zinc-400 font-medium">Consumo estimado</p>
          <p className="font-display text-4xl sm:text-5xl font-black text-yellow-400 my-1">{dec(r.kwhMes)} kWh/mes</p>
          <p className="text-sm text-zinc-400">
            {dec(r.kwhDia, 2)} kWh por día · {dec(r.kwhAnio, 0)} kWh por año
          </p>
          <p className="mt-4 text-lg font-bold text-zinc-100">
            {r.costoMes != null
              ? `≈ ${ars(r.costoMes)} por mes (${ars(r.costoAnio ?? 0)} por año)`
              : 'Cargá el precio del kWh de tu factura para ver cuánto te cuesta.'}
          </p>
          <p className="text-xs text-zinc-600 mt-4">
            Cuenta: {dec(num(watts))} W × {dec(num(horas), 2)} h × {dec(num(dias), 0)} días ÷ 1000. El costo no incluye cargo
            fijo ni impuestos de la factura, y el precio del kWh puede cambiar según tu escalón de consumo.
          </p>
        </div>
      </section>

      {eq && (
        <section>
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Ofertas de hoy: {eq.nombre.toLowerCase()}</h2>
          {lista.length === 0 ? (
            <p className="text-zinc-400 text-sm">
              Hoy no tenemos ofertas verificadas de este equipo.{' '}
              <a href={busquedas[eq.id]} target="_blank" rel="sponsored nofollow noopener" className="text-yellow-400 hover:underline">
                Ver en Mercado Libre ↗
              </a>
            </p>
          ) : (
            <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
              {lista.map(a => (
                <li key={a.id} className="flex items-baseline justify-between gap-3 px-3 py-2.5 text-sm">
                  <a href={a.url} target="_blank" rel="sponsored nofollow noopener" className="text-zinc-300 hover:text-yellow-400">
                    {a.titulo}
                  </a>
                  <span className="whitespace-nowrap font-semibold text-zinc-100">
                    {ars(a.precio)}
                    {a.descuento != null && <span className="ml-2 text-red-400">-{a.descuento}%</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-zinc-500 mt-2">
            Links de afiliado de Mercado Libre: si comprás, ganamos una comisión y el precio para vos es el mismo. Antes de
            comprar, mirá la etiqueta de eficiencia energética en la ficha.
          </p>
        </section>
      )}
    </div>
  )
}
