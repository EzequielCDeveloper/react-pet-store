# Pet Store Application

[![Build and Run Playwright Tests](https://github.com/Hemanthshiva/react-pet-store/actions/workflows/build-and-test.yml/badge.svg?branch=main)](https://github.com/Hemanthshiva/react-pet-store/actions/workflows/build-and-test.yml)

A modern, responsive React application simulating an e-commerce platform for a pet store. This project is built with React 19, TypeScript, and Vite, demonstrating modern frontend best practices including feature-based architecture, server state management with React Query, and strict type safety.

## 🚀 Features

-   **Browse Pets**: View available pets with generated images and prices.
-   **Advanced Filtering**: Filter pets by status (Available, Pending, Sold) and price range.
-   **Cart System**: Add pets to cart, manage quantities, and review order.
-   **Checkout Flow**: Simulated checkout process with user data pre-filling for registered users.
-   **Authentication**: Simulated login/registration system (persisted via LocalStorage).
-   **Responsive Design**: Mobile-friendly UI with a sidebar layout similar to BookCart.
-   **Robust Error Handling**: Global toast notifications and safe handling of API data quirks (e.g., unsafe integers).

## 🛠️ Tech Stack

-   **Core**: React 19, TypeScript, Vite
-   **State Management**: 
    -   Server State: `@tanstack/react-query`
    -   Global State: React Context (`CartContext`, `ToastContext`)
-   **Routing**: `react-router-dom`
-   **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`
-   **Forms**: React Hook Form, Zod validation
-   **API Client**: `openapi-fetch` (strictly typed against Swagger schema)
-   **Testing**: 
    -   Unit/Integration: Vitest, React Testing Library, MSW
    -   End-to-End: Playwright (with Zod schema validation)
-   **CI/CD**: GitHub Actions
-   **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd pet-store
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Install Playwright browsers (if running E2E tests):
    ```bash
    npx playwright install
    ```

### Running Locally

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Running Tests

**Unit & Integration Tests (Vitest)**:
```bash
npm run test
```

**End-to-End & API Tests (Playwright)**:
```bash
# Run all tests (headless)
npx playwright test

# Run UI tests only
npx playwright test ui/

# Run API tests only
npx playwright test api/

# View HTML report
npx playwright show-report
```

Run linting:
```bash
npm run lint
```

## 🏗️ Architecture & Data Flow

### Backend Connection
The application connects to the public **Swagger Petstore API** (`https://petstore.swagger.io/v2`).
-   **Client**: We use `openapi-fetch` for a lightweight, type-safe fetch wrapper.
-   **Schema**: TypeScript types are auto-generated from the Swagger definition (`src/api/schema.d.ts`), ensuring compile-time safety for all API requests and responses.

### Data Flow Pattern
1.  **Entry Point**: `src/main.tsx` mounts the app and wraps it in global providers (`AppProviders`).
2.  **Routing**: `src/App.tsx` defines the route hierarchy using `react-router-dom`.
3.  **Fetching**: Components use custom hooks (e.g., `useApi`, `useQuery`) to fetch data.
    -   `useApi`: Provides the configured API client.
    -   `useQuery`: Caches API responses and handles loading/error states.
4.  **Global State**: 
    -   `CartProvider` manages the shopping cart, persisting to `localStorage`.
    -   `ToastProvider` handles global notifications.
5.  **User Actions**: Mutations (like `addToCart` or `placeOrder`) update local state or trigger API calls, invalidating queries where necessary to refresh data.

### Project Structure
The project follows a **feature-based architecture**:
```
src/
├── api/            # API client and generated schemas
├── components/     # Shared global components (Layout, Providers)
├── context/        # React Context definitions and Providers
├── features/       # Feature-specific logic (pages, components, tests)
│   ├── cart/       # Cart & Checkout logic
│   ├── home/       # Home page & filtering
│   ├── pets/       # Pet details & management
│   └── users/      # Auth & user management
├── hooks/          # Shared custom hooks (useAuth, useCart)
├── lib/            # Utilities (helpers, query client config)
└── mocks/          # MSW handlers for testing
```

## 🧩 Key Implementation Details

-   **Deterministic Data**: Since the public API lacks images and prices, `src/lib/pet-utils.ts` generates consistent images and prices based on the Pet ID.
-   **Safe Integers**: The API sometimes returns IDs exceeding JavaScript's `MAX_SAFE_INTEGER`. The app filters these out to prevent routing errors.
-   **Context Separation**: Context definitions (`Context.ts`) are separated from Providers (`Provider.tsx`) to support Vite's Fast Refresh.
