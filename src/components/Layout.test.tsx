import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartProvider';
import { ToastProvider } from '../context/ToastProvider';
import { Layout } from './Layout';

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: null, login: vi.fn(), logout: vi.fn() }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLayout() {
  return render(
    <CartProvider>
      <ToastProvider>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </ToastProvider>
    </CartProvider>,
  );
}

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('search input renders in Header on desktop viewport', () => {
    renderLayout();

    const searchInput = screen.getByPlaceholderText('Buscar mascotas...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.tagName).toBe('INPUT');
  });

  it('search input has type="search"', () => {
    renderLayout();

    const searchInput = screen.getByPlaceholderText('Buscar mascotas...');
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  it('search input is wrapped in a form element', () => {
    renderLayout();

    const searchInput = screen.getByPlaceholderText('Buscar mascotas...');
    expect(searchInput.closest('form')).toBeInTheDocument();
  });

  it('search form submission navigates to /browse with query', async () => {
    const user = userEvent.setup();
    renderLayout();

    const input = screen.getByPlaceholderText('Buscar mascotas...');
    await user.type(input, 'rex');
    await user.keyboard('{Enter}');

    expect(mockNavigate).toHaveBeenCalledWith('/browse?q=rex');
  });

  it('submitting empty search does not navigate', async () => {
    const user = userEvent.setup();
    renderLayout();

    const input = screen.getByPlaceholderText('Buscar mascotas...');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('cart badge still displays correct state', () => {
    renderLayout();

    const cartLink = screen.getByLabelText('Carrito');
    expect(cartLink).toBeInTheDocument();
  });

  it('user logged-out state still shows Login button', () => {
    renderLayout();

    const loginElements = screen.getAllByText('Iniciar sesión');
    expect(loginElements.length).toBeGreaterThan(0);
  });

  it('renders hamburger button on mobile', () => {
    renderLayout();

    const menuButton = screen.getByLabelText('Abrir menú');
    expect(menuButton).toBeInTheDocument();
  });

  it('clicking hamburger opens MobileMenu', async () => {
    const user = userEvent.setup();
    renderLayout();

    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByLabelText('Abrir menú'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('MobileMenu close button closes the menu', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByLabelText('Abrir menú'));

    const closeButton = screen.getByLabelText('Cerrar menú');
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders skip-to-content link', () => {
    renderLayout();

    const skipLink = screen.getByText('Saltar al contenido principal');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('main element has id="main-content"', () => {
    renderLayout();

    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
    expect(main?.tagName).toBe('MAIN');
  });

  it('renders BackToTop component', () => {
    renderLayout();

    expect(screen.getByLabelText('Volver arriba')).toBeInTheDocument();
  });

  it('header hamburger has min-height of 44px', () => {
    renderLayout();

    const menuButton = screen.getByLabelText('Abrir menú');
    expect(menuButton.className).toContain('min-h-[44px]');
    expect(menuButton.className).toContain('min-w-[44px]');
  });

  it('cart link has min-h-[44px] touch target', () => {
    renderLayout();

    const cartLink = screen.getByLabelText('Carrito');
    expect(cartLink.className).toContain('min-h-[44px]');
    expect(cartLink.className).toContain('min-w-[44px]');
  });
});
