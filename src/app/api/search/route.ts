import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://suedpfote-backend.onrender.com';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_47735dfa80c2310e7a8b18d8c2e5ecf3df3c5a7767938647e98be59f8d2d9d9f';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) return NextResponse.json({ products: [] });

  const res = await fetch(
    `${BACKEND_URL}/store/products?q=${encodeURIComponent(q)}&limit=8`,
    { headers: { 'x-publishable-api-key': API_KEY } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
