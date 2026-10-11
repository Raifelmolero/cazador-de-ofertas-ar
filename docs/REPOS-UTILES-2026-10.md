# Repos open source utiles para Cazador de Ofertas AR (10/10/2026)

Licencia, estrellas y ultimo push verificados con `gh api` el 10/10/2026. Los repos marcados "inspeccionado" estan clonados con `--depth 1` en `D:\ext\<nombre>` solo para leer codigo (no se ejecuto nada).

Regla para instalar sin tocar C: (pegar antes de instalar cualquier cosa):

```powershell
$env:TEMP='D:\tmp'; $env:TMP='D:\tmp'
New-Item -ItemType Directory -Force D:\tmp,D:\cache\pip,D:\cache\npm,D:\cache\uv,D:\cache\hf | Out-Null
$env:PIP_CACHE_DIR='D:\cache\pip'; $env:npm_config_cache='D:\cache\npm'; $env:UV_CACHE_DIR='D:\cache\uv'; $env:HF_HOME='D:\cache\hf'
```

## TOP 3 recomendado (orden de instalacion)

1. **lychee** - chequeo de links rotos del sitio. Un binario suelto, riesgo minimo; evita perder clics por links muertos.
2. **faster-whisper** - subtitulos automaticos para reels/shorts (retencion en videos sin sonido). CPU, todo en D:.
3. **unlighthouse** - Lighthouse sobre todo el sitio; complementa sitepreflight con puntajes de rendimiento/SEO por pagina.

Experimento opcional: MoneyPrinterTurbo (ver advertencias).

## Fichas

### 1. lychee - verificador de links
- URL: https://github.com/lycheeverse/lychee
- Licencia Apache-2.0 / MIT. ~4.0k estrellas. Ultimo push 05/10/2026. Inspeccionado (v0.24.2).
- Instalar: bajar `lychee-x86_64-windows.exe` (zip de Releases) a `D:\ext\lychee\`. Uso: `D:\ext\lychee\lychee.exe --max-concurrency 4 --exclude mercadolibre.com.ar https://cazadordeofertas.com.ar/sitemap.xml`. Tambien hay GitHub Action oficial `lycheeverse/lychee-action` para correrlo semanal.
- En D: si. Riesgo bajo (verificar sha256 del release).
- Resuelve: paginas con links rotos/redirects y links externos muertos en guias. Excluir ML del chequeo (responde 403/429 a clientes automaticos; no evadir).

### 2. faster-whisper - transcripcion y subtitulos
- URL: https://github.com/SYSTRAN/faster-whisper
- MIT. ~25.8k. Push 10/10/2026.
- Instalar: `python -m venv D:\ext\fw-venv; D:\ext\fw-venv\Scripts\pip install faster-whisper` (con las variables de arriba; el modelo `small` ~460 MB va a HF_HOME en D:).
- En D: si. Riesgo bajo (PyPI conocido, modelo de Hugging Face).
- Resuelve: subtitulos en espanol para los reels de Familia Ofertin/ofertas (hoy sin subtitulos) y texto para descripciones de Shorts.

### 3. unlighthouse - Lighthouse a todo el sitio
- URL: https://github.com/harlan-zw/unlighthouse
- MIT. ~4.9k. Push 10/10/2026. Inspeccionado (sin preinstall/postinstall).
- Instalar/usar: `npx unlighthouse --site https://cazadordeofertas.com.ar --urls-limit 60` (con npm cache en D:; necesita Chrome/Edge). Fijar version: `npx unlighthouse@<version>`.
- En D: si con cache redirigido. Riesgo bajo-medio (npx ejecuta paquete npm).
- Resuelve: ver que categorias/comparativas tienen peor LCP/INP/accesibilidad en mobile.

### 4. MoneyPrinterTurbo - video corto desde un tema (experimental)
- URL: https://github.com/harry0703/MoneyPrinterTurbo
- MIT. ~129k. Push 10/10/2026. Inspeccionado (repo 339 MB; deps: moviepy, streamlit, edge_tts, litellm, google-genai, faster-whisper, etc.).
- Instalar: `git clone --depth 1 https://github.com/harry0703/MoneyPrinterTurbo D:\ext\mpt-run; cd D:\ext\mpt-run; python -m venv .venv; .\.venv\Scripts\pip install -r requirements.txt`; copiar `config.example.toml` a `config.toml` (pide API keys propias de LLM y Pexels).
- En D: si. Riesgo medio: muchas dependencias, servicios de terceros por API, edge-tts usa un endpoint no oficial. Leer `webui.bat` antes de correrlo.
- Resuelve: volumen de shorts genericos de "tips de ahorro". No sirve para reels de producto con foto y precio real (para eso esta el pipeline propio).

### 5. auto-editor - recorte de silencios
- URL: https://github.com/WyattBlue/auto-editor. Unlicense. ~5.5k. Push 10/10/2026. Inspeccionado.
- Instalar: `D:\ext\fw-venv\Scripts\pip install auto-editor` (o binario de Releases en D:). Riesgo bajo.
- Resuelve: limpiar videos con voz/screen-record antes de subir a Shorts.

### 6. umami - analitica liviana con eventos
- URL: https://github.com/umami-software/umami. MIT. ~39.3k. Push 10/10/2026. Inspeccionado.
- No se instala en la PC: se despliega aparte (Vercel + Postgres gratuito o Umami Cloud). Solo para probar local: `git clone --depth 1 https://github.com/umami-software/umami D:\ext\umami; cd D:\ext\umami; npm install`.
- Riesgo medio (DB, script de terceros en el sitio). Resuelve: medir clics por CTA/posicion sin depender solo de Clarity. Prioridad media-baja.

### 7. GrowthBook - A/B testing
- URL: https://github.com/growthbook/growthbook. MIT salvo carpetas `enterprise` (licencia propia). ~8.5k. Push 10/10/2026.
- Usar GrowthBook Cloud gratis + SDK: `npm i @growthbook/growthbook-react` en el sitio. Self-host (Docker + Mongo) no recomendado en esta PC.
- Con ~400 clics/semana el trafico es poco para significancia; dejar para despues de mas trafico.

### 8. changedetection.io - monitoreo de cambios de pagina
- URL: https://github.com/dgtlmoon/changedetection.io. Apache-2.0. ~34.9k. Push 09/10/2026.
- Instalar: `python -m venv D:\ext\cd-venv; D:\ext\cd-venv\Scripts\pip install changedetection.io; D:\ext\cd-venv\Scripts\changedetection.io -d D:\ext\cd-data -p 5000`.
- Resuelve: vigilar paginas de condiciones/comisiones de afiliados ML, bases de Cyber Monday/Hot Sale y competidores. NO usarlo para scrapear fichas de ML (bloquea; el camino correcto es la API oficial con app propia).

### 9. satori - imagenes desde JSX
- URL: https://github.com/vercel/satori. MPL-2.0. ~14k. Push 09/10/2026.
- `npm i satori @resvg/resvg-js` (o `next/og`). Resuelve: imagenes OG/pines/stories por producto en Vercel sin servicio externo.

### 10. apprise - notificaciones unificadas
- URL: https://github.com/caronc/apprise. BSD-2-Clause. ~17.6k. Push 05/10/2026.
- `pip install apprise` en venv en D:. Resuelve: alertas del bot (0 ofertas publicadas, fallas) a varios canales. Ganancia marginal: ya hay Telegram.

### 11. schema-dts - JSON-LD tipado
- URL: https://github.com/google/schema-dts. Apache-2.0. ~1.2k. Push 02/10/2026. `npm i -D schema-dts`. Evita errores de schema Product/FAQ/ItemList.

### 12. sitespeed.io - performance
- URL: https://github.com/sitespeedio/sitespeed.io. MIT. ~5.0k. Push 05/10/2026. `npm i -g sitespeed.io` (prefix en D:). Solapa con unlighthouse; elegir uno.

### 13. Revideo - video programatico en TypeScript
- URL: https://github.com/midrender/revideo. MIT. ~4.1k. Push 15/07/2026. `npm init @revideo@latest`. Alternativa MIT a Remotion para plantillas con foto/precio; curva tecnica alta.

### 14. Mixpost Lite - programador de redes (Laravel)
- URL: https://github.com/inovector/mixpost. MIT. ~3.8k. Push 16/03/2026 (7 meses sin actividad). Requiere PHP/MySQL/Redis. No recomendado: el bot ya publica solo.

## Descartes importantes

| Repo | Motivo |
|---|---|
| remotion-dev/remotion (~63k) | Licencia propia (NOASSERTION), gratis solo para equipos chicos; no es permisiva. Revideo es la alternativa MIT. |
| gitroomhq/postiz-app (~37k) | AGPL-3.0; self-host pesado con Docker. |
| knadh/listmonk, plausible/analytics | AGPL-3.0; requieren servidor y DB propios. |
| PostHog, Chatwoot, Mautic | Licencia mixta/open core, muy pesados para esta PC. |
| WhiskeySockets/Baileys (MIT), whatsapp-web.js | WhatsApp no oficial: riesgo de ban del numero y viola los terminos. Usar WhatsApp Cloud API oficial. |
| rhasspy/piper | Archivado; el sucesor piper1-gpl es GPL-3.0. |
| rany2/edge-tts | Licencia NOASSERTION (LGPL) y endpoint no oficial de Microsoft. |
| mercadolibre/python-sdk | Archivado desde 2021, sin licencia. Usar la API REST oficial. |
| ShortGPT (RayVentura) | MIT pero sin push desde 02/2025. |
| short-video-maker (gyoridavid) | MIT, ~1.4k, ultimo push 06/2025; usa Remotion y Docker. Inspeccionado, no vale el riesgo. |
| Scrapers/anti-bot (crawlee, firecrawl, proxies rotativos) | ML bloquea y evadirlo viola sus terminos. El camino es la API oficial con app propia (ML_CLIENT_ID/SECRET). |

## Notas de seguridad
- En MoneyPrinterTurbo, unlighthouse, umami, auto-editor y lychee no se hallaron scripts preinstall/postinstall ni descargas opacas tipo curl|sh; los eval/base64 de MoneyPrinterTurbo son scripts Lua de Redis y decodificacion de audio/imagen.
- No se ejecuto ningun instalador ni script de los repos clonados.
- Los comandos de instalacion son los habituales de cada proyecto; no se probaron en esta PC.
