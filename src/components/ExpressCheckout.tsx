'use client';

import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface ExpressCheckoutProps {
  price: number;
  productTitle: string;
  variantId: string;
}

function ExpressCheckoutForm({ price, productTitle, variantId }: ExpressCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const onConfirm = useCallback(async () => {
    if (!stripe || !elements) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Fehler bei der Zahlung');
      return;
    }

    // Create PaymentIntent on server
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: price,
        metadata: { product: productTitle, variant_id: variantId },
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
  }, [stripe, elements, price, productTitle, variantId]);

  return (
    <div className="w-full">
      <ExpressCheckoutElement
        onConfirm={onConfirm}
        options={{
          paymentMethods: {
            amazonPay: 'always' as any,
            applePay: 'never' as any,
            googlePay: 'never' as any,
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

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: Math.round(price * 100),
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
  );
}
