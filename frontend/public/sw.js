// Service worker del Cazador de Ofertas (app instalable).
// - Páginas: primero la red (los precios cambian), y si no hay conexión la
//   última copia guardada o la página "sin conexión".
// - Archivos estáticos (_next/static, íconos, personaje): primero la caché.
// - Nunca toca pedidos a otros dominios: los links de afiliado a Mercado Libre
//   salen tal cual, sin pasar por acá.
const VERSION = 'v3'
const PAGINAS = `paginas-${VERSION}`
const ESTATICOS = `estaticos-${VERSION}`
const SIN_CONEXION = '/app/sin-conexion.html'
const MAX_PAGINAS = 30

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(ESTATICOS)
      .then(c => c.addAll([SIN_CONEXION, '/app/icon-192.png']))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => !k.endsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

async function recortar(cache) {
  const keys = await cache.keys()
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_PAGINAS))) await cache.delete(k)
}

self.addEventListener('fetch', event => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_vercel')) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copia = res.clone()
            caches.open(PAGINAS).then(c => c.put(req, copia).then(() => recortar(c)))
          }
          return res
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(SIN_CONEXION))),
    )
    return
  }

  const estatico =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/app/') ||
    url.pathname.startsWith('/personaje/')
  if (estatico) {
    event.respondWith(
      caches.match(req).then(
        hit =>
          hit ||
          fetch(req).then(res => {
            if (res.ok) {
              const copia = res.clone()
              caches.open(ESTATICOS).then(c => c.put(req, copia))
            }
            return res
          }),
      ),
    )
  }
})
