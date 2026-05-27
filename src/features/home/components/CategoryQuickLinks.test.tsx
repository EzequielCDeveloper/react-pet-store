import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryQuickLinks from './CategoryQuickLinks';
import type { CategoryData } from '../useHomeLogic';

const mockCategories: readonly CategoryData[] = [
  { name: 'Dogs', slug: 'dogs', icon: 'Dog' },
  { name: 'Cats', slug: 'cats', icon: 'Cat' },
  { name: 'Birds', slug: 'birds', icon: 'Bird' },
  { name: 'Fish', slug: 'fish', icon: 'Fish' },
  { name: 'Small Pets', slug: 'small-pets', icon: 'Heart' },
];

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('CategoryQuickLinks', () => {
  it('renders exactly 5 category circles when given 5 categories', () => {
    renderWithRouter(<CategoryQuickLinks categories={mockCategories} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });

  it('each circle shows the correct label text', () => {
    renderWithRouter(<CategoryQuickLinks categories={mockCategories} />);

    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByText('Cats')).toBeInTheDocument();
    expect(screen.getByText('Birds')).toBeInTheDocument();
    expect(screen.getByText('Fish')).toBeInTheDocument();
    expect(screen.getByText('Small Pets')).toBeInTheDocument();
  });

  it('each circle contains a link pointing to correct slug path', () => {
    renderWithRouter(<CategoryQuickLinks categories={mockCategories} />);

    expect(screen.getByText('Dogs').closest('a')).toHaveAttribute('href', '/browse?category=dogs');
    expect(screen.getByText('Cats').closest('a')).toHaveAttribute('href', '/browse?category=cats');
    expect(screen.getByText('Fish').closest('a')).toHaveAttribute('href', '/browse?category=fish');
  });

  it('renders nothing or empty when given empty array', () => {
    renderWithRouter(<CategoryQuickLinks categories={[]} />);

    expect(screen.queryByRole('link')).toBeNull();
  });

  it('applies category color styles to circles', () => {
    renderWithRouter(<CategoryQuickLinks categories={mockCategories} />);

    const dogsLink = screen.getByText('Dogs').closest('a')!;
    const dogsCircle = dogsLink.querySelector('.rounded-full') as HTMLElement;
    expect(dogsCircle.style.backgroundColor).toBe('rgb(254, 243, 199)');

    const fishLink = screen.getByText('Fish').closest('a')!;
    const fishCircle = fishLink.querySelector('.rounded-full') as HTMLElement;
    expect(fishCircle.style.backgroundColor).toBe('rgb(219, 234, 254)');
  });
});
