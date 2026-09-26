# Ficha para la Chrome Web Store (copiar y pegar)

Panel: https://chrome.google.com/webstore/devconsole → "Nuevo elemento" → subir
`cazador-extension-<versión>.zip` (se arma con `python extension/empaquetar.py`).

## Ficha de la tienda

- **Nombre** (sale del manifest): Cazador de Ofertas: ¿el descuento es real?
- **Resumen** (sale del manifest, 120 caracteres): En cada producto de Mercado Libre Argentina te muestra el historial de precios y si el descuento es real o está inflado.
- **Categoría:** Compras
- **Idioma:** Español (Latinoamérica)
- **Sitio web:** https://cazadordeofertas.com.ar
- **Correo de contacto:** elcazadordeofertas.ar@gmail.com

### Descripción

¿Ese "-40%" de Mercado Libre es de verdad? Abrí cualquier producto de mercadolibre.com.ar y la extensión te muestra, en un panel chico abajo a la derecha:

• INFLADO: ya lo vimos al menos 5% más barato antes, así que el descuento anunciado no es real.
• CAZADO: está en el precio más bajo que registramos.
• NORMAL: ni inflado ni en su mínimo.
• NUEVO: lo empezamos a seguir hace poco y todavía no alcanza para confirmar.

Además te dice desde cuándo seguimos el producto, cuál fue el precio más bajo y en qué fecha, y un link al historial completo cuando lo tenemos.

El historial sale de Cazador de Ofertas AR (cazadordeofertas.com.ar): revisamos las ofertas de Mercado Libre 3 veces por día desde julio de 2026 y registramos el precio de cada producto.

Privacidad: la extensión no recopila datos personales, no guarda tu navegación y no manda a ningún servidor qué productos mirás. Solo descarga nuestro archivo público de historial y lo compara en tu navegador.

Aviso de afiliado: el panel tiene un botón opcional "Comprar con Cazador". Si lo tocás, abre ese mismo producto con nuestro identificador de afiliado de Mercado Libre; si comprás, recibimos una comisión y a vos te cuesta lo mismo. La extensión nunca agrega ni cambia links de afiliado por su cuenta: solo cuando tocás ese botón.

## Pestaña "Prácticas de privacidad"

- **Propósito único:** Mostrar, en la página de un producto de Mercado Libre Argentina, el historial de precios de ese producto y si su descuento es real o está inflado.
- **Justificación del permiso de host `https://cazadordeofertas.com.ar/*`:** Descargar el archivo público de historial de precios (historial.json) con el que se calcula el veredicto.
- **Justificación del acceso a `https://*.mercadolibre.com.ar/*` (content script):** Leer la dirección y el precio del producto que la persona está mirando para mostrar el panel con el veredicto en esa misma página.
- **¿Usa código remoto?** No. Todo el código está en el paquete; solo se descargan datos (JSON).
- **Uso de datos:** no se recopila ninguna de las categorías (no marcar ninguna casilla).
- Marcar las 3 certificaciones: no se venden datos a terceros, no se usan para fines ajenos al propósito único, no se usan para crédito o préstamos.
- **Política de privacidad:** https://cazadordeofertas.com.ar/privacidad#extension

## Imágenes que hacen falta

- Ícono 128×128: `extension/icon128.png` (ya está).
- Al menos 1 captura de 1280×800: con la extensión instalada, abrir un producto de ML con el panel visible y sacar la captura (Win + Shift + S), recortada a 1280×800.
- Opcional: mosaico promocional de 440×280.

## Antes de publicar

- Crear la etiqueta `extension` en el panel de afiliados de ML y cambiar `matt_word` de `web` a `extension` en `content.js`, así la extensión se mide aparte.
- Subir la versión en `manifest.json` en cada actualización.
