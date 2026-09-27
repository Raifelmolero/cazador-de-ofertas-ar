'use client'

import { useState } from 'react'
import { CARGO_MAX, CARGO_MIN, CARGO_REFERENCIA, UMBRAL_COSTO_FIJO, calcular } from '@/lib/costosml'
import {
  PLANES_TN,
  PLAZOS_TARJETA,
  type MedioTN,
  type PlazoTarjeta,
  calcularTN,
  puntoEquilibrio,
} from '@/lib/tiendanube'

const ars = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const pct = (n: number, d = 2) => n.toFixed(d).replace('.', ',')
const num = (s: string) => Math.max(0, parseFloat(s) || 0)

function Campo({
  label,
  ayuda,
  value,
  onChange,
  pesos = true,
}: {
  label: string
  ayuda?: string
  value: string
  onChange: (v: string) => void
  pesos?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-xs text-zinc-400 mb-1.5 font-medium">{label}</span>
      <div className="relative">
        {pesos && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 select-none">$</span>}
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl ${pesos ? 'pl-7' : 'pl-3'} pr-3 py-2.5 text-white`}
        />
      </div>
      {ayuda && <span className="block text-xs text-zinc-600 mt-1">{ayuda}</span>}
    </label>
  )
}

const selectCls =
  'w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 outline-none rounded-xl px-3 py-2.5 text-white'

export default function CalculadoraMLvsTN() {
  const [precio, setPrecio] = useState('50000')
  const [costo, setCosto] = useState('30000')
  const [ventas, setVentas] = useState('20')
  const [cargoPct, setCargoPct] = useState(CARGO_REFERENCIA)
  const [planId, setPlanId] = useState<string>('esencial')
  const [medio, setMedio] = useState<MedioTN>('tarjeta')
  const [plazo, setPlazo] = useState<PlazoTarjeta>(14)

  const p = num(precio)
  const c = num(costo)
  const n = Math.floor(num(ventas))
  const plan = PLANES_TN.find(x => x.id === planId) ?? PLANES_TN[0]

  const ml = calcular({ precio: p, cargoPct, cuotasPct: 0, envio: 0, costo: c })
  const tn = calcularTN({ precio: p, costo: c, plan, medio, plazo })

  const mesML = ml.ganancia * n
  const mesTN = tn.ganancia * n - plan.abono
  const diferencia = mesTN - mesML
  const ahorroPorVenta = tn.ganancia - ml.ganancia
  const equilibrio = puntoEquilibrio(plan.abono, ahorroPorVenta)

  const ganaTN = diferencia > 0
  const empate = Math.round(diferencia) === 0

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <Campo label="Precio de venta" ayuda="El mismo precio en los dos lados." value={precio} onChange={setPrecio} />
        <Campo label="Tu costo del producto" ayuda="Lo que te sale comprarlo o fabricarlo." value={costo} onChange={setCosto} />
        <Campo label="Ventas por mes (unidades)" value={ventas} onChange={setVentas} pesos={false} />

        <fieldset className="border-t border-zinc-800 pt-5 space-y-4">
          <legend className="text-xs font-bold uppercase tracking-wider text-yellow-400 pr-2">Mercado Libre</legend>
          <label className="block">
            <span className="block text-xs text-zinc-400 mb-1.5 font-medium">
              Cargo por vender de tu categoría: <b className="text-yellow-400">{pct(cargoPct)}%</b>
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
              Va de {pct(CARGO_MIN)}% a {pct(CARGO_MAX)}% según la categoría y tu provincia. Arranca en {pct(CARGO_REFERENCIA)}%, el punto medio.
            </span>
          </label>
        </fieldset>

        <fieldset className="border-t border-zinc-800 pt-5 space-y-4">
          <legend className="text-xs font-bold uppercase tracking-wider text-yellow-400 pr-2">Tiendanube</legend>
          <label className="block">
            <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Plan</span>
            <select value={planId} onChange={e => setPlanId(e.target.value)} className={selectCls}>
              {PLANES_TN.map(x => (
                <option key={x.id} value={x.id}>
                  {x.nombre} ({x.abono ? `${ars(x.abono)} por mes` : 'gratis'})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Cómo te pagan (Pago Nube)</span>
            <select value={medio} onChange={e => setMedio(e.target.value as MedioTN)} className={selectCls}>
              <option value="tarjeta">Tarjeta de crédito o débito</option>
              <option value="transferencia">Transferencia bancaria</option>
            </select>
          </label>
          {medio === 'tarjeta' && (
            <label className="block">
              <span className="block text-xs text-zinc-400 mb-1.5 font-medium">Cuándo cobrás la venta con tarjeta</span>
              <select value={plazo} onChange={e => setPlazo(Number(e.target.value) as PlazoTarjeta)} className={selectCls}>
                {PLAZOS_TARJETA.map(d => (
                  <option key={d} value={d}>
                    A {d} {d === 1 ? 'día' : 'días'} ({pct(plan.tarjeta[d])}% + IVA)
                  </option>
                ))}
              </select>
              <span className="block text-xs text-zinc-600 mt-1">Cuanto antes cobrás, más alta es la tarifa.</span>
            </label>
          )}
        </fieldset>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-bold text-zinc-100 mb-3">Mercado Libre</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-zinc-400">Cargo ({pct(cargoPct)}%)</dt><dd className="text-red-300">−{ars(ml.cargo)}</dd></div>
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-400">Costo fijo{p >= UMBRAL_COSTO_FIJO ? ' (no aplica)' : ''}</dt>
                <dd className="text-red-300">−{ars(ml.fijo)}</dd>
              </div>
              <div className="flex justify-between gap-2"><dt className="text-zinc-400">Te queda</dt><dd>{ars(ml.recibis)}</dd></div>
              <div className="flex justify-between gap-2 border-t border-zinc-800 pt-2 font-bold"><dt>Ganancia por venta</dt><dd>{ars(ml.ganancia)}</dd></div>
              <div className="flex justify-between gap-2 font-bold text-yellow-300"><dt>Por mes ({n} ventas)</dt><dd>{ars(mesML)}</dd></div>
            </dl>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-bold text-zinc-100 mb-3">Tiendanube · {plan.nombre}</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-zinc-400">Pago Nube ({pct(tn.tarifaConIvaPct)}% c/IVA)</dt>
                <dd className="text-red-300">−{ars(tn.comision)}</dd>
              </div>
              <div className="flex justify-between gap-2"><dt className="text-zinc-400">Costo por transacción</dt><dd className="text-zinc-400">$ 0</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-zinc-400">Te queda</dt><dd>{ars(tn.recibis)}</dd></div>
              <div className="flex justify-between gap-2 border-t border-zinc-800 pt-2 font-bold"><dt>Ganancia por venta</dt><dd>{ars(tn.ganancia)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-zinc-400">Abono del plan</dt><dd className="text-red-300">−{ars(plan.abono)}</dd></div>
              <div className="flex justify-between gap-2 font-bold text-yellow-300"><dt>Por mes ({n} ventas)</dt><dd>{ars(mesTN)}</dd></div>
            </dl>
          </div>
        </div>

        <div
          className={`rounded-2xl p-5 text-center border ${
            empate ? 'bg-zinc-900 border-zinc-700' : ganaTN ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-sky-500/10 border-sky-500/30'
          }`}
          aria-live="polite"
        >
          <p className="text-xs text-zinc-400">Con estas ventas, por mes</p>
          <p className="font-display text-2xl sm:text-3xl font-black text-zinc-50 [text-wrap:balance]">
            {empate
              ? 'Te queda lo mismo en los dos'
              : ganaTN
                ? `Tiendanube te deja ${ars(diferencia)} más`
                : `Mercado Libre te deja ${ars(-diferencia)} más`}
          </p>
          <p className="text-sm text-zinc-400 mt-2 [text-wrap:pretty]">
            {equilibrio === 0
              ? `El plan ${plan.nombre} no tiene abono: por venta te ahorrás ${ars(ahorroPorVenta)} frente a ML desde la primera.`
              : equilibrio === null
                ? `Con este precio, en Tiendanube no te ahorrás nada por venta: el plan ${plan.nombre} no se paga solo.`
                : `Punto de equilibrio: con ${equilibrio} ${equilibrio === 1 ? 'venta' : 'ventas'} por mes el plan ${plan.nombre} se paga solo (te ahorrás ${ars(ahorroPorVenta)} por venta frente a ML).`}
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-4 text-sm text-zinc-300 leading-relaxed [text-wrap:pretty]">
          <b className="text-yellow-200">Ojo con la comparación:</b> la cuenta supone que vendés lo mismo en los dos lados.
          En Mercado Libre los compradores ya están buscando; en tu tienda de Tiendanube las visitas las conseguís vos
          (redes, WhatsApp, Google, anuncios), y eso también tiene costo y tiempo.
        </div>

        <p className="text-xs text-zinc-600 [text-wrap:pretty]">
          Sin envío (en $0 en los dos) y sin cuotas propias. Las tarifas de Pago Nube son las mínimas publicadas
          (&ldquo;a partir de&rdquo;) más 21% de IVA; con Pago Nube el costo por transacción de Tiendanube está bonificado.
          El abono del plan es el publicado por Tiendanube. El costo fijo de ML usa la tabla de Envíos Flex. No incluye
          impuestos propios de tu condición fiscal.
        </p>
      </div>
    </section>
  )
}
