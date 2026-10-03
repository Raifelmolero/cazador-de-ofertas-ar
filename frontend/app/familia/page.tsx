// La Familia Ofertín: los personajes de los reels de Instagram, cada uno
// apuntando a la sección del sitio que "compra". Canon de personajes:
// docs/videos-virales/REVISION GUIONISTA.md (nombre, edad, rol, muletilla).
// Gustavo (el cuñado) se suma cuando esté su tarjeta aprobada.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import { DEALS_URL } from '@/lib/marca'

const URL = `${DEALS_URL}/familia`
const TITULO = 'La Familia Ofertín: ¿cuál sos vos?'
const DESCRIPCION =
  'Conocé a la Familia Ofertín: Don Ofertín, Doña Rosa, Tincho, Marce, Benja, Doña Chola y el perro Precio. Cada uno caza ofertas a su manera; encontrá las tuyas con el precio verificado contra el historial.'

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR', images: ['/personaje/familia/ofertin.webp'] },
}

interface Miembro {
  img: string
  nombre: string
  rol: string
  frase: string
  bio: string
  href: string
  cta: string
}

const FAMILIA: Miembro[] = [
  { img: 'ofertin', nombre: 'Don Ofertín', rol: 'El cazador', frase: '¿Cincuenta por ciento de qué, querido?', bio: 'Espera el precio más bajo del año y ataca. Su especialidad: aires, heladeras y todo lo de ticket alto.', href: '/hogar', cta: 'Ver lo que caza' },
  { img: 'rosa', nombre: 'Doña Rosa', rol: 'La ministra de economía', frase: '¿Y cuánto salió?', bio: 'No compró nada, pero sabe cuánto salió todo. Cocina, hogar y regalos para el Día de la Madre.', href: '/dia-de-la-madre', cta: 'Regalos para Rosa' },
  { img: 'tincho', nombre: 'Tincho', rol: 'El impulsivo', frase: '¡Estaba de oferta!', bio: 'Ve "oferta" y ya pagó. Parrillas, TV y camping. Mejor que mire el historial antes.', href: '/categoria/parrillas', cta: 'Parrillas de verdad' },
  { img: 'marce', nombre: 'Marce', rol: 'La ordenada', frase: 'Mirá el historial.', bio: 'Tiene una planilla para todo. Bebés, súper y las compras grandes del mes.', href: '/bebes-y-jugueteria', cta: 'Lo que compara Marce' },
  { img: 'benja', nombre: 'Benja', rol: 'El primo del cuarto del fondo', frase: 'Abuelo… hay cupón.', bio: 'No se levanta de la cama, pero encuentra todos los cupones. Gamer y tecnología.', href: '/gamer', cta: 'El rincón gamer' },
  { img: 'chola', nombre: 'Doña Chola', rol: 'La consuegra', frase: 'Ay, Rosa… yo la pagué menos.', bio: 'Compite con Rosa por quién compró más barato. Cuidado personal y perfumes.', href: '/categoria/perfumes', cta: 'Lo de Chola' },
  { img: 'precio', nombre: 'Precio', rol: 'El detector de inflados', frase: 'Grrr…', bio: 'Le ladra a los descuentos inflados. Mirá cuáles detectó esta semana.', href: '/descuentos-inflados', cta: 'Ver los inflados' },
]

export default function FamiliaPage() {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <header className="text-center mb-10">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-yellow-300">La Familia Ofertín</h1>
          <p className="mt-3 text-zinc-300 max-w-2xl mx-auto">
            Todas las familias tienen un Tincho que compra por impulso, una Rosa que pregunta cuánto salió y un
            primo que encuentra cupones. <strong className="text-white">¿Cuál sos vos?</strong>
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILIA.map(m => (
            <li key={m.img} className="rounded-2xl border border-yellow-400/30 bg-zinc-900/60 overflow-hidden flex flex-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/personaje/familia/${m.img}.webp`} alt={`${m.nombre}, ${m.rol.toLowerCase()}`} width={463} height={480} loading="lazy" className="w-full h-auto bg-yellow-400" />
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-display font-black text-xl text-white">{m.nombre}</h2>
                <p className="text-sm text-yellow-300 font-bold">{m.rol}</p>
                <p className="mt-2 italic text-zinc-200">“{m.frase}”</p>
                <p className="mt-2 text-sm text-zinc-400 flex-1">{m.bio}</p>
                <Link href={m.href} className="mt-4 inline-block rounded-xl bg-yellow-400 px-4 py-2 text-center font-bold text-zinc-950 hover:bg-yellow-300">
                  {m.cta} →
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-zinc-400">
          Seguí a la familia en Instagram y mirá las ofertas de hoy, con el precio verificado contra el historial:{' '}
          <Link href="/" className="text-yellow-300 underline">ver las ofertas de hoy</Link>.
        </p>
      </main>
      <Footer brand="ofertas" />
    </>
  )
}
