'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import Navigation from '@/components/Navigation';
import CheckoutForm from '@/components/CheckoutForm';
import FreeShippingProgress from '@/components/FreeShippingProgress';
import LoyaltyPoints, { addLoyaltyPoints } from '@/components/LoyaltyPoints';
import { CheckIcon, CartIcon, HandIcon, LockIcon, CreditCardIcon, TrashIcon, SpinnerIcon } from '@/components/Icons';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, cartId, updateQuantity, removeFromCart, totalPrice, clearCart, updateShippingAddress, initializePayment, completeOrder, isLoading: cartLoading } = useCart();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasProcessedSuccess = useRef(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'DE',
  });

  const shippingCost = totalPrice >= 39 ? 0 : 2.99;
  const total = totalPrice + shippingCost;

  // Check for success redirect from Stripe
  useEffect(() => {
    const handleSuccess = async () => {
      if (searchParams.get('success') === 'true' && !hasProcessedSuccess.current) {
        hasProcessedSuccess.current = true;
        
        // Get cart_id from URL (passed through Stripe redirect)
        const redirectCartId = searchParams.get('cart_id');
        
        // Restore customer data from localStorage (saved before Stripe redirect)
        const savedCustomerData = localStorage.getItem('checkout_customer_data');
        const customerData = savedCustomerData ? JSON.parse(savedCustomerData) : null;
        
        let completedOrderId = 'SP-' + Date.now();
        
        if (redirectCartId) {
          try {
            // Complete the order in Medusa using cart_id from URL
            console.log('[Checkout] Redirect success, completing order for cart:', redirectCartId);
            const result = await fetch(`/api/medusa/carts/${redirectCartId}/complete`, {
              method: 'POST',
            });
            const data = await result.json();
            completedOrderId = data.order?.id || completedOrderId;
            console.log('[Checkout] Order completed:', completedOrderId);
          } catch (err) {
            console.error('Failed to complete order on redirect:', err);
          }
        }
        
        setOrderId(completedOrderId);
        
        // Send emails using saved customer data
        if (customerData?.email) {
          console.log('[Checkout] Sending emails to:', customerData.email);
          
          // Auto-create customer account (password sent via email)
          try {
            const autoCreateRes = await fetch('/api/auth/auto-create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: customerData.email,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
              }),
            });
            const autoCreateData = await autoCreateRes.json();
            console.log('[Checkout] Auto-create customer:', autoCreateData);
          } catch (err) {
            console.error('Failed to auto-create customer:', err);
          }
          
          // Send order confirmation email
          try {
            await fetch('/api/order/send-confirmation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: customerData.email,
                orderId: completedOrderId,
                firstName: customerData.firstName,
              }),
            });
            console.log('[Checkout] Order confirmation email sent');
          } catch (err) {
            console.error('Failed to send order confirmation:', err);
          }
          
          // Award loyalty points
          try {
            await addLoyaltyPoints(customerData.email, customerData.total || 0);
            console.log('[Checkout] Loyalty points awarded');
          } catch (err) {
            console.error('Failed to award points:', err);
          }
          
          // Clear saved customer data
          localStorage.removeItem('checkout_customer_data');
        }
        
        clearCart();
        setStep('success');
      }
    };
    handleSuccess();
  }, [searchParams, clearCart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // Pre-initialize payment as soon as user reaches shipping step
  const paymentInitRef = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    if (step === 'shipping' && !clientSecret && !paymentInitRef.current && cartId) {
      console.log('[Checkout] Pre-initializing payment while user fills shipping form...');
      paymentInitRef.current = initializePayment().catch(err => {
        console.error('[Checkout] Pre-init payment failed:', err);
        return null;
      });
    }
  }, [step, clientSecret, cartId, initializePayment]);

  const handleShippingSubmit = async () => {
    setIsLoadingPayment(true);
    setError(null);

    try {
      // Save customer data to localStorage before Stripe redirect
      localStorage.setItem('checkout_customer_data', JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        total: total,
      }));

      // REUSE existing clientSecret if we have one (prevents duplicate PaymentIntents!)
      if (clientSecret) {
        console.log('[Checkout] Reusing existing clientSecret');
        // Still update shipping in background
        updateShippingAddress(
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address_1: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            country_code: formData.country.toLowerCase(),
          },
          formData.email
        ).catch(console.error);
        setStep('payment');
      } else {
        // Update shipping in background
        updateShippingAddress(
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address_1: formData.address,
            city: formData.city,
            postal_code: formData.postalCode,
            country_code: formData.country.toLowerCase(),
          },
          formData.email
        ).catch(console.error);

        // Use pre-initialized payment if available, otherwise init now
        const secret = paymentInitRef.current 
          ? await paymentInitRef.current 
          : await initializePayment(formData.email);
        
        if (secret) {
          setClientSecret(secret);
          setStep('payment');
        } else {
          throw new Error('Keine Zahlungsmethode verfügbar');
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Checkout');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Complete the order in Medusa - this creates the Order record
      console.log('[Checkout] Payment successful, completing order in Medusa...');
      const orderId = await completeOrder();
      console.log('[Checkout] Order completed:', orderId);
      
      setOrderId(orderId || 'SP-' + Date.now());
      
      // Award loyalty points via API
      if (formData.email) {
        try {
          const earnedPoints = await addLoyaltyPoints(formData.email, total);
          console.log(`Awarded ${earnedPoints} loyalty points to ${formData.email}!`);
        } catch (err) {
          console.error('Failed to award points:', err);
        }
        
        // Auto-create customer account (password sent via email)
        try {
          const autoCreateRes = await fetch('/api/auth/auto-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
            }),
          });
          const autoCreateData = await autoCreateRes.json();
          console.log('[Checkout] Auto-create customer:', autoCreateData);
        } catch (err) {
          console.error('Failed to auto-create customer:', err);
        }
        
        // Send order confirmation email
        try {
          await fetch('/api/order/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              orderId: orderId || 'SP-' + Date.now(),
              firstName: formData.firstName,
            }),
          });
          console.log('[Checkout] Order confirmation email sent');
        } catch (err) {
          console.error('Failed to send order confirmation:', err);
        }
      }
      
      setStep('success');
    } catch (err) {
      console.error('Failed to complete order:', err);
      // Still show success to customer - payment went through
      setOrderId('SP-' + Date.now());
      
      // Still try to create customer account even if order completion failed
      // (Order might already exist from redirect race condition)
      if (formData.email) {
        try {
          await fetch('/api/auth/auto-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
            }),
          });
        } catch (e) {
          console.error('Failed to auto-create customer in catch:', e);
        }
        
        // Send order confirmation email
        try {
          await fetch('/api/order/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              orderId: 'SP-' + Date.now(),
              firstName: formData.firstName,
            }),
          });
        } catch (e) {
          console.error('Failed to send order confirmation in catch:', e);
        }
      }
      
      clearCart();
      setStep('success');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckIcon className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">
              Bestellung erfolgreich!
            </h1>
            {orderId && (
              <p className="text-sm text-zinc-500 mb-2">
                Bestellnummer: <span className="font-mono">{orderId}</span>
              </p>
            )}
            <p className="text-zinc-600 mb-4">
              Vielen Dank für deine Bestellung! Du erhältst in Kürze eine Bestätigungs-E-Mail.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
              <p className="text-amber-800 text-sm">
                <strong>🎉 Dein Kundenkonto wurde erstellt!</strong><br />
                Die Zugangsdaten werden dir per E-Mail zugeschickt. 
                Damit kannst du deine Bestellungen verfolgen und Punkte einlösen.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
            >
              Weiter einkaufen
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (cart.length === 0 && !cartLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CartIcon className="w-12 h-12 text-zinc-400" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-4">
              Dein Warenkorb ist leer
            </h1>
            <p className="text-zinc-600 mb-8">
              Füge Produkte hinzu, die für dich gemacht sind.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
            >
              Produkte entdecken
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navigation />
      
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-900 mb-8">Kasse</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-12">
            <button
              onClick={() => setStep('cart')}
              className={`flex items-center gap-2 ${step === 'cart' ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'cart' ? 'bg-zinc-900 text-white' : 'bg-zinc-200'}`}>1</span>
              Warenkorb
            </button>
            <div className="flex-1 h-px bg-zinc-200" />
            <button
              onClick={() => cart.length > 0 && setStep('shipping')}
              className={`flex items-center gap-2 ${step === 'shipping' || step === 'payment' ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'shipping' || step === 'payment' ? 'bg-zinc-900 text-white' : 'bg-zinc-200'}`}>2</span>
              Versand
            </button>
            <div className="flex-1 h-px bg-zinc-200" />
            <button
              className={`flex items-center gap-2 ${step === 'payment' ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 'payment' ? 'bg-zinc-900 text-white' : 'bg-zinc-200'}`}>3</span>
              Bezahlung
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 'cart' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-zinc-900 mb-6">Warenkorb</h2>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
                        <div className="w-20 h-20 rounded-xl bg-zinc-100 flex items-center justify-center p-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <HandIcon className="w-8 h-8 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-zinc-900">{item.name}</h3>
                          <p className="text-zinc-500">€{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100"
                          >
                            −
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 transition"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep('shipping')}
                    className="w-full mt-6 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
                  >
                    Weiter zur Lieferung →
                  </button>
                </div>
              )}

              {step === 'shipping' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-zinc-900 mb-6">Lieferadresse</h2>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleShippingSubmit(); }}>
                    <div>
                      <label className="block text-sm text-zinc-600 mb-1">E-Mail *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                        placeholder="deine@email.de"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-600 mb-1">Vorname *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-600 mb-1">Nachname *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-600 mb-1">Adresse *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                        placeholder="Straße und Hausnummer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-600 mb-1">PLZ *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-600 mb-1">Stadt *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-600 mb-1">Land</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-zinc-400"
                      >
                        <option value="DE">Deutschland</option>
                        <option value="AT">Österreich</option>
                        <option value="CH">Schweiz</option>
                      </select>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={() => setStep('cart')}
                        className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition"
                      >
                        ← Zurück
                      </button>
                      <button
                        type="submit"
                        disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.postalCode || isLoadingPayment}
                        className="flex-1 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoadingPayment ? (
                          <>
                            <SpinnerIcon className="h-5 w-5" />
                            Wird vorbereitet...
                          </>
                        ) : (
                          'Weiter zur Bezahlung →'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 'payment' && clientSecret && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-zinc-900 mb-6">Bezahlung</h2>
                  <Elements 
                    stripe={stripePromise} 
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#18181b',
                          colorBackground: '#ffffff',
                          colorText: '#18181b',
                          colorDanger: '#ef4444',
                          fontFamily: 'system-ui, sans-serif',
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <CheckoutForm 
                      amount={total}
                      cartId={cartId}
                      onSuccess={handlePaymentSuccess}
                      onBack={() => setStep('shipping')}
                    />
                  </Elements>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-zinc-900 mb-6">Bestellübersicht</h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-zinc-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Zwischensumme</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Versand</span>
                    <span>{shippingCost === 0 ? <span className="text-emerald-600">Kostenlos</span> : `€${shippingCost.toFixed(2)}`}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                <div className="mt-4">
                  <FreeShippingProgress currentTotal={totalPrice} compact />
                </div>

                <div className="border-t border-zinc-100 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamt</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">inkl. MwSt.</p>
                </div>

                {/* Loyalty Points */}
                <div className="mt-4">
                  <LoyaltyPoints orderTotal={total} customerEmail={formData.email || undefined} />
                </div>

                {/* Trust badges */}
                <div className="mt-6 pt-6 border-t border-zinc-100">
                  <div className="flex flex-wrap gap-4 justify-center text-sm text-zinc-500">
                    <span className="flex items-center gap-2">
                      <LockIcon className="w-5 h-5" /> SSL-verschlüsselt
                    </span>
                    <span className="flex items-center gap-2">
                      <CreditCardIcon className="w-5 h-5" /> Stripe-gesichert
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
