import { duelosConPrecio } from '@/lib/vs'
import { presupuestosConEquipos } from '@/lib/presupuesto'

/**
 * Links a todos los duelos /vs y los "mejor hasta $X" que hoy tienen precio.
 * Sin esto quedan a 3 clics de la portada y Google casi no los encuentra.
 */
export default function LinksTecno({ className = '' }: { className?: string }) {
  const duelos = duelosConPrecio()
  const presupuestos = presupuestosConEquipos()
  if (duelos.length === 0 && presupuestos.length === 0) return null
  const link = 'text-sm text-zinc-300 hover:text-yellow-400 underline-offset-2 hover:underline'
  return (
    <section className={className} aria-label="Comparativas de tecnología">
      {presupuestos.length > 0 && (
        <>
          <h2 className="font-display text-xl font-black mb-3">El mejor según tu presupuesto</h2>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-8">
            {presupuestos.map(x => (
              <li key={x.p.slug}>
                <a href={`/mejor/${x.p.slug}`} className={link}>
                  {x.p.slug.split('-hasta-')[0].replace('smart-tv', 'Smart TV').replace(/^./, c => c.toUpperCase())} hasta ${x.p.texto}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      {duelos.length > 0 && (
        <>
          <h2 className="font-display text-xl font-black mb-3">Cara a cara: ¿cuál conviene?</h2>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-8">
            {duelos.map(x => (
              <li key={x.duelo.slug}>
                <a href={`/vs/${x.duelo.slug}`} className={link}>
                  {x.a.modelo.nombre} vs {x.b.modelo.nombre}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
