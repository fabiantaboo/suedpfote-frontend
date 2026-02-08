'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import FreeShippingProgress from './FreeShippingProgress';
import { CartIcon, HandIcon, CloseIcon } from './Icons';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-zinc-900">Warenkorb ({totalItems})</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-zinc-100 rounded-full transition"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                <CartIcon className="w-12 h-12 text-zinc-400" />
              </div>
              <p className="text-zinc-900 font-medium mb-2">Noch leer hier</p>
              <p className="text-zinc-500 text-sm">Füge Produkte hinzu, die für dich gemacht sind.</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl"
                  >
                    <div className="w-20 h-20 rounded-xl bg-zinc-100 flex items-center justify-center overflow-hidden p-3">
                      {item.image ? (
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <HandIcon className="w-8 h-8 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-zinc-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-zinc-500">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Free Shipping Progress */}
              <div className="mt-4">
                <FreeShippingProgress currentTotal={totalPrice} />
              </div>

              <div className="border-t border-zinc-100 pt-6 mt-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-zinc-500">Zwischensumme</span>
                  <span className="font-bold text-zinc-900">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                <Link 
                  href="/kasse"
                  onClick={onClose}
                  className="w-full py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition text-lg flex items-center justify-center"
                >
                  Zur Kasse →
                </Link>
                <button 
                  onClick={onClose}
                  className="w-full py-3 text-zinc-500 hover:text-zinc-900 transition text-sm"
                >
                  Weiter einkaufen
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
