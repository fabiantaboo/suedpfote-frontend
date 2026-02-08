import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = `/store/${path.join('/')}`;
  const searchParams = request.nextUrl.searchParams.toString();
  const url = searchParams ? `${MEDUSA_URL}${endpoint}?${searchParams}` : `${MEDUSA_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = `/store/${path.join('/')}`;
  
  let body;
  try {
    body = await request.json();
  } catch {
    body = undefined;
  }

  const response = await fetch(`${MEDUSA_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = `/store/${path.join('/')}`;

  const response = await fetch(`${MEDUSA_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
