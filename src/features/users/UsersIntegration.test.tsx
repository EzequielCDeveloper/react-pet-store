import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { renderWithProviders } from '../../test-utils';
import userEvent from '@testing-library/user-event';

describe('Users Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows user login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password');
    
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    });
  });

  it('allows creating a user', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    // Switch to Register tab
    await user.click(screen.getByRole('button', { name: /register/i }));

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/password/i), 'secret');
    
    // Override alert to avoid JSDOM error (if used)
    window.alert = () => {};

    // Click Create Account
    await user.click(screen.getByRole('button', { name: /create account/i }));

    // Expect success message or state change
    await waitFor(() => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });
});
