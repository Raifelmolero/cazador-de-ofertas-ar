// Botón «Avisame si baja»: abre el bot de Telegram con el deep link
// t.me/<bot>?start=MLA…, que crea la alerta de precio directo (bot/alertas.py).
// Apagado hasta cargar el @usuario del bot en TELEGRAM_BOT (sin la @).

export const TELEGRAM_BOT = 'cazador_ofertas_ar_bot'

export function alertaUrl(id: string): string | null {
  if (!TELEGRAM_BOT || !/^MLA\d{6,13}$/.test(id)) return null
  return `https://t.me/${TELEGRAM_BOT}?start=${id}`
}

export default function AlertaCTA({ id, className = '' }: { id: string; className?: string }) {
  const url = alertaUrl(id)
  if (!url) return null
  return (
    <div className={className}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-bold border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 rounded-xl px-5 py-2.5"
      >
        🔔 Avisame si baja
      </a>
      <p className="text-xs text-zinc-500 mt-1.5 [text-wrap:pretty]">
        Te escribimos una sola vez por Telegram cuando lo veamos más barato. Sin spam; lo cancelás con /stop.
      </p>
    </div>
  )
}
