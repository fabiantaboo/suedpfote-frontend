import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
const MEDUSA_ADMIN_SECRET = process.env.STRIPE_SECRET_KEY; // Reuse for admin auth

// Points configuration
const POINTS_PER_EURO = 10;
const BOOST_THRESHOLD = 100;
const BOOST_MULTIPLIER = 2;

// Redemption tiers (10x higher cost)
const REDEMPTION_TIERS = [
  { points: 5000, discount: 5, code_prefix: 'LOYAL5' },
  { points: 10000, discount: 10, code_prefix: 'LOYAL10' },
  { points: 25000, discount: 25, code_prefix: 'LOYAL25' },
  { points: 50000, discount: 50, code_prefix: 'LOYAL50' },
];

async function getAdminToken(): Promise<string> {
  const response = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@suedpfote.de',
      password: 'Suedpfote2026!',
    }),
  });
  const data = await response.json();
  return data.token;
}

// GET /api/loyalty?email=customer@email.com
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    const token = await getAdminToken();
    
    // Find customer by email
    const customersRes = await fetch(
      `${MEDUSA_URL}/admin/customers?q=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const customersData = await customersRes.json();
    
    // Filter all matches, prefer the one with points (handles duplicates)
    const matches = (customersData.customers || []).filter(
      (c: { email: string }) => c.email.toLowerCase() === email.toLowerCase()
    );
    const customer = matches.sort((a: any, b: any) => 
      (b.metadata?.loyalty_points || 0) - (a.metadata?.loyalty_points || 0)
    )[0];
    
    if (!customer) {
      return NextResponse.json({ 
        points: 0, 
        redemptionTiers: REDEMPTION_TIERS,
        message: 'New customer - no points yet' 
      });
    }

    const points = customer.metadata?.loyalty_points || 0;
    const totalEarned = customer.metadata?.total_points_earned || 0;
    const totalRedeemed = customer.metadata?.total_points_redeemed || 0;

    return NextResponse.json({
      points,
      totalEarned,
      totalRedeemed,
      redemptionTiers: REDEMPTION_TIERS,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Loyalty GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}

// POST /api/loyalty - Add points or redeem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, orderTotal, tierId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const token = await getAdminToken();

    // Find or create customer
    let customersRes = await fetch(
      `${MEDUSA_URL}/admin/customers?q=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    let customersData = await customersRes.json();
    // Filter all matches, prefer the one with points (handles duplicates)
    let matches = (customersData.customers || []).filter(
      (c: { email: string }) => c.email.toLowerCase() === email.toLowerCase()
    );
    let customer = matches.sort((a: any, b: any) => 
      (b.metadata?.loyalty_points || 0) - (a.metadata?.loyalty_points || 0)
    )[0];

    if (!customer && action === 'add') {
      // Create customer if doesn't exist
      const createRes = await fetch(`${MEDUSA_URL}/admin/customers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const createData = await createRes.json();
      customer = createData.customer;
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const currentPoints = customer.metadata?.loyalty_points || 0;
    const totalEarned = customer.metadata?.total_points_earned || 0;
    const totalRedeemed = customer.metadata?.total_points_redeemed || 0;

    if (action === 'add') {
      // Calculate points to add
      if (!orderTotal || orderTotal <= 0) {
        return NextResponse.json({ error: 'Order total required' }, { status: 400 });
      }

      const hasBoost = orderTotal >= BOOST_THRESHOLD;
      const basePoints = Math.floor(orderTotal * POINTS_PER_EURO);
      const earnedPoints = hasBoost ? basePoints * BOOST_MULTIPLIER : basePoints;

      // Update customer metadata
      const updateRes = await fetch(`${MEDUSA_URL}/admin/customers/${customer.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata: {
            ...customer.metadata,
            loyalty_points: currentPoints + earnedPoints,
            total_points_earned: totalEarned + earnedPoints,
            last_points_earned: new Date().toISOString(),
            boost_applied: hasBoost,
          },
        }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update customer points');
      }

      return NextResponse.json({
        success: true,
        pointsEarned: earnedPoints,
        newBalance: currentPoints + earnedPoints,
        boostApplied: hasBoost,
      });
    }

    if (action === 'redeem') {
      // Find the tier
      const tier = REDEMPTION_TIERS.find((t, i) => i === tierId || t.points === tierId);
      if (!tier) {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
      }

      if (currentPoints < tier.points) {
        return NextResponse.json({ 
          error: 'Not enough points',
          required: tier.points,
          current: currentPoints,
        }, { status: 400 });
      }

      // Create a unique discount code
      const discountCode = `${tier.code_prefix}_${Date.now().toString(36).toUpperCase()}`;

      // Create promotion in Medusa
      const promoRes = await fetch(`${MEDUSA_URL}/admin/promotions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode,
          type: 'standard',
          is_automatic: false,
          application_method: {
            type: 'fixed',
            target_type: 'order',
            value: tier.discount,
            currency_code: 'eur',
            allocation: 'total',
          },
          rules: [],
        }),
      });

      if (!promoRes.ok) {
        const errData = await promoRes.json();
        console.error('Failed to create promotion:', errData);
        throw new Error('Failed to create discount code');
      }

      // Deduct points
      await fetch(`${MEDUSA_URL}/admin/customers/${customer.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata: {
            ...customer.metadata,
            loyalty_points: currentPoints - tier.points,
            total_points_redeemed: totalRedeemed + tier.points,
            last_redemption: new Date().toISOString(),
          },
        }),
      });

      return NextResponse.json({
        success: true,
        discountCode,
        discountAmount: tier.discount,
        pointsSpent: tier.points,
        newBalance: currentPoints - tier.points,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Loyalty POST error:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
