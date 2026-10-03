# Don Ofertín — personaje de Cazador de Ofertas AR

> **VERSIÓN FINAL (01/10/2026): cazador explorador.** Casco de safari caqui con banda amarilla #FACC15, chaleco caqui de bolsillos, camisa amarilla, bermuda, botas, binoculares, lupa y **red de cazar mariposas** (sin armas, a propósito: políticas de redes y distancia de Elmer Gruñón). Las imágenes aprobadas están en `docs/personaje/` (maestra, expresiones, poses + poses-1-y-4 corregidas, escena-1..6, avatar, stickers). Los prompts de abajo son la versión inicial (jubilado con boina); para nuevas piezas adjuntar `maestra.webp` como referencia.
>
> Uso de escenas: 1 precio trucho · 2 oferta real · 3 mínimo histórico · 4 relámpago/se termina · 5 ticket alto · 6 consejo (pizarrón vacío para texto). Fondo negro, tercio superior libre para texto.

Jubilado argentino gruñón pero querible que no se come ningún verso de precios.
Se enoja con los descuentos inflados y se alegra con las ofertas reales.

## Cómo usarlo en ChatGPT (importante para que salga siempre igual)
1. Abrí un chat nuevo y pegá el **BLOQUE BASE** + el **PROMPT 1 (hoja maestra)**.
2. Cuando la hoja maestra te guste, **descargala**. En cada prompt siguiente (2 a 6), en el MISMO chat, adjuntá esa imagen y escribí: "Usá exactamente este personaje de la imagen adjunta" + el prompt.
3. Pedí todo **sin texto dentro de la imagen** (el texto lo ponemos nosotros en las plantillas; ChatGPT escribe mal).
4. Si una imagen sale con la cara distinta, pedí: "Regenerá manteniendo idéntica la cara, bigote, anteojos y ropa de la hoja maestra".
5. Exportá en PNG con fondo transparente las piezas 2, 3, 5 y 6.

---

## BLOQUE BASE (pegar siempre al principio)

```
Personaje: "Don Ofertín", mascota de una web argentina que verifica si las ofertas de Mercado Libre son reales.
Personalidad: jubilado argentino de unos 70 años, gruñón pero querible. Desconfiado de los precios inflados, sabio, de barrio, con humor. Nunca agresivo ni ofensivo.
Aspecto (mantener SIEMPRE idéntico):
- Cuerpo bajito y algo redondo, proporción cartoon de 3 cabezas de alto.
- Cabeza grande, nariz grande y redondeada, cejas blancas muy pobladas y expresivas.
- Bigote blanco grande y tupido tipo escoba; pelado arriba con pelo blanco a los costados.
- Anteojos redondos de marco negro fino, apoyados en la punta de la nariz.
- Boina negra (gorra vasca), ligeramente inclinada.
- Chaleco tejido amarillo (#FACC15) sobre camisa blanca arremangada; pantalón gris oscuro; zapatos marrones.
- Siempre tiene una lupa en el bolsillo del chaleco (es su accesorio característico para "chequear" precios).
Estilo: ilustración cartoon 2D plana, línea de contorno negra gruesa y uniforme, colores planos con una sola sombra suave, estilo sticker, fácil de leer en tamaño chico. Sin degradados complejos, sin texturas, sin realismo.
Paleta: amarillo #FACC15, negro #09090B, gris #3F3F46, blanco, acento rojo #F87171 (para "precio trucho") y acento verde #6EE7B7 (para "oferta real").
Reglas: sin texto, letras ni números dentro de la imagen. Sin logos de marcas reales. Personaje original, no parecido a ningún personaje existente.
```

---

## PROMPT 1 — Hoja maestra (model sheet)
```
Creá la hoja maestra del personaje (character model sheet) sobre fondo blanco liso:
- Turnaround de cuerpo entero: frente, tres cuartos, perfil y espalda, alineados en una fila y a la misma escala.
- Abajo: primer plano de la cabeza de frente, detalle de la lupa y de la boina.
- Una fila de muestras de color con la paleta indicada.
Formato horizontal 16:9, alta resolución, iluminación neutra, pose neutra de pie con expresión de leve desconfianza (una ceja levantada).
```

## PROMPT 2 — Hoja de expresiones (cara)
```
Usando exactamente el personaje de la imagen adjunta, creá una hoja de 12 expresiones faciales (solo cabeza y hombros), en grilla de 4x3, fondo transparente, mismo tamaño y encuadre en todas:
1. Neutral desconfiado (una ceja arriba)
2. Enojado (cejas fruncidas, bigote erizado, cachetes rojos)
3. Furioso echando humo por las orejas
4. Indignado con la boca abierta ("¡¿cómo que 50% OFF?!")
5. Sospechoso entrecerrando los ojos
6. Sorprendido para bien (ojos grandes, bigote levantado)
7. Contento con sonrisa grande bajo el bigote
8. Orgulloso guiñando un ojo
9. Pensativo rascándose el bigote
10. Riéndose a carcajadas
11. Triste/decepcionado (se agotó la oferta)
12. Enamorado de una oferta (ojos de corazón)
```

## PROMPT 3 — Hoja de poses y acciones (cuerpo entero)
```
Usando exactamente el personaje de la imagen adjunta, creá una hoja de 12 poses de cuerpo entero en grilla de 4x3, fondo transparente, misma escala:
1. Mirando por la lupa con cara de sospecha
2. Señalando hacia la derecha (para señalar un precio o producto)
3. Pulgar arriba aprobando
4. Mano en alto diciendo "¡alto!" (rechazando un precio trucho)
5. Brazos cruzados, gruñón
6. Sosteniendo un celular y mirándolo con desconfianza
7. Sosteniendo un cartel en blanco con las dos manos (para poner texto después)
8. Rompiendo una etiqueta de precio en dos
9. Festejando con los brazos arriba
10. Corriendo apurado (oferta que se termina)
11. Cargando una caja grande de envío, contento
12. Sentado en un sillón leyendo una lista de precios larga
```

## PROMPT 4 — Escenas para publicaciones (comerciales)
```
Usando exactamente el personaje de la imagen adjunta, creá 6 ilustraciones de escena, cada una por separado, formato vertical 4:5 (1080x1350), con espacio libre arriba para texto y fondo plano gris oscuro #09090B:
1. "Precio trucho": Don Ofertín indignado frente a una etiqueta de precio gigante tachada en rojo.
2. "Oferta real": Don Ofertín feliz con pulgar arriba al lado de una etiqueta gigante con check verde.
3. "Mínimo histórico": Don Ofertín señalando un gráfico de línea que baja hasta el punto más bajo, resaltado en verde.
4. "Se termina": Don Ofertín corriendo con un reloj de arena gigante detrás.
5. "Ticket alto": Don Ofertín sosteniendo una caja grande (electrodoméstico genérico sin marca) con cara de "esto sí vale la pena".
6. "Consejo del día": Don Ofertín de maestro con un puntero frente a un pizarrón vacío.
Sin texto en la imagen.
```

## PROMPT 5 — Avatar y stickers
```
Usando exactamente el personaje de la imagen adjunta:
A) Avatar de perfil: cabeza y hombros mirando por la lupa, centrado dentro de un círculo amarillo #FACC15, cuadrado 1:1, apto para foto de perfil.
B) Pack de 8 stickers (estilo sticker de WhatsApp, con borde blanco grueso alrededor, fondo transparente): enojado, pulgar arriba, lupa sospechosa, carcajada, ojos de corazón, echando humo, festejando, "¡alto!" con la mano.
```

## PROMPT 6 — Formatos de redes (opcional)
```
Usando exactamente el personaje de la imagen adjunta, creá:
- Una portada horizontal 3:1 (banner) con Don Ofertín a la izquierda mirando por la lupa y el resto del fondo amarillo #FACC15 libre para texto.
- Una figura de Don Ofertín asomándose desde el borde inferior de la imagen (solo cabeza y manos), fondo transparente, para poner encima de fotos de productos.
- 3 poses para la web: saludando (bienvenida), confundido rascándose la cabeza (página no encontrada), y durmiendo en un sillón (sin ofertas por ahora).
```

---

## Qué tenés que entregarme
Una carpeta con los PNG (ideal fondo transparente) separados por pieza:
- `maestra.png`, `expresiones.png`, `poses.png`
- `escena-1.png` … `escena-6.png`
- `avatar.png`, `stickers.png`
- (opcional) `banner.png`, `asomado.png`, `web-saludo.png`, `web-404.png`, `web-sin-ofertas.png`

Si vienen en grilla no pasa nada: las recorto yo y armo un PNG por expresión o pose.

## Dónde lo voy a usar
- Posts del bot (IG/Threads/Telegram/Pinterest): expresión según el tipo de oferta (precio trucho → enojado; mínimo histórico → contento; relámpago → corriendo).
- Web: verificador de descuentos, /descuentos-inflados, 404, estado vacío, bienvenida del buscador guiado.
- Avatar unificado en todas las redes; stickers para el canal de WhatsApp y Telegram.
- Medición: 2 semanas con personaje vs. antes, por etiqueta del panel de afiliados.

## Poses por tipo de oferta (02/10/2026)

En `bot/story.py` (`pose_personaje`), en orden de prioridad:
mínimo histórico → festejando · relámpago → corriendo · sello de temporada → enamorado ·
≥ $300k → atrapando · descuento ≥ 45% → lupa · resto → pulgar / binoculares (alterna por producto).
Lupa, enamorado y binoculares salen de `docs/personaje/stickers.webp` (`bot/tools/recortar_personaje.py`).

## Ideas pendientes para aprovechar ChatGPT (imágenes ilimitadas)

1. Avatar de IG simplificado (solo la cabeza, se lee mejor chico).
2. Escenas de temporada para banners web y destacadas: Halloween, Cyber Monday (03/11), Navidad, Reyes.
3. Una ilustración por guía de compra y por categoría (imagen OG + pines de Pinterest).
4. Stickers de WhatsApp/Telegram con la hoja `stickers.webp`.
5. Variantes probadas el 02/10 en ChatGPT: "Premium 3D", "Argentino con mate", "Logo/ícono", "Cazador Pro" (falta elegir).
6. Pose "enojado" de stickers.webp para posts de "descuento inflado / trucho" (la destacada Truchos).

## Escenas de temporada (02/10/2026)

`docs/personaje/escenas-temporada.png` (grilla original de ChatGPT) → recortes `escena-halloween/cyber-monday/reyes.webp`.
- Cyber Monday: en el banner de la web (`lib/temporada.ts`, campo `escena`) para Cyber Monday y Black Friday.
- Navidad: la de la grilla salió con los ojos raros; rehecha aparte en ChatGPT ("Navidad tropical con regalos aventureros"), falta bajarla → `escena-navidad`, sumarla al banner `navidad` y a la destacada Regalos después del 18/10.
- Halloween: para posts/destacada de IG hasta el 31/10 (la web no tiene temporada Halloween).
- Reyes: guardada para enero.
- `variantes-estilo` ("Explorador en cuatro estilos creíbles" en ChatGPT): falta bajarla y elegir.
