# ✅ Arreglo rápido: Netlify + Supabase (para que la app funcione YA)

## 1) Arreglar el 404 de Netlify (página no encontrada)
Esto pasa cuando entras a una ruta (por ejemplo /profiles) y Netlify no sabe que es una SPA.

✅ Ya va incluido el archivo **public/_redirects**.
- Con esto, cuando Netlify compile, se copiará a **dist/_redirects**.
- Resultado: cualquier ruta carga **index.html** y no verás el 404.

## 2) Arreglar el online (Supabase): tablas que faltan / columnas que faltan
Tus errores (404/400/409) son porque **no existen** las tablas (players, games, player_rankings, teams, tictactoe_state) o faltan columnas (por ejemplo `game_id`).

### Paso A — Ejecutar el SQL correcto
1. Abre **Supabase** → tu proyecto → **SQL Editor** → **New query**.
2. Abre el archivo **SUPABASE_SCHEMA.sql** (en la raíz de este ZIP).
3. Copia TODO → pega → **Run**.

✅ Este SQL es *idempotente*: puedes ejecutarlo varias veces y no rompe nada.

### Paso B — Verifica que tienes activada la Data API
Supabase → **Settings** → **API** → "Enable Data API" → ON.

### Paso C — Variables en Netlify (NO hace falta pagar)
OJO: lo que pide pago es **Shared environment variables** (a nivel TEAM). **A nivel PROYECTO es GRATIS**.

Netlify → tu **Site** → **Site configuration** → **Environment variables** → Add variable:

- `VITE_SUPABASE_URL` = `https://XXXX.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = tu **anon public key** (o publishable key)

✅ Importante:
- NO pongas `/rest/v1`.
- NO pongas comillas.
- No marques “Contains secret values” (no hace falta).

### Paso D — Redeploy (para que coja las variables)
Como tu sitio es **manual** (no está conectado a Git), para que Netlify use las variables necesitas **forzar un nuevo build**.

Tienes 2 opciones:
1) En **Deploys**, vuelve a subir el **ZIP del proyecto** (este mismo) en el recuadro de upload.
2) O entra a **Deploy settings** y busca una opción tipo **Clear cache and deploy site** (si te aparece).

## 3) Si sigue fallando, el 99% es una de estas 3 cosas
- No ejecutaste el **SUPABASE_SCHEMA.sql** completo.
- La `VITE_SUPABASE_URL` está mal (debe acabar en `.supabase.co`).
- No has hecho **redeploy** después de guardar variables.

---

💡 Pista rápida para comprobarlo:
- Abre la app y mira consola → NO debería salir `Could not find table public.players`.
- En Supabase → Table Editor → deberías ver: `games`, `players`, `player_rankings`, `teams`, `tictactoe_state`.
