import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_47735dfa80c2310e7a8b18d8c2e5ecf3df3c5a7767938647e98be59f8d2d9d9f';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Medusa v2: POST /auth/customer/emailpass with email + password
    const authRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      return NextResponse.json(
        { message: 'E-Mail oder Passwort falsch' },
        { status: 401 }
      );
    }

    const authData = await authRes.json();
    console.log('Auth response:', JSON.stringify(authData));
    const token = authData.token;
    
    if (!token) {
      console.error('No token in response!');
      return NextResponse.json({ message: 'Kein Token erhalten' }, { status: 500 });
    }
    
    console.log('Setting cookie with token:', token.substring(0, 20) + '...');

    // Set token in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('medusa_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login fehlgeschlagen' },
      { status: 500 }
    );
  }
}
