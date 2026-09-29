'use client'

import { useState } from 'react'
import {
  BTU_POR_FRIGORIA,
  FRIGORIAS_POR_KW,
  SOLES,
  calcularFrigorias,
  sirvePara,
  type Sol,
} from '@/lib/frigorias'

export interface AireOferta {
  id: string
  titulo: string
  precio: number
  descuento: number | null
  url: string
  frig: number
}

const num = (s: string) => parseFloat(s.replace(',', '.')) || 0
const miles = (n: number) => Math.round(n).toLocaleString('es-AR')
const ars = (n: number) => `$${miles(n)}`
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

export default function CalculadoraFrigorias({ aires, busqueda }: { aires: AireOferta[]; busqueda: string }) {
  const [m2, setM2] = useState('20')
  const [altura, setAltura] = useState('2,6')
  const [sol, setSol] = useState<Sol>('normal')
  const [personas, setPersonas] = useState('2')
  const [watts, setWatts] = useState('0')
  const r = calcularFrigorias({ m2: num(m2), altura: num(altura), sol, personas: num(personas), watts: num(watts) })
  const aptos = aires.filter(a => sirvePara(a.frig, r.total, r.recomendado)).slice(0, 8)

  // Conversor libre
  const [conv, setConv] = useState('3000')
  const [unidad, setUnidad] = useState<'frig' | 'btu' | 'kw'>('frig')
  const v = num(conv)
  const fr = unidad === 'frig' ? v : unidad === 'btu' ? v / BTU_POR_FRIGORIA : v * FRIGORIAS_POR_KW

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Superficie (m²)" ayuda="Largo × ancho" value={m2} onChange={setM2} />
            <Campo label="Altura del techo (m)" ayuda="Normal: 2,50 a 2,70" value={altura} onChange={setAltura} />
            <Campo label="Personas habitualmente" ayuda="Desde la tercera suman 100 frig. c/u" value={personas} onChange={setPersonas} />
            <Campo label="Equipos prendidos (W)" ayuda="TV, PC, heladera… (opcional)" value={watts} onChange={setWatts} />
          </div>
          <fieldset>
            <legend className="block text-xs text-zinc-400 mb-1.5 font-medium">Sol / orientación</legend>
            <div className="grid grid-cols-3 gap-2">
              {SOLES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSol(s.id)}
                  aria-pressed={sol === s.id}
                  className={`rounded-xl border px-2 py-2 text-left text-xs ${sol === s.id ? 'border-yellow-400 bg-yellow-400/10 text-yellow-200' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}
                >
                  <span className="block font-bold">{s.nombre}</span>
                  <span className="block text-zinc-500">{s.ayuda}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-5 sm:p-6" aria-live="polite">
          <p className="text-xs text-zinc-400 font-medium">Necesitás aproximadamente</p>
          <p className="font-display text-4xl sm:text-5xl font-black text-yellow-400 my-1">{miles(r.total)} frigorías</p>
          <p className="text-sm text-zinc-400">
            = {miles(r.btu)} BTU/h · {r.kw.toLocaleString('es-AR')} kW
          </p>
          <p className="mt-4 text-lg font-bold text-zinc-100">
            {r.recomendado
              ? `Equipo recomendado: ${miles(r.recomendado)} frigorías`
              : r.total > 0
                ? 'Más de 6.000 frigorías: conviene dividir en dos equipos o consultar a un instalador.'
                : 'Completá los metros del ambiente.'}
          </p>
          <dl className="mt-4 text-sm text-zinc-400 space-y-1">
            <div className="flex justify-between"><dt>Volumen × 50</dt><dd>{miles(r.base)}</dd></div>
            <div className="flex justify-between"><dt>Sol</dt><dd>+{miles(r.porSol)}</dd></div>
            <div className="flex justify-between"><dt>Personas extra</dt><dd>+{miles(r.porPersonas)}</dd></div>
            <div className="flex justify-between"><dt>Equipos (W × 0,86)</dt><dd>+{miles(r.porEquipos)}</dd></div>
          </dl>
          <p className="text-xs text-zinc-600 mt-4">
            Estimación orientativa: para ambientes especiales, pedí el cálculo a un instalador matriculado.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl sm:text-2xl font-black mb-3">
          Aires en oferta hoy {r.recomendado ? `para ${miles(r.recomendado)} frigorías` : 'para tu ambiente'}
        </h2>
        {aptos.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            Hoy no tenemos ofertas verificadas de ese tamaño.{' '}
            <a href={busqueda} target="_blank" rel="sponsored nofollow noopener" className="text-yellow-400 hover:underline">
              Ver aires en Mercado Libre ↗
            </a>
          </p>
        ) : (
          <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
            {aptos.map(a => (
              <li key={a.id} className="flex items-baseline justify-between gap-3 px-3 py-2.5 text-sm">
                <a href={a.url} target="_blank" rel="sponsored nofollow noopener" className="text-zinc-300 hover:text-yellow-400">
                  {a.titulo} <span className="text-zinc-500">({miles(a.frig)} frig.)</span>
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
          Links de afiliado de Mercado Libre: si comprás, ganamos una comisión y el precio para vos es el mismo. Las
          frigorías salen del título de cada publicación; confirmalas en la ficha antes de comprar.
        </p>
      </section>

      <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-xl font-black mb-3">Conversor frigorías ↔ BTU ↔ kW</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-40">
            <Campo label="Valor" value={conv} onChange={setConv} />
          </div>
          <label className="block">
            <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Unidad</span>
            <select value={unidad} onChange={e => setUnidad(e.target.value as 'frig' | 'btu' | 'kw')} className={inputCls}>
              <option value="frig">frigorías/h</option>
              <option value="btu">BTU/h</option>
              <option value="kw">kW</option>
            </select>
          </label>
        </div>
        <p className="mt-3 text-zinc-200">
          {miles(fr)} frigorías/h = {miles(fr * BTU_POR_FRIGORIA)} BTU/h ={' '}
          {(fr / FRIGORIAS_POR_KW).toLocaleString('es-AR', { maximumFractionDigits: 2 })} kW
        </p>
      </section>
    </div>
  )
}
