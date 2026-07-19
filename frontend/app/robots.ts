import type { MetadataRoute } from 'next'

// El mismo deploy sirve los dos dominios, así que este robots.txt responde en
// ambos. Se listan los dos sitemaps (cada host sirve el mismo archivo).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: [
      'https://www.calculadoraml.com.ar/sitemap.xml',
      'https://cazadordeofertas.com.ar/sitemap.xml',
    ],
  }
}
