import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, orderId, firstName } = await request.json();

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Email and orderId required' }, { status: 400 });
    }

    const sent = await sendOrderConfirmation(email, orderId, firstName);

    return NextResponse.json({ 
      success: sent,
      message: sent ? 'Bestellbestätigung gesendet' : 'Fehler beim Senden'
    });
  } catch (error) {
    console.error('Send confirmation error:', error);
    return NextResponse.json({ error: 'Failed to send confirmation' }, { status: 500 });
  }
}
