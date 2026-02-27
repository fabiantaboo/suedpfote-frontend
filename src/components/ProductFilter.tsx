'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/HomeClient';
import { CATEGORIES, ALL_CATEGORY, categorizeProduct } from '@/lib/categories';

// Map for the filter UI - combine shared categories with the "all" option
const FILTER_CATEGORIES = [
  { id: ALL_CATEGORY.slug, label: ALL_CATEGORY.label, emoji: ALL_CATEGORY.emoji },
  ...CATEGORIES.map((c) => ({ id: c.slug, label: c.label, emoji: c.emoji })),
];

type Product = {
  id: string;
  variantId: string;
  name: string;
  price: number;
  description: string;
  image: string | null;
  color: string;
  handle: string;
  tags?: { value: string }[];
};

export default function ProductFilter({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('alle');

  const productCategories = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const p of products) {
      map.set(p.id, categorizeProduct({ name: p.name, description: p.description, handle: p.handle, tags: p.tags }));
    }
    return map;
  }, [products]);

  // Only show categories that have products
  const availableCategories = useMemo(() => {
    const catSet = new Set<string>();
    for (const cats of productCategories.values()) {
      cats.forEach((c) => catSet.add(c));
    }
    return FILTER_CATEGORIES.filter((c) => c.id === 'alle' || catSet.has(c.id));
  }, [productCategories]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'alle') return products;
    return products.filter((p) => {
      const cats = productCategories.get(p.id) || [];
      return cats.includes(activeCategory);
    });
  }, [products, activeCategory, productCategories]);

  return (
    <>
      {/* Category Filter Pills */}
      <div className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center min-w-max pb-2">
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium
                whitespace-nowrap transition-all duration-200 cursor-pointer
                ${activeCategory === cat.id
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 scale-105'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }
              `}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.label}</span>
              {activeCategory === cat.id && cat.id !== 'alle' && (
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {filteredProducts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-4xl mb-4">🤷</p>
            <p className="text-zinc-500">Keine Produkte in dieser Kategorie gefunden.</p>
            <button
              onClick={() => setActiveCategory('alle')}
              className="mt-4 text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition cursor-pointer"
            >
              Alle Produkte anzeigen
            </button>
          </div>
        ) : (
          filteredProducts.map((product: Product, index: number) => (
            <ProductCard key={product.id} product={product} index={index} total={filteredProducts.length} />
          ))
        )}
      </div>
    </>
  );
}
