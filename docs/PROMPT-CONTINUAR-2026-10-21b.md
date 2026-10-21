# Prompt para continuar (21/10/2026) — Cazador de Ofertas AR

Pegá esto en una sesión nueva de Claude Code en `C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR`:

---
Retomamos Cazador de Ofertas AR. Leé primero: la memoria (MEMORY.md + `martes-2026-10-20-diagnostico-clics.md`), `bot-repo/docs/HANDOFF-2026-10-20.md` (sección «Cierre 20/10 noche»), `docs/PLAN-REMONTAR-CLICS-2026-10-20.md` y Trello #42 (https://trello.com/c/ZyYW9Xqx).

Estado al cierre del 20/10 (23:45):
1. EN VIVO hoy: sección /tecno ampliada + 6 /precio-hoy de tecnología (e64fae5); experimento etiqueta `sitio` (c6c7a00, etiqueta creada en Central → Administrar etiquetas, la etiqueta en uso sigue siendo `web`); página /cyber-monday/tecnologia (912045f) con el precio testigo de ~92 productos tech.
2. SIN PUBLICAR: comparador interactivo /comparador/celulares y /comparador/notebooks (rama `comparador-tecno`, commit 29297b1, en D:/wt/sitio). Build/tsc/lint OK. Falta: (a) revisar en vista previa que en celulares no se cuelen no-celulares (último ajuste del filtro `incluye` en lib/comparador.ts no se volvió a mirar), (b) correr pytest, (c) mostrarle captura a Raifel y publicar SOLO con su OK. Incluye además un título SEO más corto para /cyber-monday/tecnologia. Ojo: al previsualizar en localhost el service worker de la PWA cachea páginas → desregistrarlo.
3. YouTube reconectado con la cuenta del canal elcazadordeofertas.ar@gmail.com (proyecto Google Cloud «Cazador Shorts», app publicada «In production»; secrets YT_* actualizados 21/10 01:43 UTC; se quitó el permiso viejo de raifelmolero). Verificar en el log de la corrida nocturna (`[info] shorts:`) que el Short subió al canal del Cazador.

Hacer el 21/10:
- Cerrar el número del 20/10 en #42 y agregar la columna `sitio` (sitio = clics dentro del sitio; lo que siga entrando por `web` = links copiados/usados fuera).
- Verificar la carga diaria de las 11:13 (≥1.200 ofertas, cupón de WhatsApp, prioridad tecnología).
- GSC: pedir indexación de /cyber-monday/tecnologia, /tecno, /precio-hoy/iphone, /categoria/gamer, /categoria/bebes-y-jugueteria, /categoria/electro-de-cocina (y los comparadores cuando se publiquen).
- Plan de crecimiento que pidió Raifel (tecnología de ticket alto + autos, SEO/GEO para que todos pasen por la web antes de ML), en orden recomendado:
  1. Publicar comparadores (con OK).
  2. Páginas "X vs Y" con precios reales (iPhone 17 vs 17 Pro, Galaxy S26 vs iPhone 17, Moto G vs Galaxy A…) generadas desde lib/comparador.
  3. "Mejor celular / notebook hasta $X" (300k, 600k, 1M…) como páginas propias por presupuesto.
  4. Autos: neumáticos por medida (/neumaticos/175-65-r14, 205-55-r16…) + sumar «neumaticos» y «bateria auto» a la rotación de la carga diaria.
  5. GEO: sumar todo a llms.txt/llms-full.txt, IndexNow/Bing, y medir referrers de IAs cada semana.
- Dom 26/10: medición semanal vs metas (≥30 clics/día, ≥20 pedidos/semana). Cyber 2-4/11.

Reglas: tests antes de cada push; nada público sin dry-run y permiso de Raifel; no scrapear ML fuera de su navegador (≤35-45 páginas por corrida); en WhatsApp solo leer «Ofertas 🌟 MELI»; no tocar JARVIS; Claude no escribe credenciales; no empujar aires/verano sin calor real; recomendar siempre una opción; español rioplatense sin tecnicismos. Al cerrar: Trello + memoria + handoff.
---
