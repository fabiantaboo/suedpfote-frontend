import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is not set!');
    return NextResponse.json(
      { error: 'Stripe is not configured. STRIPE_SECRET_KEY missing.' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const { amount, email, metadata } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      receipt_email: email || undefined,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error('Stripe error:', error);
    const message = error instanceof Error ? error.message : 'Payment failed';
    return NextResponse.json(
      { error: message, keyPrefix: secretKey.substring(0, 10) + '...' },
      { status: 500 }
    );
  }
}
