# Análisis de ventas día por día y proyección (21/10/2026, 23:00)

Fuente: panel de afiliados ML, día por día del 1/8 al 21/10 (fetch a /afiliados/dashboard por día: `generalKpis` + tabla por etiqueta `"earnings":{"item_list"`), Vercel Analytics por día (visitantes, evento clic_ml, referrers de Google) e inventario de ofertas (notas de memoria).

## Semanas (lunes a domingo, todas las etiquetas)

| Semana | Clics | web | extensión | otros | Pedidos | Ventas | Ganancia |
|---|---|---|---|---|---|---|---|
| 7-13/9 | 30 | 11 | 0 | 19 | 9 | $1,5M | $31k |
| 14-20/9 | 9 | 4 | 0 | 5 | 1 | $0,2M | $24k |
| 21-27/9 | 320 | 241 | 18 | 61 | 34 | $7,0M | $474k |
| **28/9-4/10** | **417** | **356** | 61 | 0 | **56** | **$16,4M** | **$1.070k** |
| 5-11/10 | 318 | 284 | 32 | 2 | 42 | $17,6M | $958k |
| 12-18/10 | 238 | 145 | 90 | 3 | 16 | $3,4M | $238k |
| 19-21/10 (3 días) | 56 | 51 | 4 | 1 | 4 | $1,7M | $104k |

- Mejores 7 días seguidos: **30/9 al 6/10 = $1.324k** (378 clics, 63 pedidos, $20M en ventas). Hoy el panel no muestra ninguna semana de $1,7M: el «Tus últimos 7 días» de la Central da números distintos de la suma diaria y la ganancia se ajusta después (cancelaciones/aprobación). Meta realista para «volver»: **$1,0-1,3M por semana**; $1,7M es una meta nueva, más alta que el récord.
- Los clics de `extension` (90 la semana del 12/10, con picos de 34 el 14/10) **no vendieron nada nunca**: son ruido, no cuentan para la ganancia.

## Días (desde el arranque del 21/9)

`clics totales · web · extensión · pedidos · ventas · ganancia` | Vercel: visitantes · clic_ml · visitas desde Google

```
21/9  49 · 41 · 0  · 14p · $1.967k · $141k
27/9  70 · 64 · 6  ·  8p · $3.788k · $259k
28/9  77 · 67 · 10 ·  5p · $3.638k · $206k
29/9  83 · 72 · 11 ·  4p · $2.076k · $148k
30/9  54 · 46 · 8  ·  9p · $4.802k · $298k
1/10  58 · 50 · 8  ·  8p ·   $635k ·  $48k   | V 46 vis
2/10  66 · 57 · 9  ·  6p ·   $963k ·  $81k   | V 19
3/10  43 · 36 · 7  · 16p ·   $655k ·  $61k   | V 18 · clic 3
4/10  36 · 28 · 8  ·  8p · $3.647k · $227k   | V 18 · clic 2
5/10  57 · 53 · 4  · 11p · $2.211k · $150k   | V 13 · clic 1
6/10  64 · 60 · 4  ·  5p · $7.084k · $458k   | V 19 · clic 5   ← día récord (venta grande)
7/10  63 · 54 · 9  ·  7p · $4.382k ·  $85k   | V 21 · clic 13
8/10  38 · 34 · 4  ·  7p · $1.073k ·  $82k   | V 28   ← el bot queda en 45 ofertas
9/10  39 · 36 · 3  ·  4p ·   $582k ·  $43k   | V 22
10/10 34 · 29 · 5  ·  6p · $2.015k · $124k   | V 13
11/10 23 · 18 · 3  ·  2p ·   $293k ·  $17k   | V 18
12/10 33 · 27 · 5  ·  4p ·   $837k ·  $81k   | V 25 · Google 8
13/10 33 · 27 · 6  ·  6p · $1.788k · $100k   | V 32 · Google 15
14/10 53 · 19 · 34 ·  0p ·      $0 ·    $0   | V 37 · Google 21
15/10 43 · 25 · 16 ·  3p ·   $412k ·  $40k   | V 56   ← 158 ofertas
16/10 32 · 13 · 19 ·  2p ·   $346k ·  $16k   | V 38
17/10 28 · 20 · 8  ·  0p ·      $0 ·    $0   | V 42
18/10 16 · 14 · 2  ·  1p ·    $43k ·    $1k  | V 38   ← 243 ofertas
19/10 16 · 15 · 0  ·  3p · $1.042k ·  $62k   | V 71 · Google 22  ← 362 ofertas
20/10 23 · 20 · 3  ·  0p ·      $0 ·    $0   | V 50 · clic 21  ← 1.753 ofertas
21/10 17 · sitio 6 + web 10 · 1 · 1p · $698k · $42k | V 54 · clic 11 ← 1.925 ofertas
```

## Por qué bajaron las ventas (en orden de peso)

1. **Se fueron los clics que no salían de la web.** A principios de octubre el panel contaba 30-70 clics `web` por día, pero Vercel veía solo 13-28 visitantes por día en el sitio y casi ningún clic_ml. Con 18 visitantes no se hacen 11 pedidos: la mayoría de los clics `web` venían de links nuestros usados **afuera** del sitio (compartidos, copiados del feed /ofertas-hoy.json o del HTML, grupos, IAs). Desde el 18/10 el panel y el clic_ml del sitio casi coinciden: **esos clics de afuera desaparecieron**. El experimento `sitio` del 21/10 lo confirma a medias: 6 clics hechos dentro del sitio (`sitio`) + 10 de afuera (`web`).
2. **Inventario.** El bot quedó bloqueado por ML (~6/10) y las ofertas bajaron de ~1.600 a 45 el 8/10; volvieron recién el 20/10 (1.753) y el 21/10 (1.925). Los clics de afuera empezaron a caer el 8/10 y se apagaron el 14-18/10, justo con el inventario vacío: quien republicaba nuestros links se quedó sin ofertas para compartir.
3. **Conversión más baja.** Pedidos por clic web: 15,7 % (28/9) → 14,8 % (5/10) → 11 % (12/10) → ~8 % (19-21/10). Con pocas ofertas quedaban las menos atractivas.
4. **La ganancia depende de ventas grandes.** 4 días (27/9, 30/9, 4/10, 6/10) hicieron $1,24M de los $2,8M de 30 días (44 %): notebooks, TV, aires. Con menos clics hay menos chances de esa venta grande, y una semana puede saltar o caer $400k por una sola compra.

Lo que **no** es causa: ventas no efectivas (2-4 por semana, normal), Telegram (no trae sesiones) ni la temporada (Día de la Madre 18/10 debería haber subido, no bajado).

Lo bueno: **el sitio solo crece.** Visitantes por semana: ~130 (5/10) → ~270 (12/10) → ~400 al ritmo de esta semana. Google: 1-5 por día a principios de octubre → 13-22 por día ahora. Hoy el sitio por sí mismo da 10-20 clics/día.

## Qué estamos haciendo

- Inventario lleno de nuevo (1.925) con carga diaria automática 11:13 y prioridad tecnología (ticket alto).
- Páginas de ticket alto para Google y las IAs: /tecno, comparadores de celulares (79) y notebooks (53), 21 duelos /vs/*, 8 /mejor/*-hasta-*, /cyber-monday/tecnologia, /precio-hoy/*.
- Search Console: 10 pedidos de indexación por día; IndexNow/Bing para ChatGPT.
- Etiqueta `sitio` (desde 21/10) para separar clics propios de los de afuera.
- Medición diaria en Trello #42.

## Proyección: cuándo volvemos

Cuentas: cada clic web dejó en promedio **~$3.200 de ganancia** en las semanas buenas (28/9-11/10) y ~$2.300 ahora. Para **$1,3M/semana** hacen falta ~400-550 clics/semana (**~60-80 por día**); para **$1,7M**, ~530-740 (**~75-105 por día**). Hoy: ~17 por día (~$250-300k/semana).

| Escenario | Supuesto | $1,0-1,3M/semana | $1,7M/semana |
|---|---|---|---|
| Rápido | Vuelven los clics de afuera con el inventario lleno (+30-40/día) y el sitio sigue creciendo | semana del 2/11 (Cyber Monday) | fines de noviembre (Black Friday 27/11) |
| Base | Solo el sitio, creciendo ~30 %/semana (Google + páginas nuevas indexadas) | semana del 23/11 | mediados de diciembre (Navidad) |
| Lento | El sitio crece ~15 %/semana | mediados de diciembre | enero |

Los eventos ayudan: Cyber Monday (2-4/11), Black Friday (27/11) y Navidad pueden dar semanas sueltas por encima de la tendencia.

**Señal para saber en cuál estamos (dom 26/10):** ≥ 30 clics/día y `web` (afuera) volviendo a superar a `sitio` → escenario rápido. Si `web` sigue en ~10/día → base: todo el peso en SEO y en sumar tráfico propio (redes que lleven a la web, anuncios cuando Meta se destrabe).

## Pregunta para Raifel

¿Vos u otra persona compartían links de la web (o del canal) en grupos o estados de WhatsApp, en otro canal, o en una lista de ofertas, entre el 21/9 y el 10/10? Esos 30-50 clics diarios de afuera explican más de la mitad de la caída; si fueron tuyos, se recuperan volviendo a compartir.
