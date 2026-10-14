// Estado "hoy no hay ofertas" para las grillas de ofertas de una página de
// rubro. Nunca deja una grilla vacía sin explicación: dice qué pasa y da
// salidas a páginas con contenido (ver lib/afines.ts).
import Link from 'next/link'
import { DEALS_URL } from '@/lib/marca'
import type { EnlaceAfin } from '@/lib/afines'

export default function SinOfertas({ que, enlaces }: { que: string; enlaces: EnlaceAfin[] }) {
  return (
    <div className="max-w-xl mx-auto text-center py-8">
      <p className="text-zinc-200 font-semibold mb-2">Hoy no hay ofertas verificadas {que} 🎯</p>
      <p className="text-sm text-zinc-500 mb-5">
        Revisamos a mano las ofertas de Mercado Libre: volvé más tarde. Mientras tanto, mirá estas páginas relacionadas.
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {enlaces.map(e => (
          <li key={e.href}>
            <Link
              href={e.href}
              className="inline-block text-xs sm:text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-full px-3 py-1.5 transition-colors"
            >
              {e.texto}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={DEALS_URL}
            className="inline-block text-xs sm:text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-full px-3 py-1.5 transition-colors"
          >
            Todas las ofertas de hoy
          </a>
        </li>
      </ul>
    </div>
  )
}
