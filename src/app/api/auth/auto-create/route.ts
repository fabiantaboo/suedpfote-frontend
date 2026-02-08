import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_47735dfa80c2310e7a8b18d8c2e5ecf3df3c5a7767938647e98be59f8d2d9d9f';

// Generate a strong random password
function generatePassword(): string {
  const adjectives = ['Happy', 'Lucky', 'Swift', 'Brave', 'Calm', 'Cool', 'Kind', 'Bold', 'Quick', 'Smart'];
  const nouns = ['Lefty', 'Paw', 'Hand', 'Star', 'Wave', 'Link', 'Palm', 'Flow', 'South', 'Left'];
  const specials = ['#', '!', '@', '$', '&'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const special1 = specials[Math.floor(Math.random() * specials.length)];
  const special2 = specials[Math.floor(Math.random() * specials.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  
  return `${adj}${special1}${noun}${num}${special2}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const password = generatePassword();

    // Step 1: Register auth identity via /auth/customer/emailpass/register
    const registerRes = await fetch(`${MEDUSA_URL}/auth/customer/emailpass/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!registerRes.ok) {
      const error = await registerRes.json().catch(() => ({}));
      
      // Check if customer already exists (email in use)
      if (registerRes.status === 400 || registerRes.status === 422 || 
          error.message?.toLowerCase().includes('email') ||
          error.message?.toLowerCase().includes('exists') ||
          error.message?.toLowerCase().includes('identity')) {
        console.log(`Customer already exists: ${email}`);
        return NextResponse.json({ 
          success: true, 
          alreadyExists: true,
          message: 'Kundenkonto existiert bereits'
        });
      }
      
      console.error('Failed to register customer:', error);
      return NextResponse.json({ error: 'Failed to create customer', details: error }, { status: 500 });
    }

    const registerData = await registerRes.json();
    const token = registerData.token;
    
    console.log(`✅ Auth identity registered: ${email}`);

    // Step 2: Create actual customer record via /store/customers
    // This links the customer to the auth identity
    const createCustomerRes = await fetch(`${MEDUSA_URL}/store/customers`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        email,
        first_name: firstName || 'Kunde',
        last_name: lastName || '',
      }),
    });

    if (!createCustomerRes.ok) {
      const error = await createCustomerRes.json().catch(() => ({}));
      console.error('Failed to create customer record:', error);
      // Continue anyway - auth identity exists, customer might auto-create on login
    } else {
      console.log(`🎉 Customer record created: ${email}`);
    }

    // Send welcome email with password
    const emailSent = await sendWelcomeEmail(email, password, firstName);
    
    if (emailSent) {
      console.log(`📧 Welcome email sent to ${email}`);
    } else {
      console.error(`❌ Failed to send welcome email to ${email}`);
    }

    return NextResponse.json({ 
      success: true, 
      alreadyExists: false,
      emailSent,
      message: 'Kundenkonto erstellt. Zugangsdaten wurden per Email gesendet.'
    });
  } catch (error) {
    console.error('Auto-create customer error:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
