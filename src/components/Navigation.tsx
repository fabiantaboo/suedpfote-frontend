'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faHandPeace, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';

type NavigationProps = {
  onCartClick?: () => void;
};

export default function Navigation({ onCartClick }: NavigationProps) {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const CartButton = () => (
    onCartClick ? (
      <button
        onClick={onCartClick}
        className="relative flex items-center text-[#6B5E52] hover:text-[#3D3329] transition"
      >
        <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E8935A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>
    ) : (
      <Link href="/kasse" className="relative flex items-center text-[#6B5E52] hover:text-[#3D3329] transition">
        <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E8935A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </Link>
    )
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#F5F0EB]/80 backdrop-blur-lg border-b border-[#EDE8E3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image 
            src="/logo-t.png" 
            alt="Südpfote" 
            width={90} 
            height={30}
            className="group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#produkte" className="text-sm text-[#6B5E52] hover:text-[#3D3329] transition">Produkte</Link>
          <Link href="/story" className="text-sm text-[#6B5E52] hover:text-[#3D3329] transition">Story</Link>
          <Link href="/faq" className="text-sm text-[#6B5E52] hover:text-[#3D3329] transition">FAQ</Link>
          <SearchBar />
          {!loading && (
            <Link href={customer ? '/konto' : '/login'} className="flex items-center gap-2 text-sm text-[#6B5E52] hover:text-[#3D3329] transition">
              <FontAwesomeIcon icon={customer ? faHandPeace : faUser} className="w-4 h-4" />
              <span>{customer ? (customer.first_name || 'Mein Konto') : 'Anmelden'}</span>
            </Link>
          )}
          <CartButton />
        </div>

        {/* Mobile: Search + Cart + Burger */}
        <div className="flex md:hidden items-center gap-3">
          <SearchBar />
          <CartButton />
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#6B5E52] hover:text-[#3D3329] p-1">
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F5F0EB] border-t border-[#EDE8E3] px-6 py-4 space-y-3">
          <Link href="/#produkte" onClick={() => setMenuOpen(false)} className="block text-sm text-[#6B5E52] hover:text-[#3D3329]">Produkte</Link>
          <Link href="/story" onClick={() => setMenuOpen(false)} className="block text-sm text-[#6B5E52] hover:text-[#3D3329]">Story</Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className="block text-sm text-[#6B5E52] hover:text-[#3D3329]">FAQ</Link>
          {!loading && (
            <Link href={customer ? '/konto' : '/login'} onClick={() => setMenuOpen(false)} className="block text-sm text-[#6B5E52] hover:text-[#3D3329]">
              {customer ? (customer.first_name || 'Mein Konto') : 'Anmelden'}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
