// Invitación a instalar la extensión. Apagada hasta que la Chrome Web Store
// la apruebe: al publicarse, poner EXTENSION_PUBLICADA en true y listo.

export const EXTENSION_PUBLICADA = false
export const EXTENSION_URL =
  'https://chromewebstore.google.com/detail/jcmmpomhhoeohohaaminnjhicnenjbdm?utm_source=sitio'

export default function ExtensionCTA({ className = '' }: { className?: string }) {
  if (!EXTENSION_PUBLICADA) return null
  return (
    <p className={`text-sm text-zinc-400 [text-wrap:pretty] ${className}`}>
      ¿Querés verlo sin copiar links?{' '}
      <a
        href={EXTENSION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-yellow-400 underline-offset-2 hover:underline"
      >
        Instalá la extensión gratis
      </a>{' '}
      para Chrome, Brave y Edge: te avisa en cada producto de Mercado Libre si el descuento es real.
    </p>
  )
}
