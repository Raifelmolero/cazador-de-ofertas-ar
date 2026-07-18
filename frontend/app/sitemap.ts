import type { MetadataRoute } from 'next'
import { getProductos, getScrapedAt } from '@/lib/productos'

const BASE = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.calculadoraml.com.ar').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const productos = getProductos()
  const lastModified = getScrapedAt()

  return [
    { url: BASE, lastModified, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/hoy`, lastModified, changeFrequency: 'hourly', priority: 1 },
    ...productos.map(p => ({
      url: `${BASE}/calculadora/${p.id_ml}`,
      lastModified,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]
}
