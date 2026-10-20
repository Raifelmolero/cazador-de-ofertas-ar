# Noche 19→20/10/2026: auditoría, carga masiva y plan por fases

Pedido de Raifel (22:30): auditar todo, buscar repos/automatizaciones que sirvan, armar un plan por
fases y ejecutarlo sin preguntar. Meta de fondo: que el sitio funcione solo (ingreso pasivo) y después
replicar el modelo en otro cazador con otro nombre.

## 1. Qué encontré (auditoría)

| Área | Estado | Hallazgo |
|---|---|---|
| **Inventario** | 🔴 → 🟢 | Era la causa de la caída (1.500 → 362 ofertas). Esta noche: **1.260 vigentes** (898 nuevas desde /ofertas por categoría, leídas en el navegador con el permiso de ML). |
| **Tope oculto en la web** | 🔴 → 🟢 | El bot mostraba como máximo 300 aunque hubiera más cargadas (topes pensados para el scraping). Arreglado: con carga manual van todas (`deals_para_sitio`). |
| **Duración de las manuales** | 🟡 → 🟢 | 7 → 14 días (la tarjeta dice «precio visto el …»). Ya no hay precipicio del 23/10. |
| **Workflows (7 días)** | 🟢 | Todo verde. El mail de «Bot Tests failed» era de las 21:17 (test inestable, arreglado en la misma sesión). Solo falla «YouTube test upload» (falta que Raifel corra `setup_youtube.py`). |
| **Bot principal** | 🟢 | Corre ~4 veces por día. Nueva opción `solo_datos` para refrescar la web sin publicar. |
| **Redes** | 🟡 | IG 1.488 (bajando de a 2/semana), Threads 104, Telegram 4. No traen clics: no invertir más tiempo ahí hasta que la web recupere. |
| **Panel de afiliados** | 🟡 | Semana 12-18/10: web 145 clics / 16 pedidos / $237.708. Conversión ~11 % (bien). El problema era volumen, no el sitio. |
| **Sitio** | 🟢 | 278 páginas rastreadas el 19/10 sin errores; grilla carga 48 en el HTML y el resto en segundo plano (soporta 1.000+). `/cyber` redirige bien a `/cyber-monday`. |
| **Google** | 🟢 | Subiendo. /cyber-monday +250 % de impresiones (237 en 28 días, posición 53); reindexación pedida. |
| **API de ML** | ⏳ | Agustina: «este trimestre», sin fecha. No reenviarle nada hasta mediados de noviembre. |

## 2. Repos y herramientas de afuera (búsqueda del 19/10)

No hay un proyecto abierto que haga lo que ya tenemos (afiliado ML + verificación de descuentos +
web + bot multicanal). Lo más parecido:
- **AMABot** (github.com/Deluxer/amabot): bot de Telegram que compara Amazon y ML; sin afiliados.
- **PriceBuddy** (github.com/jez500/pricebuddy): seguidor de precios autoalojado; sin afiliados ni ML confirmado.
- **Cazadescuentos** (github.com/wiringbits/cazadescuentos): extensión con alertas (ML México); casi sin uso.
- **Doublegram telegram-amazon-affiliate-bot**: pago (€79), solo Amazon.
- Frameworks de agentes (AutoGPT, CrewAI, LangGraph…): genéricos; no suman frente a lo que ya hace
  Claude con tareas programadas.
- Scrapers pagos de Apify para ML: **descartados** (es scraping; ML lo prohíbe).
- Dato de mercado: en Flippa se venden sitios de ofertas «100 % automatizados» → si algún día se quiere
  vender este sitio, hay comprador para este tipo de activo.

**Conclusión:** lo que tenemos es el activo. Lo que conviene es empaquetarlo para clonarlo (fase 5).

## 3. Plan por fases

### Fase 0 — Inventario (HECHO esta noche)
- 898 ofertas nuevas, 1.260 vigentes, web sin tope, duración 14 días.
- Herramienta `bot/tools/lote_navegador.py` (extractor + filtros + lotes) con tests.
- Tarea programada **diaria ~11:13** que recorre 25-35 páginas, carga nuevas y refresca precios.

### Fase 1 — Que funcione solo (en curso, sin Raifel)
- [x] Carga diaria automática desde el navegador (tarea programada).
- [x] `solo_datos` para publicar a la web sin postear en redes.
- [ ] Cuando salga la API de ML: reemplazar la carga del navegador por la API (cero trabajo diario).
- Riesgo: la tarea diaria necesita la PC prendida con Claude y Chrome abiertos. Si un día no corre,
  no pasa nada: las ofertas duran 14 días.

### Fase 2 — Cyber Monday 2-4/11 (preparado)
- Página `/cyber-monday` con fechas oficiales (CACE) y ofertas reales; reindexación pedida.
- `docs/CYBER-POSTS-2026.md` listo; los [corchetes] se completan el 1/11 con precios reales (no se inventan).
- Del 26/10 al 4/11, cargar más páginas por día (40-50) para tener precios frescos en el evento.

### Fase 3 — Más tráfico sin pagar
- Google: seguir pidiendo indexación de páginas con impresiones (10 por día, cuota de GSC).
- Medir el domingo 26/10: etiqueta `web` contra 145 clics / 16 pedidos / $237.708.
- Redes: dejar el bot como está (no consume trabajo); no invertir horas.

### Fase 4 — Más ingresos por clic
- Priorizar ticket alto en la carga (el iPhone de 05-11/10 fue la mitad de esa semana).
- Sumar programas extra cuando haya tiempo: AliExpress (falta cargar datos de cobro, tarjeta 🙋 TUYO).

### Fase 5 — Segundo cazador (cuando este se sostenga solo 2-3 semanas)
Lo que se reutiliza tal cual: `bot/` (publicación, historial, infladas, alertas), `frontend/` (Next.js),
`lote_navegador.py`, workflows y tareas programadas. Lo que cambia: nombre/dominio, `DEALS_HOST`,
etiqueta de afiliado (`matt_word`), rubros (`comision_estimada`, `FUERA`, categorías de la carga) y textos.
Nicho sugerido para el segundo: uno que hoy no cubrimos y tenga ticket alto (ej. herramientas/construcción
o bebés), así no compite con este. Pasos: repo nuevo desde este, dominio en nic.ar, proyecto Vercel,
etiquetas nuevas en el panel de afiliados, tarea programada propia.

## 4. Lo que solo puede hacer Raifel
1. Dejar la PC prendida a la mañana con Claude y Chrome (sesión de ML) para la carga diaria.
2. YouTube: `python bot/tools/setup_youtube.py` con elcazadordeofertas.ar@gmail.com.
3. AliExpress: datos de cobro.
4. Domingo 26/10: nada (la medición la hago yo con el navegador).
