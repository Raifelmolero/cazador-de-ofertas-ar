// Link al canal de WhatsApp en las landings y guías de Black Friday (bf-conv-2411, 24/11/2026).
// Mismo canal (lib/marca.ts) y mismos atributos de medición que los botones de /black-friday
// (data-bf-evento="cta_whatsapp" + data-bf-placement).
// Sin precios ni cifras de descuento.
import { WHATSAPP_URL } from '@/lib/marca'

export default function CanalWhatsAppBF({ placement, className = '' }: { placement: string; className?: string }) {
  return (
    <section className={`rounded-2xl border border-green-500/30 bg-green-500/10 p-4 ${className}`} data-seccion={`whatsapp_${placement}`}>
      <p className="font-display text-lg font-black text-zinc-50 [text-wrap:balance]">¿Querés las ofertas del Black Friday apenas salen?</p>
      <p className="mt-1 text-sm text-zinc-300 [text-wrap:pretty]">
        Sumate gratis al canal de WhatsApp: publicamos las ofertas revisadas del día, sin spam.
      </p>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-bf-evento="cta_whatsapp"
        data-bf-placement={placement}
        className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-green-500 px-4 text-center text-base font-black text-black hover:bg-green-400 sm:w-auto sm:inline-flex"
      >
        💬 Sumate al canal de WhatsApp
      </a>
    </section>
  )
}
