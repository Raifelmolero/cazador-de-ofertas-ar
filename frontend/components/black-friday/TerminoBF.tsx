// Aviso de «terminó» para /black-friday, las landings y las guías BF (modoBF === 'termino',
// desde el lunes 30/11, hora argentina). La página no queda muerta: los productos siguen con
// su link y este cuadro manda a las ofertas vigentes de hoy (la home del dominio de ofertas).
import type { ModoBF } from '@/lib/cybermonday'
import { DEALS_URL } from '@/lib/marca'

export default function TerminoBF({ modo, className = '' }: { modo: ModoBF; className?: string }) {
  if (modo !== 'termino') return null
  return (
    <div role="status" data-seccion="bf_termino" className={`rounded-2xl border-2 border-[#FACC15] bg-black p-3 text-zinc-100 ${className}`}>
      <p className="text-sm leading-relaxed [text-wrap:pretty]">
        <strong className="text-[#FACC15]">El Black Friday 2026 ya terminó</strong> (fue el viernes 27/11). Estos productos
        siguen con su link a Mercado Libre; el precio puede haber cambiado.
      </p>
      <a
        href={DEALS_URL}
        data-evento="bf_termino_ofertas_hoy"
        className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#FACC15] px-4 text-center text-base font-black text-black hover:bg-yellow-300"
      >
        Ver las ofertas vigentes de hoy →
      </a>
    </div>
  )
}
