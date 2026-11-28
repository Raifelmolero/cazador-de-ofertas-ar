'use client'

// Botones de «Seguinos» del sitio de ofertas (rediseño 27/11). Links tal cual de lib/marca
// (REDES_SEGUIR), cada uno con data-red y el evento de Clarity `seguir_<red>` si Clarity ya
// está cargado (solo en cazadordeofertas.com.ar; acá no se agrega ningún script).
import { REDES_SEGUIR, type RedSeguir } from '@/lib/marca'

type ClarityFn = (accion: 'event', nombre: string) => void

export function medirSeguir(red: string) {
  try {
    ;(window as unknown as { clarity?: ClarityFn }).clarity?.('event', `seguir_${red}`)
  } catch {
    // medir nunca puede romper el link
  }
}

const COLOR: Record<RedSeguir, string> = {
  whatsapp: 'bg-[#25D366] text-black hover:bg-[#3ee07a]',
  // tonos oscuros del degradé de IG: blanco sobre naranja no llega a AA
  instagram: 'bg-gradient-to-br from-[#c13584] via-[#833ab4] to-[#5851db] text-white hover:brightness-110',
  x: 'bg-white text-black hover:bg-zinc-200',
  telegram: 'bg-[#2AABEE] text-black hover:bg-[#4dbaf2]',
}

function Icono({ red }: { red: RedSeguir }) {
  const p = { viewBox: '0 0 24 24', width: 18, height: 18, fill: 'currentColor', 'aria-hidden': true } as const
  if (red === 'whatsapp')
    return (
      <svg {...p}>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
      </svg>
    )
  if (red === 'instagram')
    return (
      <svg {...p} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  if (red === 'x')
    return (
      <svg {...p}>
        <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
      </svg>
    )
  return (
    <svg {...p}>
      <path d="M21.9 4.3 18.8 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.5-1 .5l.3-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.9 13 2.3 11.6c-1-.3-1-1 .2-1.5L20.5 3c.8-.3 1.6.2 1.4 1.3Z" />
    </svg>
  )
}

/**
 * `grande`: 2×2 con nombre (bloque y tarjeta de la grilla). `chico`: fila de 4 con nombre corto
 * (aviso y footer). Siempre ≥ 44 px de alto para el pulgar.
 */
export default function SeguirRedes({
  variante = 'grande',
  donde,
  className = '',
}: {
  variante?: 'grande' | 'chico'
  /** se suma al data-seccion para comparar dónde se sigue más */
  donde: string
  className?: string
}) {
  const grande = variante === 'grande'
  return (
    <ul data-seccion={`seguir_${donde}`} className={`grid gap-2 ${grande ? 'grid-cols-2' : 'grid-cols-4'} ${className}`}>
      {REDES_SEGUIR.map(r => (
        <li key={r.red} className="min-w-0">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            data-red={r.red}
            onClick={() => medirSeguir(r.red)}
            aria-label={`Seguir a Cazador de Ofertas en ${r.nombre}`}
            className={`presionable flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 font-bold leading-tight transition-[filter,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
              grande ? 'text-base' : 'text-sm'
            } ${COLOR[r.red]}`}
          >
            <Icono red={r.red} />
            <span className="truncate">{r.nombre}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
