# Application Architecture & Data Flow

This document provides a visual overview of the application's entry point and data flow to help new developers understand how the pieces fit together.

## 🗺️ High-Level Architecture

The application follows a standard React Single Page Application (SPA) flow.

![Application Architecture](./docs/assets/application-architecture.png)

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
3.  **API Call**: The query function uses `client.GET('/pet/findByStatus')`.
4.  **Filtering**:
    -   **Search**: Client-side filtering by name (case-insensitive).
    -   **Price**: Client-side filtering by price range.
    -   **Safety**: `Number.isSafeInteger` filters out invalid IDs.
5.  **Rendering**: The `PetGrid` renders the list of pets.

### 3. Adding to Cart & Wishlist
1.  **Cart Action**: User clicks "Add to Cart". `useCart` updates `CartContext` and syncs to `localStorage`.
2.  **Wishlist Action (Mocked)**:
    -   User clicks the Heart icon.
    -   `useWishlist` hook attempts to call `POST /user/wishlist/{id}`.
    -   **Real App**: Fails gracefully (API doesn't exist).
    -   **Test Environment**: Playwright intercepts the call and returns `200 OK`, allowing us to verify the UI interaction.

### 4. Checkout Process
1.  **User Action**: User submits the form on `CheckoutPage`.
2.  **Validation**: Zod schema validates the input fields.
3.  **Mutation**: `useMutation` triggers the `placeOrder` API call.
4.  **Optimistic/Side Effects**:
    -   On success, `clearCart()` is called.
    -   User is redirected to success page or shown a success toast.
    -   Queries might be invalidated to refresh order history (if implemented).
