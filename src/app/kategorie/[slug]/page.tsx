import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/medusa-server';
import { CATEGORIES, categorizeProduct, getCategoryBySlug } from '@/lib/categories';
import CartToggle from '@/components/CartToggle';
import Footer from '@/components/Footer';
import { CategoryAddToCart } from '@/components/CategoryClient';

const bgColors = [
  'bg-zinc-50',
  'bg-amber-50/50',
  'bg-emerald-50/50',
  'bg-sky-50/50',
  'bg-rose-50/50',
  'bg-violet-50/50',
];

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Kategorie nicht gefunden' };

  const title = `Linkshänder ${category.label} | Südpfote`;
  const description = `${category.description} ✓ Für Linkshänder entwickelt ✓ Schneller Versand ✓ 30 Tage Rückgabe`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://suedpfote.de/kategorie/${slug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://suedpfote.de/kategorie/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allProducts = await getAllProducts();

  const products = allProducts.filter((p) => {
    const cats = categorizeProduct(p);
    return cats.includes(slug);
  });

  // Schema.org CollectionPage
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Linkshänder ${category.label}`,
    description: category.description,
    url: `https://suedpfote.de/kategorie/${slug}`,
    numberOfItems: products.length,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://suedpfote.de/produkt/${p.handle}`,
        name: p.title,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suedpfote.de' },
      { '@type': 'ListItem', position: 2, name: 'Kategorien', item: 'https://suedpfote.de/kategorien' },
      { '@type': 'ListItem', position: 3, name: category.label, item: `https://suedpfote.de/kategorie/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CartToggle>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="pt-20 sm:pt-24 px-4 sm:px-6">
          <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-zinc-600 transition">Home</Link></li>
            <li>/</li>
            <li><Link href="/kategorien" className="hover:text-zinc-600 transition">Kategorien</Link></li>
            <li>/</li>
            <li className="text-zinc-900 font-medium">{category.label}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="pt-6 pb-10 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <span className="text-5xl mb-4 block">{category.emoji}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3D3329] mb-3">
              Linkshänder {category.label}
            </h1>
            <p className="text-[#8B7E74] max-w-xl mx-auto">
              {category.description}
            </p>
            <p className="text-sm text-[#A89888] mt-3">
              {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'}
            </p>
          </div>
        </header>

        {/* Product Grid */}
        <main className="pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🤷</p>
                <p className="text-[#8B7E74]">Noch keine Produkte in dieser Kategorie.</p>
                <Link href="/kategorien" className="mt-4 inline-block text-[#E8935A] hover:text-[#C4956A] underline underline-offset-4 transition">
                  Alle Kategorien ansehen
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => {
                  const price = product.variants?.[0]?.calculated_price?.calculated_amount || 0;
                  const colorIndex = product.id.charCodeAt(product.id.length - 1) % bgColors.length;

                  return (
                    <article key={product.id} className="group">
                      <Link href={`/produkt/${product.handle || product.id}`} className="block">
                        {index === 0 && products.length > 3 && (
                          <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#E8935A] text-white text-xs font-bold rounded-full">
                            BELIEBT
                          </span>
                        )}
                        <div className={`aspect-square rounded-3xl ${bgColors[colorIndex]} flex items-center justify-center mb-5 overflow-hidden p-8 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#C4956A]/15 relative`}>
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={`${product.title} - Linkshänder ${category.label}`}
                              width={400}
                              height={400}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                              unoptimized={product.thumbnail.startsWith('http')}
                            />
                          ) : (
                            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">🤚</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-[#8B7E74] uppercase tracking-wide">Linkshänder</p>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-[#E8935A] text-xs">★</span>
                              ))}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-[#3D3329] group-hover:text-[#C4956A] transition">
                            {product.title}
                          </h3>
                          <p className="text-sm text-[#8B7E74] leading-relaxed line-clamp-2">
                            {product.subtitle || product.description}
                          </p>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-xl font-bold text-[#3D3329]">€{price.toFixed(2)}</span>
                          <span className="text-xs text-[#8B7E74] ml-2">inkl. MwSt.</span>
                        </div>
                        <CategoryAddToCart
                          variantId={product.variants?.[0]?.id || product.id}
                          productName={product.title}
                          price={price}
                          thumbnail={product.thumbnail}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Other categories */}
            <div className="mt-20 pt-12 border-t border-zinc-200">
              <h2 className="text-2xl font-bold text-[#3D3329] mb-6 text-center">Weitere Kategorien</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.filter((c) => c.slug !== slug).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategorie/${cat.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5F0EB] text-[#6B5E52] hover:bg-[#EDE8E3] hover:text-[#3D3329] transition text-sm font-medium"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </CartToggle>
    </div>
  );
}
