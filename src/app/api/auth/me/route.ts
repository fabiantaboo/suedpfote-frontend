import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_47735dfa80c2310e7a8b18d8c2e5ecf3df3c5a7767938647e98be59f8d2d9d9f';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('medusa_token')?.value;
    
    console.log('ME endpoint - token exists:', !!token);
    if (token) {
      console.log('Token starts with:', token.substring(0, 20) + '...');
    }

    if (!token) {
      return NextResponse.json({ customer: null }, { status: 401 });
    }

    // Medusa v2: GET /store/customers/me with Bearer token + publishable key
    const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    });

    console.log('Medusa /store/customers/me status:', res.status);
    const responseText = await res.text();
    console.log('Medusa response:', responseText);

    if (!res.ok) {
      return NextResponse.json({ customer: null }, { status: 401 });
    }
    
    const data = JSON.parse(responseText);
    return NextResponse.json({ customer: data.customer });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}
