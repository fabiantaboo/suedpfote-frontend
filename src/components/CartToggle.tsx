'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import CartDrawer from '@/components/CartDrawer';

export default function CartToggle({ children }: { children: React.ReactNode }) {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <Navigation onCartClick={() => setShowCart(true)} />
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
      {children}
    </>
  );
}
