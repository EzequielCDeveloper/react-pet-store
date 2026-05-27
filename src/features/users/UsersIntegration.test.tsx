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

    const loginTab = screen.getByRole('button', { name: 'Login' });
    const registerTab = screen.getByRole('button', { name: 'Register' });
    expect(loginTab).toBeInTheDocument();
    expect(registerTab).toBeInTheDocument();
  });

  it('login tab is active by default', () => {
    renderWithProviders(<LoginPage />);

    const loginTab = screen.getByRole('button', { name: 'Login' });
    expect(loginTab.className).toContain('border-blue-600');
  });

  it('password visibility toggle works', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByLabelText('Show password'));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('allows user login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Username'), 'testuser');
    await user.type(screen.getByLabelText('Password'), 'password');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    });
  });

  it('allows creating a user', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const registerTab = screen.getByRole('button', { name: 'Register' });
    await user.click(registerTab);

    await user.type(screen.getByLabelText(/^First Name/), 'John');
    await user.type(screen.getByLabelText(/^Last Name/), 'Doe');
    await user.type(screen.getByLabelText(/^Email/), 'john@example.com');
    await user.type(screen.getAllByLabelText(/^Username/)[0], 'newuser');
    await user.type(screen.getAllByLabelText(/^Password/)[0], 'secret');

    window.alert = () => {};

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  it('shows logout view with Welcome message when user is logged in', () => {
    localStorage.setItem('petstore_user', 'testuser');
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
