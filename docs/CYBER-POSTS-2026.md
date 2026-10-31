# Posts del Cyber Monday 2026 (lunes 2 al miércoles 4/11)

Textos listos para copiar. Reglas: en Instagram **nunca `@` para Telegram** (usar
`t.me/cazadordeofertasar`); el link clickeable de IG es **solo la bio**. Los
`[corchetes]` se completan con el producto real del día (precio testigo del bot).
Links siempre con utm: `cazadordeofertas.com.ar/cyber?utm_source=<canal>&utm_campaign=cyber`.

## Calendario
| Cuándo | Qué | Canales |
|---|---|---|
| Lun 26/10 | "Falta una semana" + guía para no caer en infladas | IG feed, Threads, Telegram |
| Vie 30/10 | Checklist: qué mirar antes del lunes | IG story (link a /cyber), Threads |
| Dom 1/11 noche | "Mañana arranca" + 3 productos con precio testigo | IG story, Telegram |
| Lun 2/11 | Día 1: ticket alto (TV, heladeras, notebooks, colchones; aires solo si hace calor) | todos |
| Mar 3/11 | Día 2: los que bajaron de verdad vs. los inflados | todos |
| Mié 4/11 | Último día: mínimos históricos | todos |

## 1. Lun 26/10 — "Falta una semana"
**IG caption**
> 💻 Falta 1 semana para el Cyber Monday (2 al 4/11).
> El truco: muchos "descuentos" parten de un precio inflado. Nosotros guardamos el historial de cada producto y marcamos los que están en su mínimo real.
> 👉 Link en la bio: todas las ofertas del Cyber, comparadas contra su precio más bajo registrado.
> Telegram: t.me/cazadordeofertasar
> #cybermonday #ofertas #mercadolibre #argentina

**Threads**
> Falta una semana para el Cyber Monday. Antes de comprar nada, anotá el precio de hoy de lo que querés: es la única forma de saber si el 40% OFF del lunes es real. Nosotros guardamos ese historial todos los días → cazadordeofertas.com.ar/cyber

## 2. Vie 30/10 — Checklist (story, 3 placas)
1. "Anotá el precio de HOY de lo que querés"
2. "Mirá cuotas sin interés y envío: pesan más que el %"
3. "Link en bio: Cyber con precio testigo"

## 3. Dom 1/11 — "Mañana arranca" (Telegram)
> 💻 Mañana arranca el Cyber Monday.
> Esto costaba hoy (nuestro precio testigo):
> • [Producto 1]: $[precio]
> • [Producto 2]: $[precio]
> • [Producto 3]: $[precio]
> Mañana comparamos contra estos números. 👉 cazadordeofertas.com.ar/cyber?utm_source=telegram&utm_campaign=cyber

## 4. Lun 2/11 — Día 1 (IG feed / Telegram)
> 🔥 ARRANCÓ EL CYBER. Ticket alto primero:
> [Producto] — antes (testigo) $[X] → ahora $[Y] ([Z]% menos de verdad)
> Ver todo comparado: link en la bio.
> t.me/cazadordeofertasar

**Threads**
> Cyber Monday, día 1. Ya filtramos lo inflado: estos son los que bajaron contra su precio de hace una semana → cazadordeofertas.com.ar/cyber

## 5. Mar 3/11 — Día 2: infladas vs. reales
> 🚨 Ojo: hoy hay productos con "50% OFF" que cuestan igual que la semana pasada. Los marcamos en rojo en la página. Los que sí bajaron de verdad, con el sello CAZADO. Link en la bio.

## 6. Mié 4/11 — Último día
> ⏰ Último día del Cyber. Estos están en su MÍNIMO HISTÓRICO registrado: [producto 1], [producto 2], [producto 3]. Después de hoy vuelven al precio normal. Link en la bio.

## 7. Jue 5/11 — Cierre
> Gracias por cazar con nosotros. El Black Friday es el 27/11: seguimos guardando precios desde hoy. Link en la bio.

## Notas
- Reels: reusar la escena `escena-cyber-monday.webp` de Don Ofertín.
- Publicación: el bot ya arma posts diarios con botón a /cyber desde el 19/10; estos son extras manuales vía `special_post.yml` o a mano.
- Reemplazar `[corchetes]` mirando `/cyber` el día anterior (precio testigo cargado hasta el 1/11).

## LISTOS PARA DISPARAR (preparados el 31/10, no publicados)
Archivos en `bot/posts_texto/` (Facebook página + Threads). Se disparan desde Actions → «Post de Texto»
(`post_texto.yml`) con `archivo` = el nombre y **primero `dry_run=true`**, después `false`. El script rechaza
cualquier texto con `[corchetes]` sin completar.

| Cuándo | Archivo | Qué dice |
|---|---|---|
| Dom 1/11 (tarde/noche) | `cyber-2026-11-01-testigo.json` | 3 productos con su precio testigo del 31/10 |
| Lun 2/11 | `cyber-2026-11-02-dia1.json` | arranca el Cyber, ticket alto primero |
| Mar 3/11 | `cyber-2026-11-03-dia2.json` | infladas vs. las que bajaron de verdad |
| Mié 4/11 | `cyber-2026-11-04-ultimo.json` | último día, precio más bajo registrado |

**Productos del post del 1/11 (precio al 31/10, de `frontend/data/productos_rentables.json`):**
Heladera LG Side by Side Inverter 638 L `MLA27060246` $3.673.469 · Smart TV Samsung Mini LED 85" `MLA79587448`
$3.394.411 · Notebook Lenovo LOQ i5 RTX 3050 `MLAU3348025201` $2.698.609.
**Antes de publicar el 1/11: chequear que esos precios sigan iguales en `/cyber`; si cambiaron, editar el JSON.**
Ojo: en el texto se dice «precio testigo» y NO «mínimo histórico», porque estos productos llevan solo 5-12 días en el
registro (el precio no varió desde que entraron).
Instagram y Telegram: usar los textos de arriba a mano (el publicador de texto es solo Facebook + Threads).
