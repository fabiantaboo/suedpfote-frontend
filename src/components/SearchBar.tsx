'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

const SEARCH_URL = '/api/search';

type SearchProduct = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  thumbnail: string | null;
  variants: { prices: { amount: number; currency_code: string }[] }[];
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const search = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(
        `${SEARCH_URL}?q=${encodeURIComponent(term)}`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      const data = await res.json();
      setResults(data.products || []);
      setIsOpen(true);
    } catch {
      setResults([]);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToProduct = (id: string) => {
    setIsOpen(false);
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
    router.push(`/produkt/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      navigateToProduct(results[activeIndex].id);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getPrice = (product: SearchProduct): number | null => {
    const variant = product.variants?.[0];
    const price = variant?.prices?.find(p => p.currency_code === 'eur') || variant?.prices?.[0];
    return price ? price.amount : null;
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center gap-2 rounded-full border transition-all duration-200 ${
        isFocused
          ? 'w-48 sm:w-64 bg-white border-zinc-300 shadow-sm'
          : 'w-8 sm:w-40 bg-zinc-50 border-zinc-200'
      }`}>
        <button
          onClick={() => {
            setIsFocused(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex-shrink-0 p-2 text-zinc-400 hover:text-zinc-600 transition"
          aria-label="Suche öffnen"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Suchen..."
          className={`bg-transparent text-sm text-zinc-700 placeholder-zinc-400 outline-none transition-all duration-200 ${
            isFocused ? 'w-full pr-2' : 'w-0 sm:w-full sm:pr-2'
          }`}
        />

        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
            className="flex-shrink-0 p-2 text-zinc-400 hover:text-zinc-600 transition"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl border border-zinc-200 shadow-xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block w-5 h-5 border-2 border-zinc-300 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto" role="listbox">
              {results.map((product, i) => {
                const price = getPrice(product);
                return (
                  <li
                    key={product.id}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      i === activeIndex ? 'bg-amber-50' : 'hover:bg-zinc-50'
                    } ${i > 0 ? 'border-t border-zinc-100' : ''}`}
                    onClick={() => navigateToProduct(product.id)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs">
                          Bild
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">{product.title}</p>
                      {product.subtitle && (
                        <p className="text-xs text-zinc-500 truncate">{product.subtitle}</p>
                      )}
                    </div>
                    {price !== null && (
                      <span className="flex-shrink-0 text-sm font-semibold text-zinc-700">
                        {formatPrice(price)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-zinc-500">
                Keine Produkte für &quot;{query}&quot; gefunden.
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Versuch es mit einem anderen Suchbegriff.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
