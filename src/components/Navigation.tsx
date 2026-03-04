'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type NavigationProps = {
  onCartClick?: () => void;
};

export default function Navigation({ onCartClick }: NavigationProps) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo LEFT */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#111]">
            <path d="M12 21c-1.5 0-7-3.5-7-9.5C5 8 7.5 6 9 6c1 0 2 .5 3 2 1-1.5 2-2 3-2 1.5 0 4 2 4 5.5 0 6-5.5 9.5-7 9.5z" fill="currentColor"/>
            <circle cx="7" cy="5" r="2.5" fill="currentColor"/>
            <circle cx="17" cy="5" r="2.5" fill="currentColor"/>
            <circle cx="4" cy="9" r="2" fill="currentColor"/>
            <circle cx="20" cy="9" r="2" fill="currentColor"/>
          </svg>
          <span className="text-lg font-bold tracking-wide text-black" style={{ fontFamily: "'Manrope', sans-serif" }}>
            SÜDPFOTE
          </span>
        </Link>

        {/* Nav CENTER — Desktop */}
        <div className="hidden md:flex items-center gap-9">
          <Link href="/kategorie/kinder" className="text-[15px] text-[#444] hover:text-black transition">
            Für Kinder
          </Link>
          <Link href="/kategorie/schule" className="text-[15px] text-[#444] hover:text-black transition">
            Schule
          </Link>
          <button className="text-[15px] text-[#444] hover:text-black transition flex items-center gap-1">
            Alltag
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mt-0.5">
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Link href="/kategorie/kueche" className="text-[15px] text-[#444] hover:text-black transition">
            Küche
          </Link>
          <Link href="/kategorie/sport" className="text-[15px] text-[#444] hover:text-black transition">
            Sport
          </Link>
        </div>

        {/* Icons RIGHT */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-black hover:text-[#444] transition"
            aria-label="Suche"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          {/* Cart Icon */}
          <button
            onClick={handleCartClick}
            className="relative text-black hover:text-[#444] transition"
            aria-label="Warenkorb"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0F2E4F] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-black hover:text-[#444] transition"
            aria-label="Menü"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Link href="/kategorie/kinder" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-1">Für Kinder</Link>
          <Link href="/kategorie/schule" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-1">Schule</Link>
          <Link href="/kategorie/alltag" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-1">Alltag</Link>
          <Link href="/kategorie/kueche" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-1">Küche</Link>
          <Link href="/kategorie/sport" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-1">Sport</Link>
        </div>
      )}
    </nav>
  );
}
