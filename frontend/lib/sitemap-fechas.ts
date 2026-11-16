// Páginas de texto que no cambian con el scraper: con la fecha del scraper, Google
// ve "modificado hoy" en todo y termina ignorando el dato. Subir esta fecha solo
// cuando se edite de verdad el contenido (guías, metodología, calculadoras).
// La usan los dos sitemaps (app/sitemap.ts y app/sitemap-calc/sitemap.ts) y las guías.
export const TEXTO_MODIFICADO_ISO = '2026-11-16'
export const TEXTO_MODIFICADO = new Date(`${TEXTO_MODIFICADO_ISO}T00:00:00Z`)
