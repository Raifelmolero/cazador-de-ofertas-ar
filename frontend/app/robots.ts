import type { MetadataRoute } from 'next'

// El mismo deploy sirve los dos dominios, así que este robots.txt responde en
// ambos. Se listan los dos sitemaps (cada host sirve el mismo archivo).
//
// Los user-agents de IA (GPTBot, ClaudeBot, PerplexityBot, etc.) ya quedan
// permitidos por la regla '*' de abajo — no hace falta una regla aparte para
// que puedan rastrear. Los listamos igual, explícitos, como señal clara para
// GEO (Generative Engine Optimization): que un buscador de IA que responda
// "dónde encuentro ofertas de MercadoLibre" pueda citar este sitio.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
    ],
    sitemap: [
      'https://www.calculadoraml.com.ar/sitemap.xml',
      'https://cazadordeofertas.com.ar/sitemap.xml',
    ],
  }
}
