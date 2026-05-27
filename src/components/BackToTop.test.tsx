import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackToTop from './BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hidden initially (opacity-0, translate-y-4)', () => {
    render(<BackToTop />);

    const button = screen.getByLabelText('Back to top');
    expect(button.className).toContain('opacity-0');
    expect(button.className).toContain('translate-y-4');
    expect(button.className).toContain('pointer-events-none');
  });

  it('appears after scroll > threshold (300px default)', () => {
    render(<BackToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByLabelText('Back to top');
    expect(button.className).toContain('opacity-100');
  });

  it('click scrolls to top', async () => {
    const user = userEvent.setup();
    render(<BackToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    await user.click(screen.getByLabelText('Back to top'));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
