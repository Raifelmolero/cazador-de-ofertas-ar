import Link from 'next/link'
import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'
import LinksTecno from '@/components/LinksTecno'
import { CYBER_MONDAY as CM, etapaCyber } from '@/lib/cybermonday'
import { landingsCyberConDatos } from '@/lib/cybertecno'

const nicho = getNicho('tecno')!

export const metadata = nichoMetadata(nicho)

/** Cyber Monday de tecnología: precio de octubre por modelo (se muestra hasta
 *  que termina el evento; después el testigo ya no sirve para comparar). */
function LinksCyber() {
  if (etapaCyber().etapa === 'despues') return null
  const landings = landingsCyberConDatos()
  const link = 'text-sm text-zinc-300 hover:text-yellow-400 underline-offset-2 hover:underline'
  return (
    <section className="mb-10" aria-label={`Cyber Monday ${CM.año}`}>
      <h2 className="font-display text-xl font-black mb-3">Cyber Monday {CM.año}: ¿bajan de verdad?</h2>
      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
        <li>
          <Link href="/cyber-monday/tecnologia" className={link}>Toda la tecnología: precio de octubre vs. hoy</Link>
        </li>
        {landings.map(x => (
          <li key={x.l.slug}>
            <Link href={`/cyber-monday/${x.l.slug}`} className={link}>
              {x.l.nombre.charAt(0).toUpperCase() + x.l.nombre.slice(1)} en el Cyber Monday, por marca
            </Link>
          </li>
        ))}
        <li>
          <Link href="/cyber-monday" className={link}>Fechas y ofertas del Cyber Monday {CM.año}</Link>
        </li>
      </ul>
    </section>
  )
}

export default function TecnoPage() {
  return (
    <NichoHub
      nicho={nicho}
      extra={
        <>
          <LinksCyber />
          <LinksTecno className="mb-10" />
        </>
      }
    />
  )
}
