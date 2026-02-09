'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

type Props = {
  variantId: string;
  productTitle: string;
  price: number;
  thumbnail: string | null;
};

export function AddToCartSection({ variantId, productTitle, price, thumbnail }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart, setShowCart } = useCart();

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowCart(true);
    }, 400);
    addToCart(variantId, productTitle, price, quantity, thumbnail);
  };

  return (
    <>
      <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <span className="text-2xl sm:text-3xl font-bold text-zinc-900">
          €{price.toFixed(2)}
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer transition text-lg"
          >
            −
          </button>
          <span className="w-6 sm:w-8 text-center font-medium text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer transition text-lg"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full py-3.5 sm:py-4 rounded-full font-medium text-base sm:text-lg cursor-pointer transition-all duration-300 ${
          added
            ? 'bg-emerald-500 text-white'
            : 'bg-zinc-900 text-white hover:bg-zinc-700'
        }`}
      >
        {added ? '✓ Hinzugefügt!' : `In den Warenkorb · €${(price * quantity).toFixed(2)}`}
      </button>
    </>
  );
}
