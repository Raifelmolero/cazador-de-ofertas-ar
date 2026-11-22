import { RUBROS_FILTRO } from '@/lib/rubros-filtro'

/** Celular (68 % de las visitas): el menú de rubros está oculto y el buscador
 *  de la grilla aparece recién en la pantalla 4-5. Esta fila va dentro del
 *  header fijo: buscador (salta a la grilla con ?q=) + filtro rápido por rubro
 *  (salta a la grilla con ?categoria=). En pantallas grandes no se muestra:
 *  ahí está el menú, y los mismos filtros están arriba de la grilla. */
export default function AtajosCelular() {
  return (
    <div className="xl:hidden border-t border-zinc-900 px-4 pb-1 pt-1">
      <form method="get" role="search" className="flex gap-2">
        <label htmlFor="buscar-celular" className="sr-only">Buscar ofertas</label>
        <input
          id="buscar-celular"
          name="q"
          type="search"
          placeholder="Buscá: aire, iphone…"
          className="h-11 min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 text-base text-zinc-100 placeholder:text-zinc-400 focus:border-yellow-400 focus:outline-none"
        />
        <button type="submit" className="h-11 rounded-full bg-[#FACC15] px-4 text-base font-bold text-black">
          Buscar
        </button>
      </form>
      <nav aria-label="Filtrar por categoría" className="-mx-4 mt-1 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {RUBROS_FILTRO.map(r => (
          <a
            key={r.slug}
            href={`?categoria=${r.slug}#ofertas`}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-zinc-700 bg-zinc-900 px-4 text-base font-semibold text-zinc-200 hover:border-yellow-400"
          >
            {r.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
