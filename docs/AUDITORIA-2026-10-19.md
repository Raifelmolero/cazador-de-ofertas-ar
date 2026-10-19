# Auditoría completa 19/10/2026 (complementa AUDITORIA-2026-10-18.md)

## 1. Números
- Panel ML 7 días al 19/10: 240 clics, 16 pedidos, $237.708 (6/10: 409 / 62 / $1.013.911).
- Conversión 15 % → 6,7 %; ganancia por pedido estable (~$15k). Todo el ingreso es etiqueta `web`.
- Redes (metrics_log 19/10): Instagram 1.488 seguidores (bajando de a poco desde 1.492), Threads 104,
  Telegram 4, Facebook 0. Telegram recibe ~160 posts/mes para 4 personas.

## 2. Sistema (todo verde)
- Últimas 30 corridas de Actions OK. Bot: 294 ofertas, 121 candidatas, publica 5 por corrida.
- Links de afiliado: 267/267 con `matt_word=web`.
- API de ML: el refresh_token rota bien, pero highlights/items/search dan 403 y el catálogo trae
  productos sin precio (probado el 13/10). Con `scrape_ml=false` la API ni se consulta: no cambia nada hoy.
- YouTube Shorts: el código existe (`bot/shorts.py`, `bot/tools/setup_youtube.py`) pero nunca subió
  nada: faltan los secrets YT_*. Además, una app de Google sin auditar sube los videos como privados,
  y los links en la descripción de un Short no son clickeables. Prioridad baja.

## 3. Arreglado hoy (en main)
- Aviso diario por Telegram cuando las ofertas manuales se están por acabar.
- Landings y categorías con pocas ofertas muestran «Mientras tanto, las mejores ofertas de hoy».
- Filtros: Smart TV 55+ (ML no escribe «pulgadas») y «Aire Acond» abreviado.
- Tildes rotas en títulos cargados a mano («ColchÃ³n»): 9 corregidos y prevención en la carga.

## 4. Competencia
- **mejorescompras.com.ar**: el competidor más parecido. Verifica descuentos contra historial,
  etiqueta reales/inflados, ranking de inflados «en vivo», fichas /precio/MLA…, alertas por Telegram,
  estudio de «descuentos truchos». Dice seguir **9.000 productos por la API oficial de ML** y vivir de
  afiliados ML. Sus cifras se contradicen entre páginas (96 %, 91 %, 81 % inflados). Si de verdad
  tiene la API, es la prueba de que ML se la da a afiliados: preguntárselo a Agustina con este ejemplo.
- **Promodescuentos**: comunidad (usuarios publican ofertas y cupones). Canal de Telegram grande.
  Sirve para menciones si sus reglas permiten links propios (verificar antes de publicar).
- **soloprecio.com.ar / cuponesargentina.com.ar**: páginas de cupones ML del día. Nosotros tenemos
  /cupones-mercado-libre.
- **historial.com.ar, MercadoTrack, Baratometro**: seguimiento de precios, sin afiliado visible.
- Nosotros ya tenemos lo equivalente: verificador de links, /descuentos-inflados, /estudio, /precio.
  La diferencia es el **volumen de productos** (ellos 9.000 seguidos, nosotros ~300 a mano).

## 5. Repos de GitHub
- No hay un proyecto open source mantenido para seguir precios de ML; lo que aparece son scrapers
  pagos de Apify → descartados (es scraping, ML lo prohíbe).
- Sigue vigente `docs/REPOS-UTILES-2026-10.md` (lychee, unlighthouse, faster-whisper, changedetection).
  Nada nuevo que valga la pena instalar.

## 6. Novedades del mercado
- **YouTube Shopping + Mercado Libre en Argentina** (junio 2026): afiliados desde 500 suscriptores,
  pero exige estar en el Programa de Partners de YouTube. Camino de meses; anotarlo para 2027.
- El programa de afiliados de ML da beneficios extra (campañas, pago por vistas) desde 10.000
  seguidores en Instagram o TikTok.

## 7. Prioridades (de más a menos impacto)
1. Volumen de ofertas: lote diario con aires, heladeras, notebooks, termotanques, TV grandes.
2. API de ML: mensaje a Agustina citando que otros sitios dicen usar la API oficial.
3. Cyber Monday 2-4/11: ofertas cargadas antes del 1/11.
4. Bajar Telegram a 1 post por corrida (no suma clics; decide el dueño).
5. Preguntar qué es la etiqueta `extension` (91 clics, 0 ventas la semana pasada).

## 8. Segunda pasada (misma tarde)
- **Rastreo del sitio** (dev server con Host del dominio de ofertas): sitemap de 1.563 URLs
  (1.326 `/precio`, 89 guías, 58 comparativas, 27 landings, 25 categorías). Muestra de 278 páginas
  (todas menos `/precio` + 40 `/precio` al azar): **0 errores**, 0 links internos rotos, 0 `noindex`,
  0 títulos duplicados.
- **Links a ML**: 2.965; solo 16 sin etiqueta, todos a propósito (12 en `/descuentos-inflados`, donde
  no se gana con descuentos truchos, y 4 citas de fuentes legales en `/cupones-mercado-libre`).
- Sin JSON-LD: `/precio` (índice), `/aliexpress`, `/privacidad`, `/terminos` (menor).
- **Buscador del sitio**: buscaba la frase exacta → «aire inverter» daba 0 y «aires»/«colchones» no
  encontraban nada. Arreglado (palabra por palabra + plurales); probado en navegador: 0 → 3 aires.
- **Fecha del sitio**: confirmado en producción: `scraped_at` 19/10 13:32, 300 productos.
- **Extensión de Chrome**: el link «Comprar con Cazador» está bien armado (matt_word=extension +
  matt_tool); los 0 ventas son de uso, no un error.
- **YouTube Shorts**: token OK pero 0 Shorts registrados desde el 17/10 → error visible en el log desde
  el 19/10; revisión programada el 20/10.
- **Comparativas**: las 57 ya tienen texto propio (pendiente del 07/10 cerrado).
- No se pudo ver desde acá: Clarity, Search Console, panel de ML, peso real de imágenes en celular
  (el sandbox no llega a mlstatic), Vercel.
