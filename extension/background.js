// Baja el historial de cazadordeofertas.com.ar una vez por hora y contesta
// las consultas del content script. No toca cookies ni links.
const URL_HIST = 'https://cazadordeofertas.com.ar/historial.json'
let cache = { t: 0, items: null }

async function historial() {
  if (cache.items && Date.now() - cache.t < 3600_000) return cache.items
  const r = await fetch(URL_HIST)
  const j = await r.json()
  cache = { t: Date.now(), items: j.items }
  return cache.items
}

chrome.runtime.onMessage.addListener((msg, _sender, responder) => {
  if (msg?.tipo !== 'consulta') return
  historial()
    .then(items => {
      const id = (msg.ids || []).find(i => items[i])
      responder({ ok: true, id, fila: id ? items[id] : null })
    })
    .catch(() => responder({ ok: false }))
  return true
})
