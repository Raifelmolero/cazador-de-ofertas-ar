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
    return {
      // beforeFiles: si no, la página estática "/" gana antes de mirar el host
      beforeFiles: [DEALS_HOST, `www.${DEALS_HOST}`].map(host => ({
        source: '/',
        has: [{ type: 'host', value: host }],
        destination: '/hoy',
      })),
    }
  },
}

export default nextConfig
