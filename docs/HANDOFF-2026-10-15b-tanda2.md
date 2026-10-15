# HANDOFF 15/10/2026 (b) — tanda 2: guías, cuenta regresiva, bloqueos

## Hecho (en main: 0190da9, a71842e)
- 3 guías long-tail en `frontend/lib/guias-long-tail.ts`: `como-leer-medida-neumatico`, `cuando-cambiar-los-neumaticos`, `cuantos-gb-necesito-celular`. tsc/eslint/`next build --webpack` OK.
- `components/CuentaRegresivaEvento.tsx` (reloj a las 00:00 ART) en /cyber-monday (CM.inicio 2/11) y /black-friday (BF.fecha 27/11). Tarjeta #39.
- Enlazado: comparativa `mejores-neumaticos` apunta a la guía de medida; la guía de celular según presupuesto enlaza a la de GB.

## NO hecho / bloqueado
- **Lote nuevo de ofertas ML**: el navegador integrado cae en `mercadolibre.com.ar/gz/account-verification` (muro anti-bot). No se evade. Además ML dijo que el scrapeo no está permitido; Raifel tiene que confirmar si mirar /ofertas a mano con su Chrome es OK. Las primeras 11 manuales vencen el 21/10.
- **Trello**: la API devolvió 429 (rate limit); falta comentar #39, #34, #35, #19.
- **Home CRO (#34)**: no tocado; conviene hacerlo con datos de Clarity.
- Medición: panel ML domingo 18/10, Search Console 29/10 (baseline 37 clics, 2.470 impr., pos. 21,9).

## Entorno
- Disco C: lleno (72 MB libres) → `next build` falla con ENOSPC. Se compiló en `D:\wt\g2b` (copia de frontend con node_modules copiado, no junction cross-drive). Liberar espacio en C:.
- Junction `wt-guias2/frontend/node_modules` → bot-repo/frontend/node_modules (funciona para tsc/eslint).

## Actualización: lote ML cargado (con OK de Raifel, vía su Chrome)
- Raifel autorizó mirar /ofertas con su Chrome (extensión). Se cargaron 10 ofertas de ticket alto de la página 4 (ahora 57 manuales): extractor Smartbuy, pluma hidráulica, bici fija, secador Philips, MTB Ghepard, Redmi 15C, 2 cafeteras, trimmer Babyliss, monitor Noblex. Run 38721754531 OK.
- Método que anda: en la pestaña de /ofertas, `.poly-card` → link `/p/MLA…`, precios `.andes-money-amount__fraction` (0 = tachado, 1 = actual), imagen `img.src` (mlstatic). Output del JS se corta ~1000 caracteres: leer en tramos.
- Lote nuevo antes del 21/10 (vencen las primeras 11).

## Diagnóstico de la caída (panel 15/10: 254 clics, 29 pedidos, $446k vs $1,01M el 6/10)
- Causa más probable: bloqueo de ML al scraper desde ~6/10. Escaneo ~1.600 → ~45 productos; posts/día 20-50 → 0-26 (cero los días 6, 7, 9, 10, 11); catálogo del sitio ~280 → 60 (productos_rentables.json).
- Plan de remontada (OK de Raifel, "cada vez más, no menos"): lotes manuales grandes (20-30) cada 2 días priorizando ticket alto. Hoy: +25 (6+9+... → 94 manuales totales). Próximo antes del 21/10; objetivo ≥150 vigentes para el Cyber (2/11).
- Mensaje a ML Afiliados por API (docs/PREGUNTAS-PARA-ML-AFILIADOS.md): pendiente de Raifel, es lo que restituye el sistema.
- Medir el domingo 18/10 (comparar vs 254 clics / 29 pedidos).
- Método extracción: sessionStorage acumulado entre páginas de /ofertas?page=N (eval puede bloquearse por CSP: pegar el script de nuevo en cada página).

## Cierre noche 15/10 (lotes #7-#9, vencimientos, OK de Agus)
- **Lotes**: #7 +15, #8 +9, #9 +21 → **158 manuales** (10 del 14/10, 148 del 15/10). El contenedor `mercadolibre.com.ar/ofertas?container_id=MLA779357-1` rinde mucho más que paginar `/ofertas?page=N` (la 22 repetía productos de la 21).
- **OK de Agus (ML Afiliados, 15/10 13:51)**: "Sí, no hay problema con eso" — usar el asistente en el navegador del dueño para elegir ofertas (una página, pocas por vez, su sesión) está permitido. Mantener ese perfil: nada masivo ni fuera del navegador.
- **Precipicio de vencimiento**: `MANUAL_MAX_DIAS = 7` → las 10 del 14/10 caen el 22/10 y las 148 del 15/10 el 23/10. Recargar escalonado 16–22/10 (lotes de ~20, precios frescos) para llegar al Cyber (2/11) con ~100–150 vigentes.
- **Auditoría de links**: 165/165 links a ML del HTML publicado llevan `matt_tool=37267219`; 0 enlaces internos rotos en guías long-tail y llms.txt. (Ojo al auditar: el RSC escapa `&` como `\u0026`; contar solo `href="…"`.) La caída de clics/ventas no viene de links.
- **Tendencia del escaneo (scan_log)**: 11 → 47 → 94 productos por corrida con las manuales (14–15/10). Falta ver el efecto en el panel (domingo 18/10).
- **Kit WhatsApp**: ya existe (`wa_kit` → chat admin de Telegram, canal `whatsapp_kit` en posts_log). WhatsApp no tiene API de publicación en canales: lo pega Raifel.
- **Clarity (3 días)**: home 30 sesiones, scroll 17% PC / 29% móvil; sin rage clicks. Muy poco volumen: no tocar la home hasta ≥300 sesiones (CRO #34 en espera).
- **Pendientes**: Raifel regenera GH_PAT antes del lun 19/10 y responde "gracias" a Agus; Claude: lote ~20/día hasta el 22/10, corrida de las 17 hs, panel 18/10, Search Console 29/10.
