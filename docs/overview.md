# Overview del proyecto (ES)

Documentacion rapida para nuevos desarrolladores. Resume objetivo, arquitectura, stack, estructura, flujo principal y puntos de extension.

## Objetivo

Aplicacion React que simula un e-commerce de tienda de mascotas. Consume la API publica de Swagger Petstore y completa la experiencia con datos deterministas (imagenes y precios) para mostrar catalogo, carrito y checkout.

## Arquitectura (alto nivel)

- SPA con React + React Router.
- Server state con React Query.
- Estado global por Context (carrito y toasts).
- Cliente API tipado via `openapi-fetch` y esquema generado (Swagger).

Ver diagrama: `APPLICATION_ARCHITECTURE.md`.

## Stack

- Frontend: React 19, TypeScript, Vite.
- Routing: `react-router-dom`.
- Data: `@tanstack/react-query`.
- Formularios: React Hook Form + Zod.
- Estilos: Tailwind CSS + `clsx` + `tailwind-merge`.
- API: `openapi-fetch` + tipos en `src/api/schema.d.ts`.
- Tests: Vitest/RTL/MSW y Playwright.

## Estructura de carpetas

```
src/
  api/              Cliente y esquema tipado
  components/       Layout y providers globales
  context/          Contexts (Cart, Toast)
  features/         Modulos por feature
    cart/           Carrito y checkout
    home/           Home y filtros
    pets/           Detalle y acciones de mascotas
    users/          Login y usuario
    error/          Paginas de error
  hooks/            Hooks compartidos (useCart, useAuth, useToast)
  lib/              Utilidades (query client, pet-utils)
  mocks/            MSW handlers para tests
  main.tsx          Entrada
  App.tsx           Rutas
playwright-tests/   E2E y API tests (POM, fixtures)
docs/assets/        Diagramas
```

## Flujo principal

1. `src/main.tsx` monta la app y envuelve en `AppProviders`.
2. `AppProviders` configura React Query y contexts globales.
3. `src/App.tsx` define rutas (home, detalle, login, cart, checkout).
4. `HomePage` consulta pets por status o tags, filtra por precio y search.
5. Carrito usa `CartContext` y persiste en `localStorage`.
6. Checkout crea ordenes con `/store/order` y limpia el carrito.

## Configuracion

- API base URL:
  - Env: `VITE_API_BASE_URL`
  - Default: `https://petstore.swagger.io/v2`
- API key opcional: se lee desde `localStorage` en `petstore_api_key` y se envia como header `api_key`.
- Carrito persistido en `localStorage` con key `cart_items`.

## Scripts (package.json)

- `npm run dev` - servidor local (Vite).
- `npm run build` - build de produccion.
- `npm run preview` - preview en `http://localhost:4173`.
- `npm run lint` - eslint.
- `npm run test` - vitest.
- `npm run test:e2e` - playwright.

## Como ejecutar

```bash
npm install
npm run dev
```

App en `http://localhost:5173`.

## Tests

- Unit/Integration: `npm run test`.
- E2E/API: `npm run test:e2e`.
- Playwright usa `npm run preview` y puerto 4173 (ver `playwright.config.ts`).

Mas detalle en `playwright-tests/README.md`.

## Puntos de extension (adaptar a cliente)

- API real: setear `VITE_API_BASE_URL` y/o reemplazar `src/api/client.ts`.
- Auth real: extender `src/features/users/` y `src/hooks/useAuth` (token, refresh, roles).
- Catalogo: modificar filtros y criterios en `src/features/home/`.
- Pricing e imagenes: reemplazar logica determinista en `src/lib/pet-utils.ts`.
- Checkout: integrar pasarela real en `src/features/cart/CheckoutPage.tsx`.
- Persistencia del carrito: mover de `localStorage` a backend en `src/context/CartProvider.tsx`.
- UI/Branding: reemplazar estilos Tailwind y componentes en `src/components/`.
- Tests: ajustar mocks en `src/mocks/handlers.ts` y fixtures en `playwright-tests/fixtures/`.

## Notas de integracion

- La API publica puede devolver IDs fuera de `Number.MAX_SAFE_INTEGER`; se filtra en `HomePage`.
- En tests, MSW y Playwright mockean endpoints para mantener determinismo.
