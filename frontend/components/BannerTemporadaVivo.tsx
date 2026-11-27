'use client'
// Banner de la fecha comercial vigente (lib/temporada.ts), re-evaluado en el navegador.
// La home es estática y se deploya cada ~3 días (deploy agrupado): sin esto, un build del viernes
// del Black Friday seguiría diciendo «¡es hoy!» hasta el lunes. En el servidor y durante la
// hidratación vale la fecha del build (así el HTML coincide); después, el reloj del navegador.
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { TEMPORADAS, cuentaRegresiva, temporadaActual } from '@/lib/temporada'

const sinSuscripcion = () => () => {}

/** Lo que cambia con la fecha, en un string (snapshot estable para useSyncExternalStore). */
function claveTemporada(ahora: Date): string {
  const t = temporadaActual(ahora)
  if (!t) return ''
  const agenda = t.agenda && ahora.getTime() < new Date(`${t.agenda.inicio}T00:00:00-03:00`).getTime() ? '1' : ''
  return [t.id, cuentaRegresiva(t, ahora) ?? '', agenda].join('|')
}

export default function BannerTemporadaVivo({ ahoraInicial }: { ahoraInicial: number }) {
  const clave = useSyncExternalStore(
    sinSuscripcion,
    () => claveTemporada(new Date()),
    () => claveTemporada(new Date(ahoraInicial)),
  )
  const [id, cuenta, agenda] = clave.split('|')
  const t = TEMPORADAS.find(x => x.id === id)
  if (!t) return null
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <Link href={t.href} className={`flex items-center gap-4 rounded-2xl border px-4 py-2.5 sm:px-5 sm:py-4 transition-colors ${t.caja}`}>
        {t.escena && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.escena} alt="Don Ofertín" width={480} height={266} loading="lazy" className="hidden sm:block w-40 h-auto rounded-xl shrink-0" />
        )}
        <span className="flex-1 text-center">
        <span className={`font-display text-sm sm:text-base font-black ${t.texto}`}>{t.titulo}</span>
        {cuenta && (
          <span className={`ml-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold align-middle ${t.texto}`}>⏰ {cuenta}</span>
        )}
        <span className="block text-xs sm:text-sm text-zinc-300 mt-0.5 sm:mt-1">{t.bajada}</span>
        </span>
      </Link>
      {t.agenda && agenda && (
        <a href={t.agenda.href} download className={`mt-2 block text-center text-xs sm:text-sm font-bold hover:underline ${t.texto}`}>
          📅 Agendá el aviso en tu calendario
        </a>
      )}
    </section>
  )
}
