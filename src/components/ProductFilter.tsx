'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/HomeClient';

const CATEGORIES = [
  { id: 'alle', label: 'Alle Produkte', emoji: '🤚' },
  { id: 'schreibwaren', label: 'Schreibwaren', emoji: '✍️' },
  { id: 'scheren', label: 'Scheren', emoji: '✂️' },
  { id: 'kueche', label: 'Küchenhelfer', emoji: '🍳' },
  { id: 'schule', label: 'Schulbedarf', emoji: '📐' },
  { id: 'haushalt', label: 'Haushalt', emoji: '🏠' },
  { id: 'tech', label: 'Technik', emoji: '🖱️' },
];

const KEYWORD_MAP: Record<string, string[]> = {
  schreibwaren: ['füller', 'fueller', 'stift', 'kugelschreiber', 'tintenroller', 'pen', 'schreib', 'tinte', 'bleistift', 'marker', 'textmarker', 'radierer', 'füllfeder'],
  scheren: ['schere', 'schneiden', 'scissors'],
  kueche: ['messer', 'schäler', 'schaeler', 'dosenöffner', 'dosenoeffner', 'küche', 'kueche', 'korkenzieher', 'sparschäler', 'gemüse', 'kitchen', 'kochen', 'pfannenwender'],
  schule: ['lineal', 'spitzer', 'heft', 'geodreieck', 'zirkel', 'college', 'block', 'mappe', 'schul', 'anspitzer'],
  haushalt: ['haushalt', 'bügel', 'buegel', 'öffner', 'oeffner', 'werkzeug', 'maßband', 'massband'],
  tech: ['maus', 'mouse', 'tastatur', 'keyboard', 'controller', 'gamepad', 'laptop', 'tech', 'computer', 'ergonomisch'],
};

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

function categorizeProduct(product: Product): string[] {
  const categories: string[] = [];

  // Check tags first
  if (product.tags && product.tags.length > 0) {
    const tagValues = product.tags.map((t) => t.value.toLowerCase());
    for (const [catId, keywords] of Object.entries(KEYWORD_MAP)) {
      if (tagValues.some((tag) => keywords.some((kw) => tag.includes(kw)))) {
        categories.push(catId);
      }
    }
  }

  // Keyword matching on title (always, as fallback or supplement)
  const titleLower = product.name.toLowerCase();
  const descLower = (product.description || '').toLowerCase();
  const text = `${titleLower} ${descLower}`;

  for (const [catId, keywords] of Object.entries(KEYWORD_MAP)) {
    if (!categories.includes(catId) && keywords.some((kw) => text.includes(kw))) {
      categories.push(catId);
    }
  }

  return categories.length > 0 ? categories : ['alle'];
}

export default function ProductFilter({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('alle');

  const productCategories = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const p of products) {
      map.set(p.id, categorizeProduct(p));
    }
    return map;
  }, [products]);

  // Only show categories that have products
  const availableCategories = useMemo(() => {
    const catSet = new Set<string>();
    for (const cats of productCategories.values()) {
      cats.forEach((c) => catSet.add(c));
    }
    return CATEGORIES.filter((c) => c.id === 'alle' || catSet.has(c.id));
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
