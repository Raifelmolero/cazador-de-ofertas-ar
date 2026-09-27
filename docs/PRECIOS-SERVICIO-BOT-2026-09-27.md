# Precios del servicio "bot de ofertas a medida" (Trello #10)

Fecha de consulta de todas las fuentes: **27/09/2026**. Tipo de cambio usado: **USD 1 = ARS 1.540** (BNA venta, 25/09/2026, [El Cronista](https://www.cronista.com/finanzas-mercados/dolar-oficial-asi-abre-la-cotizacion-este-viernes-25-de-septiembre/)). Lo marcado **[estimación]** es criterio propio, no dato publicado.

## 1. Comparables

| Tipo | Producto / fuente | Precio publicado | Qué da |
|---|---|---|---|
| SaaS afiliados (BR) | [Pai das Ofertas](https://paidasofertas.com/) | R$ 35,90 / 55,90 / 75,90 por mes (gratis limitado) | Autoposteo en WhatsApp/Telegram, incluye Mercado Livre; autoservicio |
| SaaS afiliados (BR) | [AfiliTools / trocalink](https://trocalink.com.br/) (título indexado en buscador; sitio no cargó) | R$ 99/mes | WhatsApp, Telegram, Instagram, links, reportes |
| SaaS afiliados (BR) | [DivulgaNinja](https://www.divulganinja.com.br/blog/automacao-para-afiliados-no-instagram/) (según buscador) | desde R$ 49,90/mes | Automatización para afiliados |
| Bot Amazon self-hosted | [doublegram](https://github.com/doublegram/telegram-amazon-affiliate-bot) (según buscador; repo hoy da 404) | €79 licencia de por vida | Bot Telegram Amazon con IA; te lo instalás vos |
| Bot gratis (ES) | [FRIKIdelBOT](https://www.frikidelto.com/frikidelbot/) | Gratis, "no está a la venta" | Ofertas, historial, alertas |
| Freelance global | [Fiverr gig "automatic amazon deals on telegram"](https://www.fiverr.com/themarkz679/realize-you-a-telegram-bot-for-auto-post-amazon-deals) (título indexado) | desde USD 20 | Bot básico Amazon→Telegram |
| Freelance global | [Fiverr – hire Telegram bot](https://www.fiverr.com/hire/telegram-bot) (según buscador; página da 403) | promedio USD 134,54 por proyecto | Desarrollo de bot a medida |
| SaaS redes | [Metricool](https://metricool.com/pricing/) | Starter USD 20/mes (5 marcas); Advanced USD 53/mes | Programación, sin generar contenido |
| SaaS redes | [Later](https://later.com/pricing/) | USD 25 / 50 / 110 por mes (mensual) | Programación, 30–180 posts/perfil |
| CM Argentina | [tarifario.info](https://tarifario.info/redes-sociales/) (sep-2026, "orientativo") | 1 red: USD 80–150 jr / 180–350 sr; 3+ redes: USD 250–450 jr / 500–900 sr; agencia 3+ redes USD 900–2.200 | Gestión humana de redes |
| CM Argentina | [Aprender21](https://www.aprender21.com.ar/blog/tarifario-community-manager-argentina) | ARS 180–280 mil (jr, 2 redes) / 300–520 mil (semi-sr, 3 redes) | Gestión humana |

**Lectura:** hay un piso muy bajo (SaaS brasileños ≈ USD 7–18/mes; bots de Fiverr USD 20–135) para "solo postear en Telegram". Lo que Raifel tiene distinto —historial de precios que filtra descuentos inflados, IG+Threads+reels automáticos, web propia con SEO, reporte— compite más con un CM junior (USD 80–450/mes) que con un SaaS. **[estimación]** Conviene posicionarse como "servicio llave en mano" entre ambos.

## 2. Costos reales y términos (lo que cambia el modelo)

- **Vercel Hobby NO sirve para esto.** Sus [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) dicen que Hobby es "non-commercial personal use only" y dan como ejemplo de uso comercial "Affiliate linking is the primary purpose of the site" y "Receiving payment to create, update, or host the site". Esto aplica **también a cazadordeofertas.com.ar hoy** si está en Hobby. Pro: USD 20/mes por developer seat con USD 20 de crédito ([pricing](https://vercel.com/pricing)).
- **GitHub Actions:** repos públicos sin costo de minutos; privados en Free 2.000 min/mes, después USD 0,006/min Linux ([docs](https://docs.github.com/en/billing/concepts/product-billing/github-actions)). Pero los [términos adicionales](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features) prohíben ofrecer Actions como servicio con fines comerciales y, en runners hosteados, "actividad no relacionada con producir, testear, desplegar o publicar el software del repo" y cargas tipo "serverless". Un bot que corre por cron para clientes pagos es zona gris. **[estimación]** Recomendación: cada cliente con **su propia cuenta** (GitHub, hosting, bot de Telegram, app de Meta, tag de afiliado) o migrar a un VPS/cron pago; Raifel cobra instalación y mantenimiento, no "hosting".
- **Meta (IG/Threads):** para operar cuentas profesionales que la app no posee hace falta **Advanced Access = App Review + Business Verification** ([Meta](https://developers.facebook.com/docs/instagram-platform/overview/)). Si el cliente usa la app de Raifel, hay que pasar esa revisión; si no, cada cliente arma la suya (más fricción de instalación).
- Otros costos variables por cliente **[estimación]**: API de Claude Haiku para textos (centavos/mes), dominio (lo paga el cliente), horas de soporte (el costo real mayor: ~2–4 h/mes por cliente).

## 3. Paquetes propuestos [estimación]

Setup: 50% al firmar, 50% al publicar el primer post. Abono mensual con **mínimo 3 meses**, ajuste trimestral (ARS por tipo de cambio o IPC). Infra y cuentas a nombre del cliente.

| | **Básico – Canal Telegram** | **Pro – Multired** | **Full – Tienda/Creador** |
|---|---|---|---|
| Instalación única | **USD 150 / ARS 230.000** | **USD 400 / ARS 615.000** | **USD 800 / ARS 1.230.000** |
| Abono mensual | **USD 30 / ARS 46.000** | **USD 90 / ARS 139.000** | **USD 180 / ARS 277.000** |
| Incluye | Bot ML→Telegram con su tag de afiliado, hasta 3 tandas/día, 1 nicho, filtro de descuento real con historial, monitoreo y arreglos por cambios de ML | Todo Básico + IG post y story + Threads con plantilla de su marca, reporte semanal, hasta 3 nichos | Todo Pro + reels/YouTube Shorts, web catálogo con buscador en su dominio, alertas de precio por Telegram privado, 1 cambio de funcionalidad chico/mes |
| NO incluye | IG/Threads, web, diseño a medida, contenido manual, publicidad paga | Reels, web, gestión de comentarios/DMs, garantía de ventas | Community management humano, pauta, trámites de Meta (App Review) si fallan por la cuenta del cliente, costos de infra (Vercel Pro, dominio) |
| Soporte | Por mail/Telegram, 72 h hábiles | 48 h hábiles | 24 h hábiles |

**Razonamiento:** Básico queda arriba de los SaaS brasileños (USD 7–18) porque incluye instalación hecha y filtro anti-descuento-inflado, pero abajo de un CM de 1 red (USD 80+). Pro se ubica en el rango CM junior 2–3 redes (USD 150–450) sin requerir trabajo humano diario. Full queda por debajo de un CM senior/agencia pero suma web+SEO, que ningún comparable incluye. Con 5 clientes Pro: ~USD 450/mes de abono.

## 4. Riesgos que deben ir en el contrato

1. **Cambios de ML** (API, programa de afiliados, bloqueos de scraping) pueden cortar el servicio: cláusula de "mejores esfuerzos", sin reintegro del setup. Revisar también si los términos del programa de afiliados de ML permiten operar para terceros.
2. **Baneos/límites de Meta** (App Review rechazada, cuenta restringida por automatización): el cliente es titular de su cuenta; no se garantiza publicación en IG.
3. **Sin garantía de comisiones ni de ventas.**
4. Dependencia de proveedores gratuitos (ver punto 2): cualquier corte de GitHub/Vercel por términos.

## 5. Cómo facturar como monotributista

- Instalación y abono son **locación/prestación de servicios** (no venta de cosas muebles): se factura con **Factura C**, actividad de servicios informáticos/desarrollo o similar. Clientes del exterior (LatAm): **Factura E** de exportación de servicios.
- Escala ARCA vigente desde 01/08/2026 ([ARCA – categorías](https://www.arca.gob.ar/monotributo/categorias.asp)): p. ej. Cat. A tope anual $12.009.410 (cuota servicios $49.527); C $24.670.494 ($66.020); F $45.151.659 ($150.784); H $81.924.660 ($522.707).
- **[estimación]** Ojo: los ingresos del servicio **se suman** a las comisiones de afiliado de ML para el tope anual. 5 clientes Pro durante 12 meses ≈ USD 7.400 ≈ ARS 11,4 M, solo con esto ya está cerca del tope de la Cat. A.
- **Recomendación: consultarlo con un contador** antes de la primera factura: código de actividad correcto, alta en Ingresos Brutos (convenio multilateral si hay clientes en otras provincias), exportación de servicios y recategorización.
