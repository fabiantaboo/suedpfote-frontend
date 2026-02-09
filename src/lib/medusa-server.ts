// Server-side Medusa API calls (direct, no proxy needed)
const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'https://suedpfote-backend.onrender.com';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_47735dfa80c2310e7a8b18d8c2e5ecf3df3c5a7767938647e98be59f8d2d9d9f';
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || 'reg_01KGWC6CFD8AHFJBPB6PRKZE09';

export type MedusaProduct = {
  id: string;
  title: string;
  description: string;
  subtitle: string | null;
  handle: string;
  thumbnail: string | null;
  updated_at: string;
  variants: {
    id: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }[];
};

export async function getProductByHandle(handle: string): Promise<MedusaProduct | null> {
  try {
    const url = handle.startsWith('prod_')
      ? `${MEDUSA_URL}/store/products/${handle}?region_id=${REGION_ID}`
      : `${MEDUSA_URL}/store/products?handle=${handle}&region_id=${REGION_ID}`;

    const res = await fetch(url, {
      headers: { 'x-publishable-api-key': PUBLISHABLE_KEY },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.product || data.products?.[0] || null;
  } catch {
    return null;
  }
}

export async function getAllProducts(): Promise<MedusaProduct[]> {
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?region_id=${REGION_ID}&limit=50`,
      {
        headers: { 'x-publishable-api-key': PUBLISHABLE_KEY },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}
