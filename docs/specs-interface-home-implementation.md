# Implementación de Interfaz: Inicio (Home)

## 1. ¿Qué se hizo?

Se rediseñó por completo la página de inicio (`HomePage`) del proyecto react-pet-store. La interfaz anterior era un dashboard de datos (con filtros, grilla genérica de mascotas y métricas) que no cumplía con el propósito de una landing page de e-commerce. Se reemplazó por un diseño de página de aterrizaje con secciones propias de una tienda de mascotas en línea: banner hero, enlaces rápidos por categoría, mascotas destacadas y sección promocional. Además, se integró una barra de búsqueda en el header del layout global y se eliminaron los componentes obsoletos `PetFilters.tsx` y `PetGrid.tsx`.

## 2. ¿Por qué se hizo?

La `HomePage` original funcionaba como un panel de administración o dashboard de datos, mostrando una tabla/grilla de todas las mascotas con filtros. Esto no ofrecía una experiencia de bienvenida atractiva para un usuario que visita una tienda de mascotas. Se necesitaba una experiencia de landing page de e-commerce que:

- Cause una buena primera impresión visual
- Guíe al usuario hacia las secciones relevantes (categorías, productos destacados, promociones)
- Separe responsabilidades: el header maneja la búsqueda global, no la página de inicio
- Siga las especificaciones definidas en `docs/specs-interface-home.md`

## 3. ¿Para qué sirve?

La página de inicio rediseñada proporciona:

- **Primera impresión atractiva**: El `HeroBanner` con gradiente azul, copy persuasivo y CTA ("Shop Now") capta la atención del visitante.
- **Navegación por categorías**: `CategoryQuickLinks` ofrece acceso rápido a las categorías principales (Dogs, Cats, Birds, Fish, Small Pets) con iconos de Lucide.
- **Vitrina de productos**: `FeaturedPets` muestra hasta 8 mascotas "available" desde la API, con manejo completo de estados.
- **Sección promocional**: `PromoBanner` invita al usuario con una oferta especial (20% off) y un enlace a `/pets`.
- **Búsqueda global**: La barra de búsqueda integrada en el `Layout` permite buscar desde cualquier página, no solo desde el inicio.

## 4. ¿Dónde está implementado?

### Archivos principales

| Archivo | Rol |
|---------|-----|
| `src/features/home/HomePage.tsx` | Componente contenedor de la página de inicio. Orquesta las secciones y pasa datos mediante prop drilling. |
| `src/features/home/useHomeLogic.ts` | Custom hook que encapsula la lógica de datos: llama a la API, transforma la respuesta y expone estado reactivo. |
| `src/features/home/components/HeroBanner.tsx` | Banner hero con gradiente, título, subtítulo y botón CTA que hace scroll a FeaturedPets. |
| `src/features/home/components/CategoryQuickLinks.tsx` | Grid de categorías con iconos y enlaces (`/pets?category=...`). |
| `src/features/home/components/FeaturedPets.tsx` | Sección de mascotas destacadas con patrón de 4 estados (loading, error, vacío, datos). |
| `src/features/home/components/PromoBanner.tsx` | Banner promocional con fondo verde y enlace a `/pets`. |
| `src/components/Layout.tsx` | Layout global con header, barra de búsqueda, y footer compartido. |

### Archivos de pruebas

| Archivo | Rol |
|---------|-----|
| `src/features/home/components/HeroBanner.test.tsx` | Pruebas unitarias del HeroBanner. |
| `src/features/home/components/CategoryQuickLinks.test.tsx` | Pruebas unitarias de CategoryQuickLinks. |
| `src/features/home/components/FeaturedPets.test.tsx` | Pruebas unitarias de FeaturedPets (4 estados). |
| `src/features/home/components/PromoBanner.test.tsx` | Pruebas unitarias del PromoBanner. |

### Archivos eliminados

| Archivo | Motivo |
|---------|--------|
| `src/features/home/components/PetFilters.tsx` | Reemplazado por búsqueda global en el header y filtros delegados a otras páginas. |
| `src/features/home/components/PetGrid.tsx` | Reemplazado por `FeaturedPets` que usa `PetCard` del módulo `pets`. |

## 5. ¿Cómo funciona?

### Árbol de componentes

```
Layout (Header con SearchBar + Outlet + Footer)
└── HomePage
    ├── HeroBanner (estático, recibe targetRef para scroll)
    ├── CategoryQuickLinks (datos estáticos de categorías)
    ├── FeaturedPets (datos dinámicos, 4 estados)
    └── PromoBanner (estático)
```

### Flujo de datos (useHomeLogic)

```
useApi() → useQuery() → select transformer → prop drilling
```

1. **`useApi()`** obtiene el cliente tipado generado a partir del schema OpenAPI (`src/api/client.ts`).
2. **`useQuery`** (React Query / TanStack Query) ejecuta `api.GET("/pet/findByStatus", ...)` con status `available`.
3. **`select`** transforma la respuesta: filtra mascotas con ID válido, ordena por ID ascendente y toma las primeras 8 (`FEATURED_PETS_LIMIT`).
4. El hook retorna `{ featuredPets, isLoading, error, refetch, categories }`.
5. **Prop drilling**: `HomePage` pasa los datos a cada sección como props tipadas.

Parámetros de caché: `staleTime: 5min`, `gcTime: 10min`.

### Patrón de 4 estados en FeaturedPets

`FeaturedPets` usa `forwardRef` para recibir la ref de scroll y renderiza condicionalmente:

| Estado | Condición | UI |
|--------|-----------|-----|
| **Loading** | `isLoading === true` | 8 skeletons con `animate-pulse` (rectángulos grises simulando tarjetas) |
| **Error** | `error !== null` | Mensaje de error en caja roja con botón "Retry" que llama a `refetch()` |
| **Empty** | `!pets \|\| pets.length === 0` | Icono de carita triste y texto "No pets available at the moment" |
| **Data** | `pets.length > 0` | Grid responsive de `PetCard` (1-4 columnas según breakpoint) |

### Barra de búsqueda en el Layout

La barra de búsqueda se ubica en el **Header** del `Layout.tsx`, entre el Logo (izquierda) y las Right Actions (carrito + perfil). Es visible solo en `md:` (768px+) hacia arriba. El estado del input es local (`useState`), no persiste entre navegaciones. El placeholder es "Search pets...".

### Orden de secciones y comportamiento de scroll

1. **HeroBanner**: Primera sección visible. El botón CTA ("Shop Now") hace `scrollIntoView({ behavior: 'smooth' })` hacia la ref de FeaturedPets.
2. **CategoryQuickLinks**: Segunda sección. Fondo blanco, muestra 5 categorías con iconos circulares y enlaces.
3. **FeaturedPets**: Tercera sección. Fondo `gray-50`. Es el destino del scroll desde el CTA del Hero.
4. **PromoBanner**: Cuarta sección. Fondo `emerald-600`, invita a navegar todos los pets.

`HomePage` usa margen negativo (`-mx-4 sm:-mx-6 lg:-mx-8 -my-8`) para que las secciones ocupen el ancho completo, anulando el padding del `<main>` del Layout.

### Limpieza de archivos

- **`PetFilters.tsx`**: Eliminado. Los filtros de búsqueda se delegaron al header global del Layout y a futuras páginas de listado.
- **`PetGrid.tsx`**: Eliminado. Reemplazado por `FeaturedPets` que reutiliza `PetCard` del feature `pets` (`src/features/pets/components/PetCard.tsx`).
