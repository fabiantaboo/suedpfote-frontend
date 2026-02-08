import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
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

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Get admin token
    const adminToken = await getAdminToken();
    if (!adminToken) {
      return NextResponse.json({ error: 'Admin auth failed' }, { status: 500 });
    }

    // Find customer by email
    const customerRes = await fetch(`${MEDUSA_URL}/admin/customers?q=${encodeURIComponent(email)}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    if (!customerRes.ok) {
      return NextResponse.json({ error: 'Failed to find customer' }, { status: 500 });
    }
    
    const customerData = await customerRes.json();
    const customer = customerData.customers?.find((c: any) => c.email === email);
    
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    console.log(`[LinkOrders] Found customer: ${customer.id}`);

    // Find all orders with this email (use q= for search)
    const ordersRes = await fetch(`${MEDUSA_URL}/admin/orders?q=${encodeURIComponent(email)}&limit=100`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    
    if (!ordersRes.ok) {
      return NextResponse.json({ error: 'Failed to find orders' }, { status: 500 });
    }
    
    const ordersData = await ordersRes.json();
    // Use all orders from search (q= searches by email field in Medusa)
    const orders = ordersData.orders || [];
    console.log(`[LinkOrders] Found ${orders.length} orders matching search for ${email}`);
    
    // Filter orders that need linking (no customer_id or different customer_id)
    const ordersToLink = orders.filter((o: any) => !o.customer_id || o.customer_id !== customer.id);
    
    if (ordersToLink.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Alle Bestellungen sind bereits verknüpft',
        linked: 0 
      });
    }

    // Link each order
    let linked = 0;
    for (const order of ordersToLink) {
      try {
        const updateRes = await fetch(`${MEDUSA_URL}/admin/orders/${order.id}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}` 
          },
          body: JSON.stringify({ customer_id: customer.id }),
        });
        
        if (updateRes.ok) {
          linked++;
          console.log(`[LinkOrders] ✅ Linked order ${order.id}`);
        } else {
          const errorText = await updateRes.text();
          console.error(`[LinkOrders] Failed to link order ${order.id}: ${updateRes.status} - ${errorText}`);
        }
      } catch (err) {
        console.error(`[LinkOrders] Error linking order ${order.id}:`, err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${linked} Bestellung(en) verknüpft`,
      linked,
      total: orders.length
    });
  } catch (error) {
    console.error('[LinkOrders] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
