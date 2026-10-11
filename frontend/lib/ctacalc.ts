// Enlaces para las cajas de acción de las calculadoras de vendedores
// (calculadoraml.com.ar): llevan a las ofertas del sitio de ofertas, siempre con
// URL absoluta porque esas páginas viven en otro dominio.
import { DEALS_URL } from '@/lib/marca'
import { paginaML } from '@/lib/afiliado'
import { getLanding, indexableLanding } from '@/lib/landings'
import type { EnlaceCta } from '@/components/CtaCalculadora'

const LANDINGS_REVENTA = ['ofertas-mas-de-30-off', 'minimos-historicos-hoy', 'ofertas-ticket-alto']

/** Botón principal: la página de ofertas de ML con el link de afiliado. */
export const ML_OFERTAS: EnlaceCta = {
  href: paginaML('https://www.mercadolibre.com.ar/ofertas'),
  texto: 'Ver las ofertas de hoy en Mercado Libre',
}

/** Landings del día que hoy tienen productos suficientes (no se linkea una página vacía). */
export function enlacesOfertas(): EnlaceCta[] {
  const landings = LANDINGS_REVENTA.flatMap(slug => {
    const l = getLanding(slug)
    if (!l || !indexableLanding(l)) return []
    return [{ href: `${DEALS_URL}/ofertas/${l.slug}`, texto: l.nombre.charAt(0).toUpperCase() + l.nombre.slice(1) }]
  })
  return [...landings, { href: `${DEALS_URL}/hoy`, texto: 'Ofertas verificadas de hoy' }]
}
