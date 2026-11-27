// Bloques destacados de regalos caros (notebooks, celulares, TV) para /regalos-navidad y sus páginas
// por presupuesto. Los productos salen de lib/regalos-ticket-alto.ts (datos del repo, nada inventado).
import Link from 'next/link'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import type { ProductWithMargins } from '@/lib/productos'
import type { BloqueTicketAlto } from '@/lib/regalos-ticket-alto'
import { slugPorId } from '@/lib/seguimiento'

export default function RegalosTicketAlto({
  bloques,
  titulo = 'Los regalos grandes: notebooks, celulares y TV',
  seccion,
}: {
  bloques: BloqueTicketAlto[]
  titulo?: string
  seccion: string
}) {
  const conProductos = bloques.filter(b => b.productos.length > 0)
  if (conProductos.length === 0) return null
  const historial = slugPorId()
  const light = (o: ProductWithMargins): OfertaLight => ({
    id_ml: o.id_ml, titulo: o.titulo, precio_actual: o.precio_actual, precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct, minimo_historico: o.minimo_historico, relampago: o.relampago,
    url_producto: o.url_producto, url_imagen: o.url_imagen, historial: historial[o.id_ml],
  })
  return (
    <section id="ticket-alto" data-seccion={seccion} className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
      <div className="max-w-3xl mb-2">
        <h2 className="font-display text-xl sm:text-2xl font-black">🎁 {titulo}</h2>
        <p className="mt-1 text-sm text-zinc-400 [text-wrap:pretty]">
          Las ofertas de hoy de mayor precio en cada rubro, comparadas contra el precio más bajo que registramos. Son los
          regalos que más conviene comprar con tiempo: revisá la fecha de entrega en la publicación para que llegue antes
          del 24/12.
        </p>
      </div>
      {conProductos.map(b => (
        <div key={b.id} id={`regalo-${b.id}`} className="pt-5 scroll-mt-20">
          <h3 className="font-display text-lg font-black mb-3 flex flex-wrap items-baseline gap-x-3">
            <span>{b.emoji} {b.titulo}</span>
            <Link href={b.href} className="text-sm font-bold text-yellow-400 hover:underline">
              Ver más {b.titulo === 'Smart TV' ? 'smart TV' : b.titulo.toLowerCase()} →
            </Link>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {b.productos.map(o => (
              <OfertaCard key={o.id_ml} producto={light(o)} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
