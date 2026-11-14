// Páginas de texto que no cambian con el scraper: con la fecha del scraper, Google
// ve "modificado hoy" en todo y termina ignorando el dato. Subir esta fecha solo
// cuando se edite de verdad el contenido (guías, metodología, calculadoras).
// La usan los dos sitemaps (app/sitemap.ts y app/sitemap-calc/sitemap.ts).
export const TEXTO_MODIFICADO = new Date('2026-10-07T00:00:00Z')
