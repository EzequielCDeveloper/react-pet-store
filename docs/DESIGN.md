# Diseño y Arquitectura Global

## Stack Tecnológico
* **React** & **React Router**: Construcción de la interfaz y enrutamiento.
* **createContext**: Manejo del estado global de la aplicación.
* **Axios**: Obtención de datos (data fetching).
* **Tailwind CSS**: Estilos y diseño de la interfaz.

## Estructura de Carpetas
El proyecto utiliza una estructura organizada para la escalabilidad:
* `src/features/*`: Estructura basada en funcionalidades (Feature-based).
* `src/components/*`: Componentes genéricos y compartidos de la UI.
* `src/api/*`: Capa de red para la comunicación con el backend.

## Gestión de Datos (Data Management)
* Es de carácter estricto el consumo de la API existente definida en `src/api/*` utilizando Axios.
* Las respuestas de la API deben mapearse al Context cuando se requiera compartir el estado global de la aplicación con otras partes del sistema.
