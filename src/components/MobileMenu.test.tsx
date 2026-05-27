import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MobileMenu from './MobileMenu';

function renderMenu(isOpen: boolean, onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <MobileMenu isOpen={isOpen} onClose={onClose} />
    </MemoryRouter>,
  );
}

describe('MobileMenu', () => {
  it('renders when open', () => {
    renderMenu(true);

    const dialog = screen.getByRole('dialog', { name: 'Navigation menu' });
    expect(dialog).toBeInTheDocument();
  });

  it('hidden when closed (returns null)', () => {
    renderMenu(false);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('nav links present', () => {
    renderMenu(true);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('close button works', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderMenu(true, onClose);

    await user.click(screen.getByLabelText('Close menu'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('backdrop click closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderMenu(true, onClose);

    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Escape key closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderMenu(true, onClose);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('aria-modal="true" on dialog', () => {
    renderMenu(true);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
