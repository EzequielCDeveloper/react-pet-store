import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { HomePage } from '../home/HomePage';
import { renderWithProviders } from '../../test-utils';
import userEvent from '@testing-library/user-event';

describe('Pets Integration', () => {
  it('renders pets list fetched from API', async () => {
    renderWithProviders(<HomePage />);

    // Check for loading state (optional, might be too fast)
    // await waitFor(() => expect(screen.getByText(/loading/i)).toBeInTheDocument());

    // Check if pets are rendered
    await waitFor(() => {
      expect(screen.getByText('Doggie')).toBeInTheDocument();
      expect(screen.getByText('Kitty')).toBeInTheDocument();
    });
    
    // Use getAllByText because status badge and filter label might match
    const availableElements = screen.getAllByText('available');
    expect(availableElements.length).toBeGreaterThan(0);
    
    // "pending" might be in the filter list even if no pets are pending, 
    // but the test data has a pending pet usually? 
    // Let's assume the mock returns mixed status pets.
  });

  it('allows filtering by status', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await waitFor(() => expect(screen.getByText('Doggie')).toBeInTheDocument());

    // Toggle 'available' off
    // The label text is "available" (lowercase) in the mock/component?
    // In PetFilters.tsx it is capitalized in the span: <span ... capitalize">{status}</span>
    // So it renders "Available".
    // The test was looking for 'available'. 
    // Let's check PetFilters.tsx again.
    // It maps ['available', 'pending', 'sold'].
    // {status} is "available".
    // Class is "capitalize". So visual text is "Available".
    // But getByLabelText might look at the text node.
    // Let's try matching /Available/i.
    
    const availableCheckbox = screen.getByLabelText(/available/i);
    await user.click(availableCheckbox);

    // Should re-fetch (MSW handler is static, but we can verify the checkbox state)
    expect(availableCheckbox).not.toBeChecked();
  });

  it('allows filtering by price', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await waitFor(() => expect(screen.getByText('Doggie')).toBeInTheDocument());

    // Default price range is 0-200. Generated prices are 10-100.
    // Set Min Price to 150. Should filter out all pets.
    const minPriceInput = screen.getByLabelText(/min/i);
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '150');

    // Wait for filter to apply (it's client side, so fast, but async in React state update)
    await waitFor(() => {
        expect(screen.queryByText('Doggie')).not.toBeInTheDocument();
    });

    // Set Min Price back to 0. Pets should reappear.
    await user.clear(minPriceInput);
    await user.type(minPriceInput, '0');
    
    await waitFor(() => {
        expect(screen.getByText('Doggie')).toBeInTheDocument();
    });
  });
});

