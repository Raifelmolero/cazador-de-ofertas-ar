import { busquedaML } from '@/lib/afiliado'
import type { Tendencias } from '@/lib/tendencias'

/** "Lo que más se busca hoy": palabras en tendencia de ML con link a la
 *  búsqueda (etiqueta web). No muestra precios ni descuentos: eso lo verifica
 *  el resto del sitio contra el historial. */
export default function TendenciasML({ datos }: { datos: Tendencias }) {
  const fecha = new Date(datos.actualizado).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', timeZone: 'America/Argentina/Buenos_Aires',
  })
  return (
    <section aria-label="Lo que más se busca hoy" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <h2 className="font-display text-base sm:text-xl font-black mb-1">📈 Lo que más se busca hoy en Mercado Libre</h2>
      <p className="text-xs text-zinc-500 mb-3">
        Búsquedas en tendencia al {fecha}. Tocá una y mirá los precios actuales en Mercado Libre.
      </p>
      <ul className="flex flex-wrap gap-2">
        {datos.items.slice(0, 24).map(t => (
          <li key={t.keyword}>
            <a
              href={busquedaML(t.keyword)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-block text-xs sm:text-sm font-semibold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-full px-3 py-1.5 transition-colors"
            >
              {t.keyword}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
