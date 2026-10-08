# Traspaso 07/10/2026 — SEO vs andocomprando.com.ar (comparativas)

## Qué pasó
Raifel vio que en Google "mejores piletas de lona accesorios 2026" sale primero
https://andocomprando.com.ar/mejores-piletas-de-lona-argentina/ y nuestra página no.

## Diagnóstico (verificado con curl)
- Nuestra `/mejores/mejores-piletas` tenía `noindex, follow` y NO estaba en el sitemap:
  regla `MIN_PRODUCTOS_INDEXABLE = 3` en `frontend/lib/comparativas.ts` (si ese día hay <3
  productos, se esconde). Eran 8 páginas escondidas: piletas, parrillas, freezers,
  lavavajillas, licuadoras, perfumes, sillas gamer, afeitadoras.
- Competidor: sitio chico (~102 URLs, solo electro), página permanente de 9 modelos fijos,
  ~2.600 palabras, título «Mejores piletas de lona en Argentina 2026: desde $42.418», FAQ de
  3 preguntas, 1 bloque JSON-LD. Bloquea Ahrefs/Semrush, permite GPTBot/ClaudeBot.
  No hay señal de que nos copie (usa precio/ventas/envío gratis de ML, método propio).
- Nuestro dominio tiene ~2,5 meses: autoridad = semanas, no hay atajo.

## Hecho (todo en main, CI/lint/tipos/build OK)
- 8c317e4: `frontend/lib/comparativas-contenido.ts` (NUEVO) con `CONTENIDO[slug]` = secciones de
  guía + FAQ. `indexable()` devuelve true si el slug está en CONTENIDO. La página
  `app/mejores/[slug]/page.tsx` renderiza las secciones + FAQ visibles y las suma al FAQPage JSON-LD.
  Título de piletas: «Mejores piletas de lona y accesorios en Argentina 2026».
- 8e55e38 + c5a4bdd: título dinámico «…: desde $X» (mínimo de la tabla; SOLO con ≥3 productos,
  porque con 1 producto «desde» engaña); sitemap con `textoModificado` (fecha fija 2026-10-07)
  para guías/calculadoras/metodología/cupones/familia en vez de la fecha del scraper en todo;
  si la tabla tiene <3 productos se muestran hasta 10 modelos con historial.
- Contenido (guía + FAQ) ya cargado para 15 comparativas: piletas, parrillas, freezers,
  lavavajillas, licuadoras, perfumes, sillas-gamer, afeitadoras, ventiladores, muebles-de-jardin,
  bicicletas, aires-acondicionados, heladeras, colchones, freidoras-de-aire.

## Pendiente / siguiente
1. **Raifel**: Search Console → Inspección de URL → «Solicitar indexación» (se le acabó la cuota
   diaria el 07/10). Ya pidió: /mejores/mejores-piletas + las otras 7 escondidas. Faltan, en
   orden: Cyber Monday (/cyber-monday, /mejores/ofertas-cyber-monday y las 6 cyber-monday-*),
   aires, heladeras, colchones, ventiladores, muebles-de-jardin, bicicletas, regalos-de-navidad,
   /ofertas/ofertas-ticket-alto, /ofertas/minimos-historicos-hoy, /estudio/descuentos-inflados-mercado-libre.
2. **Yo**: mejorar texto propio en páginas de categoría (`/categoria/*`) y guías (`/guias/*`):
   mucha tabla y poco texto. Después sumar CONTENIDO a las ~25 comparativas restantes
   (notebooks, celulares, smart-tv, lavarropas, monitores, cafeteras, microondas, etc.).
3. Links internos con anchor «mejores piletas de lona» desde home/categorías/guías.
4. Menciones externas: `docs/MENCIONES-EXTERNAS-2026.md` (las publica Raifel a mano).
5. Medir en Search Console en 2-4 semanas: impresiones/posición de «mejores piletas de lona».
   Con nuestro dominio nuevo no esperar el #1 enseguida.

## Notas técnicas
- El texto de CONTENIDO lo redacté yo con criterios generales (sin precios ni modelos); que Raifel
  lo lea. No inventar datos. Texto nuevo: voseo, sin tecnicismos.
- Poner un slug en CONTENIDO lo vuelve siempre indexable aunque la tabla esté vacía; hacerlo solo
  con contenido real (si no, es página flaca).
- WebSearch del agente es US-only: no sirve para ver el ranking real en Argentina; usar la captura
  de Raifel o Search Console.

## Entorno
- GitHub: cuenta activa `Raifelmolero` (dueña del repo). Hay otra guardada, `pedidosorigencafe-cmd`
  (Amidata); si Amidata pide cambiarla: `gh auth switch`, y volver a Raifelmolero para Cazador.
- Repo: `bot-repo/`, rama main, deploy automático en Vercel (~2-4 min tras cada push).
