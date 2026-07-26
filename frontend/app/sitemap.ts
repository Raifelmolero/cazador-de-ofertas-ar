import type { MetadataRoute } from 'next'
import { getScrapedAt } from '@/lib/productos'

const BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.calculadoraml.com.ar').replace(/\/$/, '')
// La página de ofertas canonicaliza a la raíz de su propio dominio (ver
// app/hoy/page.tsx); acá va esa URL y no BASE/hoy para no listar un duplicado.
const DEALS_URL = 'https://cazadordeofertas.com.ar'

/**
 * Solo las dos páginas estables, a propósito.
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

  return [
    { url: BASE, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: DEALS_URL, lastModified, changeFrequency: 'hourly', priority: 1 },
  ]
}
