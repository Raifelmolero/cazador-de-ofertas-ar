# Atribución de ventas por canal (#05)

## Tabla etiqueta (matt_word) → canal

Todos los links de afiliado llevan `matt_tool=37267219` (fijo) y `matt_word=<etiqueta>`,
que es lo que el panel de afiliados de ML separa como "etiqueta".

| Etiqueta | Canal | Dónde se define |
|---|---|---|
| `telegram` | Canal de Telegram | `bot/cazador_bot.py` (env `ML_WORD_TELEGRAM`) |
| `instagram` | Instagram (posts, stories, reels) | env `ML_WORD_IG` |
| `threads` | Threads | env `ML_WORD_THREADS` |
| `facebook` | Facebook | env `ML_WORD_FACEBOOK` |
| `whatsapp` | Kit de WhatsApp | env `ML_WORD_WHATSAPP` |
| `youtube` | YouTube Shorts | env `ML_WORD_YOUTUBE` |
| `web` | cazadordeofertas.com.ar (fichas, buscador, verificador) | env `ML_WORD_WEB`, `frontend/lib/afiliado.ts`, `frontend/components/Verificador.tsx` |
| `alertas` | Alertas de precio por Telegram privado | `bot/alertas.py` (`MATT_WORD`) |
| `herramientas`, `hogar`, `tecno`, `gastronomia`, `gamer`, `bebes`, `electro`, `vehiculos` | Páginas de nicho de la web | `frontend/lib/nichos.ts` |
| (ID de afiliado) | Link sin etiqueta específica (fallback de `affiliate_link`) | `bot/cazador_bot.py` |

Si un secret `ML_WORD_*` tiene otro valor, en el panel aparece ese valor y el script lo
muestra como "Otra (...)": agregarlo a `CANALES` en `bot/atribucion.py`.

## Formato del CSV

Soportado y garantizado: **CSV simple** de 4 columnas, una fila por etiqueta, todas del mismo período:

```
etiqueta,clics,pedidos,ganancia
telegram,100,10,150000
```

- Separador `,` o `;`. Montos como `150000`, `150.000` o `$ 150.000,50`.
- Encabezados alternativos aceptados: `ventas`/`unidades` (pedidos), `ganancia estimada`/`comisiones` (ganancia), `clicks`.
- Líneas que empiezan con `#` y filas "Total" se ignoran. Etiquetas repetidas se suman.
- El formato exacto del export del panel de ML **no está verificado**: si el export trae
  columnas con esos nombres, el script lo lee igual (ignora columnas extra). Si no,
  copiar los números a mano al CSV simple.

`ejemplo-atribucion.csv` es un **ejemplo con números inventados**, solo para ver el formato.

## Uso

```
python bot/atribucion.py mis-datos.csv -o reporte.md
```

Genera una tabla con ganancia por canal, % del total, $/clic y conversión, más una
recomendación: $/clic ≥1,2x el promedio → publicar más ahí; ≤0,5x → revisar;
menos de 20 clics → no concluyente.
