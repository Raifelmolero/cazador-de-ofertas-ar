import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getScrapedAt } from '@/lib/productos'
import { GUIAS } from '@/lib/guias'
import { CATEGORIAS } from '@/lib/categorias'
import { COMPARATIVAS } from '@/lib/comparativas'
import { NICHOS } from '@/lib/nichos'
import { getSeguidos } from '@/lib/seguimiento'

const BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.calculadoraml.com.ar').replace(/\/$/, '')
// La página de ofertas canonicaliza a la raíz de su propio dominio (ver
// app/hoy/page.tsx); acá va esa URL y no BASE/hoy para no listar un duplicado.
const DEALS_HOST = process.env.DEALS_HOST ?? 'cazadordeofertas.com.ar'
const DEALS_URL = `https://${DEALS_HOST}`

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
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = getScrapedAt()

  // El mismo deploy sirve los dos dominios. Google marca error si un sitemap
  // lista URLs de otro dominio (le pasaba al de cazadordeofertas: 1 error y
  // solo 23 páginas descubiertas), así que cada host lista solo lo suyo.
  const host = ((await headers()).get('host') ?? '').replace(/^www\./, '')
  if (!host.startsWith(DEALS_HOST)) {
    return [{ url: BASE, lastModified, changeFrequency: 'daily', priority: 1 }]
  }

  return [
    { url: DEALS_URL, lastModified, changeFrequency: 'hourly', priority: 1 },
    // URLs estables (el listado de adentro rota, la página no): a diferencia de
    // /calculadora/[id] no se caen del sitio, así que sí se anuncian.
    ...CATEGORIAS.map(c => ({
      url: `${DEALS_URL}/categoria/${c.slug}`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...COMPARATIVAS.map(c => ({
      url: `${DEALS_URL}/mejores/${c.slug}`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...NICHOS.map(n => ({ url: `${DEALS_URL}/${n.slug}`, lastModified, changeFrequency: 'daily' as const, priority: 0.9 })),
    { url: `${DEALS_URL}/estudio/descuentos-inflados-mercado-libre`, lastModified, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${DEALS_URL}/precio`, lastModified, changeFrequency: 'daily' as const, priority: 0.6 },
    ...getSeguidos().map(s => ({
      url: `${DEALS_URL}/precio/${s.slug}`,
      lastModified: new Date(s.ultimo_visto),
      changeFrequency: 'daily' as const,
      priority: 0.5,
    })),
    ...GUIAS.map(g => ({
      url: `${DEALS_URL}/guias/${g.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
