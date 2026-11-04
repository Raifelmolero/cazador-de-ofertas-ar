// Dominio de la marca de ofertas (se puede pisar con la env var DEALS_HOST en
// Vercel). Cuando ese dominio se agrega al proyecto, su raíz sirve /hoy y
// calculadoraml.com.ar sigue mostrando la calculadora — un solo deploy, dos caras.
const DEALS_HOST = process.env.DEALS_HOST ?? 'cazadordeofertas.com.ar'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',
      },
    ],
  },
  // Cabeceras de seguridad básicas (sin CSP: el sitio carga scripts de analítica
  // y una CSP mal armada rompería medición y botones).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  // Direcciones cortas para placas de story y para tipear: llevan a la página
  // larga conservando los utm (?utm_source=...) que traiga el link.
  async redirects() {
    const cortos = {
      '/cupones': '/cupones-mercado-libre',
      '/notebooks': '/mejores/mejores-notebooks',
      '/celulares': '/mejores/mejores-celulares',
      '/colchones': '/mejores/mejores-colchones',
      '/aires': '/mejores/mejores-aires-acondicionados',
      '/tv': '/mejores/mejores-smart-tv',
      '/lavarropas': '/mejores/mejores-lavarropas',
      '/heladeras': '/mejores/mejores-heladeras',
      '/cyber': '/cyber-monday',
      '/madre': '/dia-de-la-madre',
    }
    // Las páginas de ofertas vistas desde calculadoraml.com.ar no venden
    // (etiqueta calcml: 407 clics, 0 ventas en octubre): se mandan al dominio
    // de ofertas, que sí convierte. La calculadora y /vender quedan donde están.
    const calcHosts = ['calculadoraml.com.ar', 'www.calculadoraml.com.ar']
    const ofertas = [
      'hoy', 'precio', 'precio-hoy', 'mejores', 'mejor', 'vs', 'ofertas', 'categoria',
      'cyber-monday', 'black-friday', 'cupones-mercado-libre', 'regalos-navidad',
      'dia-de-la-madre', 'descuentos-inflados', 'tecno', 'hogar', 'gamer', 'gastronomia',
      'bebes-y-jugueteria', 'pequenos-electrodomesticos', 'vehiculos', 'aliexpress',
      'guias', 'comparador', 'familia',
    ]
    const aOfertas = calcHosts.flatMap(host =>
      ofertas.flatMap(p => [`/${p}`, `/${p}/:path*`]).map(source => ({
        source,
        has: [{ type: 'host', value: host }],
        destination: `https://${DEALS_HOST}${source}`,
        permanent: true,
      })),
    )
    // Guías duplicadas: la vieja ya cubría el tema, se unifica en una sola URL.
    const guiasDuplicadas = {
      '/guias/termotanque-a-gas-o-electrico': '/guias/termotanque-electrico-o-a-gas-o-calefon',
    }
    return [
      ...aOfertas,
      ...Object.entries(guiasDuplicadas).map(([source, destination]) => ({ source, destination, permanent: true })),
      ...Object.entries(cortos).map(([source, destination]) => ({ source, destination, permanent: false })),
    ]
  },
  async rewrites() {
    const dealsHosts = [DEALS_HOST, `www.${DEALS_HOST}`]
    return {
      // beforeFiles: si no, la página estática "/" gana antes de mirar el host
      beforeFiles: [
        ...dealsHosts.map(host => ({
          source: '/',
          has: [{ type: 'host', value: host }],
          destination: '/hoy',
        })),
        // Los navegadores piden /favicon.ico a ciegas; en el dominio de
        // ofertas tiene que ser el ícono de esa marca, no el de la raíz.
        ...dealsHosts.map(host => ({
          source: '/favicon.ico',
          has: [{ type: 'host', value: host }],
          destination: '/favicon-ofertas.png',
        })),
        // llms.txt propio para calculadoraml (public/llms.txt es el del Cazador)
        ...['calculadoraml.com.ar', 'www.calculadoraml.com.ar'].map(host => ({
          source: '/llms.txt',
          has: [{ type: 'host', value: host }],
          destination: '/llms-calc.txt',
        })),
      ],
    }
  },
}

export default nextConfig
