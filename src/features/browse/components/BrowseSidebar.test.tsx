import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BrowseSidebar from './BrowseSidebar';
import type { BrowseFilters } from '../useBrowseLogic';
import type { components } from '../../../api/schema';

type Pet = components["schemas"]["Pet"];

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const defaultFilters: BrowseFilters = {
  status: '',
  category: '',
  q: '',
  sort: 'name-asc',
  hasPhoto: '',
};

const allPetsWithCategories: Pet[] = [
  { id: 1, name: 'Buddy', status: 'available', photoUrls: [], category: { id: 1, name: 'Dogs' } },
  { id: 2, name: 'Max', status: 'available', photoUrls: [], category: { id: 1, name: 'Dogs' } },
  { id: 3, name: 'Luna', status: 'available', photoUrls: [], category: { id: 2, name: 'Cats' } },
  { id: 4, name: 'Bella', status: 'available', photoUrls: [], category: { id: 3, name: 'Fish' } },
];

describe('BrowseSidebar', () => {
  it('renders status dropdown with all options', () => {
    renderWithRouter(
      <BrowseSidebar
        allPets={[]}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    );

    const statusSelect = screen.getByLabelText('Estado');
    expect(statusSelect).toBeInTheDocument();
    const statusOptions = within(statusSelect);
    expect(statusOptions.getByRole('option', { name: 'Todos' })).toBeInTheDocument();
    expect(statusOptions.getByRole('option', { name: 'Disponible' })).toBeInTheDocument();
    expect(statusOptions.getByRole('option', { name: 'Pendiente' })).toBeInTheDocument();
    expect(statusOptions.getByRole('option', { name: 'Vendido' })).toBeInTheDocument();
  });

  it('renders category dropdown with All plus categories from allPets', () => {
    renderWithRouter(
      <BrowseSidebar
        allPets={allPetsWithCategories}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    );

    const categorySelect = screen.getByLabelText('Categoría');
    expect(categorySelect).toBeInTheDocument();
    const categoryOptions = within(categorySelect);
    expect(categoryOptions.getByRole('option', { name: 'Todos' })).toBeInTheDocument();
    expect(categoryOptions.getByRole('option', { name: 'Cats' })).toBeInTheDocument();
    expect(categoryOptions.getByRole('option', { name: 'Dogs' })).toBeInTheDocument();
    expect(categoryOptions.getByRole('option', { name: 'Fish' })).toBeInTheDocument();
  });

  it('renders sort dropdown with four options', () => {
    renderWithRouter(
      <BrowseSidebar
        allPets={[]}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    );

    const sortSelect = screen.getByLabelText('Ordenar por');
    expect(sortSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Nombre A-Z' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Nombre Z-A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Precio menor-mayor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Precio mayor-menor' })).toBeInTheDocument();
  });

  it('renders hasPhoto dropdown', () => {
    renderWithRouter(
      <BrowseSidebar
        allPets={[]}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    );

    const photoSelect = screen.getByLabelText('Foto');
    expect(photoSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Mostrar todos' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Solo con foto' })).toBeInTheDocument();
  });

  it('status change calls onFilterChange with correct key and value', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    renderWithRouter(
      <BrowseSidebar
        allPets={[]}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onClearAll={() => {}}
      />
    );

    await user.selectOptions(screen.getByLabelText('Estado'), 'available');
    expect(onFilterChange).toHaveBeenCalledWith('status', 'available');
  });

  it('category change calls onFilterChange with correct key and value', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    renderWithRouter(
      <BrowseSidebar
        allPets={allPetsWithCategories}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={onFilterChange}
        onClearAll={() => {}}
      />
    );

    await user.selectOptions(screen.getByLabelText('Categoría'), 'Dogs');
    expect(onFilterChange).toHaveBeenCalledWith('category', 'Dogs');
  });

  it('Clear all filters button calls onClearAll', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();

    renderWithRouter(
      <BrowseSidebar
        allPets={[]}
        isLoading={false}
        filters={defaultFilters}
        onFilterChange={() => {}}
        onClearAll={onClearAll}
      />
    );

    await user.click(screen.getByRole('button', { name: /Limpiar filtros/i }));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('during loading category dropdown is disabled', () => {
    renderWithRouter(
      <BrowseSidebar
        allPets={[]}
        isLoading={true}
        filters={defaultFilters}
        onFilterChange={() => {}}
        onClearAll={() => {}}
      />
    );

    const categorySelect = screen.getByLabelText('Categoría');
    expect(categorySelect).toBeDisabled();
  });

  describe('mobile drawer', () => {
    it('renders desktop sidebar always visible', () => {
      renderWithRouter(
        <BrowseSidebar
          allPets={[]}
          isLoading={false}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onClearAll={() => {}}
          isOpen={false}
          onClose={() => {}}
        />
      );

      const desktopSidebar = document.querySelector('aside.hidden.lg\\:block');
      expect(desktopSidebar).toBeInTheDocument();
    });

    it('mobile drawer renders when isOpen=true with onClose', () => {
      renderWithRouter(
        <BrowseSidebar
          allPets={[]}
          isLoading={false}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onClearAll={() => {}}
          isOpen={true}
          onClose={() => {}}
        />
      );

      const mobileAside = document.querySelector('aside.fixed.top-0');
      expect(mobileAside).toBeInTheDocument();
      expect(mobileAside?.className).toContain('translate-x-0');
    });

    it('mobile drawer hidden when isOpen=false', () => {
      renderWithRouter(
        <BrowseSidebar
          allPets={[]}
          isLoading={false}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onClearAll={() => {}}
          isOpen={false}
          onClose={() => {}}
        />
      );

      const mobileAside = document.querySelector('aside.fixed.top-0');
      expect(mobileAside?.className).toContain('-translate-x-full');
    });

    it('close button in mobile drawer calls onClose', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithRouter(
        <BrowseSidebar
          allPets={[]}
          isLoading={false}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onClearAll={() => {}}
          isOpen={true}
          onClose={onClose}
        />
      );

      await user.click(screen.getByLabelText('Cerrar filtros'));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('backdrop overlay closes the drawer', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithRouter(
        <BrowseSidebar
          allPets={[]}
          isLoading={false}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onClearAll={() => {}}
          isOpen={true}
          onClose={onClose}
        />
      );

      const backdrop = document.querySelector('.bg-black\\/50');
      expect(backdrop).toBeInTheDocument();
      if (backdrop) await user.click(backdrop);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('Escape key closes the mobile drawer', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithRouter(
        <BrowseSidebar
          allPets={[]}
          isLoading={false}
          filters={defaultFilters}
          onFilterChange={() => {}}
          onClearAll={() => {}}
          isOpen={true}
          onClose={onClose}
        />
      );

      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledOnce();
    });
  });
});
