import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { PetCard } from '../pets/components/PetCard';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const mockPet = {
  id: 1,
  name: "Test Dog",
  status: "available" as const,
  photoUrls: [],
  category: { id: 1, name: "Dogs" },
  tags: []
};

describe('Cart Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows adding item to cart', async () => {
    renderWithProviders(<PetCard pet={mockPet} />);
    
    const addButton = screen.getByText(/Agregar al carrito/i);
    fireEvent.click(addButton);
    
    expect(screen.getByText(/¡Agregado al carrito!/i)).toBeInTheDocument();
    
    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('cart_items') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].pet.id).toBe(1);
  });

  it('displays items in cart page', () => {
    // Seed localStorage
    localStorage.setItem('cart_items', JSON.stringify([
      { pet: mockPet, quantity: 1, price: 50 }
    ]));

    renderWithProviders(<CartPage />);
    
    expect(screen.getByText('Test Dog')).toBeInTheDocument();
    expect(screen.getAllByText('£50')[0]).toBeInTheDocument();
  });

  it('allows updating quantity', () => {
    localStorage.setItem('cart_items', JSON.stringify([
      { pet: mockPet, quantity: 1, price: 50 }
    ]));

    renderWithProviders(<CartPage />);
    
    const plusButton = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-plus'));
    if (plusButton) fireEvent.click(plusButton);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('£100')).toBeInTheDocument();
  });

  it('allows removing item', () => {
    localStorage.setItem('cart_items', JSON.stringify([
      { pet: mockPet, quantity: 1, price: 50 }
    ]));

    renderWithProviders(<CartPage />);
    
    const removeButton = screen.getAllByRole('button').find(b => b.title === "Quitar artículo");
    if (removeButton) fireEvent.click(removeButton);
    
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('completes checkout successfully', async () => {
    localStorage.setItem('cart_items', JSON.stringify([
      { pet: mockPet, quantity: 1, price: 50 }
    ]));

    // Mock order endpoint
    server.use(
      http.post('https://petstore.swagger.io/v2/store/order', () => {
        return HttpResponse.json({ id: 123, status: 'placed' });
      })
    );

    renderWithProviders(<CheckoutPage />);
    
    // Fill form
    fireEvent.change(screen.getAllByLabelText(/Nombre/i)[0], { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'London' } });
    fireEvent.change(screen.getByLabelText(/Código postal/i), { target: { value: 'SW1A 1AA' } });
    fireEvent.change(screen.getByLabelText(/Nombre en la tarjeta/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Número de tarjeta/i), { target: { value: '1234123412341234' } });
    fireEvent.change(screen.getByLabelText(/Fecha de vencimiento/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: '123' } });

    const payButton = screen.getByText(/Pagar £50/i);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText(/Pedido confirmado/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
