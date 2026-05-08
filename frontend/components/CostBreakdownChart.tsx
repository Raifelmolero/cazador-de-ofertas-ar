interface Props {
  precio: number
  comisionArs: number
  iibbArs: number
  envioArs: number
  margenArs: number
}

interface BarItem {
  label: string
  sublabel: string
  value: number
  color: string
  textColor: string
}

export default function CostBreakdownChart({ precio, comisionArs, iibbArs, envioArs, margenArs }: Props) {
  const items: BarItem[] = [
    { label: 'Comisión ML', sublabel: '15%', value: comisionArs, color: 'bg-amber-500', textColor: 'text-amber-400' },
    { label: 'Retención IIBB', sublabel: '3%', value: iibbArs, color: 'bg-orange-500', textColor: 'text-orange-400' },
    { label: 'Costo de envío', sublabel: 'base', value: envioArs, color: 'bg-red-500', textColor: 'text-red-400' },
    { label: 'Margen potencial', sublabel: 'neto', value: margenArs, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  ]

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-white mb-5">Desglose de Costos</h2>

      {/* Stacked horizontal bar */}
      <div className="flex h-8 rounded-lg overflow-hidden gap-px mb-6">
        {items.map(item => {
          const pct = (item.value / precio) * 100
          if (pct <= 0) return null
          return (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-700 ease-out`}
              style={{ width: `${Math.max(pct, 0)}%` }}
              title={`${item.label}: ${pct.toFixed(1)}%`}
            />
          )
        })}
      </div>

      {/* Legend rows */}
      <div className="space-y-3">
        {items.map(item => {
          const pct = ((item.value / precio) * 100).toFixed(1)
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-sm ${item.color} flex-shrink-0`} />
                <div className="min-w-0">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <span className="text-xs text-gray-600 ml-1">({item.sublabel})</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-gray-600 tabular-nums">{pct}%</span>
                <span className={`text-sm font-semibold tabular-nums ${item.textColor}`}>
                  ${Math.round(item.value).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-800 flex justify-between items-center">
        <span className="text-sm text-gray-500">Precio de venta en ML</span>
        <span className="text-base font-bold text-white">${precio.toLocaleString('es-AR')}</span>
      </div>
    </section>
  )
}
