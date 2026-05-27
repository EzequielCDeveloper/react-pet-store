import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { renderWithProviders } from '../../test-utils';
import userEvent from '@testing-library/user-event';

describe('Users Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login/register tabs', () => {
    renderWithProviders(<LoginPage />);

    const loginTab = screen.getAllByRole('button', { name: 'Iniciar sesión' })[0];
    const registerTab = screen.getByRole('button', { name: 'Registrarse' });
    expect(loginTab).toBeInTheDocument();
    expect(registerTab).toBeInTheDocument();
  });

  it('login tab is active by default', () => {
    renderWithProviders(<LoginPage />);

    const loginTab = screen.getAllByRole('button', { name: 'Iniciar sesión' })[0];
    expect(loginTab.className).toContain('border-blue-600');
  });

  it('password visibility toggle works', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByLabelText('Mostrar contraseña'));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('allows user login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Nombre de usuario'), 'testuser');
    await user.type(screen.getByLabelText('Contraseña'), 'password');

    await user.click(screen.getAllByRole('button', { name: /iniciar sesión/i })[1]);

    await waitFor(() => {
      expect(screen.getByText(/bienvenido, testuser/i)).toBeInTheDocument();
    });
  });

  it('allows creating a user', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const registerTab = screen.getByRole('button', { name: 'Registrarse' });
    await user.click(registerTab);

    await user.type(screen.getByLabelText('Nombre'), 'John');
    await user.type(screen.getByLabelText('Apellido'), 'Doe');
    await user.type(screen.getByLabelText('Correo electrónico'), 'john@example.com');
    await user.type(screen.getAllByLabelText('Nombre de usuario')[0], 'newuser');
    await user.type(screen.getAllByLabelText('Contraseña')[0], 'secret');

    window.alert = () => {};

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText(/registro exitoso/i)).toBeInTheDocument();
    });
  });

  it('shows logout view with Welcome message when user is logged in', () => {
    localStorage.setItem('petstore_user', 'testuser');
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/bienvenido, testuser/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });
});
