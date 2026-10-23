# Prompt para continuar (23/10/2026) — Cazador de Ofertas AR

Pegá esto en una sesión nueva de Claude Code en `C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR`:

---
Retomamos Cazador de Ofertas AR. Leé primero, en este orden:
1. La memoria: MEMORY.md + `martes-2026-10-20-diagnostico-clics.md` (secciones 21/10 y 22/10, lo último está al final).
2. Este archivo completo.
3. `docs/PROMPT-CONTINUAR-2026-10-22.md`: método técnico, GSC, panel y carga. Sigue valiendo todo lo que este archivo no cambia.
4. La tarjeta Trello #42 (https://trello.com/c/ZyYW9Xqx). El último comentario es el «CIERRE 22/10 (noche)».
5. Si hace falta el porqué: `docs/ANALISIS-VENTAS-2026-10-21.md` y `docs/PLAN-REMONTAR-CLICS-2026-10-20.md`.

Usá la extensión de Chrome (Claude in Chrome) para todo lo del navegador: el navegador interno no tiene las sesiones de Raifel.

## Estado al cierre del 22/10 (noche)

### Números
- **Fila 21/10, cerrada:** 24 clics · 1 pedido · $42.014.
  - Por etiqueta: sitio 6 clics y 1 pedido · web 15 · extension 3.
  - Vercel: 57 visitantes y 11 clic_ml. Ofertas: 1.925.
- **22/10 parcial:** web 0 · sitio 3.
- **Carga del 22/10 (11:13):** OK, +247 → 2.127 vigentes, cupón MELIBONUS.
- **Diagnóstico:**
  - Cerca del 80 % de los clics y ventas de principios de octubre venían de terceros que usaban nuestros links. Eso se cortó cuando el sitio quedó sin ofertas, del 8 al 19/10.
  - Raifel confirmó que nadie compartía links fuera del sitio.
  - Hay un candidato sin prueba: el canal de WhatsApp «CazadorDeOfertaML».
  - Señal a mirar: si la etiqueta `web` pasa de ~30 por día antes del 26/10, volvió el tercero.
- **Campaña de $30k (2 ventas en octubre):** sigue en 0/2. Raifel la pregunta en «Necesito ayuda» o a Agus.

### Publicado el 22/10 (todo en main y verificado en vivo)
- **#28 y #29:** las guías y las páginas sin productos muestran las ofertas del día que están en su precio mínimo.
- **#30:** /mejor/notebook-hasta-1-2-millones y /mejor/notebook-hasta-2-millones.
  - Celular hasta 500 mil, 800 mil y 1,5 M quedaron descartadas: daban los mismos 3 primeros que el escalón vecino, o sea contenido duplicado.
- **#31:** 15 duelos /vs nuevos, 36 en total (lista DUELOS en lib/vs.ts).
- **#32:** /comparador/smart-tv (34 TV) + 5 páginas /mejor/smart-tv-hasta-{400-mil,600-mil,800-mil,1-millon,1-5-millones}. La regla automática SIN_REPETIDOS de lib/presupuesto.ts evita escalones repetidos.
- **#33:** portada, /vs, /mejor, comparadores y Cyber tecno ahora usan el pie de ofertas (`brand="ofertas"`), con links a comparadores y a /mejor.
- **#34:** los títulos de /vs ya no se cortan.
- **#35:** links a duelos y a /mejor desde /tecno y /cyber-monday/tecnologia. Las descripciones de /vs y /mejor ya no empiezan con «Hoy (fecha)».
- **#36, en /vs/*:**
  - botones «Ver X desde $… ↗» en Respuesta rápida (`data-seccion="vs-respuesta"`);
  - fila «Comprar» en la tabla (`vs-tabla`);
  - bloque «¿Cuál te conviene según lo que buscás?», armado solo con datos reales: precio, memoria, cercanía al mínimo y cantidad de vendedores;
  - datos estructurados (JSON-LD ItemList) con 2 productos y sus precios (Product/AggregateOffer).

### SIN PUBLICAR: rama `mejores-links-presupuesto` (commit fa7e454, ya está en GitHub)
- **Qué cambia:**
  - `app/mejores/[slug]/page.tsx`: las páginas /mejores de celulares, notebooks y smart TV muestran el bloque «¿Tenés un presupuesto? Te decimos cuál conviene hoy». Tiene links a cada /mejor/* de esa categoría y un «Comparar todos» que lleva a /comparador/<categoría> (`data-seccion="mejores-presupuesto"`).
  - `app/mejor/[slug]/page.tsx`: el título para Google pasa a «Mejor X hasta $Y (2026): ranking de hoy». Si no entra en 65 caracteres, queda sin «: ranking de hoy». El año sale de la fecha de la compilación.
- **Pruebas:**
  - La 1ª compilación, solo con los links, dio verde: mejores-celulares tiene 4 links, notebooks 6, smart TV 5 y lavarropas 0.
  - pytest dio 365 OK; tsc y eslint, OK.
  - La 2ª compilación, ya con los títulos, falló por TIEMPO («took more than 60 seconds», con la PC cargada). No fue un error de código.
- **Para publicarla:**
  1. `cd D:/wt/sitio && git checkout mejores-links-presupuesto`.
  2. En frontend, correr `npm run build` en segundo plano y con la PC tranquila.
  3. Revisar los `<title>` en `.next/server/app/mejor/*.html`.
  4. `gh pr create`, después `timeout 100 gh pr merge --squash --delete-branch`.
  5. Verificar en vivo con curl.

### Otros
- **Disco C:** pasó de 9,2 a 15 GB libres. Se borraron los 8 worktrees de bot-repo/.claude/worktrees y la caché de npm.
  - Las ramas siguen en GitHub; `worktree-agent-a9c38b10b27016d63` tiene 1 commit sin mergear.
  - Opcional, solo con OK de Raifel: mover ORIGEN CAFÉ (2,7 GB) del Escritorio a D:.
- **Trello:** volvió a conectar el 22/10 a la noche. La #42 está al día.
- **Vault:** el único vault relacionado es el de JARVIS. Por regla no se toca, y además el acceso quedó bloqueado. No hay vault propio del Cazador.

## Hacer el 23/10, en orden
1. **Verificar la carga de las 11:13:** que haya corrido, que haya 1.200 vigentes o más y que esté el cupón del día. Estamos sobre el tope de 1.600, así que la carga refresca más precios de los que suma ofertas nuevas.
2. **Publicar la rama `mejores-links-presupuesto`** con los pasos de arriba.
3. **Fila del 22/10 en la #42:** panel por etiqueta (sitio, web, extension), Vercel (visitantes y clic_ml) y ofertas.
4. **GSC (hasta 10 por día), en este orden:**
   - /vs/lenovo-loq-vs-hp-omen
   - /comparador/smart-tv
   - /mejor/smart-tv-hasta-600-mil
   - /mejor/smart-tv-hasta-1-millon
   - /mejor/notebook-hasta-1-2-millones
   - /mejor/notebook-hasta-2-millones
   - después, los duelos nuevos de #31 (ver DUELOS en lib/vs.ts)
   - Antes de pedir cada una, mirar si ya está indexada.
5. **Neumáticos:** solo si Raifel da el OK (el plan está en el prompt del 22/10).
6. **Domingo 26/10:** medición semanal contra las metas (30 clics por día o más, 20 pedidos por semana o más).
   - Medir también clic_ml por sección: vs-respuesta, vs-tabla, vs-publicaciones y mejores-presupuesto.
   - Cyber: del 2 al 4/11.

## Cómo se publica (esto cambió)
- El modo automático bloquea `git push origin HEAD:main`. El flujo ahora es: rama → `gh pr create` → `timeout 100 gh pr merge --squash --delete-branch`.
- Antes de mergear:
  - `npx tsc --noEmit`
  - `npx eslint <archivos>`
  - `npm run build`: ~4.517 páginas, ~4,5 min, en segundo plano.
  - `cd bot && python -m pytest -q`: 365 OK.
- Borrar worktrees en Windows: PowerShell `Remove-Item -LiteralPath ('\\?\' + $p) -Recurse -Force`.

## Reglas
- Tests antes de cada push.
- Nada público en redes sin permiso de Raifel (captura + OK).
- No scrapear ML fuera de su navegador.
- WhatsApp: solo leer el grupo «Ofertas 🌟 MELI» y no escribir nada.
- No tocar JARVIS.
- Claude no escribe credenciales.
- No empujar aires ni productos de verano sin calor real.
- Recomendar siempre una opción.
- Español rioplatense, sin tecnicismos.
- Al cerrar: Trello + memoria + handoff.
---
