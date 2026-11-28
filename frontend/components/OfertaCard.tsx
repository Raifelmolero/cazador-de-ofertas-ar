'use client'

import Image from 'next/image'
import { miniaturaML } from '@/lib/imagenml'
import { nombreCorto } from '@/lib/nombrecorto'
import Link from 'next/link'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'
import { alertaUrl } from '@/components/AlertaCTA'
import { BadgeVeracidad, BOTON_ML, MiniGrafico, UltVerificacion, VsPromedio } from '@/components/PartesTarjeta'

/** Subconjunto serializable de ProductWithMargins: es lo único que la tarjeta
 *  necesita, y mantiene liviano el payload que viaja al cliente. */
export interface OfertaLight {
  id_ml: string
  titulo: string
  precio_actual: number
  precio_anterior?: number
  descuento_pct?: number
  minimo_historico?: boolean
  relampago?: boolean
  url_producto: string
  url_imagen: string | null
  /** fecha (YYYY-MM-DD) en que se vio el precio; solo ofertas cargadas a mano */
  precio_visto?: string
  /** slug de /precio/[slug] si el producto tiene historial propio */
  historial?: string
  /** slug del filtro rápido de /hoy (lib/rubros-filtro) */
  rubro?: string
  /** % por debajo de NUESTRO promedio (lib/lectura-precio); solo si es ≥ 5 % con ≥ 3 días de serie */
  vs_promedio?: number
  /** puntos del mini gráfico: solo las tarjetas que vienen en el HTML (lib/ofertashoy conSpark) */
  spark?: number[]
}

function precio(n: number) {
  return `$${Math.round(n).toLocaleString('es-AR')}`
}

function shareWhatsApp(e: React.MouseEvent, producto: OfertaLight) {
  e.preventDefault()
  e.stopPropagation()
  // Sin %: descuento_pct sale del tachado de ML, no del historial.
  const texto = `Mirá esta oferta: ${producto.titulo}\n${precio(producto.precio_actual)}\n\n${producto.url_producto}`
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer')
}

function ShareButton({ producto }: { producto: OfertaLight }) {
  return (
    <button
      type="button"
      onClick={e => shareWhatsApp(e, producto)}
      aria-label="Compartir por WhatsApp"
      className="absolute top-0 right-0 z-10 flex items-center justify-center w-11 h-11 group/share focus-visible:outline-none"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/70 text-white transition-colors group-hover/share:bg-green-600 group-focus-visible/share:ring-2 group-focus-visible/share:ring-yellow-400">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C11 9.2 10.5 8 10.3 7.5c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2 22l4.9-1.3C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.7 0-3.3-.5-4.6-1.3l-.3-.2-3.1.8.8-3-.2-.3C3.7 14 3.2 12.4 3.2 10.8c0-4.8 3.9-8.7 8.7-8.7 4.8 0 8.7 3.9 8.7 8.7s-3.8 9.4-8.6 9.4z" />
      </svg>
      </span>
    </button>
  )
}

/**
 * Toda la tarjeta es UN solo link (mejor tap target en mobile); el "botón"
 * es visual. Fondo blanco en la foto: las imágenes de ML son JPG de fondo
 * blanco, así quedan integradas en vez de flotar como rectángulos.
 */
/** El link al historial va FUERA de la tarjeta (no se anidan <a>). */
export default function OfertaCard(props: {
  producto: OfertaLight
  featured?: boolean
  priority?: boolean
  /** lugar de la tarjeta en la grilla (1 = primera): se manda a Clarity al hacer clic */
  posicion?: number
}) {
  const slug = props.producto.historial
  // «Avisame si baja»: solo ticket alto, donde esperar la baja vale más plata
  const alerta = props.producto.precio_actual >= TICKET_ALTO_DESDE ? alertaUrl(props.producto.id_ml) : null
  if (!slug && !alerta) return <Tarjeta {...props} />
  const enlace = 'presionable flex min-h-11 items-center justify-center gap-1 text-center text-base leading-tight'
  return (
    <div className={`flex min-w-0 flex-col ${props.featured ? 'col-span-full' : ''}`}>
      <Tarjeta {...props} />
      {slug && (
        <Link href={`/precio/${slug}`} className={`${enlace} font-semibold text-zinc-200 underline decoration-zinc-600 underline-offset-4 hover:text-yellow-300 hover:decoration-yellow-400`}>
          📈 Ver historial
        </Link>
      )}
      {alerta && (
        <a href={alerta} target="_blank" rel="noopener noreferrer" className={`${enlace} text-sky-300 hover:text-sky-200`}>
          🔔 Avisame si baja
        </a>
      )}
    </div>
  )
}

/** Imagen, nombre corto, precio, fecha y botón. `featured`: la misma, acostada y a todo el ancho. */
function Tarjeta({
  producto,
  featured = false,
  priority = false,
  posicion,
}: {
  producto: OfertaLight
  featured?: boolean
  priority?: boolean
  posicion?: number
}) {
  return (
    <a
      href={producto.url_producto}
      target="_blank"
      rel="noopener noreferrer sponsored"
      data-destacada={featured ? true : undefined}
      data-posicion={posicion}
      data-ticket-alto={producto.precio_actual >= TICKET_ALTO_DESDE ? '' : undefined}
      className={`rise-in group flex min-w-0 overflow-hidden rounded-2xl border bg-zinc-900 transition-colors duration-200 hover:border-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
        featured ? 'col-span-full flex-wrap border-yellow-400/40 sm:flex-nowrap' : 'flex-1 flex-col border-zinc-800'
      }`}
    >
      <span className={`relative block bg-white ${featured ? 'h-36 w-36 shrink-0 sm:h-56 sm:w-56' : 'aspect-square w-full'}`}>
        {producto.url_imagen ? (
          <Image
            src={miniaturaML(producto.url_imagen, featured ? 'media' : 'chica')}
            alt={producto.titulo}
            fill
            priority={priority}
            unoptimized
            sizes={featured ? '(min-width: 640px) 224px, 144px' : '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'}
            className="object-contain p-2"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl text-zinc-300">📦</span>
        )}
        <BadgeVeracidad
          minimo={producto.minimo_historico}
          vsPromedio={producto.vs_promedio}
          className="absolute bottom-1.5 left-1.5 z-[1] max-w-[calc(100%-0.75rem)] shadow-sm shadow-black/30"
        />
        <ShareButton producto={producto} />
      </span>

      {/* `contents` en la acostada: en celular el botón baja a su propia fila, a todo el ancho */}
      <span className={featured ? 'contents sm:flex sm:flex-1 sm:flex-col sm:justify-center' : 'flex flex-1 flex-col'}>
        <span className={`flex min-w-0 flex-col ${featured ? 'flex-1 justify-center p-3 sm:flex-none sm:px-6' : 'p-2.5 sm:p-4'}`}>
          <h2 className={`line-clamp-2 text-base leading-snug text-zinc-100 ${featured ? 'font-bold sm:text-xl' : 'font-medium'}`}>
            {nombreCorto(producto.titulo)}
          </h2>
          <span className="mt-1.5 flex flex-wrap items-end gap-x-2 gap-y-1">
            <span className={`font-display font-black leading-none tracking-tight tabular-nums text-yellow-400 ${featured ? 'text-3xl sm:text-4xl' : 'text-[1.4rem] sm:text-3xl'}`}>
              {precio(producto.precio_actual)}
            </span>
            <MiniGrafico puntos={producto.spark} className="mb-0.5" />
          </span>
          <VsPromedio pct={producto.vs_promedio} />
          <UltVerificacion fecha={producto.precio_visto} />
        </span>
        <span className={featured ? 'w-full p-3 pt-2 sm:max-w-sm sm:px-6' : 'mt-auto block p-2 pt-0 sm:p-4 sm:pt-0'}>
          <span className={BOTON_ML}>Ver en Mercado Libre</span>
        </span>
      </span>
    </a>
  )
}
