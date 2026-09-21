import type { Metadata } from 'next'
import Footer from '@/components/Footer'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: 'Términos de servicio — Cazador de Ofertas AR',
  description: 'Condiciones de uso de Cazador de Ofertas AR.',
  alternates: { canonical: `${DEALS_URL}/terminos` },
}

export default function TerminosPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-zinc-900">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-10 space-y-6 text-zinc-400 leading-relaxed">
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">Términos de servicio</h1>
        <p className="text-xs text-zinc-500">Última actualización: 21 de septiembre de 2026</p>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Qué es este sitio</h2>
          <p>
            Cazador de Ofertas AR ({DEALS_URL.replace('https://', '')}) publica ofertas de Mercado Libre
            Argentina con fines informativos. No vendemos productos ni procesamos pagos: las compras se
            hacen siempre en Mercado Libre, bajo sus propios términos y condiciones.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Precios y disponibilidad</h2>
          <p>
            Los precios, descuentos y stock cambian con frecuencia y los define Mercado Libre. Hacemos lo
            posible por mostrar datos actualizados, pero pueden variar o no estar vigentes cuando entres.
            Antes de comprar, verificá siempre el precio final en Mercado Libre.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Links de afiliado</h2>
          <p>
            Participamos del programa de afiliados de Mercado Libre. Si comprás a través de nuestros links
            podemos recibir una comisión, sin costo adicional para vos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Uso del sitio y responsabilidad</h2>
          <p>
            El sitio se ofrece &quot;tal como está&quot;, sin garantías. No somos responsables por decisiones de
            compra, por el contenido de sitios de terceros ni por interrupciones del servicio. Podemos
            modificar o retirar contenido en cualquier momento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Privacidad y contacto</h2>
          <p>
            Cómo tratamos los datos está en la <a className="text-yellow-400 underline" href="/privacidad">política de privacidad</a>.
            Para cualquier consulta: elcazadordeofertas.ar@gmail.com.
          </p>
        </section>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
