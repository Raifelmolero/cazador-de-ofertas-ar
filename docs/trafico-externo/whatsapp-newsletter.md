# Canal de WhatsApp + newsletter (Trello #08)

Estado: plan. No se tocó código del sitio ni se creó ninguna cuenta.
Objetivo: tener audiencia propia que vuelva al sitio sin depender de Google, Instagram ni de un algoritmo. El sitio se presenta siempre como comparador de ofertas con links de afiliado.

## 1. Decisión de herramientas

| Canal | Herramienta | Costo | Por qué |
|---|---|---|---|
| WhatsApp | Canal de WhatsApp (función "Canales"), no grupo | Gratis | Difusión de uno a muchos, los seguidores no ven el teléfono de nadie, no hay límite práctico de seguidores. |
| Newsletter | MailerLite (recomendado) | Plan gratuito con tope de suscriptores y envíos mensuales; verificar los topes vigentes al crear la cuenta | Formulario embebible, editor simple, automatización de bienvenida incluida. |
| Alternativa newsletter | Beehiiv o Substack | Gratis para empezar | Si Raifel prefiere cero configuración; menos control de formulario y marca. |

Recomendación: WhatsApp Canal + MailerLite. Telegram ya existe (t.me/cazadordeofertasar) y sigue siendo el canal de alertas rápidas; WhatsApp y mail son para el resumen que se lee tranquilo.

Cosas a verificar antes de arrancar (no las pude confirmar desde acá):
- Que los términos del programa de afiliados de Mercado Libre Argentina permitan compartir links por mensajería y mail (una nota de prensa indica que mensajería está permitida; el documento oficial es el que manda).
- Los topes del plan gratuito de MailerLite al momento de crear la cuenta.
- Que el nombre del canal no se confunda con otro canal de WhatsApp de nombre casi igual que ya existe: usar "Cazador de Ofertas AR" y poner el dominio en la descripción.

## 2. Qué se manda y cuándo

Principio: pocas veces, siempre útil, honesto. Nada de "imperdible" ni urgencia inventada. Si no hay nada bueno, no se manda.

- Newsletter: 1 por semana, jueves a la mañana. 5 a 7 minutos de lectura como máximo.
- Canal de WhatsApp: 3 mensajes por semana (lunes, miércoles, viernes) más uno extra solo en eventos (Hot Sale, Cyber Monday, Black Friday).
- Un solo link principal por mensaje, el resto adentro del sitio.
- Siempre una línea fija: "Links de afiliado de Mercado Libre: si comprás por acá nos llega una comisión, el precio no cambia."

## 3. Cuatro plantillas

Todas con campos entre llaves que Raifel completa mirando el sitio ese día. No inventar precios ni porcentajes: copiar lo que muestra la página.

### Plantilla 1. Resumen semanal (newsletter, jueves)
Asunto: `{N} ofertas que valen la pena esta semana y una que no`
```
Hola, soy Raifel, de Cazador de Ofertas AR.

Esta semana revisé las ofertas de Mercado Libre y esto es lo que pasó el filtro:

1. {producto}: {por qué vale: mínimo histórico / cuotas / envío}. Ver: {link}
2. {producto}: {motivo}. Ver: {link}
3. {producto}: {motivo}. Ver: {link}

La que NO te recomiendo: {producto}. El descuento se calcula contra un precio anterior que {motivo}. Cómo lo chequeo: {link a guía}

Para leer con calma: {guía o comparativa de la semana} -> {link}

Links de afiliado de Mercado Libre: si comprás por acá nos llega una comisión, el precio no cambia.
Si no querés recibir más, hay un link para darte de baja abajo de todo.
```

### Plantilla 2. Oferta verificada (WhatsApp, lunes o viernes)
```
Mirando precios de hoy en Mercado Libre: {producto}.
Lo que chequeamos: {historial: estuvo igual o más barato en {fecha} / es su mínimo registrado}.
Cuotas/envío: {dato visible en la publicación}.
Ver publicación: {link}
(Link de afiliado. Cazador de Ofertas AR, cazadordeofertas.com.ar)
```

### Plantilla 3. Guía o calculadora (WhatsApp, miércoles)
```
Pregunta que nos hacen mucho: "{pregunta}".
La respuesta corta: {2 líneas}.
Armamos una guía/calculadora gratis, sin registro: {link a /guias/... o /calculadora-...}
```
Ejemplos reales de páginas del sitio: frigorías, consumo eléctrico, cómo saber si un descuento es real, qué es el mínimo histórico.

### Plantilla 4. Alerta de evento (WhatsApp, solo Hot Sale / Cyber / Black Friday)
```
{Evento} arranca {fecha}. Para no caer en descuentos inflados:
1. Anotá hoy el precio de lo que querés.
2. Mirá el historial antes de comprar.
3. Comparalo con cuotas y envío.
Armamos una página del evento con las ofertas que revisamos: {link /cyber-monday o /black-friday}
```

## 4. Cómo capturar suscriptores desde el sitio (sin tocar código ahora)

Esto es una especificación para cuando Raifel decida avanzar; no se implementó nada.

**Componente `SuscripcionCTA`** (nuevo, simple, similar en espíritu a `AlertaCTA` y `ExtensionCTA`, que ya existen en `frontend/components`):
- Texto: "Una vez por semana, las ofertas de Mercado Libre que pasaron el filtro. Sin spam. Links de afiliado, lo aclaramos en cada mail."
- Un campo de email y un botón. El botón envía a la URL del formulario alojado de MailerLite (acción HTTP POST del formulario embebible o redirección a la página de alta). No requiere backend propio.
- Debajo del botón, enlace a /privacidad y la aclaración de afiliados.
- Segundo botón: "Seguir por WhatsApp" con el link del canal, y "Telegram" con t.me/cazadordeofertasar.
- Sin pop-ups. Una sola aparición por página, al final del contenido útil.

**Dónde ponerlo** (por orden de impacto esperado):
1. Al final de las guías (`/guias/[slug]`) y comparativas (`/mejores/[slug]`).
2. Debajo de las calculadoras (frigorías, consumo, cuotas, envío gratis).
3. Páginas de evento (Cyber, Black Friday) donde ya hay intención de compra.
4. Footer del sitio, versión corta.

**Requisitos legales y de confianza**: aviso de privacidad actualizado (qué dato se guarda y dónde), baja con un clic en cada mail, y no cargar listas ajenas. Revisar `/privacidad` antes de lanzar.

## 5. Plan de lanzamiento

1. Crear cuenta de MailerLite y el canal de WhatsApp (15 a 30 min).
2. Configurar el mail de bienvenida automático con 3 enlaces: guía de descuentos reales, calculadora de frigorías, comparativas.
3. Sumar los links a los canales existentes (Telegram, bio de Instagram) y a los posts de menciones externas, sin spamear.
4. Recién ahí encargar el componente al sitio.
5. Mantener 8 semanas antes de evaluar.

## 6. Métricas

| Métrica | Meta orientativa a 8 semanas | Dónde se mide |
|---|---|---|
| Suscriptores newsletter | Lo que alcance para validar; fijar la meta al ver el primer mes | MailerLite |
| Tasa de apertura | Medir; objetivo mantener por encima de lo normal del rubro | MailerLite |
| Clics por envío | Medir tendencia semanal | MailerLite |
| Seguidores del canal de WhatsApp | Crecimiento semanal | WhatsApp |
| Visitas al sitio desde canales propios | Subir mes a mes | Clarity / panel por etiqueta |
| Clics a Mercado Libre y ventas atribuidas a mail/WhatsApp | La métrica que importa | Panel de afiliados, con etiqueta propia por canal |
| Bajas y reportes de spam | Mantener bajas bajas; ante reportes, frenar y revisar | MailerLite, WhatsApp |

Importante: etiquetar los links de cada canal con una etiqueta distinta en el panel de afiliados (por ejemplo `wa` y `mail`) para saber cuál convierte. No se fijan metas numéricas absolutas porque no hay línea base propia todavía: se miden las primeras 4 semanas y después se ponen.

## 7. Qué no hacer
- No mandar todos los días: quema la lista y hace que silencien el canal.
- No prometer "descuentos de X%" ni "últimas unidades" sin verlo en la publicación.
- No comprar ni importar listas.
- No mezclar con propaganda de terceros.
