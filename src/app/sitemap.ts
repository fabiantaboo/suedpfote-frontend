import { MetadataRoute } from 'next';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

type Product = {
  id: string;
  handle: string;
  updated_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://suedpfote.de';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/agb`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch products for dynamic pages
  try {
    const res = await fetch(
      `${MEDUSA_URL}/store/products?region_id=${REGION_ID}`,
      {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_KEY,
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (res.ok) {
      const data = await res.json();
      const products: Product[] = data.products || [];

      const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/produkt/${product.handle || product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      return [...staticPages, ...productPages];
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return staticPages;
}
