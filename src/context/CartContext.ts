import { createContext } from 'react';
import type { components } from '../api/schema';

type Pet = components["schemas"]["Pet"];

export interface CartItem {
  pet: Pet;
  quantity: number;
  price: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: number) => void;
  updateQuantity: (petId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
