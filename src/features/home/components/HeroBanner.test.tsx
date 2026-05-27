import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroBanner from './HeroBanner';

describe('HeroBanner', () => {
  it('renders heading containing promotional copy', () => {
    const ref = { current: null };
    render(<HeroBanner targetRef={ref as React.RefObject<HTMLElement | null>} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Perfect Companion');
  });

  it('renders subheading paragraph text', () => {
    const ref = { current: null };
    render(<HeroBanner targetRef={ref as React.RefObject<HTMLElement | null>} />);

    expect(screen.getByText(/Discover loving pets/)).toBeInTheDocument();
  });

  it('renders CTA button with Shop Now text', () => {
    const ref = { current: null };
    render(<HeroBanner targetRef={ref as React.RefObject<HTMLElement | null>} />);

    expect(screen.getByRole('button', { name: /Shop Now/i })).toBeInTheDocument();
  });

  it('clicking CTA button calls scrollIntoView on targetRef', async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();

    const mockElement = {
      scrollIntoView: scrollIntoViewMock,
    } as unknown as HTMLElement;

    const ref = { current: mockElement };

    render(<HeroBanner targetRef={ref as React.RefObject<HTMLElement | null>} />);

    const button = screen.getByRole('button', { name: /Shop Now/i });
    await user.click(button);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
