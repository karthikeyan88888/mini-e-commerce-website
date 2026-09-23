import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../types';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity = 1): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Please log in to add items to your cart' };
    }
    try {
      await api.post('/cart/items', { productId, quantity });
      await fetchCart();
      setIsDrawerOpen(true); // Open drawer on addition
      return { success: true, message: 'Added to cart' };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to cart';
      return { success: false, message: errorMsg };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) return;
    try {
      await api.put(`/cart/items/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (err: any) {
      console.error('Failed to update quantity', err);
      throw new Error(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (!user) return;
    try {
      await api.delete(`/cart/items/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete('/cart/clear');
      await fetchCart();
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
