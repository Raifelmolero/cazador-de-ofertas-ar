import Link from 'next/link'
import { cuentaRegresiva, temporadaActual } from '@/lib/temporada'

/** Banner de la fecha comercial vigente (ver lib/temporada.ts). */
export default function BannerTemporada({ ahora = new Date() }: { ahora?: Date }) {
  const t = temporadaActual(ahora)
  if (!t) return null
  const cuenta = cuentaRegresiva(t, ahora)
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <Link href={t.href} className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${t.caja}`}>
        {t.escena && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.escena} alt="Don Ofertín" width={480} height={266} loading="lazy" className="hidden sm:block w-40 h-auto rounded-xl shrink-0" />
        )}
        <span className="flex-1 text-center">
        <span className={`font-display font-black ${t.texto}`}>{t.titulo}</span>
        {cuenta && (
          <span className={`ml-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold align-middle ${t.texto}`}>⏰ {cuenta}</span>
        )}
        <span className="block text-sm text-zinc-300 mt-1">{t.bajada}</span>
        </span>
      </Link>
    </section>
  )
}
