import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '../../../context/CartProvider';
import { ToastProvider } from '../../../context/ToastProvider';
import FeaturedPets from './FeaturedPets';
import type { components } from '../../../api/schema';

type Pet = components["schemas"]["Pet"];

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', status: 'available', photoUrls: [] },
  { id: 2, name: 'Max', status: 'available', photoUrls: [] },
  { id: 3, name: 'Luna', status: 'available', photoUrls: [] },
  { id: 4, name: 'Bella', status: 'available', photoUrls: [] },
];

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CartProvider>
          <MemoryRouter>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

describe('FeaturedPets', () => {
  it('loading state renders 8 skeleton cards with animate-pulse class', () => {
    renderWithProviders(
      <FeaturedPets
        pets={undefined}
        isLoading={true}
        error={null}
        onRetry={() => {}}
      />
    );

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(8);
  });

  it('error state renders error message and Retry button', () => {
    renderWithProviders(
      <FeaturedPets
        pets={undefined}
        isLoading={false}
        error={new Error('API Error')}
        onRetry={() => {}}
      />
    );

    expect(screen.getByText(/Unable to load featured pets/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('error state clicking Retry calls onRetry prop', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderWithProviders(
      <FeaturedPets
        pets={undefined}
        isLoading={false}
        error={new Error('API Error')}
        onRetry={onRetry}
      />
    );

    await user.click(screen.getByRole('button', { name: /Retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('empty state renders no pets available message', () => {
    renderWithProviders(
      <FeaturedPets
        pets={[]}
        isLoading={false}
        error={null}
        onRetry={() => {}}
      />
    );

    expect(screen.getByText('No pets available at the moment')).toBeInTheDocument();
  });

  it('data state renders correct number of PetCard components', () => {
    renderWithProviders(
      <FeaturedPets
        pets={mockPets}
        isLoading={false}
        error={null}
        onRetry={() => {}}
      />
    );

    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Luna')).toBeInTheDocument();
    expect(screen.getByText('Bella')).toBeInTheDocument();
  });

  it('renders in responsive grid', () => {
    renderWithProviders(
      <FeaturedPets
        pets={mockPets}
        isLoading={false}
        error={null}
        onRetry={() => {}}
      />
    );

    const section = screen.getByText('Featured Pets').closest('section');
    const grid = section?.querySelector('.grid');
    expect(grid).toBeTruthy();
  });
});
