'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  variantId: string;
  name: string;
  price: number;
  description: string;
  image: string | null;
  color: string;
  handle: string;
};

export function ProductCard({ product, index, total }: { product: Product; index: number; total: number }) {
  const [added, setAdded] = useState(false);
  const { addToCart, setShowCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowCart(true);
    }, 400);
    addToCart(product.variantId, product.name, product.price, 1, product.image);
  };

  return (
    <Link href={`/produkt/${product.handle || product.id}`} className="group block">
      <article className="relative">
        {index === 0 && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            BESTSELLER
          </span>
        )}
        {index === total - 1 && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
            NEU
          </span>
        )}

        <div className={`aspect-square rounded-3xl ${product.color} flex items-center justify-center mb-5 overflow-hidden p-8 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-zinc-200 relative`}>
          {product.image ? (
            <img
              src={product.image}
              alt={`${product.name} - Linkshänder Produkt kaufen`}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">🤚</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Linkshänder</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-400 text-xs">★</span>
              ))}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-zinc-600 transition">
            {product.name}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between pt-4">
            <div>
              <span className="text-xl font-bold text-zinc-900">€{product.price.toFixed(2)}</span>
              <span className="text-xs text-zinc-400 ml-2">inkl. MwSt.</span>
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                added
                  ? 'bg-emerald-500 text-white scale-95'
                  : 'bg-zinc-900 text-white hover:bg-zinc-700 hover:scale-105'
              }`}
            >
              {added ? '✓ Hinzugefügt' : 'In den Warenkorb'}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
