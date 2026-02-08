'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { LockIcon, SpinnerIcon } from './Icons';

interface CheckoutFormProps {
  amount: number;
  cartId: string | null;
  onSuccess: () => void;
  onBack: () => void;
}

export default function CheckoutForm({ amount, cartId, onSuccess, onBack }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/kasse?success=true&cart_id=${cartId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Zahlung fehlgeschlagen');
      setIsProcessing(false);
    } else {
      // Payment succeeded
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition disabled:opacity-50"
        >
          ← Zurück
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-4 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <SpinnerIcon className="h-5 w-5" />
              Wird verarbeitet...
            </>
          ) : (
            `Jetzt kaufen · €${amount.toFixed(2)}`
          )}
        </button>
      </div>

      <p className="mt-4 text-xs text-center text-zinc-400 flex items-center justify-center gap-1">
        <LockIcon className="w-4 h-4" /> Sichere Zahlung via Stripe
      </p>
    </form>
  );
}
