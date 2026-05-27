import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { ToastProvider } from './context/ToastProvider';
import { CartProvider } from './context/CartProvider';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface RenderOptions {
  readonly initialEntries?: MemoryRouterProps['initialEntries'];
}

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  const queryClient = createTestQueryClient();
  const { initialEntries } = options || {};

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CartProvider>
          <MemoryRouter initialEntries={initialEntries}>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
