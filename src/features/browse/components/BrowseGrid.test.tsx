import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BrowseGrid from './BrowseGrid';
import type { components } from '../../../api/schema';

type Pet = components["schemas"]["Pet"];

vi.mock('../../pets/components/PetCard', () => ({
  PetCard: ({ pet }: { pet: { id?: number; name?: string } }) => (
    <div data-testid={`pet-card-${pet.id}`}>{pet.name}</div>
  ),
}));

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const mockPets: Pet[] = [
  { id: 1, name: 'Buddy', status: 'available', photoUrls: [] },
  { id: 2, name: 'Max', status: 'available', photoUrls: [] },
  { id: 3, name: 'Luna', status: 'available', photoUrls: [] },
  { id: 4, name: 'Bella', status: 'available', photoUrls: [] },
];

describe('BrowseGrid', () => {
  it('loading state renders 8 skeleton cards with animate-pulse class', () => {
    renderWithRouter(
      <BrowseGrid
        pets={[]}
        isLoading={true}
        error={null}
        onRetry={() => {}}
      />
    );

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons).toHaveLength(8);
  });

  it('error state renders error message and Try again button', () => {
    renderWithRouter(
      <BrowseGrid
        pets={[]}
        isLoading={false}
        error={new Error('Network Error')}
        onRetry={() => {}}
      />
    );

    expect(screen.getByText(/No se pudieron cargar/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Intentar de nuevo/i })).toBeInTheDocument();
  });

  it('error state clicking Try again calls onRetry prop', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderWithRouter(
      <BrowseGrid
        pets={[]}
        isLoading={false}
        error={new Error('Network Error')}
        onRetry={onRetry}
      />
    );

    await user.click(screen.getByRole('button', { name: /Intentar de nuevo/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('empty state renders no pets message', () => {
    renderWithRouter(
      <BrowseGrid
        pets={[]}
        isLoading={false}
        error={null}
        onRetry={() => {}}
      />
    );

    expect(screen.getByText('No se encontraron mascotas con esos filtros')).toBeInTheDocument();
  });

  it('data state renders correct number of PetCard components', () => {
    renderWithRouter(
      <BrowseGrid
        pets={mockPets}
        isLoading={false}
        error={null}
        onRetry={() => {}}
      />
    );

    expect(screen.getByTestId('pet-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('pet-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('pet-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('pet-card-4')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^pet-card-/)).toHaveLength(4);
  });

  it('grid has responsive classes', () => {
    renderWithRouter(
      <BrowseGrid
        pets={mockPets}
        isLoading={false}
        error={null}
        onRetry={() => {}}
      />
    );

    const grid = document.querySelector('.grid');
    expect(grid).toBeTruthy();
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('sm:grid-cols-2');
    expect(grid?.className).toContain('md:grid-cols-3');
    expect(grid?.className).toContain('lg:grid-cols-4');
  });
});
