import { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts } from '@/lib/medusa-server';
import { CATEGORIES, categorizeProduct } from '@/lib/categories';
import CartToggle from '@/components/CartToggle';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Alle Kategorien | Linkshänder-Produkte | Südpfote',
  description: 'Entdecke unsere Linkshänder-Produkte nach Kategorie: Schreibwaren, Scheren, Küchenmesser, Küchenhelfer, Schulbedarf, Sport und mehr. ✓ Für Linkshänder entwickelt ✓ Schneller Versand',
  openGraph: {
    title: 'Alle Kategorien | Südpfote',
    description: 'Linkshänder-Produkte nach Kategorie sortiert – finde genau was du brauchst.',
    type: 'website',
    url: 'https://suedpfote.de/kategorien',
  },
  alternates: {
    canonical: 'https://suedpfote.de/kategorien',
  },
};

export default async function CategoriesPage() {
  const allProducts = await getAllProducts();

  // Count products per category
  const categoryCounts: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    categoryCounts[cat.slug] = 0;
  }
  for (const product of allProducts) {
    const cats = categorizeProduct(product);
    for (const catSlug of cats) {
      if (categoryCounts[catSlug] !== undefined) {
        categoryCounts[catSlug]++;
      }
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suedpfote.de' },
      { '@type': 'ListItem', position: 2, name: 'Kategorien', item: 'https://suedpfote.de/kategorien' },
    ],
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CartToggle>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="pt-20 sm:pt-24 px-4 sm:px-6">
          <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-zinc-400">
            <li><Link href="/" className="hover:text-zinc-600 transition">Home</Link></li>
            <li>/</li>
            <li className="text-zinc-900 font-medium">Kategorien</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="pt-6 pb-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3D3329] mb-3">
              Unsere Kategorien
            </h1>
            <p className="text-[#8B7E74] max-w-xl mx-auto">
              {allProducts.length} Linkshänder-Produkte in {CATEGORIES.length} Kategorien – finde genau was du brauchst.
            </p>
          </div>
        </header>

        {/* Category Grid */}
        <main className="pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.slug] || 0;

                return (
                  <Link
                    key={cat.slug}
                    href={`/kategorie/${cat.slug}`}
                    className="group block p-8 rounded-2xl bg-[#F5F0EB] hover:bg-[#EDE8E3] transition-all duration-300 hover:shadow-lg hover:shadow-[#C4956A]/10 hover:-translate-y-1"
                  >
                    <span className="text-4xl block mb-4">{cat.emoji}</span>
                    <h2 className="text-xl font-bold text-[#3D3329] group-hover:text-[#C4956A] transition mb-2">
                      {cat.label}
                    </h2>
                    <p className="text-sm text-[#8B7E74] leading-relaxed mb-4">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#A89888] bg-white/60 px-3 py-1 rounded-full">
                        {count} {count === 1 ? 'Produkt' : 'Produkte'}
                      </span>
                      <span className="text-[#E8935A] text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Entdecken →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* All products CTA */}
            <div className="mt-16 text-center">
              <Link
                href="/#produkte"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#3D3329] text-white rounded-full font-medium hover:bg-[#2C241E] transition-all hover:shadow-lg"
              >
                <span>🤚</span>
                <span>Alle {allProducts.length} Produkte ansehen</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </CartToggle>
    </div>
  );
}
