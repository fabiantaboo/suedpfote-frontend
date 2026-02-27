'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export function CategoryAddToCart({
  variantId,
  productName,
  price,
  thumbnail,
}: {
  variantId: string;
  productName: string;
  price: number;
  thumbnail: string | null;
}) {
  const [added, setAdded] = useState(false);
  const { addToCart, setShowCart } = useCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowCart(true);
    }, 400);
    addToCart(variantId, productName, price, 1, thumbnail);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
        added
          ? 'bg-emerald-500 text-white scale-95'
          : 'bg-[#3D3329] text-white hover:bg-[#2C241E] hover:shadow-lg'
      }`}
    >
      {added ? '✓' : 'In den Warenkorb'}
    </button>
  );
}
