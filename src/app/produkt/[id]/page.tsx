import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getProductByHandle, getAllProducts } from '@/lib/medusa-server';
import { AddToCartSection } from '@/components/ProductClient';
import CartToggle from '@/components/CartToggle';
import Footer from '@/components/Footer';

const bgColors = [
  'bg-zinc-50',
  'bg-amber-50/50',
  'bg-emerald-50/50',
  'bg-sky-50/50',
  'bg-rose-50/50',
  'bg-violet-50/50',
];

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByHandle(id);
  if (!product) return { title: 'Produkt nicht gefunden' };

  const price = product.variants?.[0]?.calculated_price?.calculated_amount || 0;
  const description = product.subtitle || product.description?.substring(0, 160) || `${product.title} - Premium Linkshänder-Produkt von Südpfote`;

  return {
    title: `${product.title} | Linkshänder-Produkt kaufen`,
    description: `${description} ✓ Für Linkshänder entwickelt ✓ Schneller Versand ✓ 30 Tage Rückgabe`,
    openGraph: {
      title: `${product.title} | Südpfote`,
      description,
      type: 'website',
      images: product.thumbnail ? [{ url: product.thumbnail, width: 800, height: 800, alt: product.title }] : [],
      url: `https://suedpfote.de/produkt/${product.handle}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
    alternates: {
      canonical: `https://suedpfote.de/produkt/${product.handle}`,
    },
  };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.handle || p.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductByHandle(id);

  if (!product) {
    notFound();
  }

  // Redirect technical IDs to SEO-friendly handles
  if (id.startsWith('prod_') && product.handle) {
    redirect(`/produkt/${product.handle}`);
  }

  const price = product.variants?.[0]?.calculated_price?.calculated_amount || 0;
  const colorIndex = product.id.charCodeAt(product.id.length - 1) % bgColors.length;

  // Fetch related products
  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  // Schema.org JSON-LD
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle || product.description?.substring(0, 500),
    image: product.thumbnail || undefined,
    brand: { '@type': 'Brand', name: 'Südpfote' },
    offers: {
      '@type': 'Offer',
      url: `https://suedpfote.de/produkt/${product.handle}`,
      priceCurrency: 'EUR',
      price: price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Südpfote' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'EUR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'DE' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 4, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'DE',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    category: 'Linkshänder-Produkte',
    audience: {
      '@type': 'PeopleAudience',
      suggestedGender: 'unisex',
      audienceType: 'Linkshänder',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suedpfote.de' },
      { '@type': 'ListItem', position: 2, name: 'Produkte', item: 'https://suedpfote.de/#produkte' },
      { '@type': 'ListItem', position: 3, name: product.title, item: `https://suedpfote.de/produkt/${product.handle}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CartToggle>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="pt-20 sm:pt-24 px-4 sm:px-6">
          <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-zinc-600 transition">Home</Link></li>
            <li>/</li>
            <li><Link href="/#produkte" className="hover:text-zinc-600 transition">Produkte</Link></li>
            <li>/</li>
            <li className="text-zinc-900 font-medium truncate">{product.title}</li>
          </ol>
        </nav>

        {/* Product */}
        <main className="pt-4 pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 lg:gap-20">
              {/* Image */}
              <div className={`aspect-square rounded-2xl sm:rounded-3xl ${bgColors[colorIndex]} flex items-center justify-center p-6 sm:p-12`}>
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={`${product.title} - Linkshänder Produkt von Südpfote`}
                    title={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain"
                    priority
                    unoptimized={product.thumbnail.startsWith('http')}
                  />
                ) : (
                  <div className="text-8xl">🤚</div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center min-w-0 overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wide mb-2">
                  Linkshänder
                </p>
                <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900 mb-3 sm:mb-4 break-words hyphens-auto" lang="de">
                  {product.title}
                </h1>
                <p className="text-sm sm:text-lg text-zinc-600 leading-relaxed mb-6 sm:mb-8 break-words">
                  {product.subtitle || product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-zinc-100 text-zinc-700 text-xs sm:text-sm rounded-full">
                    Für Linkshänder
                  </span>
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-zinc-100 text-zinc-700 text-xs sm:text-sm rounded-full">
                    Premium Qualität
                  </span>
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-zinc-100 text-zinc-700 text-xs sm:text-sm rounded-full">
                    Schneller Versand
                  </span>
                </div>

                {/* Price & Add to Cart (Client Component) */}
                <AddToCartSection
                  variantId={product.variants?.[0]?.id || product.id}
                  productTitle={product.title}
                  price={price}
                  thumbnail={product.thumbnail}
                />

                {/* Info */}
                <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-100">
                  <h3 className="font-semibold text-zinc-900 mb-3 sm:mb-4">Warum Südpfote?</h3>
                  <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-zinc-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>Speziell für Linkshänder entwickelt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>Kostenloser Versand ab 39 €</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>30 Tage Rückgaberecht</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ausführliche Produktbeschreibung */}
            {product.description && product.description.length > 200 && (
              <div className="mt-20 pt-12 border-t border-zinc-200">
                <h2 className="text-2xl font-bold text-zinc-900 mb-8">Produktdetails</h2>
                <div className="prose prose-zinc max-w-none">
                  {product.description.split('\n\n').map((section: string, index: number) => {
                    const trimmed = section.trim();
                    if (trimmed.startsWith('- ') && trimmed.endsWith(' -') && trimmed.length < 80) {
                      const title = trimmed.replace(/^-\s*/, '').replace(/\s*-$/, '').trim();
                      return (
                        <h3 key={index} className="text-lg font-semibold text-zinc-900 mt-8 mb-4 flex items-center gap-2">
                          <span className="w-8 h-0.5 bg-zinc-900"></span>
                          {title}
                        </h3>
                      );
                    } else if ((section.startsWith('---') && section.endsWith('---')) || (section.startsWith('—') && section.endsWith('—'))) {
                      const title = section.replace(/---/g, '').replace(/—/g, '').trim();
                      return (
                        <h3 key={index} className="text-lg font-semibold text-zinc-900 mt-8 mb-4 flex items-center gap-2">
                          <span className="w-8 h-0.5 bg-zinc-900"></span>
                          {title}
                        </h3>
                      );
                    } else if (section.includes('\n-') || section.includes('\n•') || section.includes('\n ')) {
                      const items = section.split('\n').filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('✓'));
                      return (
                        <ul key={index} className="space-y-2 mb-6">
                          {items.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-zinc-600">
                              <span className="text-emerald-500 mt-1">✓</span>
                              <span>{item.replace(/^[-•]\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return (
                        <p key={index} className="text-zinc-600 leading-relaxed mb-4">
                          {section}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-20 pt-12 border-t border-zinc-200">
                <h2 className="text-2xl font-bold text-zinc-900 mb-8">Das könnte dir auch gefallen</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProducts.map((rp, i) => {
                    const rpPrice = rp.variants?.[0]?.calculated_price?.calculated_amount || 0;
                    const rpColor = bgColors[rp.id.charCodeAt(rp.id.length - 1) % bgColors.length];
                    return (
                      <Link href={`/produkt/${rp.handle || rp.id}`} key={rp.id} className="group block">
                        <div className={`aspect-square rounded-2xl ${rpColor} flex items-center justify-center p-8 mb-4 transition-all group-hover:shadow-lg`}>
                          {rp.thumbnail ? (
                            <Image src={rp.thumbnail} alt={`${rp.title} - Linkshänder Produkt`} width={300} height={300} className="w-full h-full object-contain group-hover:scale-105 transition-transform" unoptimized={rp.thumbnail!.startsWith('http')} />
                          ) : (
                            <div className="text-6xl">🤚</div>
                          )}
                        </div>
                        <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition">{rp.title}</h3>
                        <p className="text-zinc-900 font-bold mt-1">€{rpPrice.toFixed(2)}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </CartToggle>
    </div>
  );
}
