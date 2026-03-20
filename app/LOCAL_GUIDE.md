# Guía de Ejecución Local para "Fiesta Party"

Esta guía te permite ejecutar la aplicación en tu ordenador sin necesidad de subirla a Netlify. 
**Nota:** Necesitas conexión a internet para que funcione el chat y las sugerencias (Supabase).

## Requisitos previos
1.  Tener **Node.js** instalado (Recomendado v18 o superior).
2.  Tener el código del proyecto en tu carpeta.

## Pasos para ejecutar

1.  **Abrir la terminal** en la carpeta del proyecto:
    `c:\Users\Rafa\Desktop\App Final\app`

2.  **Instalar dependencias** (solo la primera vez):
    ```bash
    npm install
    ```

3.  **Iniciar el servidor local**:
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador**:
    -   Aparecerá un link como `http://localhost:5173/`.
    -   Hacer Ctl+Click o copiarlo en tu navegador Chrome/Edge.

## Cómo jugar con amigos (Red Local / LAN)
Si quieres que tus amigos se unan desde sus móviles estando en la misma casa (mismo WiFi):

1.  Averigua tu **IP Local**:
    -   Abre una terminal nueva y escribe `ipconfig`.
    -   Busca la línea "Dirección IPv4" (ejemplo: `192.168.1.45`).

2.  Ejecuta el servidor con la opción `--host`:
    ```bash
    npm run dev -- --host
    ```

3.  **Compartir el Link**:
    -   Tus amigos deben escribir en sus móviles: `http://TU_IP:5173` (ejemplo: `http://192.168.1.45:5173`).
    
¡Y listo! Ya pueden jugar todos juntos conectados a tu ordenador.
