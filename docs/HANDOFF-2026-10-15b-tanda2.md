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
