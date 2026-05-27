import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PromoBanner from './PromoBanner';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('PromoBanner', () => {
  it('renders promotional heading with discount-related text', () => {
    renderWithRouter(<PromoBanner />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/20% Off/i);
  });

  it('renders descriptive promotional copy', () => {
    renderWithRouter(<PromoBanner />);

    expect(screen.getByText(/Join our community/)).toBeInTheDocument();
  });

  it('renders CTA link pointing to /browse', () => {
    renderWithRouter(<PromoBanner />);

    const link = screen.getByRole('link', { name: /Browse Pets/i });
    expect(link).toHaveAttribute('href', '/browse');
  });
});
