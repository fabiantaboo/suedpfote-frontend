'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as medusa from '@/lib/medusa';

export type CartItem = {
  id: string; // line item id
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

type CartContextType = {
  cart: CartItem[];
  cartId: string | null;
  isLoading: boolean;
  addToCart: (variantId: string, name: string, price: number, quantity: number, image: string | null) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  // Checkout functions
  updateShippingAddress: (address: medusa.Address, email: string) => Promise<void>;
  initializePayment: (email?: string) => Promise<string | null>; // Returns client_secret
  completeOrder: () => Promise<string | null>; // Returns order_id
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'suedpfote-cart-id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [paymentCollectionId, setPaymentCollectionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Transform Medusa cart to our format
  const transformCart = useCallback((medusaCart: medusa.Cart | null): CartItem[] => {
    if (!medusaCart || !medusaCart.items) {
      return [];
    }
    return medusaCart.items.map(item => ({
      id: item.id,
      variantId: item.variant_id,
      name: item.title,
      price: item.unit_price, // Medusa v2 uses full precision (EUR, not cents)
      quantity: item.quantity,
      image: item.thumbnail || null,
    }));
  }, []);

  // Load cart from Medusa on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      
      if (savedCartId) {
        const existingCart = await medusa.getCart(savedCartId);
        if (existingCart && existingCart.items.length > 0) {
          setCartId(savedCartId);
          setCart(transformCart(existingCart));
          if (existingCart.payment_collection) {
            setPaymentCollectionId(existingCart.payment_collection.id);
          }
        } else {
          // Cart expired or empty, clear it
          localStorage.removeItem(CART_ID_KEY);
        }
      }
      setIsLoading(false);
    };

    loadCart();
  }, [transformCart]);

  const refreshCart = useCallback(async () => {
    if (!cartId) return;
    const medusaCart = await medusa.getCart(cartId);
    if (medusaCart) {
      setCart(transformCart(medusaCart));
    }
  }, [cartId, transformCart]);

  const addToCart = useCallback(async (
    variantId: string,
    name: string,
    price: number,
    quantity: number,
    image: string | null
  ) => {
    // Optimistic update: show item in cart immediately
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing) {
        return prev.map(item =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: `temp-${Date.now()}`, variantId, name, price, quantity, image }];
    });

    // Sync with Medusa in background
    try {
      let currentCartId = cartId;

      if (!currentCartId) {
        const newCart = await medusa.createCart();
        currentCartId = newCart.id;
        setCartId(currentCartId);
        localStorage.setItem(CART_ID_KEY, currentCartId);
      }

      const updatedCart = await medusa.addLineItem(currentCartId, variantId, quantity);
      setCart(transformCart(updatedCart));
    } catch (error) {
      console.error('Failed to sync cart with server:', error);
      // Optimistic state stays - user sees their item
    }
  }, [cartId, transformCart]);

  const removeFromCart = useCallback(async (lineItemId: string) => {
    if (!cartId) return;
    
    setIsLoading(true);
    try {
      const updatedCart = await medusa.removeLineItem(cartId, lineItemId);
      setCart(transformCart(updatedCart));
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setCart(prev => prev.filter(item => item.id !== lineItemId));
    } finally {
      setIsLoading(false);
    }
  }, [cartId, transformCart]);

  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (!cartId) return;

    if (quantity <= 0) {
      await removeFromCart(lineItemId);
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = await medusa.updateLineItem(cartId, lineItemId, quantity);
      setCart(transformCart(updatedCart));
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setCart(prev =>
        prev.map(item => (item.id === lineItemId ? { ...item, quantity } : item))
      );
    } finally {
      setIsLoading(false);
    }
  }, [cartId, transformCart, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartId(null);
    setPaymentCollectionId(null);
    localStorage.removeItem(CART_ID_KEY);
  }, []);

  const updateShippingAddress = useCallback(async (address: medusa.Address, email: string) => {
    if (!cartId) throw new Error('No cart');

    // Step 1: Update cart with address + email
    await medusa.updateCart(cartId, {
      email,
      shipping_address: address,
      billing_address: address,
    });

    // Step 2: Get shipping options and add one
    const shippingOptions = await medusa.getShippingOptions(cartId);
    if (shippingOptions.length > 0) {
      await medusa.addShippingMethod(cartId, shippingOptions[0].id);
    }

    // Skip refreshCart — caller will proceed to payment immediately
  }, [cartId]);

  const initializePayment = useCallback(async (email?: string): Promise<string | null> => {
    if (!cartId) throw new Error('No cart');

    try {
      // Use Medusa payment flow (works with Stripe plugin)
      console.log('[Checkout] Creating payment collection for cart:', cartId);
      const { payment_collection } = await medusa.createPaymentCollection(cartId);
      setPaymentCollectionId(payment_collection.id);

      console.log('[Checkout] Initializing Stripe payment session...');
      const clientSecret = await medusa.initializePaymentSession(payment_collection.id, 'pp_stripe_stripe');
      
      if (!clientSecret) {
        throw new Error('No client secret returned from Medusa');
      }
      
      console.log('[Checkout] Got client secret from Medusa/Stripe');
      return clientSecret;
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      throw error;
    }
  }, [cartId]);

  const completeOrder = useCallback(async (): Promise<string | null> => {
    if (!cartId) throw new Error('No cart');

    try {
      const result = await medusa.completeCart(cartId);
      clearCart();
      return result.order.id;
    } catch (error) {
      console.error('Failed to complete order:', error);
      throw error;
    }
  }, [cartId, clearCart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice,
        updateShippingAddress,
        initializePayment,
        completeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
