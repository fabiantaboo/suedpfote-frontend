'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faHandPeace } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';

type NavigationProps = {
  onCartClick?: () => void;
};

export default function Navigation({ onCartClick }: NavigationProps) {
  const { totalItems } = useCart();
  const { customer, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image 
            src="/logo-t.png" 
            alt="Südpfote" 
            width={90} 
            height={30}
            className="group-hover:scale-105 transition-transform"
          />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/#produkte" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
            Produkte
          </Link>
          <Link href="/story" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
            Story
          </Link>
          <Link href="/faq" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
            FAQ
          </Link>
          
          <SearchBar />

          {/* Auth Link */}
          {!loading && (
            <Link
              href={customer ? '/konto' : '/login'}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition"
            >
              <FontAwesomeIcon 
                icon={customer ? faHandPeace : faUser} 
                className="w-4 h-4" 
              />
              {customer ? (
                <span className="hidden sm:inline">
                  {customer.first_name || 'Mein Konto'}
                </span>
              ) : (
                <span className="hidden sm:inline">Anmelden</span>
              )}
            </Link>
          )}
          
          {/* Cart */}
          {onCartClick ? (
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          ) : (
            <Link
              href="/kasse"
              className="relative flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
