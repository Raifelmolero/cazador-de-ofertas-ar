// Bloque amarillo #FACC15 / negro arriba de las páginas de la calculadora
// (calculadoraml.com.ar, etiqueta calcml). Pedido del 23/11/2026: llevar a los
// compradores que caen ahí al Black Friday del sitio de ofertas y a las landings de
// notebooks y smart TV. Links absolutos al dominio de ofertas (desde la calculadora
// esas rutas redirigen; así no hay salto de más). Se apaga solo después del 30/11,
// igual que AvisoBFRubro: en el build y en el navegador.
// No toca la calculadora: es un bloque aparte, sin estado, debajo del encabezado.
import { avisoBFVigente } from '@/lib/bf-enlaces'
import { DEALS_URL } from '@/lib/marca'
import SoloHastaFinBF from '@/components/SoloHastaFinBF'

export const LINKS_BF_CALCULADORA = [
  { href: `${DEALS_URL}/mejores/black-friday-notebooks`, texto: '💻 Notebooks' },
  { href: `${DEALS_URL}/mejores/black-friday-smart-tv`, texto: '📺 Smart TV' },
]

export default function AvisoBFCalculadora() {
  if (!avisoBFVigente()) return null
  return (
    <SoloHastaFinBF>
      <aside aria-label="Black Friday 2026" className="max-w-5xl mx-auto px-4 sm:px-6 pt-4" data-seccion="aviso_bf_calculadora">
        <div className="rounded-xl px-4 py-3 text-black" style={{ backgroundColor: '#FACC15' }}>
          <a href={`${DEALS_URL}/black-friday`} className="block font-display text-base font-black leading-tight sm:text-lg">
            🖤 Black Friday 27/11: lo que elegimos para comprar →
          </a>
          <ul className="mt-2 flex flex-wrap gap-2">
            {LINKS_BF_CALCULADORA.map(l => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-[44px] items-center rounded-full bg-black px-4 text-sm font-black text-yellow-400 hover:bg-zinc-900">
                  {l.texto}
                </a>
              </li>
            ))}
            <li>
              <a href={`${DEALS_URL}/black-friday`} className="inline-flex min-h-[44px] items-center rounded-full border-2 border-black px-4 text-sm font-black text-black">
                Todo el Black Friday
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </SoloHastaFinBF>
  )
}
