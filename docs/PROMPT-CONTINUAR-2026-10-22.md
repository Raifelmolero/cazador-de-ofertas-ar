# Prompt para continuar (22/10/2026) — Cazador de Ofertas AR

Pegá esto en una sesión nueva de Claude Code en `C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR`:

---
Retomamos Cazador de Ofertas AR. Leé primero la memoria (MEMORY.md + `martes-2026-10-20-diagnostico-clics.md`, sección «21/10») y la tarjeta Trello #42 (https://trello.com/c/ZyYW9Xqx, comentarios del 21/10).

Estado al cierre del 21/10 (todo en main, verificado en vivo):
1. Carga diaria: corrió 18:28 (PC apagada a las 11:13) → 1.925 ofertas vigentes, cupón FLASHMELI. Sobre el tope de 1.600: las próximas corridas, más refresco que nuevas.
2. EN VIVO: comparadores /comparador/celulares (79) y /notebooks (53) — main 9c26b77.
3. EN VIVO: 14 duelos /vs/* con precios reales (lib/vs.ts, lista DUELOS) — main b11cd50.
4. EN VIVO: 8 páginas /mejor/<celular|notebook>-hasta-<monto> (lib/presupuesto.ts) — main c1db778. Recomienda solo marcas conocidas; RAM de celulares con tope 8 GB.
5. GSC 21/10: indexación pedida de los 2 comparadores, /cyber-monday/tecnologia, /tecno, /precio-hoy/iphone, /categoria/electro-de-cocina (gamer y bebés ya estaban).
6. Clics (panel ML, todas las etiquetas, por día vs clic_ml de Vercel): hasta el 17/10 el panel contaba muchos más clics que los que salían del sitio; desde el 18/10 casi coinciden → cayeron los clics de afuera, el sitio da 10-20/día. El «últimos 7 días» de la Central no es confiable. El parámetro `filter_tag` del fetch NO filtra.
7. Campaña de incentivo REAL (Central → Campañas con incentivos): $30.000 por 2 ventas del 1 al 31/10, inscripto, progreso 0/2 (raro). Raifel pregunta con «Necesito ayuda» o a Agus.

Hacer el 22/10, en orden:
- Verificar la carga diaria de las 11:13 (≥1.200 vigentes, cupón del día).
- GSC (cuota nueva): /vs/iphone-17-vs-iphone-17-pro, /vs/samsung-galaxy-s26-vs-iphone-17, /vs/moto-g15-vs-samsung-galaxy-a16, /mejor/celular-hasta-400-mil, /mejor/notebook-hasta-1-millon, /mejor/celular-hasta-1-millon.
- Fila diaria del 21/10 en #42 y separar web vs sitio desde el selector de etiquetas del panel.
- Siguiente del plan: duelos de notebooks (en lib/vs.ts), neumáticos por medida (/neumaticos/175-65-r14…) + «neumaticos»/«bateria auto» en la rotación de la carga, GEO (IndexNow/Bing de las páginas nuevas, referrers de IAs semanal).
- Dom 26/10: medición semanal vs metas (≥30 clics/día, ≥20 pedidos/semana). Cyber 2-4/11.

Notas: el navegador interno no abre localhost → vista previa en Chrome (config «tecno» de .claude/launch.json, worktree D:/wt/sitio; desregistrar el service worker). Los prompts de continuidad viven en el worktree donde se escribieron (este en D:/wt/sitio/docs y en main).

Reglas: tests antes de cada push; nada público sin permiso de Raifel; no scrapear ML fuera de su navegador; en WhatsApp solo el grupo «Ofertas 🌟 MELI» salvo que Raifel pida otro mensaje; no tocar JARVIS; Claude no escribe credenciales; no empujar aires/verano sin calor real; recomendar siempre una opción; español rioplatense sin tecnicismos. Al cerrar: Trello + memoria + handoff.
---
