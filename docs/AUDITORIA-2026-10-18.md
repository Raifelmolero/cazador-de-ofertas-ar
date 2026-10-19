# Auditoría completa 18/10/2026

## 1. Lo que dicen los números (capturas del panel)
- Ingresos de ML: octubre (período actual, al 18/10) $1.812.678 en revisión; septiembre completo $1.182.502; saldo pendiente $3.000.380; a pagar el 19/11 $1.187.702. **Octubre ya supera a septiembre entero**, aunque la última semana vendió poco.
- Últimos 7 días (hasta el 18/10): 253 clics (todas las etiquetas), 18 pedidos, $254.331. Etiqueta `web` 11-17/10: 149 clics, 17 u., $253.596 (la `extension` suma 91 clics con 0 ventas).
- Semanas `web`: 337 → 338 → 190 → 149 clics; ganancia $982k → $1,31M → $446k → $254k. Conversión estable (11-15 %).
- Hoy 11/10-17/10 las ventas se concentraron el 12-13/10 (10 de 17 unidades); el 14 y el 17/10 no tuvieron ventas con 53 y 28 clics.

## 2. Causas (de más a menos respaldada)
1. Corte de publicaciones 6-11/10 (bot bloqueado por ML → carga manual); posts ~34/día desde el 14/10 pero con ofertas más viejas y sin las mejores del día.
2. Menos ticket alto: ganancia por unidad ~$22k → ~$15k; semana sin celulares caros.
3. Sin tráfico propio (IG/Telegram ≈ 0 clics; Google sube pero chico: 86 clics/28 d).
4. No confirmado: efecto Día de la Madre. Descartado: links rotos (165/165 con matt_tool), conversión, caída de Google.

## 3. Auditoría técnica
- CI/automatizaciones: últimas 25 corridas en verde; bot corre 4×/día, alertas, IndexNow, informes.
- Sitemap: 1.560 URLs; robots permite bots de IA. Guías indexadas rápido (Google las muestra en horas/días).
- **Seguridad**: solo había HSTS. Faltaban X-Content-Type-Options, X-Frame-Options, Referrer-Policy y Permissions-Policy → agregadas en `frontend/next.config.mjs`. Pendiente aparte: CSP (riesgo de romper analítica; hacerla en modo report-only).
- Dependabot: 1 alerta media aceptada (postcss-selector-parser/Tailwind 3). Tailwind 4 requiere migración.
- Pendientes: lychee completo, velocidad móvil (Speed Insights), `/precio` vencidos.

## 4. Qué investigué (GitHub / agentes de IA)
- **claude-seo (AgriciDaniel) y agentic-seo-skill**: skills de Claude Code para auditoría SEO/GEO/schema con agentes en paralelo. Útil para auditorías periódicas del sitio. Ya tenemos skills SEO equivalentes instaladas.
- **GitHub Agentic Workflows (gh-aw, preview desde feb-2026)**: agentes descritos en Markdown que corren en Actions de forma programada (revisión, triage, auditoría de seguridad nocturna). Candidato para: auditoría nocturna del repo y reporte de enlaces rotos.
- **GitHub AI Scan / code scanning**: escaneo de seguridad gratis para repos (hay que activarlo desde Settings → Code security).
- **Bots de precios para Telegram** (Pricegram, telebot, etc.): proyectos chicos, desactualizados o de Amazon/Flipkart; no hay un repo mantenido que combine ofertas + afiliado + alertas para ML. Nuestro `bot/alertas.py` ya cubre esa función.
- **Agentes 24 h generando contenido**: no encontré fuentes sólidas. Un agente que publique solo contenido sin revisión humana arriesga contenido de baja calidad (Google lo penaliza) y publicaciones públicas sin tu permiso; recomiendo agentes que AUDITEN y PROPONGAN, no que publiquen.

## 5. Plan para potenciar (ordenado por impacto)
1. Tráfico pago (Meta): destrabar la cuenta (revisar accountquality) → test ≤ $10.000 durante el Cyber.
2. Fuente de ofertas de comisión 15 % (hub de afiliados "Productos seleccionados para vos"): subir ganancia por clic.
3. Lote diario ~20 ofertas (hoy 291 vigentes; las 148 del 15/10 vencen el 23/10).
4. Guías y comparativas de ticket alto + indexación diaria (hoy 22 guías nuevas desde el 15/10).
5. Cyber Monday 2-4/11 y Black Friday 27/11: posts y precios testigo (31/10 y 1/11).
6. Automatizar auditorías: tarea programada semanal (enlaces, schema, seguridad) que reporte por Telegram; activar GitHub code scanning.
7. Medir cada domingo con la misma planilla (clics `web`, ganancia/clic, mix).
