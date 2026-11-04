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

## Crecer en X y en todas las redes antes que la competencia (anotado 4/11)
En X hay cuentas de afiliados de ML con más de 15.000 seguidores. Todas hacen lo mismo:
pegan links de ML con «X % OFF». No les ganamos a volumen; les ganamos con lo que ellos no tienen.

**Nuestra ventaja (dato propio):** historial de precios de miles de productos. Podemos decir
«este es el precio MÁS BAJO que registramos» y «este descuento está inflado, ojo». Nadie más lo dice.

Plan, en orden:
1. **X en automático** (lo primero, destraba todo): Raifel saca las 4 claves gratis en
   developer.x.com con @cazaofertazas (pasos en `X TWITTER/README-AUTOMATIZAR.md`) y las carga
   como secrets del repo. El bot publica 3-5 tuits por día: mínimos históricos con foto y link a
   `/precio/...` del sitio (así el clic suma a la web y al historial).
2. **Formato que crece en X**: hilos «Black Friday: qué está realmente barato y qué está inflado»,
   respuestas rápidas a tuits virales de ofertas con el dato del historial, encuestas.
3. **Lo mismo en todas las redes**: el sello «mínimo histórico / descuento inflado» en IG, Threads,
   FB, TikTok y WhatsApp. Una marca reconocible: «Cazador» = el que te avisa si es verso.
4. **Ganarle a la ventana**: Black Friday (fines de noviembre) y Navidad son el pico; entrar antes
   con constancia diaria, no después.
5. **Medir**: etiqueta propia en el panel de ML para X (`matt_word=x`), en el parte diario.

Con OK de Raifel: cada publicación nueva en público hasta que el formato esté aprobado; X Ads pagos
(tope y fecha de corte, el pago lo hace él).
