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
