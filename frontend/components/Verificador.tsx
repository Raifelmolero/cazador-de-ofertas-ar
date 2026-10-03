'use client'

// Verificador de la home: pegás un link de ML y te decimos, con nuestro
// historial de precios (/historial.json), si el descuento es real o inflado.
// El link a ML con nuestra etiqueta aparece solo como botón explícito.

import { useRef, useState } from 'react'

type Fila = [number, string, string, number, string, string]
type Estado =
  | { tipo: 'vacio' }
  | { tipo: 'cargando' }
  | { tipo: 'error'; msg: string }
  | { tipo: 'nuevo'; url: string }
  | { tipo: 'ok'; url: string; fila: Fila; precio: number; ingresado: boolean }

let historial: Promise<Record<string, Fila>> | null = null
const cargar = () =>
  (historial ??= fetch('/historial.json')
    .then(r => r.json())
    .then(j => j.items as Record<string, Fila>)
    .catch(e => {
      historial = null
      throw e
    }))

const pesos = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')
const fecha = (s: string) => {
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y.slice(2)}`
}
const dias = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)

// Medición en Clarity (eventos y etiquetas personalizadas, gratis en el plan
// actual): cuánta gente usa el verificador, qué veredicto le sale y si después
// toca "Ir a Mercado Libre". Solo corre en el dominio de ofertas (clarity.tsx).
type Tipo = 'inflado' | 'cazado' | 'normal' | 'sin_datos' | 'link_invalido' | 'error'
function medir(evento: string, tipo?: Tipo) {
  const c = (window as unknown as { clarity?: (...a: unknown[]) => void }).clarity
  if (!c) return
  if (tipo) c('set', 'verificador_veredicto', tipo)
  c('event', tipo ? `${evento}_${tipo}` : evento)
}

function clasificar(fila: Fila, precio: number): Tipo {
  const [min, , desde, , lastTs] = fila
  if (min < precio * 0.95) return 'inflado'
  if (precio <= min * 1.01 && dias(desde, lastTs) >= 3) return 'cazado'
  return 'normal'
}

export function idsDeLink(link: string) {
  return [...link.matchAll(/MLA-?(\d{6,13})/gi)].map(m => `MLA${m[1]}`)
}

function conEtiqueta(url: string) {
  try {
    const u = new URL(url)
    u.searchParams.set('matt_word', 'web')
    u.searchParams.set('matt_tool', '37267219')
    return u.toString()
  } catch {
    return url
  }
}

export default function Verificador({ idPrefijo = 'v' }: { idPrefijo?: string }) {
  const [link, setLink] = useState('')
  const [precio, setPrecio] = useState('')
  const [estado, setEstado] = useState<Estado>({ tipo: 'vacio' })
  const resultado = useRef<HTMLDivElement>(null)

  async function verificar(e: React.FormEvent) {
    e.preventDefault()
    const ids = idsDeLink(link)
    if (!ids.length) {
      medir('verificador', 'link_invalido')
      setEstado({ tipo: 'error', msg: 'Ese link no parece de un producto de Mercado Libre. Copialo desde la página del producto (tiene “MLA” en la dirección).' })
      return
    }
    setEstado({ tipo: 'cargando' })
    try {
      const h = await cargar()
      const id = ids.find(i => h[i])
      const url = link.trim().startsWith('http') ? link.trim() : `https://${link.trim()}`
      const p = Number(precio.replace(/\D/g, ''))
      if (!id) {
        medir('verificador', 'sin_datos')
        setEstado({ tipo: 'nuevo', url })
      } else {
        medir('verificador', clasificar(h[id], p || h[id][3]))
        if (p > 0) medir('verificador_con_precio')
        setEstado({ tipo: 'ok', url, fila: h[id], precio: p || h[id][3], ingresado: p > 0 })
      }
      requestAnimationFrame(() => resultado.current?.focus())
    } catch {
      medir('verificador', 'error')
      setEstado({ tipo: 'error', msg: 'No pudimos cargar el historial. Probá de nuevo en un momento.' })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={verificar} className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`${idPrefijo}-link`}>Link del producto en Mercado Libre</label>
        <input
          id={`${idPrefijo}-link`}
          type="text"
          inputMode="url"
          autoComplete="off"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="Pegá el link del producto de Mercado Libre"
          className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
        />
        <label className="sr-only" htmlFor={`${idPrefijo}-precio`}>Precio que ves hoy (opcional)</label>
        <input
          id={`${idPrefijo}-precio`}
          type="text"
          inputMode="numeric"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          placeholder="Precio que ves"
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 sm:w-44"
        />
        <button
          type="submit"
          disabled={estado.tipo === 'cargando'}
          className="rounded-xl bg-yellow-400 px-6 py-3.5 text-[15px] font-black text-black transition-transform duration-150 ease-out hover:bg-yellow-300 active:scale-[0.97] disabled:opacity-60"
        >
          {estado.tipo === 'cargando' ? 'Buscando…' : 'Verificar'}
        </button>
      </form>

      <div ref={resultado} tabIndex={-1} aria-live="polite" className="outline-none">
        {estado.tipo === 'error' && <p className="mt-3 text-sm text-red-300">{estado.msg}</p>}
        {estado.tipo === 'nuevo' && (
          <Resultado sello="SIN DATOS" tono="zinc" titulo="Todavía no seguimos este producto">
            Registramos los productos que pasan por las ofertas de Mercado Libre desde julio. Este no apareció
            todavía, así que no podemos confirmar el descuento. Mirá abajo las ofertas que sí verificamos.
            <Comprar url={estado.url} tipo="sin_datos" />
          </Resultado>
        )}
        {estado.tipo === 'ok' && <Veredicto {...estado} />}
      </div>
    </div>
  )
}

function Veredicto({ url, fila, precio, ingresado }: { url: string; fila: Fila; precio: number; ingresado: boolean }) {
  const [min, minTs, desde, last, lastTs, slug] = fila
  const base = ingresado
    ? `Con el precio que ves hoy (${pesos(precio)})`
    : `El último precio que vimos fue ${pesos(last)} (${fecha(lastTs)})` +
      (dias(lastTs, new Date().toISOString().slice(0, 10)) > 7 ? '; si hoy es otro, cargalo en “Precio que ves” y verificá de nuevo' : '')
  const historia = (
    <>
      Lo seguimos desde el {fecha(desde)}. El más bajo que registramos: <strong className="text-zinc-100">{pesos(min)}</strong> el {fecha(minTs)}.
      {slug && (
        <>
          {' '}
          <a href={`/precio/${slug}`} className="font-bold text-yellow-400 underline-offset-2 hover:underline">
            Ver el historial completo
          </a>
          .
        </>
      )}
    </>
  )
  const tipo = clasificar(fila, precio)
  if (tipo === 'inflado') {
    const pct = Math.round((1 - min / precio) * 100)
    return (
      <Resultado sello="INFLADO" tono="red" titulo={`Ojo: ya estuvo ${pct}% más barato`}>
        {base}. {historia} Si no te apura, conviene esperar.
        <Comprar url={url} tipo={tipo} />
      </Resultado>
    )
  }
  if (tipo === 'cazado') {
    return (
      <Resultado sello="CAZADO" tono="green" titulo="Es el precio más bajo que registramos">
        {base}. {historia} El descuento es real.
        <Comprar url={url} tipo={tipo} />
      </Resultado>
    )
  }
  return (
    <Resultado sello="NORMAL" tono="yellow" titulo="Precio normal: ni inflado ni mínimo">
      {base}. {historia}
      <Comprar url={url} tipo={tipo} />
    </Resultado>
  )
}

const TONOS = {
  red: 'border-red-500 text-red-400',
  green: 'border-emerald-400 text-emerald-300',
  yellow: 'border-yellow-400 text-yellow-300',
  zinc: 'border-zinc-500 text-zinc-400',
}

// Cara de Don Ofertín según el veredicto (public/personaje/)
const CARAS: Record<keyof typeof TONOS, string> = {
  red: '/personaje/cara-furioso.webp',
  green: '/personaje/cara-enamorado.webp',
  yellow: '/personaje/cara-desconfiado.webp',
  zinc: '/personaje/cara-desconfiado.webp',
}

function Resultado({ sello, tono, titulo, children }: { sello: string; tono: keyof typeof TONOS; titulo: string; children: React.ReactNode }) {
  return (
    <div className="verdict relative mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 pr-5 sm:pr-36 text-left">
      <span
        aria-hidden="true"
        className={`stamp absolute right-4 top-4 hidden rotate-[-9deg] rounded-md border-[3px] px-2 py-1 font-display text-lg font-black tracking-widest sm:block ${TONOS[tono]}`}
      >
        {sello}
      </span>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CARAS[tono]} alt="" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
        <p className={`font-display text-xl font-black sm:text-2xl ${TONOS[tono].split(' ')[1]}`}>{titulo}</p>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-zinc-400 [text-wrap:pretty]">{children}</div>
    </div>
  )
}

function Comprar({ url, tipo }: { url: string; tipo: Tipo }) {
  return (
    <p className="mt-4">
      <a
        href={conEtiqueta(url)}
        onClick={() => medir('verificador_click_ml', tipo)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={
          tipo === 'inflado'
            ? 'inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-100 transition-colors hover:border-yellow-400 hover:text-yellow-300'
            : 'inline-block rounded-xl bg-yellow-400 px-5 py-3 text-base font-black text-black transition-transform hover:bg-yellow-300 active:scale-[0.97]'
        }
      >
        {tipo === 'cazado' ? 'Comprar en Mercado Libre 🛒' : 'Ir a Mercado Libre'}
      </a>
      <span className="ml-3 text-xs text-zinc-500">Link de afiliado: a vos te cuesta lo mismo.</span>
    </p>
  )
}
