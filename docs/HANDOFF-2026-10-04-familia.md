# HANDOFF 2026-10-04 — Familia Ofertín / videos virales (chat de videos)

Este es el traspaso del chat de **videos y personajes**. El chat principal (web, bot, métricas) tiene el suyo: `docs/HANDOFF-2026-10-03.md` (sección "Cierre del chat 04/10"). Pueden correr en paralelo: commitear solo archivos propios con rutas explícitas y `git pull --rebase --autostash` antes de push.

## Objetivo
Que la Familia Ofertín (Don Ofertín + familia) sea viral en Argentina con humor argentino y que eso lleve a likes, compartidos, comentarios, clics al link de la bio y compras de afiliado en Mercado Libre. Imágenes y videos 9:16 con **Gemini Pro (prueba)** manejado con Claude in Chrome (corre en **Brave**).

## Reglas de Raifel para este frente
- Una carpeta por video y adentro escena-1, escena-2…; si se pueden unir, unirlas (ffmpeg); si no, dejarlas para que Raifel las una.
- Revisar cada imagen o video antes de mostrarlo: manos de más, ojos, logos de marcas (Apple, Google, Nike, camiseta de Brasil), precios en USD, menores o banderas, personajes que cambian de cara o aparecen duplicados, textos basura ("image 1.png").
- Mostrar todo para auditar. **No publicar nada sin su OK**: Raifel sube reels y carruseles a mano desde el celular.
- Las descargas las dispara Claude con la extensión y Raifel toca "Guardar".
- No preguntar "¿sigo?", recomendar siempre una opción, tests/lint/build antes de push, no tocar JARVIS.
- **Pagar Google AI Pro antes del 7/10** (si no, se corta Gemini Pro).
- El receptor HTTP local para guardar archivos fue rechazado por el clasificador de permisos: no intentarlo de otra forma.

## Canon
- Personajes, edades, muletillas y guiones: `docs/videos-virales/REVISION GUIONISTA.md` (canon). También `BIBLIA DE ESCENARIOS Y PERSONAJES.md`, `PLAN DE VIDEOS.md` y `PUBLICAR - TEXTOS PARA AUDITAR.md` (captions), en `docs/videos-virales/` con copia en `VIDEOS VIRALES/_documentos/`.
- Familia: Don Ofertín (el cazador), Doña Rosa ("¿Y cuánto salió?"), Tincho (el impulsivo), Marce (la ordenada), Gustavo (el cuñado, "Tengo un contacto"), Benja (20 años, "Abuelo… hay cupón"), Doña Chola (la consuegra), Juli (POV) y el perro **Changuito** (detector de inflados; antes se llamaba "Precio"). El villano sigue siendo **"Precio Inflado"**.
- Web: `/familia` (frontend/app/familia/page.tsx), con cada personaje llevando a su sección; imágenes en `frontend/public/personaje/familia/*.webp` (changuito.webp, gustavo.webp…).

## Estado de las carpetas (`C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR\VIDEOS VIRALES\`)
| Carpeta | Estado |
|---|---|
| 01 - Cuanto salio | **LISTO PARA SUBIR**: `01 - Cuanto salio - CON CIERRE.mp4` (33 s: gancho + cierre con TV LG QNED 75" $ 2.399.999, mínimo histórico al 04/10). Sin cierre: `- FINAL.mp4` (30 s). Si se sube otro día, regenerar el cierre para que tenga el precio del día. |
| 02 - Abuelos reaccionan al Cyber | Borrador con inconsistencias (Don Ofertín falta, Juli aparece en cuadro, dos abuelos, logo de Apple). **Rehacer de cero**. |
| 03 - Rutina 5 AM | Pendiente: Gemini dio límite diario. Chat "El misterioso paquete de Ofertín". |
| 04 - Tu hermano cuando ve oferta | Pendiente: chat de Videos nuevo con la hoja de Tincho. |
| 05 - Tengo un contacto | Hay cuadros iniciales; faltan los clips (hojas de Gustavo, Ofertín y Changuito). |
| 06 - Presentacion familia | Póster (13.jpg, 36.jpg). |
| 07 - La consuegra | Hay cuadros iniciales. Clips: Raifel arrastra las hojas de Chola y Rosa a un chat de Videos nuevo (Portrait 9:16) y se pega el Guion 7. |
| 08 - Cada familia tiene su especialista | Cuadros de apertura y final. |
| 09 - Arco Cyber TV de 98 | 5 cuadros. Regenerar los que tienen logos. |
| 10 - Abuelo hay cupon (Benja) | Cuadro 1 + hoja de Benja 20. |
| carrusel-final-8 | **LISTO PARA SUBIR**: 1–8.jpg (1080x1350) + vista-previa.jpg. La 4 es Gustavo con el borde emparejado y la 8 dice "CHANGUITO · El detector de inflados". Falta la 9 (familia solo adultos). |
| meme-tipos-compradores | 6 placas de meme (anterior). |
| carrusel-final, carrusel-gemini-originales | Versiones viejas o crudas. |
| _documentos | Copias de los .md de canon + armar_carrusel.py (arma las placas con PIL). |
| _referencias personajes | Hojas de personaje para adjuntar en Gemini. |
| _descartes y pruebas | Descartes y hojas de control. |

Cada carpeta tiene un `LEEME.txt` con qué archivo va y de qué chat de Gemini sale. Los crudos que bajó Raifel están en `C:\Users\pc\Desktop\DON OFERTÍN\` (zips, `descargas-gemini/`, `carrusel/`).

## Herramientas
- `bot/tools/cierre_reel.py` (+ `bot/tests/test_cierre_reel.py`): a un reel de IA 720x1280 le pone un **gancho arriba** todo el video y un **cierre de 3 s** con la foto del producto real, precio, % OFF, "Link en la bio 👆", cazadordeofertas.com.ar y Don Ofertín. Sin producto, elige sola la mejor oferta de hogar/electro de ticket alto del día (`frontend/data/productos_rentables.json`, prioriza mínimos históricos).
  - `python bot/tools/cierre_reel.py ENTRADA.mp4 SALIDA.mp4 --gancho "texto" [--deal-id MLA… | --titulo --precio --imagen [--antes]] [--buscar palabras] [--sin-ding]`
  - Conviene correrlo después de `git pull` para que los precios sean los del día.
- ffmpeg 8.1.1 (WinGet Gyan.FFmpeg, no está en el PATH: `~/AppData/Local/Microsoft/WinGet/Packages/*FFmpeg*/*/bin`). `delogo` para tapar globitos o logos, `tile` para hojas de control y ffprobe para las duraciones.

## Cómo manejar Gemini (aprendido a los golpes)
- Si la pestaña está en segundo plano, las capturas y los timers se congelan: inspeccionar con `javascript_tool`.
- Los menús de Gemini solo abren despachando `pointerdown/mousedown/pointerup/mouseup/click`.
- Texto: `document.execCommand('insertText')` en `.ql-editor` y clic en `button[aria-label="Send message"]`.
- **Subir archivos a un chat nuevo NO funciona** (el input acepta el archivo pero Gemini lo ignora). Para videos con personajes, seguir en chats que ya tienen las hojas o pedirle a Raifel que arrastre las hojas.
- "Create video" dentro de un chat de imágenes abre un chat nuevo.
- Gemini **extiende** videos: el último archivo del chat ya trae todas las escenas unidas (10 s → 20 s → 30 s).
- Bajar videos: desde gemini.google.com, `fetch(src,{credentials:'include'})` de cada `<video>`, armar un ZIP "store" en JS (CRC32) y clic en `<a download>`; Raifel toca Guardar. Si da 0 videos, la página no terminó de cargar: esperar y repetir.
- Imágenes (lh3) no se pueden bajar cruzado; Raifel las baja desde la Biblioteca de Gemini.
- Hay límite diario de videos: si aparece, anotarlo y seguir con imágenes o cuadros iniciales.
- Chats clave: "El misterioso paquete de Ofertín" (videos 01 y 03), "Abuelos reaccionan al Cyber" (02, descartado) y "Creación de Hoja de Personaje 3D" (imágenes, cuadros y hojas).

## Pendientes, en orden
1. **Raifel** sube desde el celu `01 - Cuanto salio - CON CIERRE.mp4` y `carrusel-final-8/1..8.jpg` con los captions de `PUBLICAR - TEXTOS PARA AUDITAR.md`. Después medir alcance, guardados, compartidos y clics a la bio (Vercel Analytics: evento `clic_ml`; Clarity: `click_ml`).
2. **Raifel**: pagar Google AI Pro antes del 7/10.
3. Cuando Gemini libere videos: Rutina 5 AM (chat del paquete), rehacer Abuelos de cero, La consuegra (con las hojas que arrastre Raifel) y Tincho (04).
4. Imágenes: tarjeta 9 del carrusel (familia solo adultos) y regenerar los cuadros de la TV de 98 sin logos.
5. Pasar cada video terminado por `cierre_reel.py` con su gancho.
6. Lo que dejaron los agentes que se cortaron (no terminaron, no hay archivos): **pack de prompts canon** para Gemini (`VIDEOS VIRALES/_documentos/PROMPTS CANON GEMINI.md`, un prompt fijo por personaje para que no cambien de cara) y **2 carruseles-meme nuevos** (`VIDEOS VIRALES/meme-*/`). Rehacerlos si hay tiempo.

## Notas técnicas
- `git stash@{0}` (autostash) guarda una versión local vieja de `bot/state/precio_testigo_2026.json`: no es de este chat. Se dejó a propósito; no borrarlo sin mirarlo.
- Vercel Pro: Analytics + Speed Insights activos; `frontend/app/clics-ml.tsx` manda `clic_ml` (página y destino) por cada clic a ML.
- La vista previa local del sitio (launch "web-dev", puerto 3101) existe, pero el navegador no puede abrir localhost: verificar con `npm run build` y en producción.
