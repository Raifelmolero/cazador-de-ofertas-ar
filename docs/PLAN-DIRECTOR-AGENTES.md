# Plan: Director de la Oficina de agentes (anotado 4/11/2026, para hacer después)

Idea de Raifel (inspirada en un esquema de «agente en el centro»): un agente director que
coordine a los 6 agentes de la Oficina, tome decisiones solo cuando sean buenas para el
negocio, ponga a trabajar a los subagentes y cree nuevos si hace falta, para seguir escalando.
El director es Claude (no Grok).

## Qué ya existe (no rehacer)
- Bot de ofertas en GitHub Actions 3×/día, deploy agrupado 3×/día.
- Brave + extensión 24/7 en la PC (carga de ofertas desde ML a ritmo humano).
- Oficina de agentes (`/oficina`, `data/oficina.json`): 6 agentes con tareas reales.
- Alertas por Telegram al admin, n8n (guardián), Termómetro (artifact).

## Fases
1. **Parte diario 8:00 por Telegram** (primero): ganancia y clics del último día cerrado,
   deploys/bot OK, PRs esperando OK, 1-2 tareas sugeridas. Raifel responde «dale» desde el celular.
   Necesita a Raifel en la PC una vez para aprobar la tarea programada.
2. **Director que reparte**: cada mañana lee el parte y lanza a los agentes las tareas del día
   (cargar ofertas de rubros flojos, guías SEO de temporada, refrescar Termómetro, revisar posts
   programados). Deja todo en PRs acumulados y lo registra en `/oficina`.
3. **Crear agentes nuevos** cuando una tarea se repite 3 veces o más (p. ej. «Cazador de temporada»,
   «Revisor de duplicados SEO»). Cada agente nuevo se anota en la Oficina con su tarea y su medición.
4. **Medir y podar**: los domingos, cada agente se mide por ganancia/clics que movió. El que no
   mueve nada en 2 semanas se pausa.

## Qué decide solo y qué no (reglas de Raifel, fijas)
Puede solo: cargar ofertas desde su navegador a ritmo humano, escribir guías y PRs, refrescar
datos, mandar avisos a Raifel, publicar en SU canal de WhatsApp.
Siempre con OK de Raifel: mergear (en lote, intermedios `datos:`), cualquier cosa pública
(IG, FB, Threads, X, anuncios), gastar plata, tocar Meta Ads. Nunca: scrapear ML desde
servidores, tocar JARVIS, más de 1 build de Vercel por lote.
