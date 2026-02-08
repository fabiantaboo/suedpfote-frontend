'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import LoyaltyPoints from '@/components/LoyaltyPoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faShoppingCart, faRocket, faGift, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function LoyaltyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      if (data.customer?.email) {
        setIsLoggedIn(true);
        setCustomerEmail(data.customer.email);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemed = (code: string) => {
    setRedeemedCode(code);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCoins} className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">
              Treuepunkte
            </h1>
            <p className="text-zinc-600 text-lg">
              Sammle Punkte bei jedem Einkauf und löse sie für Rabatte ein!
            </p>
          </div>

          {!isLoggedIn ? (
            <>
              {/* Login Prompt */}
              <div className="bg-zinc-50 rounded-2xl p-8 mb-8 text-center">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                  Melde dich an, um deine Punkte zu sehen
                </h2>
                <p className="text-zinc-600 mb-6">
                  Mit deinem Konto kannst du deinen Punktestand einsehen und Gutscheine einlösen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/login?redirect=/punkte"
                    className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
                  >
                    Anmelden
                  </Link>
                  <Link
                    href="/konto"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-900 rounded-full font-medium border border-zinc-200 hover:border-zinc-300 transition"
                  >
                    Konto erstellen
                  </Link>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-zinc-50 rounded-2xl p-8">
                <h3 className="font-semibold text-zinc-900 mb-6 text-center">So funktioniert's</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Einkaufen</p>
                      <p className="text-zinc-600">10 Punkte pro €1 Einkauf</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faRocket} className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">2x Boost ab €100</p>
                      <p className="text-zinc-600">Bestelle für €100+ und erhalte doppelte Punkte!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faGift} className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Einlösen</p>
                      <p className="text-zinc-600">Tausche Punkte gegen Gutscheine ein</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Logged in - show points */}
              <div className="bg-zinc-50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-zinc-500 text-center">
                  Eingeloggt als <span className="font-medium text-zinc-700">{customerEmail}</span>
                </p>
              </div>

              <LoyaltyPoints 
                orderTotal={0} 
                customerEmail={customerEmail}
                showEarnings={false}
                showRedemption={true}
                onRedeemed={handleRedeemed}
              />

              {redeemedCode && (
                <div className="mt-6 p-6 bg-emerald-50 rounded-2xl text-center">
                  <p className="text-emerald-700 font-medium mb-4">
                    🎉 Gutscheincode: <span className="font-mono font-bold">{redeemedCode}</span>
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
                  >
                    Jetzt mit Gutschein einkaufen →
                  </Link>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/konto"
                  className="text-zinc-500 hover:text-zinc-900 transition text-sm"
                >
                  ← Zurück zum Konto
                </Link>
              </div>
            </>
          )}

          {/* Rewards Overview */}
          <div className="mt-12 bg-zinc-50 rounded-2xl p-8">
            <h3 className="font-semibold text-zinc-900 mb-6 text-center">Belohnungsstufen</h3>
            <div className="grid gap-3">
              {[
                { points: 5000, discount: 5 },
                { points: 10000, discount: 10 },
                { points: 25000, discount: 25 },
                { points: 50000, discount: 50 },
              ].map((tier, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faGift} className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-zinc-900">{tier.points.toLocaleString()} Punkte</span>
                  </div>
                  <span className="font-bold text-emerald-600">€{tier.discount} Gutschein</span>
                </div>
              ))}
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-10">
            <Link 
              href="/" 
              className="text-zinc-500 hover:text-zinc-900 transition"
            >
              ← Zurück zum Shop
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
