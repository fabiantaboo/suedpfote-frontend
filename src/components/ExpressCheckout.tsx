'use client';

import { useState, useCallback, Component, ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

const FREE_SHIPPING_THRESHOLD = 39;
const SHIPPING_COST = 2.99;

function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

function getTotalWithShipping(subtotal: number): number {
  return subtotal + getShippingCost(subtotal);
}

// Error Boundary to prevent crashes
class ExpressCheckoutErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface ExpressCheckoutProps {
  price: number;
  productTitle: string;
  variantId: string;
}

function ExpressCheckoutForm({ price, productTitle, variantId }: ExpressCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const shipping = getShippingCost(price);
  const total = getTotalWithShipping(price);

  const onConfirm = useCallback(async () => {
    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Fehler bei der Zahlung');
      return;
    }

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        metadata: {
          product: productTitle,
          variant_id: variantId,
          subtotal: price.toFixed(2),
          shipping: shipping.toFixed(2),
        },
      }),
    });
    const { clientSecret, error: serverError } = await res.json();

    if (serverError) {
      setError(serverError);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/kasse?success=true`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'Zahlung fehlgeschlagen');
    }
  }, [stripe, elements, price, total, shipping, productTitle, variantId]);

  return (
    <div className="w-full">
      {shipping > 0 && (
        <p className="text-xs text-zinc-400 mb-2 text-center">
          zzgl. {SHIPPING_COST.toFixed(2).replace('.', ',')} € Versand · Ab {FREE_SHIPPING_THRESHOLD} € versandkostenfrei
        </p>
      )}
      <ExpressCheckoutElement
        onConfirm={onConfirm}
        onReady={() => setReady(true)}
        options={{
          paymentMethods: {
            amazonPay: 'auto' as any,
            applePay: 'auto' as any,
            googlePay: 'auto' as any,
            link: 'never' as any,
          },
        }}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

export default function ExpressCheckout({ price, productTitle, variantId }: ExpressCheckoutProps) {
  if (price <= 0) return null;

  const total = getTotalWithShipping(price);

  return (
    <ExpressCheckoutErrorBoundary>
      <Elements
        stripe={stripePromise}
        options={{
          mode: 'payment',
          amount: Math.round(total * 100),
          currency: 'eur',
          appearance: {
            theme: 'stripe',
            variables: {
              borderRadius: '12px',
            },
          },
        }}
      >
        <ExpressCheckoutForm
          price={price}
          productTitle={productTitle}
          variantId={variantId}
        />
      </Elements>
    </ExpressCheckoutErrorBoundary>
  );
}
