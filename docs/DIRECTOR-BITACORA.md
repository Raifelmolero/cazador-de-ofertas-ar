
## 21/11 17:30 · Estratega
- **Dato:** Clarity 19-21/11: `/comparador/smart-tv` y `/comparador/notebooks` (6 sesiones c/u, top 6-7) con scroll promedio de **3,9 % y 6,4 %**, el más bajo del sitio: la gente no pasa del encabezado. Televisores +72 % y Computación +25 % en Tendencias 21/11. Además, los clics de «Respuesta rápida» se contaban como `grilla` (sin `data-seccion`).
- **Cambio:** en `app/comparador/[slug]/page.tsx` la caja «Respuesta rápida: hoy» (la más barata, la mejor por rubro, todas con link a ML) sube al encabezado, justo debajo del H1 y antes del texto de intro. Se marca `data-seccion="comparador_rapida"` para medirla. Aplica a los 3 comparadores.
- **Cómo medir:** clics-ml por sección `comparador_rapida` + clics a ML por sesión en `/comparador/*`, 7 días antes vs 7 días después del próximo deploy agrupado; Clarity quick backs en esas páginas.
