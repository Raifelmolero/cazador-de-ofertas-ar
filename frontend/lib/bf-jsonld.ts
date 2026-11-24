// JSON-LD de las landings (/mejores/black-friday-*) y guías de Black Friday 2026.
// Módulo puro (sin imports de runtime): lo prueba bot/tests/test_landings_black_friday.py
// transpilándolo con TypeScript y corriéndolo en node con productos de ejemplo.
//
// Reglas (pedido del 23/11/2026):
// - ItemList con Product/Offer. El Offer (precio en ARS) solo va si el precio se vio
//   hace 7 días o menos: eso ya lo decide productosDeItems (precio = null si es viejo).
// - Un Product sin offers, review ni aggregateRating es inválido para Google. Como no
//   inventamos ratings, un producto sin precio reciente va como ListItem simple
//   (nombre + url), no como Product.
// - Nada de aggregateRating, review ni inventoryLevel: no tenemos esos datos.
// - availability (24/11/2026, aviso de Search Console «falta availability en offers»):
//   InStock solo cuando hay precio vigente (visto hace 7 días o menos); sin precio no se
//   emite Offer. Lo usan también /precio, /precio-hoy, /vs, /mejores, /categoria y /hoy.

/** schema.org/availability de un Offer: InStock con precio vigente, OutOfStock sin precio. */
export const EN_STOCK = 'https://schema.org/InStock'
export const SIN_STOCK = 'https://schema.org/OutOfStock'
export function disponibilidadLD(precio: number | null | undefined): string {
  return typeof precio === 'number' && precio > 0 ? EN_STOCK : SIN_STOCK
}

export interface ProductoLD {
  nombre: string
  detalle?: string
  url: string
  img: string | null
  /** null = no hay precio visto hace 7 días o menos */
  precio: number | null
}

export interface FaqLD {
  q: string
  a: string
}

export interface MigaLD {
  name: string
  item: string
}

export function breadcrumbLD(migas: MigaLD[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, item: m.item })),
  }
}

export function faqLD(faq: FaqLD[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

/** ItemList: Product + Offer para los que tienen precio reciente; ListItem simple para el resto. */
export function itemListLD(nombre: string, url: string, productos: ProductoLD[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: nombre,
    url,
    numberOfItems: productos.length,
    itemListElement: productos.map((p, i) => {
      if (p.precio === null || !(p.precio > 0)) {
        return { '@type': 'ListItem', position: i + 1, name: p.nombre, url: p.url }
      }
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.nombre,
          ...(p.detalle ? { description: p.detalle } : {}),
          ...(p.img ? { image: p.img } : {}),
          url: p.url,
          offers: {
            '@type': 'Offer',
            price: Math.round(p.precio),
            priceCurrency: 'ARS',
            availability: disponibilidadLD(p.precio),
            url: p.url,
          },
        },
      }
    }),
  }
}
