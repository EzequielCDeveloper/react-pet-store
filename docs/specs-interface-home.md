# Especificaciones de la Interfaz: Inicio (Home)

## Secciones
* **Header (Dinámico):** Incluye el carrito de compras, estado de la sesión y búsqueda.
* **Hero Banner (Estático):** Contiene el copy promocional y un CTA (Llamado a la acción).
* **Quick Categories (Estático):** Categorías rápidas para la navegación del usuario.
* **Featured Pets/Products (Dinámico):** Sección alimentada por fetch de Axios para mostrar productos y mascotas destacadas.
* **Promo Section (Estático):** Sección de promociones.
* **Footer (Estático):** Pie de página informativo.

## Componentización
* **Patrón Custom Hook:** Se utilizará un patrón donde el componente de UI se separa de la lógica. Todo manejo de lógica, Axios y Context deberá abstraerse en un custom hook (por ejemplo, `useHomeLogic.ts`).

## Estados y Animaciones
* **Carga:** Mostrar Skeleton loaders (usando `animate-pulse`) durante el fetch con Axios.
* **Error:** Implementar Error Boundary o manejadores de estado de error que incluyan un botón de "Reintentar" (Retry) en caso de fallo.
* **Transiciones:** Emplear transiciones suaves con Tailwind CSS (ej. `transition-transform hover:scale-105`) en tarjetas (cards) y botones.
