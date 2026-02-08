import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY missing' },
      { status: 500 }
    );
  }

  try {
    const { amount, email, metadata } = await request.json();

    // Use fetch directly instead of Stripe SDK (avoids connection issues on Vercel)
    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'amount': String(Math.round(amount * 100)),
        'currency': 'eur',
        ...(email ? { 'receipt_email': email } : {}),
        'automatic_payment_methods[enabled]': 'true',
        ...(metadata ? Object.fromEntries(
          Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, String(v)])
        ) : {}),
      }).toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Stripe error' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      clientSecret: data.client_secret,
    });
  } catch (error: unknown) {
    console.error('Stripe error:', error);
    const message = error instanceof Error ? error.message : 'Payment failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
