// Identidad pública de Cazador de Ofertas AR: dominio y perfiles oficiales.
// Una sola fuente para el JSON-LD (Organization.sameAs), llms.txt y
// llms-full.txt, así buscadores e IAs ven siempre los mismos perfiles.
// Solo perfiles reales y activos: si se suma YouTube/TikTok, agregarlo acá.

export const DEALS_URL = 'https://cazadordeofertas.com.ar'
export const MARCA = 'Cazador de Ofertas AR'

/** @id estables del grafo JSON-LD (se referencian desde otras páginas). */
export const ORG_ID = `${DEALS_URL}/#organization`
export const WEBSITE_ID = `${DEALS_URL}/#website`

export const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
export const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'
export const THREADS_URL = 'https://www.threads.com/@elcazadordeofertas.ar'
export const INSTAGRAM_URL = 'https://instagram.com/elcazadordeofertas.ar'
/** Bot de alertas de precio por privado (bot/alertas.py, components/AlertaCTA.tsx). */
export const BOT_ALERTAS_URL = 'https://t.me/cazador_ofertas_ar_bot'

export const SAME_AS = [INSTAGRAM_URL, THREADS_URL, TELEGRAM_URL, WHATSAPP_URL]

/** Calculadora hermana (mismo deploy, otro dominio). */
export const CALC_URL = 'https://calculadoraml.com.ar'
