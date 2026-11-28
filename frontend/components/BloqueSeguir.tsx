// «Te avisamos antes que nadie» (rediseño 27/11, pedido del dueño): seguir en redes sin tapar
// ninguna oferta. Sin hooks: lo usan la home (servidor) y la grilla (cliente).
//
// El gancho es verdad: el bot publica en las redes en cada corrida (12, 17 y 21 h) y la web
// se actualiza con el deploy agrupado (cada ~3 días). Por eso «suelen salir primero ahí».
import SeguirRedes from '@/components/SeguirRedes'

export const GANCHO_SEGUIR =
  'Publicamos en las redes apenas cazamos una oferta; esta página se actualiza cada pocos días. Las que duran poco (relámpago, poco stock) suelen salir primero ahí.'

/** Bloque ancho, para el final de la home. */
export function BloqueSeguir({ className = '' }: { className?: string }) {
  return (
    <section aria-labelledby="seguir-titulo" className={`max-w-2xl mx-auto px-4 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-yellow-400/25 bg-zinc-900 px-5 py-6 sm:px-7">
        <p aria-hidden="true" className="pointer-events-none absolute -right-3 -top-4 select-none font-display text-[7rem] font-black leading-none text-yellow-400/[0.06]">
          ¡YA!
        </p>
        <h2 id="seguir-titulo" className="font-display text-xl sm:text-2xl font-black [text-wrap:balance]">
          Te avisamos antes que nadie
        </h2>
        <p className="mt-1.5 mb-4 text-sm text-zinc-300 leading-relaxed [text-wrap:pretty]">{GANCHO_SEGUIR}</p>
        <SeguirRedes donde="bloque_home" />
        <p className="mt-3 text-xs text-zinc-400">Gratis. Sin registrarte. Te vas cuando quieras.</p>
      </div>
    </section>
  )
}

/** Tarjeta intercalada en la grilla (cada ~12 ofertas): ocupa 2 columnas. */
export function TarjetaSeguir() {
  return (
    <div className="col-span-2 flex flex-col justify-center rounded-2xl border border-dashed border-yellow-400/40 bg-yellow-400/[0.06] p-4">
      <p className="font-display text-lg font-black leading-tight [text-wrap:balance]">¿Querés enterarte primero de la próxima?</p>
      <p className="mt-1 mb-3 text-sm text-zinc-300">Las ofertas cortas suelen salir antes en las redes que acá.</p>
      <SeguirRedes donde="tarjeta_grilla" />
    </div>
  )
}
