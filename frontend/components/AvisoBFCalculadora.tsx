// Bloque amarillo #FACC15 / negro arriba de las páginas de la calculadora
// (calculadoraml.com.ar, etiqueta calcml). Pedido del 23/11/2026: llevar a los
// compradores que caen ahí al Black Friday del sitio de ofertas y a las landings de
// notebooks y smart TV. Links absolutos al dominio de ofertas (desde la calculadora
// esas rutas redirigen; así no hay salto de más). Se apaga solo después del 30/11,
// igual que AvisoBFRubro: en el build y en el navegador.
// No toca la calculadora: es un bloque aparte, sin estado, debajo del encabezado.
// 26/11: los links llevan ?utm_source=calcml (lib/afiliado: desdeCalculadora), así los clics a ML
// de esa visita en el sitio de ofertas siguen saliendo con la etiqueta de la calculadora y el
// panel mide si ese tráfico compra. Suma lavarropas y herramientas: lo que más ganancia dejó en el
// panel después de notebooks y TV, y herramientas paga más comisión por venta.
import { avisoBFVigente } from '@/lib/bf-enlaces'
import { DEALS_URL } from '@/lib/marca'
import { desdeCalculadora } from '@/lib/afiliado'
import SoloHastaFinBF from '@/components/SoloHastaFinBF'

export const LINKS_BF_CALCULADORA = [
  { href: desdeCalculadora(`${DEALS_URL}/mejores/black-friday-notebooks`), texto: '💻 Notebooks' },
  { href: desdeCalculadora(`${DEALS_URL}/mejores/black-friday-smart-tv`), texto: '📺 Smart TV' },
  { href: desdeCalculadora(`${DEALS_URL}/mejores/black-friday-lavarropas`), texto: '🧺 Lavarropas' },
  { href: desdeCalculadora(`${DEALS_URL}/mejores/black-friday-herramientas`), texto: '🛠️ Herramientas' },
]

const BF_URL = desdeCalculadora(`${DEALS_URL}/black-friday`)

export default function AvisoBFCalculadora() {
  if (!avisoBFVigente()) return null
  return (
    <SoloHastaFinBF>
      <aside aria-label="Black Friday 2026" className="max-w-5xl mx-auto px-4 sm:px-6 pt-4" data-seccion="aviso_bf_calculadora">
        <div className="rounded-xl px-4 py-3 text-black" style={{ backgroundColor: '#FACC15' }}>
          <a href={BF_URL} className="block font-display text-base font-black leading-tight sm:text-lg">
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
              <a href={BF_URL} className="inline-flex min-h-[44px] items-center rounded-full border-2 border-black px-4 text-sm font-black text-black">
                Todo el Black Friday
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </SoloHastaFinBF>
  )
}
