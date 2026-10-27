# Halloween: Find the Treat

Juego web de una sola página inspirado en el clásico juego de los vasos. No requiere dependencias ni compilación.

## Cómo abrirlo

Cada página queda fija a una marca; no hay selector para cambiar a otra desde el juego. Las entradas incluidas son:

- NexusTours (naranja): `index.html?lang=es`
- Royalton (azul): `royalton.html?lang=es`
- PH (morado): `ph.html?lang=es`

Para inglés, cambia `lang=es` por `lang=en`. El control de idioma conserva la página de marca. Para usar subdominios como `juego-halloween-ph.thintodos.com`, configura cada subdominio para servir la página de su marca como página inicial. Publica junto con ella `styles.css` y `app.js`.

## Mecánica incluida

- Cinco vasos con posiciones, pelota y cuatro intercambios aleatorios por ronda.
- Observación inicial de la pelota, animación de mezcla y selección táctil o con mouse.
- Tres intentos como máximo; 15% (`TREAT15`) al acertar en el primero y 10% (`TREAT10`) al acertar en el segundo o tercero.
- Copia del código promocional y enlaces de reserva con el código aplicado para cada marca.
- Partida guardada en el navegador durante 24 horas para que recargar la página no restaure los intentos.
- Interfaz en español e inglés, diseño adaptable y soporte para movimiento reducido.

## Recursos de marca

El selector de marca es un menú propio integrado al encabezado y no usa el desplegable nativo del navegador. La composición se mantiene igual en las tres versiones; cambian los colores de los vasos, el panel y sus adornos. Los fondos usan gradientes CSS limpios en vez de las imágenes de referencia de baja resolución.

Los PNG y JPG originales de Google Drive aún no están en el proyecto. Esta versión usa gráficos vectoriales de referencia; cuando los archivos estén disponibles localmente, se pueden reemplazar desde `index.html`.
