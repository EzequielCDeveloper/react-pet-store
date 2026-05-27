import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import BrowsePage from './BrowsePage';
import { ToastProvider } from '../../context/ToastProvider';
import { CartProvider } from '../../context/CartProvider';

type Pet = import('../../api/schema').components['schemas']['Pet'];

const mockState = vi.hoisted(() => ({
  pets: [] as Pet[],
  allPets: [] as Pet[],
  isLoading: true,
  error: null as Error | null,
  retry: vi.fn(),
}));

vi.mock('./useBrowseLogic', () => ({
  useBrowseLogic: () => ({
    pets: mockState.pets,
    allPets: mockState.allPets,
    isLoading: mockState.isLoading,
    error: mockState.error,
    retry: mockState.retry,
  }),
}));

const mockPet1: Pet = { id: 1, name: 'Buddy', status: 'available', photoUrls: ['photo1.jpg'] };
const mockPet2: Pet = { id: 2, name: 'Max', status: 'available', photoUrls: [] };

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/browse']) {
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
          <MemoryRouter initialEntries={initialEntries}>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe('BrowsePage', () => {
  beforeEach(() => {
    mockState.pets = [];
    mockState.allPets = [];
    mockState.isLoading = true;
    mockState.error = null;
    vi.clearAllMocks();
  });

  it('renders Breadcrumb with "Home > Browse"', () => {
    renderWithProviders(<BrowsePage />);

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
  });

  it('renders FilterChips hidden when no filters', () => {
    renderWithProviders(<BrowsePage />);

    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('renders BrowseSidebar with filter dropdowns', () => {
    renderWithProviders(<BrowsePage />);

    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort')).toBeInTheDocument();
    expect(screen.getByLabelText('Photo')).toBeInTheDocument();
  });

  it('renders BrowseGrid in loading state initially', () => {
    mockState.isLoading = true;
    renderWithProviders(<BrowsePage />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders BrowseGrid with pets after loading', () => {
    mockState.isLoading = false;
    mockState.pets = [mockPet1, mockPet2];
    renderWithProviders(<BrowsePage />);

    const articles = screen.getAllByRole('article');
    expect(articles.length).toBe(2);
  });
});
