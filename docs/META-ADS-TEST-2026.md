# Test de Meta Ads — plan (tarjeta #28). NO activado: lo decide y paga Raifel.

**Por qué:** convertimos 15% y cada clic vale ~$2.480 de ganancia. Aunque el clic de
anuncio rinda un tercio, vale ~$800. El test busca saber a cuánto sale el clic real.

## Presupuesto y regla de corte
- Tope total $10.000 (≈ $1.000/día por 10 días), entre el 26/10 y el 4/11.
- Cortar si: gastados $5.000 y el costo por clic de enlace supera $400, o 0 clics a ML en Clarity.
- Escalar solo si el costo por clic es < $300 y se ven clics a ML por utm_source=meta.

## Campaña
- Objetivo: Tráfico (clics en el enlace) a la landing, no Interacción.
- Audiencia: hombres y mujeres 25-54 (observado: hombres 25-44), CABA/GBA/Córdoba, intereses
  compras online/electrodomésticos. Ubicaciones: Feed y Reels de Instagram + Facebook.
- Destino: `https://cazadordeofertas.com.ar/cyber?utm_source=meta&utm_medium=cpc&utm_campaign=cyber_test`
  (alternativa: `/ofertas/ofertas-ticket-alto` con el mismo utm).

## Anuncios (3 variantes, probar cuál rinde)
1. "¿Ese 40% OFF es real? Antes del Cyber, mirá cuáles bajaron de verdad contra su precio histórico." — botón: Más información.
2. "Cyber Monday 2 al 4/11: ofertas verificadas contra el historial de precios. Sin descuentos inflados." — botón: Ver más.
3. "1 de cada 6 ofertas de Mercado Libre tiene el descuento inflado. Fijate cuáles no." — botón: Más información.
Creatividad: placa del bot o escena de Don Ofertín de Cyber (`escena-cyber-monday.webp`). Sin precios inventados.

## Medición (limitación importante)
- Los links a ML llevan `matt_word=web` para todo el sitio, así que el panel de afiliados NO separa
  los pedidos que vinieron de Meta. Clarity sí registra `utm_source=meta` y los clics a ML.
- Para medir pedidos reales por anuncio hay que crear la etiqueta `meta` en el Administrador de
  etiquetas del panel de ML y que una landing de anuncios use `matt_word=meta` (requiere un cambio
  chico de código; lo hago cuando Raifel cree la etiqueta).
- Mientras tanto: comparar clics y pedidos totales del panel contra la semana anterior.

## Pasos de Raifel
1. Tener la cuenta publicitaria de Meta con método de pago.
2. (Opcional, recomendado) crear la etiqueta `meta` en el panel de ML y avisarme.
3. Aprobar el tope y las fechas.

## Actualización 15/10 (con datos reales del panel por etiqueta)
- Etiqueta `web`: 190 clics/sem, 13,7% de conversión, ganancia $446.462 → **~$2.350 por clic web** (1-7/10: $3.870 por clic).
- Un clic de anuncio rinde ~1/3 (llega frío): **vale ~$780**. Corte propuesto: costo por clic < $400 (margen 2x). Con $10.000 de tope se compran 25-35 clics → ~$20-27k de ganancia: sirve para APRENDER el costo real, no para mover el mes.
- Para mover octubre al escenario optimista haría falta ~250 clics extra/semana: ~$75.000/semana a $300 por clic, con retorno ~2,6x (neto ~+$120k/semana). Eso supera el tope de reinversión de $10k/mes (#00): decisión de Raifel.
- Recomendación: adelantar el arranque del 26/10 a ~19-20/10 con el tope de $10.000 para medir el costo real, y escalar solo si el costo por clic < $300 y se ven pedidos. Crear la etiqueta `meta` antes de arrancar.

## Actualización 21/10: medición por etiqueta lista (en main)
- Quien entra con `utm_source=meta` hace sus clics con `matt_word=meta` (se recuerda en la pestaña, también
  en las páginas siguientes). El resto sigue con el experimento `sitio`/`web`. Probado en navegador.
- **ANTES de prender los anuncios**: crear la etiqueta `meta` en Central de afiliados → Administrar etiquetas.
  Sin esa etiqueta, los clics del anuncio podrían no pagar comisión.
- Destino del anuncio: `https://cazadordeofertas.com.ar/cyber?utm_source=meta&utm_medium=cpc&utm_campaign=cyber_test`
  (o `https://cazadordeofertas.com.ar/?utm_source=meta&utm_medium=cpc&utm_campaign=test` antes del Cyber).
- Medir en el panel: Métricas → Redes → etiqueta `meta` (clics, pedidos, ganancia) contra lo gastado en Meta.
