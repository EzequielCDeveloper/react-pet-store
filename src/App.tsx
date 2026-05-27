import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./features/home/HomePage";
import { PetDetailPage } from "./features/pets/PetDetailPage";
import { LoginPage } from "./features/users/LoginPage";
import BrowsePage from "./features/browse/BrowsePage";
import { NotFoundPage } from "./features/error/NotFoundPage";
import { ErrorPage } from "./features/error/ErrorPage";
import { CartPage } from "./features/cart/CartPage";
import { CheckoutPage } from "./features/cart/CheckoutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pets/:petId", element: <PetDetailPage /> },
      { path: "browse", element: <BrowsePage /> },
      { path: "users/login", element: <LoginPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
