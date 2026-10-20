# Prompt para continuar (21/10/2026 en adelante)

Copiar y pegar en un chat nuevo:

---

Retomamos Cazador de Ofertas AR (afiliados de Mercado Libre + cazadordeofertas.com.ar). Repo:
`C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR\bot-repo` (GitHub Raifelmolero/cazador-de-ofertas-ar; deploy = push a
main → Vercel). Leé primero, en este orden, y no me preguntes nada que esté ahí:
1. Memoria: `noche-2026-10-19-carga-masiva-navegador` (sobre todo las líneas del 20/10 al final) y
   `lunes-2026-10-19-noche-caida-ventas`.
2. `bot-repo/docs/PLAN-REMONTAR-CLICS-2026-10-20.md` (**el plan vigente: diagnóstico, 6 pasos, metas**),
   `docs/HANDOFF-2026-10-20.md` (incluida la sección «Tarde/noche 20/10»), `docs/PROMPT-CONTINUAR-2026-10-20b.md`
   (método de carga y reglas) y la sección «Estado al 2026-10-20» de `CLAUDE.md`.
3. Trello, tablero «Cazador de ofertas»: tarjeta **#42 📈 Remontar clics** (checklist del plan + tabla diaria),
   #40 (plan de acción) y https://trello.com/c/rAugjBkb (comentarios de la carga diaria).

Seguí el plan en orden, sin preguntarme, con tests antes de cada push y anotando en la #42.

## Dónde quedamos (20/10 noche)
- **1.753 ofertas vigentes** (carga masiva del 20/10). El sitio quedó como a principios de octubre por primera vez
  desde el bloqueo de ML (6/10).
- **Diagnóstico**: los clics web del panel siguen al inventario con ~2 días de demora; la conversión no cambió
  (12-16 %). Semanas web: 28/9-4/10 356 clics/56 pedidos/$1,07M · 5-11/10 284/43/$1,16M · 12-18/10 145/16/$238k
  · 19/10 15/3/$62k. **Paradoja**: Vercel y Clarity ven el doble de visitas que a principios de mes (Google
  18→95 por semana) y más `clic_ml` (24→89), pero el panel cuenta menos clics web (338→116) → hipótesis: alguien
  republica nuestros links de afiliado (están en el HTML, `/ofertas-hoy.json` y el JSON-LD de `/precio`).
  Sin confirmar.
- Ya en main: Facebook 5/día y Telegram 3/día (c1aa737, verificado), celulares ≥ $1M con 10 % en su mínimo
  (77eda74), bloque «Cupón de hoy» (be2c876, 57b85c3), plan y CLAUDE.md al día.
- Tarea diaria `cargar-ofertas-central-2010` (~11:13): primera corrida con el paso 0 (grupo de WhatsApp «Ofertas 🌟
  MELI» → cupón del día) y búsquedas de celulares el **21/10**.

## Próximos pasos (en orden)
1. **21/10 mañana**: verificar la carga diaria (comentario en rAugjBkb, `scanned` ≥ 1.200 en
   `bot/state/scan_log.jsonl` de origin/main, cupón del día cargado si Agus mandó uno, sin inventar). Si no
   corrió, cargar a mano.
2. **21/10**: GSC, pedir indexación de /categoria/gamer, /categoria/bebes-y-jugueteria, /categoria/electro-de-cocina.
3. **Todos los días 21-26/10**: fila en la #42 con panel web (clics/pedidos/ganancia), Vercel (visitantes y
   `clic_ml`) y ofertas vigentes. Cómo sacarlo: sección «Paso 2» del plan.
4. **Si la tabla confirma la fuente externa** (panel ≥ 45 clics/día con `clic_ml` ~15): Paso 3 del plan
   (logs de Vercel de `/ofertas-hoy.json`; experimento de etiqueta `webcopia` **con OK de Raifel** para crearla
   en el panel).
5. **Dom 26/10**: medición semanal vs metas (≥ 30 clics/día, ≥ 20 pedidos/semana) y referrer facebook.com en
   Vercel vs 51 por semana. Si hay ≥ 1.200 ofertas todos los días y < 20 clics/día → Paso 3 + consulta a Agustina.
6. **26/10-4/11**: carga Cyber (45 páginas/día); 1/11 completar `docs/CYBER-POSTS-2026.md` (dry-run + permiso).
7. **29/10**: CTR de Google vs 1,7 %.

## Pendientes de Raifel
- YouTube: `python bot/tools/setup_youtube.py` (pegar Client ID y Secret, elegir elcazadordeofertas.ar@gmail.com);
  después «YouTube test upload» → «✓ subido (privado)».
- PC prendida a la mañana con Claude + Chrome (sesión de ML y WhatsApp Web) para la carga diaria.
- Decidir: formulario TENT Creator Summit 27/10 (https://forms.gle/xmg5wsgTEGqqaoqNA).
- OK para crear la etiqueta `webcopia` si el Paso 2 confirma la fuente externa.

## Reglas (no negociables)
Español rioplatense, directo, sin tecnicismos; recomendar siempre una opción. Tests y build antes de cada push
(`python -m pytest -q bot/tests`; `npx next build` si se toca el frontend). Nada público sin dry-run y permiso.
No inventar datos de productos. No scrapear ML desde servidores ni fuera del Chrome de Raifel (≤ 35-45 páginas
por corrida). WhatsApp: leer SOLO el grupo «Ofertas 🌟 MELI», nunca escribir ni abrir otros chats. No empujar
aires/verano sin calor real salvo pedido. No tocar JARVIS. Meta Ads: Claude no paga ni carga tarjetas. Claude
nunca escribe credenciales. Al cerrar: Trello, memoria y handoff.

---
