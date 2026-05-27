// ============================================================
// TUTORIAL: Cómo construir un Breadcrumb en React
// ============================================================
//
// PASO 1: ¿Qué es un breadcrumb y por qué se usa?
//   - Accesibilidad: ayuda a usuarios con lectores de pantalla (aria-label)
//   - Orientación: muestra al usuario dónde está en la jerarquía del sitio
//   - Navegación: permite volver a niveles superiores sin usar el botón "atrás"
//   - SEO: los motores de búsqueda entienden la estructura del sitio
//
// PASO 2: Leer la URL actual con useLocation()
//   - useLocation() de react-router-dom devuelve { pathname, search, hash }
//   - pathname = "/browse" → segmentos = ["browse"]
//   - pathname = "/pets/123" → segmentos = ["pets", "123"]
//   - NO usamos searchParams aquí — eso es para los filtros, no para navegación
//
// PASO 3: Mapear segmentos a etiquetas humanas
//   - Creamos un objeto de mapeo: { "": "Home", "browse": "Browse", "pets": "Pets" }
//   - Segmentos sin mapeo → se muestran tal cual
//   - El primer segmento siempre es "Home" (ruta raíz)
//   - Cada segmento acumula la ruta: "" → "/browse" → "/pets/123"
//
// PASO 4: Renderizar la lista de crumbs
//   - <nav aria-label="Breadcrumb"> — necesario para accesibilidad
//   - <ol> — lista ordenada semánticamente correcta
//   - Cada <li> contiene:
//     - Si NO es el último: <Link to={path}> — navegable
//     - Si ES el último: <span> — página actual, no navegable
//   - Separador visual ">" entre items (pseudo-elemento CSS o componente)
//
// PASO 5: Estilizar con Tailwind
//   - Links: text-sm text-gray-500 hover:text-gray-700
//   - Current: text-sm font-medium text-gray-900
//   - Separadores: text-gray-400 mx-2
//   - Contenedor: flex items-center py-3 px-4
//
// PASO 6: Alcance y limitaciones de este breadcrumb
//   - Máximo 3 niveles de profundidad (suficiente para este proyecto)
//   - No depende de ningún contexto global (totalmente standalone)
//   - Se puede reutilizar en cualquier página importándolo
//   - NO maneja filtros — eso se hace con FilterChips (separación de concerns)
//   - Para breadcrumbs dinámicos (ej: nombre de mascota), usar extraCrumbs prop
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  readonly label: string;
  readonly path: string;
}

interface BreadcrumbProps {
  readonly extraCrumbs?: readonly Crumb[];
}

// PASO 2: labelMap traduce segmentos de URL a etiquetas legibles por humanos.
// Un segmento vacío ("") representa la raíz → "Home".
// Segmentos conocidos como "browse" o "pets" obtienen traducción directa.
// Cualquier segmento no mapeado se muestra tal cual (fallback).
const labelMap: Record<string, string> = {
  '': 'Home',
  browse: 'Browse',
  pets: 'Pets',
};

export default function Breadcrumb({ extraCrumbs = [] }: BreadcrumbProps) {
  // PASO 2: useLocation() devuelve un objeto con pathname, search y hash.
  // Solo necesitamos pathname para el breadcrumb — searchParams es
  // responsabilidad exclusiva de FilterChips (separación de concerns).
  const { pathname } = useLocation();

  // PASO 3: Dividimos la ruta en segmentos y filtramos cadenas vacías.
  // Ejemplo: "/browse" → ["", "browse"] → ["browse"]
  // Cada segmento se mapea a su etiqueta legible usando labelMap.
  // Calculamos la ruta acumulada para cada nivel del breadcrumb.
  const segments = pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] = segments.map((segment, index) => {
    const cumulativePath = '/' + segments.slice(0, index + 1).join('/');
    const label = labelMap[segment] ?? segment;
    return { label, path: cumulativePath };
  });

  // PASO 3: "Home" siempre es el primer crumb, incluso si la ruta actual es "/".
  // Si la ruta es "/", allCrumbs tendrá solo [{ label: "Home", path: "/" }].
  const allCrumbs: Crumb[] = [
    { label: 'Home', path: '/' },
    ...crumbs,
    ...extraCrumbs,
  ];

  return (
    // PASO 4: <nav aria-label="Breadcrumb"> es obligatorio para accesibilidad.
    // Los lectores de pantalla anuncian "Breadcrumb navigation" al entrar.
    <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-100">
      {/*
        PASO 4: <ol> es semánticamente correcto para una lista ordenada de
        elementos de navegación jerárquica. Cada <li> representa un nivel.
      */}
      <ol className="flex items-center py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-sm">
        {allCrumbs.map((crumb, index) => {
          const isLast = index === allCrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center">
              {/*
                PASO 4: El último crumb es la página actual → <span> no navegable.
                Los anteriores son <Link> → permiten navegación hacia atrás.
                Usar aria-current="page" en el último elemento mejora accesibilidad.
              */}
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-gray-900"
                >
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    to={crumb.path}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  {/*
                    PASO 5: aria-hidden="true" evita que los lectores de pantalla
                    lean el separador ">" en voz alta. Visualmente es un separador
                    claro, pero no aporta información semántica.
                  */}
                  <span aria-hidden="true" className="mx-2 text-gray-400">
                    <ChevronRight size={14} />
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
