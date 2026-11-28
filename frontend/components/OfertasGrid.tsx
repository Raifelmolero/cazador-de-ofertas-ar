'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { busquedaML } from '@/lib/afiliado'
import { EVENTO_FILTRO, PRESUPUESTOS_FILTRO, RUBROS_FILTRO, enPresupuesto, type DetalleFiltro, type PresupuestoId } from '@/lib/rubros-filtro'
import { TarjetaSeguir } from '@/components/BloqueSeguir'

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** «aire inverter» tiene que encontrar «Aire Acondicionado Split Inverter» y
 *  «aires» a «aire»: cada palabra por separado, en cualquier orden, y sin la s
 *  o es final (colchones → colchon, celulares → celular). */
function raiz(palabra: string) {
  if (palabra.length > 4 && palabra.endsWith('es')) return palabra.slice(0, -2)
  if (palabra.length > 3 && palabra.endsWith('s')) return palabra.slice(0, -1)
  return palabra
}
export function coincide(titulo: string, consulta: string) {
  const t = normalizar(titulo)
  return normalizar(consulta)
    .split(/\s+/)
    .filter(Boolean)
    .every(w => t.includes(raiz(w)))
}

function BuscarEnML({ q }: { q: string }) {
  return (
    <a
      href={busquedaML(q)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 rounded-xl px-4 py-3 text-sm transition-colors"
    >
      <span className="text-zinc-300">
        ¿No está lo que buscás? Buscá <b className="text-white">«{q.trim()}»</b> en todo Mercado Libre
      </span>
      <span className="shrink-0 font-bold text-yellow-400">Buscar en ML ↗</span>
    </a>
  )
}

/** Llega desde Google con ?q= («monitor 22 pulgadas», «rotomartillo westul»):
 *  Clarity 12-19/11, esas visitas se iban sin un clic (la mayoría buscaba algo
 *  que no tenemos cargado). Botón amarillo arriba, antes que cualquier tarjeta. */
function BuscarEnMLGrande({ q, hay }: { q: string; hay: number }) {
  return (
    <div data-seccion="buscar_ml_desde_google" className="mb-4 rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4">
      <p className="text-sm text-zinc-300 mb-3">
        {hay > 0 ? (
          <>Tenemos {hay} {hay === 1 ? 'oferta verificada' : 'ofertas verificadas'} con «{q.trim()}» (abajo). Para ver todos los modelos y vendedores:</>
        ) : (
          <>Hoy no tenemos «{q.trim()}» entre las ofertas verificadas. Mirá todas las publicaciones en Mercado Libre:</>
        )}
      </p>
      <a
        href={busquedaML(q)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="flex items-center justify-center text-center rounded-xl bg-yellow-400 hover:bg-yellow-300 px-5 py-3.5 font-black text-black transition-colors"
      >
        Ver «{q.trim()}» en Mercado Libre 🛒
      </a>
    </div>
  )
}

// Atajos de búsqueda en ML: con catálogo chico, mucha gente busca algo que no
// cargamos. Es un link de afiliado a un listado, no consulta nada a ML.
const RUBROS_ML = ['Heladeras', 'Aires acondicionados', 'Celulares', 'Notebooks', 'Smart TV', 'Colchones', 'Zapatillas', 'Lavarropas']

function BuscaPorRubro() {
  return (
    <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h2 className="font-display text-lg font-black mb-1">¿No ves lo que buscás?</h2>
      <p className="text-sm text-zinc-400 mb-3">Buscalo directo en Mercado Libre. El precio para vos es el mismo.</p>
      <div className="flex flex-wrap gap-2" data-seccion="buscar_ml">
        {RUBROS_ML.map(r => (
          <a
            key={r}
            href={busquedaML(r)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="text-sm font-bold bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-white rounded-full px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            {r} ↗
          </a>
        ))}
      </div>
    </section>
  )
}

// Sin filtro por % OFF: descuento_pct es el tachado de ML, no un descuento verificado.
const CHIPS = [
  { id: 'all', label: 'Todas' },
  ...RUBROS_FILTRO.map(r => ({ id: r.slug, label: r.label })),
  { id: 'flash', label: '⚡ Relámpago' },
  { id: 'low', label: '📉 Mínimo histórico' },
] as const

// Cada cuántas ofertas va la tarjeta de «Seguinos» (rediseño 27/11).
const CADA_SEGUIR = 12

type ChipId = (typeof CHIPS)[number]['id']

function pasaChip(o: OfertaLight, chip: ChipId) {
  if (chip === 'all') return true
  if (chip === 'flash') return !!o.relampago
  if (chip === 'low') return !!o.minimo_historico
  return o.rubro === chip
}

const ORDENES = [
  { id: 'relevancia', label: 'Más relevantes' },
  { id: 'precio_asc', label: 'Precio: menor a mayor' },
  { id: 'precio_desc', label: 'Precio: mayor a menor' },
] as const

type OrdenId = (typeof ORDENES)[number]['id']

function ordenar(ofertas: OfertaLight[], orden: OrdenId) {
  if (orden === 'relevancia') return ofertas
  const copia = [...ofertas]
  copia.sort((a, b) =>
    orden === 'precio_asc' ? a.precio_actual - b.precio_actual : b.precio_actual - a.precio_actual
  )
  return copia
}

/** Intercala la tarjeta de «Seguinos» cada CADA_SEGUIR ofertas (nunca al final de la lista). */
function conSeguir(tarjetas: React.ReactNode[], activo: boolean): React.ReactNode[] {
  if (!activo) return tarjetas
  const out: React.ReactNode[] = []
  tarjetas.forEach((t, i) => {
    out.push(t)
    if ((i + 1) % CADA_SEGUIR === 0 && i < tarjetas.length - 1) out.push(<TarjetaSeguir key={`seguir-${i}`} />)
  })
  return out
}

const PASO = 48

export default function OfertasGrid({
  ofertas: iniciales,
  total,
  telegramUrl,
  omitirIds,
}: {
  ofertas: OfertaLight[]
  total?: number
  telegramUrl: string
  /** Ya mostradas arriba (top 3): con catálogo chico no se repiten en la grilla. */
  omitirIds?: string[]
}) {
  // Primero las del HTML (pinta rápido en celular); apenas el navegador queda
  // libre, todas las de hoy para que búsqueda, filtros y "ver más" las tengan.
  const [todasOfertas, setOfertas] = useState(iniciales)
  const ofertas = useMemo(() => {
    if (!omitirIds?.length) return todasOfertas
    const fuera = new Set(omitirIds)
    return todasOfertas.filter(o => !fuera.has(o.id_ml))
  }, [todasOfertas, omitirIds])
  useEffect(() => {
    if (!total || total <= iniciales.length) return
    let vivo = true
    const bajar = () =>
      fetch('/ofertas-hoy.json')
        .then(r => (r.ok ? r.json() : null))
        .then((todas: OfertaLight[] | null) => {
          if (!vivo || !todas?.length) return
          // El JSON no trae el mini gráfico (solo las del HTML lo tienen): se conserva.
          const spark = new Map(iniciales.filter(o => o.spark).map(o => [o.id_ml, o.spark]))
          setOfertas(spark.size ? todas.map(o => (spark.has(o.id_ml) ? { ...o, spark: spark.get(o.id_ml) } : o)) : todas)
        })
        .catch(() => {})
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(bajar, { timeout: 2000 })
    else setTimeout(bajar, 1000)
    return () => {
      vivo = false
    }
  }, [iniciales, total])

  const [q, setQ] = useState('')
  const [chip, setChip] = useState<ChipId>('all')
  const [orden, setOrden] = useState<OrdenId>('relevancia')
  const [tope, setTope] = useState<PresupuestoId | 'all'>('all')
  const [desdeUrl, setDesdeUrl] = useState(false)
  const resultadosRef = useRef<HTMLDivElement>(null)

  // ?q=heladera en la URL: búsquedas compartibles (y que una IA pueda linkear).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // ?categoria=notebooks: filtro rápido del header.
    const rubro = RUBROS_FILTRO.find(r => r.slug === params.get('categoria'))
    const presu = PRESUPUESTOS_FILTRO.find(p => p.slug === params.get('presupuesto'))
    if (presu) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- leer la URL solo existe en el cliente
      setTope(presu.slug)
      if (!rubro) requestAnimationFrame(() => resultadosRef.current?.scrollIntoView({ block: 'start' }))
    }
    if (rubro) {
      setChip(rubro.slug)
      requestAnimationFrame(() => resultadosRef.current?.scrollIntoView({ block: 'start' }))
    }
    const inicial = params.get('q')
    if (!inicial) return
    setQ(inicial)
    setDesdeUrl(true)
    // Llega con intención de compra (Google/IA): saltar directo a los resultados
    // filtrados en vez de dejarlo en el hero.
    requestAnimationFrame(() => resultadosRef.current?.scrollIntoView({ block: 'start' }))
  }, [])

  // Chips del hero (components/ChipsHero): cada toque arranca un filtro limpio.
  useEffect(() => {
    const onFiltro = (e: Event) => {
      const d = (e as CustomEvent<DetalleFiltro>).detail ?? {}
      const rubro = RUBROS_FILTRO.find(r => r.slug === d.rubro)
      setQ('')
      setTope(d.presupuesto ?? 'all')
      setChip(d.minimos ? 'low' : rubro ? rubro.slug : 'all')
    }
    window.addEventListener(EVENTO_FILTRO, onFiltro)
    return () => window.removeEventListener(EVENTO_FILTRO, onFiltro)
  }, [])

  // Cada fila de chips cuenta con el filtro de la otra fila puesto (presupuesto × rubro).
  const counts = useMemo(() => {
    const c = Object.fromEntries(CHIPS.map(x => [x.id, 0])) as Record<ChipId, number>
    for (const o of ofertas) {
      if (!enPresupuesto(o.precio_actual, tope)) continue
      for (const x of CHIPS) if (pasaChip(o, x.id)) c[x.id]++
    }
    if (tope === 'all') c.all = Math.max(ofertas.length, total ?? 0)
    return c
  }, [ofertas, total, tope])
  const countsTope = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of PRESUPUESTOS_FILTRO) c[p.slug] = 0
    for (const o of ofertas) {
      if (!pasaChip(o, chip)) continue
      for (const p of PRESUPUESTOS_FILTRO) if (enPresupuesto(o.precio_actual, p.slug)) c[p.slug]++
    }
    return c
  }, [ofertas, chip])

  // Render incremental: 423 tarjetas SSR pesaban 1,7 MB de HTML y ~1 s de
  // hidratación en mobile. Se muestran de a PASO; búsqueda/filtros siguen
  // corriendo sobre todas las ofertas.
  const [limite, setLimite] = useState(PASO)
  // Con pocas ofertas, buscador/orden/chips son fricción: empujan las tarjetas
  // hacia abajo en mobile y no hay nada que filtrar.
  const catalogoChico = Math.max(ofertas.length, total ?? 0) < 40
  const nq = normalizar(q.trim())
  const filtrando = chip !== 'all' || tope !== 'all' || nq !== '' || orden !== 'relevancia'
  const visibles = useMemo(() => {
    const base =
      chip !== 'all' || tope !== 'all' || nq !== ''
        ? ofertas.filter(o => pasaChip(o, chip) && enPresupuesto(o.precio_actual, tope) && (!nq || coincide(o.titulo, nq)))
        : ofertas
    return ordenar(base, orden)
  }, [ofertas, chip, tope, nq, orden])

  return (
    <>
      <div ref={resultadosRef} className="scroll-mt-20" />
      {desdeUrl && nq !== '' && visibles.length > 0 && (
        <p className="mb-3 font-display text-base sm:text-lg font-black">
          Resultados para «{q.trim()}» <span className="text-sm font-semibold text-zinc-400">({visibles.length})</span>
        </p>
      )}
      {desdeUrl && nq.length >= 3 && <BuscarEnMLGrande q={q} hay={visibles.length} />}
      {/* Búsqueda + filtros */}
      {!catalogoChico && (
      <div className="mb-4 sm:mb-5 space-y-3">
        <div className="flex gap-2">
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar: colchón, aire, bici…"
            aria-label="Buscar ofertas"
            className="min-w-0 flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-base sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400/60 focus-visible:ring-1 focus-visible:ring-yellow-400/60 transition-colors"
          />
          <select
            value={orden}
            onChange={e => setOrden(e.target.value as OrdenId)}
            aria-label="Ordenar ofertas"
            className="w-32 sm:w-auto shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl px-2 sm:px-3 py-3 text-base sm:text-sm text-white focus:outline-none focus:border-yellow-400/60 focus-visible:ring-1 focus-visible:ring-yellow-400/60 transition-colors"
          >
            {ORDENES.map(o => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div role="group" aria-label="Presupuesto" className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-sm font-bold text-zinc-400" aria-hidden="true">💰</span>
          {PRESUPUESTOS_FILTRO.map(p => {
            const activo = tope === p.slug
            const n = countsTope[p.slug]
            if (!activo && n === 0) return null
            return (
              <button
                key={p.slug}
                onClick={() => setTope(activo ? 'all' : p.slug)}
                aria-pressed={activo}
                className={`chip min-h-11 shrink-0 text-base font-bold rounded-full px-4 py-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  activo ? 'bg-zinc-50 text-black border-zinc-50' : 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {p.label} <span className={activo ? 'text-black/60' : 'text-zinc-500'}>({n.toLocaleString('es-AR')})</span>
              </button>
            )
          })}
        </div>
        <div role="group" aria-label="Rubro" className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CHIPS.map(c => {
            const activo = chip === c.id
            const n = counts[c.id]
            if (c.id !== 'all' && !activo && n === 0) return null
            return (
              <button
                key={c.id}
                onClick={() => setChip(activo && c.id !== 'all' ? 'all' : c.id)}
                aria-pressed={activo}
                className={`chip min-h-11 shrink-0 text-base font-bold rounded-full px-4 py-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  activo
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {c.label} <span className={activo ? 'text-black/60' : 'text-zinc-500'}>({n})</span>
              </button>
            )
          })}
        </div>
      </div>
      )}

      {nq.length >= 3 && !desdeUrl && (
        <div className="mb-4">
          <BuscarEnML q={q} />
        </div>
      )}

      {visibles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400 mb-4">
            {nq ? <>Hoy no tenemos «{q.trim()}» en oferta 🎯 — mirá en Mercado Libre o estas ofertas de hoy.</> : (total ?? 0) > todasOfertas.length ? 'Cargando ofertas…' : 'Nada con ese filtro por ahora 🎯 — sumamos ofertas nuevas seguido.'}
          </p>
          {nq !== '' && nq.length < 3 && (
            <div className="mb-4">
              <BuscarEnML q={q} />
            </div>
          )}
          {nq !== '' && ofertas.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 text-left">
              {ordenar(ofertas, 'relevancia').slice(0, 4).map((o, i) => (
                <OfertaCard key={o.id_ml} producto={o} posicion={i + 1} />
              ))}
            </div>
          )}
          <button
            onClick={() => {
              setQ('')
              setChip('all')
              setTope('all')
              setOrden('relevancia')
            }}
            className="text-sm font-bold bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-white rounded-xl px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Ver todas las ofertas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtrando ? (
            conSeguir(visibles.slice(0, limite).map((o, i) => <OfertaCard key={o.id_ml} producto={o} posicion={i + 1} />), !catalogoChico)
          ) : (
            <>
              {/* Sin priority: la grilla está varias pantallas abajo, las fotos van lazy */}
              <OfertaCard producto={visibles[0]} featured posicion={1} />
              {conSeguir(
                visibles.slice(1, limite).map((o, i) => <OfertaCard key={o.id_ml} producto={o} posicion={i + 2} />),
                !catalogoChico,
              )}
            </>
          )}
        </div>
      )}

      {catalogoChico && !filtrando && visibles.length > 7 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-yellow-400 rounded-2xl px-5 py-4 sm:px-6 mt-6">
          <p className="text-black font-extrabold text-sm sm:text-base text-center sm:text-left [text-wrap:balance]">
            📲 Las mejores del día van directo al canal de Telegram, gratis
          </p>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-black text-yellow-400 font-bold text-sm rounded-xl px-5 py-2.5 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Unirme al canal ✈️
          </a>
        </div>
      )}

      <BuscaPorRubro />

      {visibles.length > limite && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setLimite(l => l + PASO)}
            className="text-sm font-bold bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-white rounded-xl px-6 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Ver más ofertas ({visibles.length - limite} restantes)
          </button>
        </div>
      )}
    </>
  )
}
