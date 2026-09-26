# Extensión "Cazador de Ofertas" (Chrome / Edge)

En la página de un producto de Mercado Libre Argentina muestra un panel con el
historial de precios que registra el bot y el veredicto: **INFLADO / NORMAL /
CAZADO** (mismo criterio que el verificador de la home y el bot: inflado = lo
vimos ≥5% más barato antes).

## Regla que no se toca
La extensión **nunca** agrega, reemplaza ni "refresca" un link de afiliado por
su cuenta (eso es cookie-stuffing, el caso Honey, y es causal de baja en el
programa de afiliados de ML). La etiqueta solo se usa si la persona toca el
botón **"Comprar con Cazador"**, que dice claramente que es opcional.
No pide permisos de cookies, pestañas ni historial: solo lee
`cazadordeofertas.com.ar/historial.json`.

## Probarla
1. Chrome → `chrome://extensions` → activar *Modo de desarrollador*.
2. *Cargar descomprimida* → elegir esta carpeta `extension/`.
3. Abrir cualquier producto de mercadolibre.com.ar.

## Publicarla (lo hace Raifel)
Chrome Web Store pide una cuenta de desarrollador (pago único USD 5) a nombre
del dueño. Subir el zip de esta carpeta, categoría *Shopping*, y en la ficha
declarar el uso de links de afiliado solo a pedido del usuario. Pendiente:
crear la etiqueta `extension` en el panel de afiliados para medirla aparte
(hoy usa `web`).
