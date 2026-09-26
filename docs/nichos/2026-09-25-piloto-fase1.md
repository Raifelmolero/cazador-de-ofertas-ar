# Piloto Fase 1 — mini-cazadores por nicho (2026-09-25)

## Recomendación

**Herramientas Eléctricas.** Es la única categoría de los 6 candidatos que junta
las tres cosas: comisión más alta del sitio (15%), catálogo real hoy (48 posts
de 1529 en `posts_log.jsonl`, ~3%), e infraestructura ya viva para no arrancar
de cero (`/categoria/herramientas-electricas`, `/mejores/mejores-taladros`,
guías de taladro y amoladora). Black Friday (noviembre) es temporada fuerte de
herramientas en Argentina — encaja perfecto como piloto antes de esa fecha.

Los otros 3 nichos "nuevos" (gamer, bebés/juguetería, gastronomía industrial)
no pasan el filtro de catálogo o de comisión (ver abajo). Hogar y Tecno ya
están totalmente cubiertos — no son piloto, son mantenimiento.

## Tabla top 5 (candidatos evaluados)

| Nicho | Comisión | Catálogo (post_log) | Cobertura actual | Temporada próxima | Puntaje |
|---|---|---|---|---|---|
| **Herramientas eléctricas** | 15% | 48/1529 (3.1%) | Parcial: 1 categoría + 2 guías (taladro, amoladora) | Black Friday (nov) — herramientas es rubro clásico de BF en AR | **Alto** |
| Hogar (aires/colchones/heladeras) | 15% / 7% | 276/1529 (18%) | **Completa**: 8+ páginas categoría/mejores | Verano (aires) desde oct/nov | Alto pero saturado — no es "piloto", ya está armado |
| Tecno (TV/monitores) | 7% | 94/1529 (6.1%) | **Completa**: categoria+mejores TV y monitores | Ninguna específica | Medio, ya cubierto |
| Gastronomía/Hotelería (equipo industrial) | 15% (estimado) | 7/1529 (0.5%) | Nula como página propia (se mezcla en cocinas-y-hornos) | Ninguna | Bajo — comisión ideal pero catálogo insuficiente para sostener una página |
| Gamer (mouse/teclado/placas) | ~2% (estimado, bucket sin señal) | 43/1529 (2.8%) | Nula | Ninguna | Bajo — catálogo ok pero comisión mala |
| Bebés y juguetería | Sin dato (bucket 2%, sin señal) | 2/1529 (0.1%) | Nula | Día del Niño ya pasó; Navidad en dic | Muy bajo — el scraper de ofertas de ML casi no trae bebés/juguetes |

*(Comisión de gastronomía y gamer marcadas "(estimado)": no hay ventas propias
que las confirmen en el panel de afiliados, son las notas ya existentes en
`cazador_bot.py`.)*

## Plan concreto — Herramientas Eléctricas

1. **`/mejores/mejores-amoladoras`** (falta, hay guía pero no comparativa) —
   keyword: "mejor amoladora 2026", "amoladora angular precio argentina".
2. **`/guias/que-soldadora-comprar`** — keyword: "qué soldadora comprar",
   "soldadora inverter vs transformador". Categoría vinculada:
   herramientas-electricas.
3. **`/guias/que-hidrolavadora-comprar`** — keyword: "hidrolavadora precio
   argentina", "qué hidrolavadora comprar para casa". Buen ticket, aparece
   en catálogo real.
4. **`/guias/herramientas-electricas-black-friday`** — keyword: "black
   friday herramientas argentina", "ofertas herramientas cyber monday". Fecha
   límite: publicar **antes del 10 de noviembre** (Cyber Monday AR suele ser
   fines de noviembre; hay que estar indexado con anticipación).
5. Etiqueta ML sugerida (`matt_word`): mantener `web` para todo lo que va al
   sitio (ya es la convención, no crear una etiqueta nueva por nicho salvo
   que el dueño quiera medir herramientas aparte en el panel de afiliados —
   si quiere eso, sugerido: `web_herramientas`).

## Qué NO hacer / riesgos

- No abrir sección de **bebés/juguetería**: el scraper de ofertas de ML casi
  no trae productos de ese rubro (2 en 1529 posts) — una página ahí quedaría
  vacía o con relleno forzado, mala señal para SEO.
- No abrir sección de **gastronomía/hotelería industrial** todavía: comisión
  buena pero catálogo insuficiente (7 posts) para sostener actualización
  diaria. Revisar de nuevo cuando `posts_log.jsonl` tenga más historia.
- No priorizar **gamer**: la comisión real de periféricos/placas de video es
  la más baja del sitio (~2%, bucket sin señal en `CATEGORY_COMMISSION_WEIGHT`)
  — mismo esfuerzo, mucha menos plata por venta.
- No duplicar páginas de Hogar/Tecno: ya están hechas, cualquier esfuerzo ahí
  es mantenimiento (revisar precios/imágenes), no nicho nuevo.
- No inventar comisiones: los números de gastronomía y gamer son estimados
  del propio código, no confirmados en el panel — si el dueño ve ventas
  reales de esos rubros, avisar para ajustar `CATEGORY_COMMISSION_WEIGHT`.
