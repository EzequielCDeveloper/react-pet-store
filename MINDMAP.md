# Application Architecture & Data Flow

This document provides a visual overview of the application's entry point and data flow to help new developers understand how the pieces fit together.

## 🗺️ High-Level Architecture

The application follows a standard React Single Page Application (SPA) flow.

```mermaid
graph TD
    subgraph Entry ["Entry Point (src/main.tsx)"]
        Main[ReactDOM.createRoot] --> Providers[AppProviders Wrapper]
    end

    subgraph Context ["Global State & Providers"]
        Providers --> QC[QueryClientProvider]
        Providers --> CP[CartProvider]
        Providers --> TP[ToastProvider]
        Providers --> SP[SettingsProvider]
    end

    subgraph Router ["Routing (src/App.tsx)"]
        QC --> AppRouter[React Router]
        AppRouter --> Layout[Layout Component]
        Layout --> Outlet[Page Content]
    end

    subgraph Pages ["Feature Pages"]
        Outlet --> Home[HomePage]
        Outlet --> PetDetail[PetDetailPage]
        Outlet --> Cart[CartPage]
        Outlet --> Checkout[CheckoutPage]
        Outlet --> Login[LoginPage]
    end

    subgraph Data ["Data Sources"]
        Home -.-> |useApi & useQuery| SwaggerAPI[(Swagger Petstore API)]
        PetDetail -.-> |useApi & useQuery| SwaggerAPI
        Cart -.-> |useCart| LocalStorage[(LocalStorage)]
        Login -.-> |useAuth| LocalStorage
        Checkout -.-> |useApi & useCart| SwaggerAPI
    end

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef primary fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef storage fill:#fff3e0,stroke:#e65100,stroke-width:2px;

    class Main,Providers primary;
    class SwaggerAPI,LocalStorage storage;
```

## 🔄 Detailed Data Flow Scenarios

### 1. Application Initialization
1.  **`src/main.tsx`**: The entry point. It finds the root DOM element and renders the `App` component wrapped in `AppProviders`.
2.  **`AppProviders`**: Initializes the global context providers:
    -   **QueryClientProvider**: Sets up React Query for caching API requests.
    -   **CartProvider**: Hydrates the shopping cart from `localStorage`.
    -   **ToastProvider**: Sets up the notification system.
3.  **`App.tsx`**: Defines the routes. Based on the URL, it renders the appropriate page component inside the `Layout`.

### 2. Fetching & Displaying Pets (HomePage)
1.  **Component Mount**: `HomePage` mounts.
2.  **Hook Execution**: Calls `useQuery` with a key like `['pets', status]`.
3.  **API Call**: The query function uses `client.GET('/pet/findByStatus')` (from `openapi-fetch`).
4.  **Data Processing**:
    -   Response is validated against the generated schema.
    -   `getPetImage` and `getPetPrice` (utils) add missing visual data.
    -   `Number.isSafeInteger` filters out invalid IDs.
5.  **Rendering**: The `PetGrid` renders the list of pets.

### 3. Adding to Cart
1.  **User Action**: User clicks "Add to Cart" on a `PetCard`.
2.  **Context Update**: `useCart` hook's `addToCart` function is called.
3.  **State Change**: The `CartContext` state updates, adding the item.
4.  **Persistence**: The `CartProvider`'s `useEffect` detects the state change and writes the new cart to `localStorage`.
5.  **UI Feedback**: The Header cart counter updates automatically (reactively).

### 4. Checkout Process
1.  **User Action**: User submits the form on `CheckoutPage`.
2.  **Validation**: Zod schema validates the input fields.
3.  **Mutation**: `useMutation` triggers the `placeOrder` API call.
4.  **Optimistic/Side Effects**:
    -   On success, `clearCart()` is called.
    -   User is redirected to success page or shown a success toast.
    -   Queries might be invalidated to refresh order history (if implemented).
