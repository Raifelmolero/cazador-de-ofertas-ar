// Aviso de «terminó» para /black-friday, las landings y las guías BF (modoBF === 'termino',
// desde el lunes 30/11, hora argentina). La página no queda muerta: los productos siguen con
// su link y este cuadro manda a los regalos de Navidad (pedido del 27/11), a la categoría
// equivalente del rubro (lib/navidad-post-bf.ts) y a las ofertas vigentes de hoy.
import Link from 'next/link'
import type { ModoBF } from '@/lib/cybermonday'
import { DEALS_URL } from '@/lib/marca'
import { categoriaEquivalente } from '@/lib/navidad-post-bf'

export default function TerminoBF({ modo, landing, className = '' }: { modo: ModoBF; landing?: string; className?: string }) {
  if (modo !== 'termino') return null
  const cat = categoriaEquivalente(landing)
  return (
    <div role="status" data-seccion="bf_termino" className={`rounded-2xl border-2 border-[#FACC15] bg-black p-3 text-zinc-100 ${className}`}>
      <p className="font-display text-base font-black text-[#FACC15] [text-wrap:balance]">
        Black Friday terminó — estas siguen con buen precio
      </p>
      <p className="mt-1 text-sm leading-relaxed [text-wrap:pretty]">
        Fue el viernes 27/11. Los productos de esta página siguen con su link a Mercado Libre; revisá el precio en la
        publicación. Y si estás pensando en las fiestas, armamos los regalos de Navidad por presupuesto.
      </p>
      <Link
        href="/regalos-navidad"
        data-evento="bf_termino_navidad"
        className="mt-2 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#FACC15] px-4 text-center text-base font-black text-black hover:bg-yellow-300"
      >
        🎄 Ver los regalos de Navidad →
      </Link>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {cat && (
          <Link
            href={cat.href}
            data-evento="bf_termino_categoria"
            className="flex min-h-12 items-center justify-center rounded-xl border border-[#FACC15]/60 px-3 text-center text-sm font-bold text-[#FACC15] hover:bg-[#FACC15]/10"
          >
            Ver {cat.nombre} de hoy →
          </Link>
        )}
        <a
          href={DEALS_URL}
          data-evento="bf_termino_ofertas_hoy"
          className={`flex min-h-12 items-center justify-center rounded-xl border border-[#FACC15]/60 px-3 text-center text-sm font-bold text-[#FACC15] hover:bg-[#FACC15]/10 ${cat ? '' : 'sm:col-span-2'}`}
        >
          Ver las ofertas vigentes de hoy →
        </a>
      </div>
    </div>
  )
}
