import React, { useState, useEffect } from 'react';
import type { components } from '../api/schema';
import { getPetPrice } from '../lib/pet-utils';
import { CartContext, type CartItem } from './CartContext';

type Pet = components["schemas"]["Pet"];

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = (pet: Pet) => {
    setItems(current => {
      const existing = current.find(item => item.pet.id === pet.id);
      if (existing) {
        return current.map(item =>
          item.pet.id === pet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { pet, quantity: 1, price: getPetPrice(pet.id) }];
    });
  };

  const removeFromCart = (petId: number) => {
    setItems(current => current.filter(item => item.pet.id !== petId));
  };

  const updateQuantity = (petId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(current =>
      current.map(item =>
        item.pet.id === petId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
