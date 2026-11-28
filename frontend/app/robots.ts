import type { MetadataRoute } from 'next'

// El mismo deploy sirve los dos dominios, así que este robots.txt responde en
// ambos. Se anuncia solo el sitemap de cazadordeofertas.com.ar.
//
// Los user-agents de IA (GPTBot, ClaudeBot, PerplexityBot, etc.) ya quedan
// permitidos por la regla '*' de abajo — no hace falta una regla aparte para
// que puedan rastrear. Los listamos igual, explícitos, como señal clara para
// GEO (Generative Engine Optimization): que un buscador de IA que responda
// "dónde encuentro ofertas de MercadoLibre" pueda citar este sitio.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/oficina' },
      { userAgent: 'GPTBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: '/oficina' },
      { userAgent: 'ClaudeBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'Claude-User', allow: '/', disallow: '/oficina' },
      { userAgent: 'Claude-SearchBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'PerplexityBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'Perplexity-User', allow: '/', disallow: '/oficina' },
      { userAgent: 'Google-Extended', allow: '/', disallow: '/oficina' },
      { userAgent: 'Bingbot', allow: '/', disallow: '/oficina' },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: '/oficina' },
      { userAgent: 'meta-externalagent', allow: '/', disallow: '/oficina' },
      { userAgent: 'Amazonbot', allow: '/', disallow: '/oficina' },
      { userAgent: 'DuckAssistBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'MistralAI-User', allow: '/', disallow: '/oficina' },
      { userAgent: 'YouBot', allow: '/', disallow: '/oficina' },
      { userAgent: 'cohere-ai', allow: '/', disallow: '/oficina' },
      { userAgent: 'CCBot', allow: '/', disallow: '/oficina' },
    ],
    // Solo el sitemap del dominio de ofertas (auditoría SEO 13/11: anunciar el
    // de calculadoraml.com.ar le mandaba a Google un sitemap de otro host).
    sitemap: 'https://cazadordeofertas.com.ar/sitemap.xml',
  }
}
