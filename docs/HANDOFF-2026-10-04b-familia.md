# HANDOFF 04/10/2026 (noche) — Videos / Familia Ofertín

Sigue a `HANDOFF-2026-10-04-familia.md`. Raíz de trabajo: `C:\Users\pc\Desktop\CAZADOR DE OFERTAS AR\VIDEOS VIRALES\`.

## Herramientas nuevas (usarlas siempre)
- **Skill `videos-familia-ofertin`** (`C:\Users\pc\.claude\skills\videos-familia-ofertin\SKILL.md`): plantilla de prompt con tiempos `[00:00-00:02]`, reglas de voz, encuadre, revisión. Cargarla antes de cualquier prompt de la familia.
- **`_documentos/escuchar.py`** (faster-whisper, modelo small, CPU): `python escuchar.py video.mp4` → transcripción con segundo de cada palabra. Así se detectan palabras repetidas y voces que no corresponden.
- **Adjuntar referencias a Gemini sin Raifel**: input file oculto `refs-claude` → `find` → `file_upload` → `ClipboardEvent('paste')` sobre `.ql-editor` (detalle en la skill).
- `_documentos/armar_consuegra.py`: arma la historieta de La consuegra (globos, título, cierre).
- `_documentos/PROMPTS CANON GEMINI.md`: bloques de personaje + secciones nuevas "Reglas de VOZ" y "Encuadre y ritmo".

## Aprendido hoy sobre Gemini/Veo (no repetir errores)
1. Voz fuera de cuadro → Gemini se la pega a otro personaje (Rosa habló con voz de Juli). **Un solo hablante por clip**, sin voces fuera de cuadro; la pregunta de Juli va como texto en la edición.
2. Otro video en el mismo chat → lo **pega** al anterior (20 s). **Un chat nuevo por escena**.
3. Si sobra tiempo, **repite la frase** (2 de 2). Marcar `[00:05-00:08] TODOS con la boca cerrada`. Si repite igual: cortar tras la 1.ª frase con ffmpeg y congelar 1,5 s en silencio.
4. **Animar un cuadro sacado de un video ("animá esta imagen") lo rechaza el filtro** ("parecen menores"), 2 veces, aun aclarando "jubilados". Para video: solo tarjetas del carrusel (`carrusel-final-8/1.jpg` Ofertín, `2.jpg` Rosa, `6.jpg` Chola) + prompt con tiempos.
5. Para IMÁGENES sí funciona adjuntar referencias (tarjetas o un cuadro anterior aprobado): así salió consistente La consuegra.
6. Gemini Pro: hoy a la noche ya NO estaba "al límite de capacidad"; cada video tarda ~2-3 min. Los resultados aparecen recargando el chat.
7. Las descargas las hace Raifel (caen en `_entrada`). Después Claude las mueve a la carpeta del video.

## Estado de cada pieza
| Pieza | Estado |
|---|---|
| **07 La consuegra** (carrusel historieta 4 placas) | LISTO, sin publicar. `07 - La consuegra/SUBIR - carrusel consuegra/01-04.jpg`. Cuadros 2 y 3 rehechos con el cuadro 1 de referencia (ropa y cuerpos iguales). Caption abajo. Recomendado subir martes/miércoles noche. |
| **02 Abuelos reaccionan al Cyber** | Escena 1 `escena-1-el-tele.mp4` LISTA (cortado el "auto" doble, verificado con escuchar.py). Escena 2 `escena-2-setenta-de-que.mp4` LISTA (7 s, cortada la repetición + congelado). **Escena 3 se estaba generando** en el chat de Gemini "Prompts para Video Animado" (`gemini.google.com/app/b04649b44b85dfb5`): Rosa "Juli, pasame la tarjeta del abuelo", Ofertín congelado con el puño. Falta: Raifel la baja → revisar con hoja de contacto + escuchar.py → recortar si repite → unir 1+2+3 con textos en pantalla ("Abu, ¿cuánto pensás que sale este tele?", "Y este dice 70% OFF", "¿Y esta freidora?" / "Freidora: ✅ CAZADA") → `bot-repo/bot/tools/cierre_reel.py` → mostrar a Raifel. Prompts en `02 - Abuelos…/PROMPTS escenas (una voz por clip).txt`. |
| Carrusel familia | PUBLICADO por Raifel (04/10). |
| Reel 01 "Cuánto salió" | Publicado (22 likes). |
| Memes grupo WhatsApp / cazado o inflado | Listos (`meme-grupo-familia/`, `meme-cazado-o-inflado/`). Grupo sugerido martes; inflado ~27/10. |
| Rutina 5 AM, Tincho 04, El vecino (Rubén), La consuegra en video | Pendientes. Hacerlos con la skill (un chat por escena, tarjetas, un hablante). |
| Cuadros inconsistentes viejos (05 Tengo un contacto, 09 TV de 98 con logos Google y camiseta Brasil, 04 c08, 07 c25, 08 c37) | Rehacer con referencias adjuntas. |
| Hojas de personaje | Solo `ruben.jpg` y `ruben-tarjeta.jpg` en `_referencias personajes/hojas/`; mientras tanto usar las tarjetas de `carrusel-final-8/`. |
| Encargado (personaje nuevo, sin copiar a Eliseo) | Más adelante. |

**Caption La consuegra:**
> Toda familia tiene una Chola 😏☕
> La misma cafetera… a la mitad. Antes de presumir, mirá el historial.
> ¿Sos ROSA o sos CHOLA? Comentalo 👇
> Ofertas verificadas en el link de la bio.

## Reglas de Raifel (vigentes)
Carpeta por video con escena-1, escena-2… · revisar TODO antes de mostrar (manos, ojos, logos, USD, nenes, caras, y ahora AUDIO con escuchar.py) · nada se publica sin su OK · Raifel baja de Gemini · otro chat trabaja en paralelo en el repo: commitear solo archivos propios con rutas explícitas, `git pull --rebase --autostash` antes de push, tests/build si se toca bot/frontend · no tocar JARVIS · no preguntar "¿sigo?", recomendar siempre · **recordar pagar Google AI Pro antes del 7/10**.
