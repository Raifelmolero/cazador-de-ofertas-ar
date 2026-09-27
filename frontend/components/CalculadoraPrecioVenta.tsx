'use client'

import { useState } from 'react'
import { CARGO_MAX, CARGO_MIN, CARGO_REFERENCIA, CUOTAS, UMBRAL_COSTO_FIJO, calcular } from '@/lib/costosml'
import { precioParaGanancia } from '@/lib/precioventa'

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
  prefijo = '$',
}: {
  label: string
  ayuda?: string
  value: string
  onChange: (v: string) => void
  prefijo?: string
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
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${inputCls} pl-7 pr-3`}
        />
      </div>
      {ayuda && <span className="block text-xs text-zinc-600 mt-1">{ayuda}</span>}
    </label>
  )
}

export default function CalculadoraPrecioVenta() {
  const [costo, setCosto] = useState('20000')
  const [ganancia, setGanancia] = useState('30')
  const [modo, setModo] = useState<'pct' | 'pesos'>('pct')
  const [envio, setEnvio] = useState('0')
  const [cargoPct, setCargoPct] = useState(CARGO_REFERENCIA)
  const [cuotasId, setCuotasId] = useState('sin')

  const cuotasPct = CUOTAS.find(o => o.id === cuotasId)?.pct ?? 0
  const c = parseFloat(costo) || 0
  const g = parseFloat(ganancia) || 0
  const gananciaPesos = modo === 'pct' ? (c * g) / 100 : g
  const e = parseFloat(envio) || 0
  const s = precioParaGanancia({ costo: c, ganancia: gananciaPesos, cargoPct, cuotasPct, envio: e })
  const r = s ? calcular({ precio: s.precio, cargoPct, cuotasPct, envio: e, costo: c }) : null
  const enUmbral = s !== null && s.precio === UMBRAL_COSTO_FIJO

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <Campo label="Tu costo del producto" ayuda="Lo que te sale comprarlo o fabricarlo." value={costo} onChange={setCosto} />
        <div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Campo
                label="Ganancia que querés por venta"
                prefijo={modo === 'pct' ? '%' : '$'}
                value={ganancia}
                onChange={setGanancia}
              />
            </div>
            <div className="flex rounded-xl border border-zinc-700 overflow-hidden text-sm" role="group" aria-label="Tipo de ganancia">
              {(['pct', 'pesos'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={modo === m}
                  onClick={() => setModo(m)}
                  className={`px-3 py-2.5 ${modo === m ? 'bg-yellow-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'}`}
                >
                  {m === 'pct' ? '% del costo' : 'en $'}
                </button>
              ))}
            </div>
          </div>
          {modo === 'pct' && (
            <span className="block text-xs text-zinc-600 mt-1">
              {coma(g, 0)}% sobre tu costo = {ars(gananciaPesos)} por venta.
            </span>
          )}
        </div>
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
          <span className="block text-xs text-zinc-600 mt-1">
            Va de {coma(CARGO_MIN)}% a {coma(CARGO_MAX)}% según la categoría y tu provincia. Arranca en{' '}
            {coma(CARGO_REFERENCIA)}%, el punto medio.
          </span>
        </label>
        <label className="block">
          <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Cuotas que ofrecés</span>
          <select value={cuotasId} onChange={ev => setCuotasId(ev.target.value)} className={`${inputCls} px-3`}>
            {CUOTAS.map(o => (
              <option key={o.id} value={o.id}>
                {o.nombre}
                {o.pct ? ` (+${coma(o.pct, 1)}%)` : ''}
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
        {s && r ? (
          <>
            <div className="rounded-xl p-4 text-center bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs text-zinc-400">Publicá a</p>
              <p className="font-display text-4xl font-black text-emerald-300" aria-live="polite">
                {ars(s.precio)}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                para ganar {ars(r.ganancia)} por venta (pediste {ars(gananciaPesos)})
              </p>
            </div>

            {enUmbral && (
              <p className="mt-4 text-sm text-zinc-300 bg-zinc-800/60 rounded-xl p-3 [text-wrap:pretty]">
                Justo debajo de {ars(UMBRAL_COSTO_FIJO)} el costo fijo por unidad no te deja llegar a tu ganancia, y desde{' '}
                {ars(UMBRAL_COSTO_FIJO)} ya no se cobra. Por eso el precio mínimo es exactamente {ars(UMBRAL_COSTO_FIJO)} y
                ganás algo más de lo que pediste.
              </p>
            )}
            {s.subirAlUmbral && (
              <p className="mt-4 text-sm text-yellow-200 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 [text-wrap:pretty]">
                💡 Estás cerca de {ars(UMBRAL_COSTO_FIJO)}. Si publicás a {ars(UMBRAL_COSTO_FIJO)} no pagás el costo fijo por
                unidad ({ars(r.fijo)}) y ganás {ars(s.subirAlUmbral.gananciaExtra)} más por venta, subiendo el precio solo{' '}
                {ars(UMBRAL_COSTO_FIJO - s.precio)}.
              </p>
            )}

            <h2 className="font-bold text-zinc-300 mt-6 mb-3 text-sm">Comprobación a {ars(s.precio)}</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-zinc-400">Precio de venta</dt><dd>{ars(s.precio)}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-400">Cargo por vender ({coma(cargoPct)}%)</dt><dd className="text-red-300">−{ars(r.cargo)}</dd></div>
              {r.cuotas > 0 && (
                <div className="flex justify-between"><dt className="text-zinc-400">Costo por cuotas ({coma(cuotasPct, 1)}%)</dt><dd className="text-red-300">−{ars(r.cuotas)}</dd></div>
              )}
              <div className="flex justify-between">
                <dt className="text-zinc-400">Costo fijo por unidad{s.precio >= UMBRAL_COSTO_FIJO ? ' (no aplica)' : ''}</dt>
                <dd className="text-red-300">−{ars(r.fijo)}</dd>
              </div>
              {e > 0 && (
                <div className="flex justify-between"><dt className="text-zinc-400">Envío</dt><dd className="text-red-300">−{ars(e)}</dd></div>
              )}
              <div className="flex justify-between border-t border-zinc-800 pt-2.5 font-bold"><dt>Te queda de Mercado Libre</dt><dd>{ars(r.recibis)}</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-400">Tu costo</dt><dd className="text-red-300">−{ars(c)}</dd></div>
              <div className="flex justify-between border-t border-zinc-800 pt-2.5 font-bold text-emerald-300"><dt>Tu ganancia</dt><dd>{ars(r.ganancia)}</dd></div>
            </dl>
            {r.margenPct !== null && (
              <p className="text-xs text-zinc-500 mt-3">
                Margen sobre el precio: {coma(r.margenPct, 1)}% · ML se lleva {ars(r.totalML)}
              </p>
            )}
          </>
        ) : (
          <p className="text-zinc-400">Con ese cargo y esas cuotas, Mercado Libre se lleva todo el precio. Probá con menos cuotas.</p>
        )}
        <p className="text-xs text-zinc-600 mt-4 [text-wrap:pretty]">
          Redondeamos al peso para arriba. El costo fijo usa la tabla de Envíos Flex; con Full o correo varía un poco según el
          peso. No incluye impuestos propios de tu condición fiscal.
        </p>
      </div>
    </section>
  )
}
