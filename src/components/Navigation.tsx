'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        {/* Logo + Brand LEFT */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo-icon.jpg"
            alt="Südpfote Logo"
            width={44}
            height={44}
            className="h-9 sm:h-10 w-auto"
            priority
          />
          <span className="text-[20px] sm:text-[22px] font-semibold text-black tracking-tight">Südpfote</span>
        </Link>

        {/* Nav CENTER — Desktop: direct category links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/kategorie/kinder" className="text-[14px] text-[#444] hover:text-black transition">Für Kinder</Link>
          <Link href="/kategorie/alltag" className="text-[14px] text-[#444] hover:text-black transition">Alltag</Link>
          <Link href="/kategorie/kueche" className="text-[14px] text-[#444] hover:text-black transition">Küche</Link>
          <Link href="/kategorie/schule" className="text-[14px] text-[#444] hover:text-black transition">Schule</Link>
          <Link href="/kategorie/sport" className="text-[14px] text-[#444] hover:text-black transition">Sport &amp; Freizeit</Link>
          <span className="w-px h-4 bg-gray-200" />
          <Link href="/story" className="text-[14px] text-[#444] hover:text-black transition">Über Südpfote</Link>
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
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Burger Menu — visible on ALL screen sizes */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black hover:text-[#444] transition"
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

      {/* Slide-out Menu — all screens */}
      {menuOpen && (
        <div className="bg-white border-t border-gray-100 px-6 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          <p className="text-[12px] font-semibold text-[#999] uppercase tracking-wider pt-2 pb-1">Unsere Produkte</p>
          <Link href="/kategorie/kinder" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Für Kinder</Link>
          <Link href="/kategorie/alltag" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Alltag</Link>
          <Link href="/kategorie/kueche" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Küche</Link>
          <Link href="/kategorie/schule" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Schule</Link>
          <Link href="/kategorie/sport" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Sport &amp; Freizeit</Link>
          <Link href="/kategorien" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Alle Produkte</Link>
          
          <div className="border-t border-gray-100 my-2" />
          <p className="text-[12px] font-semibold text-[#999] uppercase tracking-wider pt-2 pb-1">Über Südpfote</p>
          <Link href="/story" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Unsere Story</Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">FAQ</Link>
          <Link href="/versand" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Lieferung &amp; Versand</Link>
          <Link href="/kontakt" onClick={() => setMenuOpen(false)} className="block text-[15px] text-[#444] hover:text-black py-2">Kontakt</Link>
        </div>
      )}
    </nav>
  );
}
