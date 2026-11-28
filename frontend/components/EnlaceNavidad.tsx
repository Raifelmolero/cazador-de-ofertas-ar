// Link destacado a /regalos-navidad (pedido del 27/11/2026: que el tráfico del Black Friday pase a
// Navidad). Va en la home, /mejores, /black-friday y guías de rubros regalables. Se muestra desde el
// día del Black Friday hasta Reyes (lib/navidad-post-bf.ts); fuera de esa ventana no va al HTML.
import Link from 'next/link'
import { enlaceNavidadVigente } from '@/lib/navidad-post-bf'

export default function EnlaceNavidad({ seccion, className = '' }: { seccion: string; className?: string }) {
  if (!enlaceNavidadVigente()) return null
  return (
    <Link
      href="/regalos-navidad"
      data-seccion={seccion}
      data-evento="navidad_enlace"
      className={`block rounded-2xl border border-green-400/40 bg-green-500/10 px-4 py-3 transition-colors hover:border-green-400/70 ${className}`}
    >
      <span className="block font-display text-sm font-black text-green-200 sm:text-base">
        🎄 Regalos de Navidad: tecno, árboles y combos por presupuesto →
      </span>
      <span className="mt-0.5 block text-xs text-zinc-300 sm:text-sm">
        Con el descuento comparado contra el historial. Para que llegue antes del 24/12, revisá la fecha de entrega en la publicación.
      </span>
    </Link>
  )
}
