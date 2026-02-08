import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_47735dfa80c2310e7a8b18d8c2e5ecf3df3c5a7767938647e98be59f8d2d9d9f';
const ADMIN_EMAIL = 'admin@suedpfote.de';
const ADMIN_PASSWORD = 'Suedpfote2026!';

async function getAdminToken(): Promise<string | null> {
  try {
    const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token;
  } catch {
    return null;
  }
}

async function getCustomerEmail(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${MEDUSA_URL}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.customer?.email || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('medusa_token')?.value;

    if (!token) {
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    // Get customer email from their token
    const customerEmail = await getCustomerEmail(token);
    
    if (!customerEmail) {
      console.log('[Orders] Could not get customer email');
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    console.log(`[Orders] Fetching orders for: ${customerEmail}`);

    // Get admin token to query orders by email
    const adminToken = await getAdminToken();
    
    if (!adminToken) {
      console.error('[Orders] Could not get admin token');
      return NextResponse.json({ orders: [] }, { status: 500 });
    }

    // Query orders by email using admin API
    const res = await fetch(`${MEDUSA_URL}/admin/orders?q=${encodeURIComponent(customerEmail)}&limit=50&order=-created_at`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!res.ok) {
      console.error('[Orders] Admin API failed:', res.status);
      return NextResponse.json({ orders: [] }, { status: 500 });
    }

    const data = await res.json();
    const orders = data.orders || [];
    
    // Transform orders to frontend format
    const transformedOrders = orders.map((order: any) => ({
      id: order.id,
      display_id: order.display_id,
      created_at: order.created_at,
      total: order.total || 0,
      status: order.status,
      fulfillment_status: order.fulfillment_status || 'not_fulfilled',
      payment_status: order.payment_status || 'pending',
      items: order.items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })) || [],
    }));

    console.log(`[Orders] Found ${transformedOrders.length} orders for ${customerEmail}`);
    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
