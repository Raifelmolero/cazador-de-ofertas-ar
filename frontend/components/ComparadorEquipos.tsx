'use client'

// Parte interactiva del comparador (/comparador/[slug]): filtros por
// presupuesto, marca y specs, orden, y "comparar" hasta 3 equipos lado a lado.
// La lista completa ya viene en el HTML (la ven Google y las IAs); esto solo
// filtra en el navegador.
import { useMemo, useState } from 'react'
import Image from 'next/image'
import type { Equipo, FiltroSpec, Rango } from '@/lib/comparador'

const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)
const MAX_COMPARAR = 3

type Orden = 'precio' | 'precio-desc' | 'descuento' | 'minimo'

function Chip({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`text-xs sm:text-sm font-semibold rounded-full px-3 py-1.5 border transition-colors ${
        activo ? 'bg-yellow-400 text-black border-yellow-400' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
      }`}
    >
      {children}
    </button>
  )
}

/** Cuánto arriba de su mínimo registrado está hoy (null si no hay mínimo). */
const sobreMinimo = (e: Equipo) => (e.minimo ? Math.round((e.precio / e.minimo - 1) * 100) : null)

export default function ComparadorEquipos({
  equipos,
  rangos,
  filtros,
  specs,
  plural,
}: {
  equipos: Equipo[]
  rangos: Rango[]
  filtros: FiltroSpec[]
  specs: string[]
  plural: string
}) {
  const [rango, setRango] = useState<number | null>(null)
  const [marca, setMarca] = useState<string | null>(null)
  const [minimos, setMinimos] = useState<Record<string, number>>({})
  const [soloOferta, setSoloOferta] = useState(false)
  const [orden, setOrden] = useState<Orden>('precio')
  const [comparar, setComparar] = useState<string[]>([])

  const marcas = useMemo(() => {
    const n = new Map<string, number>()
    for (const e of equipos) n.set(e.marca, (n.get(e.marca) ?? 0) + 1)
    return [...n.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m)
  }, [equipos])

  const lista = useMemo(() => {
    const desde = rango === null || rango === 0 ? 0 : (rangos[rango - 1].hasta ?? 0)
    const hasta = rango === null ? null : rangos[rango].hasta
    const f = equipos.filter(
      e =>
        (rango === null || (e.precio > desde && (hasta === null || e.precio <= hasta))) &&
        (marca === null || e.marca === marca) &&
        (!soloOferta || e.enOferta) &&
        Object.entries(minimos).every(([k, v]) => (e.orden[k] ?? 0) >= v),
    )
    const s = [...f]
    if (orden === 'precio-desc') s.sort((a, b) => b.precio - a.precio)
    else if (orden === 'descuento') s.sort((a, b) => (b.descuento ?? -1) - (a.descuento ?? -1))
    else if (orden === 'minimo') s.sort((a, b) => (sobreMinimo(a) ?? 999) - (sobreMinimo(b) ?? 999) || a.precio - b.precio)
    return s
  }, [equipos, rangos, rango, marca, minimos, soloOferta, orden])

  const elegidos = comparar.map(id => equipos.find(e => e.id === id)).filter((e): e is Equipo => !!e)
  const toggleComparar = (id: string) =>
    setComparar(c => (c.includes(id) ? c.filter(x => x !== id) : c.length >= MAX_COMPARAR ? c : [...c, id]))
  const hayFiltros = rango !== null || marca !== null || soloOferta || Object.keys(minimos).length > 0

  return (
    <div>
      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Presupuesto</p>
          <div className="flex flex-wrap gap-2">
            {rangos.map((r, i) => (
              <Chip key={r.texto} activo={rango === i} onClick={() => setRango(rango === i ? null : i)}>
                {r.texto}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Marca</p>
          <div className="flex flex-wrap gap-2">
            {marcas.map(m => (
              <Chip key={m} activo={marca === m} onClick={() => setMarca(marca === m ? null : m)}>
                {m}
              </Chip>
            ))}
          </div>
        </div>
        {filtros.map(f => (
          <div key={f.clave}>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">{f.nombre}</p>
            <div className="flex flex-wrap gap-2">
              {f.opciones.map(o => (
                <Chip
                  key={o.valor}
                  activo={minimos[f.clave] === o.valor}
                  onClick={() =>
                    setMinimos(m => {
                      const n = { ...m }
                      if (n[f.clave] === o.valor) delete n[f.clave]
                      else n[f.clave] = o.valor
                      return n
                    })
                  }
                >
                  {o.texto}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Chip activo={soloOferta} onClick={() => setSoloOferta(!soloOferta)}>
            Solo en oferta hoy
          </Chip>
          <label className="text-sm text-zinc-400">
            Ordenar:{' '}
            <select
              value={orden}
              onChange={e => setOrden(e.target.value as Orden)}
              className="ml-1 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-200"
            >
              <option value="precio">Más barato primero</option>
              <option value="precio-desc">Más caro primero</option>
              <option value="descuento">Mayor descuento</option>
              <option value="minimo">Más cerca de su precio más bajo</option>
            </select>
          </label>
          {hayFiltros && (
            <button
              type="button"
              onClick={() => {
                setRango(null)
                setMarca(null)
                setMinimos({})
                setSoloOferta(false)
              }}
              className="text-sm font-semibold text-yellow-400 hover:underline"
            >
              Borrar filtros
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 mb-3 text-sm text-zinc-400" aria-live="polite">
        {lista.length} {plural} {hayFiltros ? 'con esos filtros' : 'para comparar'}
        {comparar.length > 0 ? ` · ${comparar.length} de ${MAX_COMPARAR} para comparar` : ' · tildá hasta 3 para compararlos'}
      </p>

      {elegidos.length >= 2 && (
        <div className="mb-6 overflow-x-auto rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.05]">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="p-3 text-zinc-500 font-semibold w-28"> </th>
                {elegidos.map(e => (
                  <th key={e.id} className="p-3 align-top font-semibold text-zinc-100 [text-wrap:pretty]">
                    {e.titulo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="p-3 text-zinc-500">Precio hoy</td>
                {elegidos.map(e => (
                  <td key={e.id} className="p-3 font-bold text-zinc-100">{pesos(e.precio)}</td>
                ))}
              </tr>
              <tr className="border-b border-zinc-800">
                <td className="p-3 text-zinc-500">Más bajo registrado</td>
                {elegidos.map(e => (
                  <td key={e.id} className="p-3 text-cyan-300">{e.minimo ? pesos(e.minimo) : '—'}</td>
                ))}
              </tr>
              {specs.map(k => (
                <tr key={k} className="border-b border-zinc-800">
                  <td className="p-3 text-zinc-500 capitalize">{k === 'ram' ? 'RAM' : k}</td>
                  {elegidos.map(e => (
                    <td key={e.id} className="p-3 text-zinc-200">{e.specs[k] ?? '—'}</td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3" />
                {elegidos.map(e => (
                  <td key={e.id} className="p-3">
                    <a href={e.url} target="_blank" rel="noopener noreferrer sponsored" className="inline-block text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg px-3 py-2">
                      Ver en Mercado Libre
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {lista.map(e => {
          const sm = sobreMinimo(e)
          const tildado = comparar.includes(e.id)
          return (
            <li key={e.id} className={`flex gap-3 rounded-2xl border p-3 ${tildado ? 'border-cyan-400/60 bg-cyan-500/[0.05]' : 'border-zinc-800 bg-zinc-900/60'}`}>
              {e.img && (
                <Image src={e.img} alt="" width={80} height={80} className="h-20 w-20 shrink-0 rounded-lg bg-white object-contain" />
              )}
              <div className="min-w-0 flex-1">
                <a href={e.url} target="_blank" rel="noopener noreferrer sponsored" className="block text-sm font-semibold text-zinc-100 hover:text-yellow-400 line-clamp-2">
                  {e.titulo}
                </a>
                {Object.keys(e.specs).length > 0 && (
                  <p className="mt-1 flex flex-wrap gap-1">
                    {specs.filter(k => e.specs[k]).map(k => (
                      <span key={k} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-300">{e.specs[k]}</span>
                    ))}
                  </p>
                )}
                <p className="mt-1.5 text-sm">
                  <strong className="text-zinc-50">{pesos(e.precio)}</strong>
                  {e.enOferta && e.descuento ? <span className="ml-1.5 text-emerald-300 font-semibold">{e.descuento}% OFF</span> : null}
                  {!e.enOferta && <span className="ml-1.5 text-zinc-500 text-xs">visto el {diaMes(e.visto)}</span>}
                </p>
                {e.minimo ? (
                  <p className="text-xs text-zinc-400">
                    Más bajo registrado: <span className="text-cyan-300">{pesos(e.minimo)}</span>
                    {sm !== null && (sm <= 2 ? <span className="text-emerald-300"> · está en su mínimo</span> : <span className="text-amber-300"> · {sm}% arriba</span>)}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <label className="inline-flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                    <input type="checkbox" checked={tildado} disabled={!tildado && comparar.length >= MAX_COMPARAR} onChange={() => toggleComparar(e.id)} className="accent-cyan-400" />
                    Comparar
                  </label>
                  {e.historial && (
                    <a href={`/precio/${e.historial}`} className="text-xs font-semibold text-yellow-400 hover:underline">Historial →</a>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {lista.length === 0 && <p className="text-sm text-zinc-500">No hay {plural} con esos filtros hoy. Probá sacar alguno.</p>}
    </div>
  )
}
