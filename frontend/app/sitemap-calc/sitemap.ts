import type { MetadataRoute } from 'next'
import { getScrapedAt } from '@/lib/productos'
import { CALC_URL, GUIAS_VENDER } from '@/lib/vender'
import { TEXTO_MODIFICADO } from '@/lib/sitemap-fechas'

// Sitemap de calculadoraml.com.ar (y de cualquier host que no sea el de
// ofertas). Se sirve en /sitemap.xml de esos hosts con un rewrite por host en
// next.config.mjs; así los dos sitemaps son estáticos (se arman en el build)
// en vez de elegir con headers() en cada pedido.
export const dynamic = 'force-static'

// Sin www: Vercel redirige www → calculadoraml.com.ar (307), y un sitemap o
// canónico que apunta a una redirección confunde a Google.
const BASE = CALC_URL

/**
 * Solo las páginas estables, a propósito (la home, las calculadoras, ML vs
 * Tiendanube y las guías de /vender).
 *
 * Las de `/calculadora/[id]` salen del JSON que el bot reescribe 3×/día y rotan
 * ~50% por corrida: de 118 URLs vivas el 20/07, a los 6 días quedaban 29. Como
 * Google tarda días o semanas en indexar una URL nueva, anunciarlas solo le
 * servía 404s y le gastaba presupuesto de rastreo. Encima apuntan a consultas
 * sin volumen ("calculadora de ganancia <producto puntual>"): lo que se busca
 * de verdad es genérico y lo tiene que ganar la home.
 *
 * Las páginas siguen existiendo y navegables desde el sitio; lo que se saca es
 * el anuncio. Si algún día se persisten (que no se borren al salir del JSON),
 * ahí sí tiene sentido volver a listarlas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getScrapedAt()
  const textoModificado = TEXTO_MODIFICADO
  return [
    { url: BASE, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/calculadora-de-comisiones`, lastModified: textoModificado, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/calculadora-precio-de-venta`, lastModified: textoModificado, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/calculadora-envio-gratis`, lastModified: textoModificado, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/calculadora-cuotas-sin-interes`, lastModified: textoModificado, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/mercado-libre-vs-tiendanube`, lastModified: textoModificado, changeFrequency: 'monthly', priority: 0.9 },
    // Índice estable de las fichas /calculadora/[id] (las fichas no se listan: rotan)
    { url: `${BASE}/calculadora`, lastModified, changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE}/vender`, lastModified: textoModificado, changeFrequency: 'monthly', priority: 0.7 },
    ...GUIAS_VENDER.map(g => ({ url: `${BASE}/vender/${g.slug}`, lastModified: textoModificado, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}
