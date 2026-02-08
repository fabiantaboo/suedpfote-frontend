'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

type Order = {
  id: string;
  display_id: number;
  created_at: string;
  total: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
};

export default function KontoPage() {
  const router = useRouter();
  const { customer, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login');
    }
  }, [authLoading, customer, router]);

  useEffect(() => {
    if (customer) {
      fetchOrders();
      fetchLoyaltyPoints();
    }
  }, [customer]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/auth/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchLoyaltyPoints = async () => {
    if (!customer?.email) return;
    try {
      const res = await fetch(`/api/loyalty?email=${encodeURIComponent(customer.email)}`);
      if (res.ok) {
        const data = await res.json();
        setLoyaltyPoints(data.points || 0);
      }
    } catch (error) {
      console.error('Failed to fetch loyalty points:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full" />
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const pointsValue = (loyaltyPoints / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          
          {/* Simple Header */}
          <div className="mb-12">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Hey {customer.first_name || 'du'}! 👋
            </h1>
            <p className="text-zinc-500 mt-1">{customer.email}</p>
          </div>

          {/* Quick Stats - Simple text, no boxes */}
          <div className="mb-12 flex gap-8">
            <div>
              <span className="text-3xl font-semibold text-zinc-900">{loyaltyPoints}</span>
              <p className="text-sm text-zinc-500">Punkte (€{pointsValue})</p>
            </div>
            <div>
              <span className="text-3xl font-semibold text-zinc-900">{orders.length}</span>
              <p className="text-sm text-zinc-500">Bestellung{orders.length !== 1 ? 'en' : ''}</p>
            </div>
          </div>

          {/* Orders Section */}
          <div className="mb-12">
            <h2 className="text-lg font-medium text-zinc-900 mb-4">Deine Bestellungen</h2>
            
            {loadingOrders ? (
              <p className="text-zinc-400">Lädt...</p>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-zinc-500 mb-4">Noch keine Bestellungen.</p>
                <Link href="/" className="text-zinc-900 underline hover:no-underline">
                  Jetzt stöbern →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-zinc-200 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-medium text-zinc-900">
                          #{order.display_id}
                        </span>
                        <span className="text-zinc-400 text-sm ml-2">
                          {new Date(order.created_at).toLocaleDateString('de-DE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        order.payment_status === 'captured' || order.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.payment_status === 'captured' || order.payment_status === 'paid' ? 'Bezahlt' : 'Offen'}
                      </span>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className="text-sm text-zinc-600 mb-3">
                        {order.items.map((item, i) => (
                          <span key={item.id}>
                            {item.quantity}× {item.title}
                            {i < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-right font-medium text-zinc-900">
                      €{(order.total / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Points Info - Simple */}
          <div className="mb-12 p-5 bg-zinc-50 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-medium text-zinc-900 mb-2">So sammelst du Punkte</h2>
                <p className="text-sm text-zinc-600">
                  10 Punkte pro €1. Ab €100 Einkauf: doppelte Punkte!<br/>
                  100 Punkte = €1 Rabatt.
                </p>
              </div>
              <Link
                href="/punkte"
                className="text-sm font-medium text-zinc-900 hover:underline whitespace-nowrap"
              >
                Punkte einlösen →
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 py-3 text-center bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
            >
              Weiter shoppen
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 text-zinc-500 hover:text-zinc-900 transition"
            >
              Abmelden
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
