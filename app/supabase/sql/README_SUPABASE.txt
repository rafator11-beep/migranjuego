SUPABASE (3 pasos, sin lío)

1) En Supabase Dashboard → SQL Editor
   - Pega y ejecuta: supabase/sql/01_schema.sql
   - Luego pega y ejecuta: supabase/sql/02_rls_policies.sql

   (Opcional) Si quieres borrar todo y empezar de 0:
   - Ejecuta antes: supabase/sql/00_reset.sql

2) En Netlify → Site settings → Environment variables
   - VITE_SUPABASE_URL = https://TU-PROYECTO.supabase.co
   - VITE_SUPABASE_PUBLISHABLE_KEY = tu "anon public" key

3) Redeploy (si no ves botón de trigger):
   - En Deploys, arrastra la carpeta del proyecto (el ZIP descomprimido) en el recuadro "Drag and drop".
   - O haz un cambio mínimo (editar un texto) y vuelve a subir.

Si te sale 409/trigger exists → ejecuta 00_reset.sql y luego 01/02.
Si te sale 404 "Could not find table public.players" → no está corrido 01_schema.sql.
