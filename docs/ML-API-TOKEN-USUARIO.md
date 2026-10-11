# Token de usuario de Mercado Libre (plan B de la API)

Para qué sirve: hoy el bot pide a ML un token de la **app** (`client_credentials`)
y `/highlights/...` e `/items?ids=` devuelven `403 PA_UNAUTHORIZED_RESULT_FROM_POLICIES`.
Con un token de **usuario** (la cuenta dueña de la app, vía `refresh_token`) esas
llamadas suelen tener más permisos. Si ML sigue dando 403 con este token, el
problema es la política de la app y hay que pedírselo a ML (no se arregla acá).

Cómo funciona en el bot (`bot/ml_api.py`):

- Si existe el secret `ML_REFRESH_TOKEN` (además de `ML_CLIENT_ID`/`ML_CLIENT_SECRET`),
  pide el token con `grant_type=refresh_token`.
- Si no existe, o ML lo rechaza, **cae a `client_credentials`** como antes.
- Nunca imprime tokens ni secrets; solo avisa en el log qué pasó.

## Pasos (una sola vez, ~5 minutos)

1. **App de ML** (developers.mercadolibre.com.ar → Mis aplicaciones → la app
   `7890698556822222` → Editar):
   - *Redirect URI*: una URL https tuya, por ejemplo `https://cazadordeofertas.com.ar/`
     (la página puede dar 404, no importa: solo necesitamos leer el `code` de la barra).
   - Permisos: lectura + **"Mantener sesión" (`offline_access`)**. Sin esto ML no
     devuelve `refresh_token`.
   - Si la app tiene PKCE activado, correr el script con `--pkce`.
2. **En tu PC** (con Python, sin instalar nada):
   ```
   python bot/tools/ml_obtener_token.py --redirect-uri https://cazadordeofertas.com.ar/
   ```
   Te pide `ML_CLIENT_ID` y `ML_CLIENT_SECRET` (el secret no se ve al tipear;
   también los toma de las variables de entorno si las tenés). Te da una URL:
   abrila, entrá con la cuenta dueña de la app, aceptá y copiá el `code` (o toda
   la URL a la que te redirige) y pegalo. El `code` vence en minutos y sirve una vez.
3. El script guarda el `refresh_token` en `~/.cazador-ofertas/ml_refresh_token.txt`
   (fuera del repo; se niega a guardar dentro del repo) y **no lo muestra**.
4. **Cargalo como secret** sin copiarlo a mano y borrá el archivo:
   ```
   gh secret set ML_REFRESH_TOKEN --repo Raifelmolero/cazador-de-ofertas-ar < ~/.cazador-ofertas/ml_refresh_token.txt
   rm ~/.cazador-ofertas/ml_refresh_token.txt
   ```
5. **Probar**: Actions → *Cazador Deals Bot* → Run workflow. En el log buscá
   `[info] ml_api:`: "ML rotó el refresh_token..." y "N ofertas vía API oficial"
   es la señal verde. `[warn] ml_api: ... HTTP 403` = ML sigue sin dar permiso.

## Rotación del refresh_token (importante)

Los refresh tokens de ML **rotan**: cada vez que se usa, ML devuelve uno nuevo y el
anterior deja de servir (además vence a los ~6 meses sin uso; verificar contra la
doc vigente de ML, no pude consultarla desde el sandbox). Por eso:

- `ml_api.py` escribe el token nuevo en el archivo `ML_REFRESH_TOKEN_OUT`
  (sin imprimirlo).
- `deals_bot.yml` define esa ruta y, en el paso **"Guardar refresh token rotado de
  ML"** (`if: always()`, nunca frena al bot), lo guarda como secret
  `ML_REFRESH_TOKEN` con `gh secret set` usando `GH_PAT`, el mismo patrón que
  `ig_token_refresh.yml`. Si no puede, avisa por Telegram.
- Solo el job `post-deals` recibe `ML_REFRESH_TOKEN` (y corre serializado por el
  grupo de concurrencia `deals-bot`), así dos procesos no queman el mismo token.

Qué hacer si se rompe la cadena (`invalid_grant`, aviso de Telegram o `[warn]
ml_api: refresh_token rechazado`): repetir los pasos 2 a 4. Mientras tanto el bot
sigue andando con `client_credentials`.

## Cuidados

- **No usar ese refresh_token en otro lado** (ni correr el bot en tu PC con
  `ML_REFRESH_TOKEN` seteado): cada uso lo quema y el de GitHub quedaría inválido.
  Si lo corrés local, dejá `ML_REFRESH_TOKEN` sin definir.
- `GH_PAT` tiene que poder escribir secrets (ya lo usa `ig_token_refresh.yml`).
- Los tests (`python -m unittest discover -s bot/tests`) no tocan la red ni secrets reales.
