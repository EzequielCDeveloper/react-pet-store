import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import HomePage from './HomePage';
import { ToastProvider } from '../../context/ToastProvider';
import { CartProvider } from '../../context/CartProvider';

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

describe('HomePage', () => {
  it('renders HeroBanner first', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Perfect Companion');
  });

  it('renders CategoryQuickLinks', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Shop by Category')).toBeInTheDocument();
    expect(screen.getByText('Dogs')).toBeInTheDocument();
  });

  it('renders FeaturedPets section', async () => {
    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Featured Pets')).toBeInTheDocument();
    });
  });

  it('renders PromoBanner', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText(/Special Offer/)).toBeInTheDocument();
  });

  it('renders all 4 sections in correct vertical order', () => {
    renderWithProviders(<HomePage />);

    const sections = document.querySelectorAll('section');
    expect(sections).toHaveLength(4);

    const sectionTexts = Array.from(sections).map(s => s.textContent || '');
    expect(sectionTexts[0]).toContain('Perfect Companion');
    expect(sectionTexts[1]).toContain('Shop by Category');
    expect(sectionTexts[2]).toContain('Featured Pets');
    expect(sectionTexts[3]).toContain('Special Offer');
  });
});
