import type { Metadata } from 'next'
import Footer from '@/components/Footer'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

export const metadata: Metadata = {
  title: 'Política de privacidad — Cazador de Ofertas AR',
  description: 'Qué datos usa Cazador de Ofertas AR y cómo los trata.',
  alternates: { canonical: `${DEALS_URL}/privacidad` },
}

export default function PrivacidadPage() {
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
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white">Política de privacidad</h1>
        <p className="text-xs text-zinc-500">Última actualización: 21 de septiembre de 2026</p>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Quiénes somos</h2>
          <p>
            Cazador de Ofertas AR ({DEALS_URL.replace('https://', '')}) es un sitio que publica ofertas de
            Mercado Libre Argentina. Contacto: elcazadordeofertas.ar@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Datos que recopilamos</h2>
          <p>
            El sitio no pide registro ni datos personales. Usamos Microsoft Clarity para medir cómo se usa la
            página (visitas, clics, desplazamiento), sin identificar personas. Clarity puede usar cookies y
            registra datos técnicos como el dispositivo y el navegador.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Links de afiliado</h2>
          <p>
            Los botones &quot;Ver oferta&quot; llevan a Mercado Libre con un identificador de afiliado. Si
            comprás, podemos recibir una comisión, sin costo extra para vos. Mercado Libre trata tus datos
            según su propia política de privacidad.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Uso de la API de YouTube</h2>
          <p>
            Para publicar los videos cortos de ofertas usamos la API de YouTube con el permiso de subir
            videos al canal de Cazador de Ofertas. Solo accedemos a esa cuenta propia, únicamente para subir
            videos, y no leemos, almacenamos ni compartimos datos de otras personas. El uso de la información
            recibida de las APIs de Google respeta la Política de datos de usuario de los servicios de API de
            Google.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-black text-white mb-2">Tus derechos</h2>
          <p>
            Podés escribirnos a elcazadordeofertas.ar@gmail.com para consultar o pedir la eliminación de
            cualquier dato que tengamos sobre vos.
          </p>
        </section>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
