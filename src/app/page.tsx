'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Navigation from '@/components/Navigation';
import CartDrawer from '@/components/CartDrawer';

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

// Background colors for products
const bgColors = [
  'bg-zinc-50',
  'bg-amber-50/50',
  'bg-emerald-50/50',
  'bg-sky-50/50',
  'bg-rose-50/50',
  'bg-violet-50/50',
];

type Product = {
  id: string;
  variantId: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  color: string;
  handle?: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/medusa/products?region_id=${REGION_ID}`);
        if (res.ok) {
          const data = await res.json();
          const mappedProducts: Product[] = (data.products || []).map((p: any, i: number) => ({
            id: p.id,
            variantId: p.variants?.[0]?.id || p.id,
            name: p.title,
            price: p.variants?.[0]?.calculated_price?.calculated_amount || 0,
            category: 'Linkshänder',
            description: p.description || '',
            image: p.thumbnail || null,
            color: bgColors[i % bgColors.length],
            handle: p.handle,
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
      setShowCart(true);
    }, 400);
    
    addToCart(
      product.variantId,
      product.name,
      product.price,
      1,
      product.image
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation onCartClick={() => setShowCart(true)} />
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute -top-10 -left-20 w-40 h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-10 -right-20 w-40 h-40 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full blur-3xl opacity-50" />
          
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4 relative">
            Für die anderen 10%
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight leading-tight mb-6 relative">
            Write Different.
          </h1>
          <p className="text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed relative">
            Premium Produkte, designed für Linkshänder. 
            Weil du es verdient hast, dass Dinge einfach funktionieren.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center relative">
            <a 
              href="#produkte"
              className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 hover:scale-105 transition-all shadow-lg shadow-zinc-900/20"
            >
              Produkte entdecken
            </a>
            <Link 
              href="/story"
              className="inline-flex items-center justify-center px-8 py-4 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition"
            >
              Unsere Story
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-6 bg-zinc-900 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-8 text-zinc-400 text-sm font-medium">
              <span>&#9986;&#65039; Scheren die schneiden</span>
              <span>&#9997;&#65039; Füller die nicht schmieren</span>
              <span>&#128208; Lineale die du lesen kannst</span>
              <span>&#127859; Küchenwerkzeug das funktioniert</span>
              <span>&#128433;&#65039; Tech für deine Hand</span>
              <span>&#10084;&#65039; Made for Lefties</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="group">
            <p className="text-5xl font-bold text-zinc-900 group-hover:scale-110 transition-transform">8 Mio</p>
            <p className="text-sm text-zinc-500 mt-2">Linkshänder in Deutschland</p>
          </div>
          <div className="group">
            <p className="text-5xl font-bold text-zinc-900 group-hover:scale-110 transition-transform">10%</p>
            <p className="text-sm text-zinc-500 mt-2">der Weltbevölkerung</p>
          </div>
          <div className="group">
            <p className="text-5xl font-bold text-zinc-900 group-hover:scale-110 transition-transform">100%</p>
            <p className="text-sm text-zinc-500 mt-2">für Links designed</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="produkte" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-900 mb-4">Unsere Kollektion</h2>
            <p className="text-zinc-500 max-w-lg mx-auto text-lg">
              Jedes Produkt wurde speziell für die linke Hand entwickelt. 
              Keine Kompromisse.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-zinc-200 border-t-zinc-900"></div>
                <p className="mt-4 text-zinc-500">Lade Produkte...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-zinc-500">Keine Produkte gefunden.</p>
              </div>
            ) : null}
            {products.map((product, index) => (
              <Link
                href={`/produkt/${product.handle || product.id}`}
                key={product.id}
                className="group block"
              >
                <article className="relative">
                  {index === 0 && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                      BESTSELLER
                    </span>
                  )}
                  {index === products.length - 1 && (
                    <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      NEU
                    </span>
                  )}
                  
                  <div className={`aspect-square rounded-3xl ${product.color} flex items-center justify-center mb-5 overflow-hidden p-8 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-zinc-200 relative`}>
                    {product.image ? (
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-500">&#129306;</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                        {product.category}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-amber-400 text-xs">&#9733;</span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-zinc-600 transition">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-xl font-bold text-zinc-900">
                          &euro;{product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-zinc-400 ml-2">inkl. MwSt.</span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                          addedId === product.id
                            ? 'bg-emerald-500 text-white scale-95'
                            : 'bg-zinc-900 text-white hover:bg-zinc-700 hover:scale-105'
                        }`}
                      >
                        {addedId === product.id ? '&#10004; Hinzugefügt' : 'In den Warenkorb'}
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 px-6 bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-8">&#128172;</div>
          <blockquote className="text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed mb-8">
            {'"'}Ich wusste gar nicht, wie viel Energie ich mein Leben lang verschwendet habe, 
            nur weil meine Schere für die falsche Hand war.{'"'}
          </blockquote>
          <cite className="text-zinc-500 not-italic">
            &mdash; Sarah, Lehrerin aus München
          </cite>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-zinc-900 rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Du bist nicht falsch gebaut.
          </h2>
          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Die Welt ist es. Zeit, das zu ändern.
          </p>
          <Link 
            href="/story"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-100 transition"
          >
            Unsere Mission lesen &rarr;
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6 border-t border-zinc-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">
            Bleib auf dem Laufenden
          </h2>
          <p className="text-zinc-500 mb-8 text-lg">
            Neue Produkte, Tipps für Linkshänder, und 10% auf deine erste Bestellung.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="deine@email.de"
              className="flex-1 px-6 py-4 rounded-full border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition text-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition text-lg"
            >
              Anmelden
            </button>
          </form>
          <p className="text-sm text-zinc-400 mt-4">
            Kein Spam. Versprochen. Jederzeit abmelden.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">&#128666;</span>
              </div>
              <p className="font-medium text-zinc-900">Kostenloser Versand</p>
              <p className="text-sm text-zinc-500">Ab 39 &euro; Bestellwert</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">&#8617;&#65039;</span>
              </div>
              <p className="font-medium text-zinc-900">30 Tage Rückgabe</p>
              <p className="text-sm text-zinc-500">Ohne Wenn und Aber</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">&#128274;</span>
              </div>
              <p className="font-medium text-zinc-900">Sichere Zahlung</p>
              <p className="text-sm text-zinc-500">SSL-verschlüsselt</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">&#128156;</span>
              </div>
              <p className="font-medium text-zinc-900">Made for Lefties</p>
              <p className="text-sm text-zinc-500">Von Linkshändern</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-zinc-50" id="faq">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Häufig gestellte Fragen
          </h2>
          <p className="text-zinc-600 text-center mb-12">
            Alles was du über Linkshänder-Produkte wissen musst
          </p>

          <div className="space-y-4">
            {[
              {
                q: "Warum brauche ich spezielle Linkshänder-Produkte?",
                a: "Die meisten Alltagsprodukte sind für Rechtshänder designt. Scheren, Füller, Küchengeräte - alles ist spiegelverkehrt aufgebaut. Das führt bei Linkshändern zu Ermüdung, schlechteren Ergebnissen und Frustration. Unsere Produkte sind ergonomisch für die linke Hand entwickelt und machen den Unterschied spürbar."
              },
              {
                q: "Sind Linkshänder-Scheren wirklich anders?",
                a: "Ja! Bei einer Linkshänder-Schere sind die Klingen vertauscht. Wenn du mit der linken Hand schneidest, drückst du automatisch nach innen - genau wie die Klingen zusammengedrückt werden. Bei Rechtshänder-Scheren drücken Linkshänder die Klingen auseinander, was zu unsauberen Schnitten führt."
              },
              {
                q: "Wie lange dauert der Versand?",
                a: "Wir versenden innerhalb von 1-2 Werktagen. Die Lieferung dauert in Deutschland 2-4 Werktage. Ab 39 \u20AC Bestellwert ist der Versand kostenlos!"
              },
              {
                q: "Kann ich Produkte zurückgeben?",
                a: "Selbstverständlich! Du hast 30 Tage Zeit, Produkte ohne Angabe von Gründen zurückzugeben. Wir erstatten den vollen Kaufpreis."
              },
              {
                q: "Sind alle Produkte für Linkshänder geeignet?",
                a: "Ja, 100%! Jedes Produkt bei Südpfote ist speziell für Linkshänder entwickelt oder ausgewählt. Wir testen alles selbst - denn wir sind auch Linkshänder."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl shadow-sm">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-zinc-900">
                  {faq.q}
                  <span className="ml-4 text-zinc-400 group-open:rotate-180 transition-transform">&#9660;</span>
                </summary>
                <p className="px-6 pb-6 text-zinc-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Warum brauche ich spezielle Linksh\u00e4nder-Produkte?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Die meisten Alltagsprodukte sind f\u00fcr Rechtsh\u00e4nder designt. Unsere Produkte sind ergonomisch f\u00fcr die linke Hand entwickelt."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Sind Linksh\u00e4nder-Scheren wirklich anders?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja! Bei einer Linksh\u00e4nder-Schere sind die Klingen vertauscht."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wie lange dauert der Versand?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wir versenden innerhalb von 1-2 Werktagen. Die Lieferung dauert in Deutschland 2-4 Werktage. Ab 39 \u20ac Bestellwert ist der Versand kostenlos!"
                  }
                },
                {
                  "@type": "Question",
                  "name": "Kann ich Produkte zur\u00fcckgeben?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Selbstverst\u00e4ndlich! Du hast 30 Tage Zeit, Produkte ohne Angabe von Gr\u00fcnden zur\u00fcckzugeben."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Sind alle Produkte f\u00fcr Linksh\u00e4nder geeignet?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, 100%! Jedes Produkt bei S\u00fcdpfote ist speziell f\u00fcr Linksh\u00e4nder entwickelt oder ausgew\u00e4hlt."
                  }
                }
              ]
            })
          }}
        />
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Image src="/logo-t.png" alt="Südpfote" width={140} height={46} />
              </div>
              <p className="text-zinc-400 max-w-sm mb-6">
                Premium Produkte für Linkshänder. Weil 10% der Welt auch 100% verdienen.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400">Visa</span>
                <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400">Mastercard</span>
                <span className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-400">PayPal</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#produkte" className="hover:text-white transition">Alle Produkte</a></li>
                <li><a href="#" className="hover:text-white transition">Bestseller</a></li>
                <li><a href="#" className="hover:text-white transition">Neu eingetroffen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Über uns</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><Link href="/story" className="hover:text-white transition">Unsere Story</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><a href="mailto:hallo@suedpfote.de" className="hover:text-white transition">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><Link href="/impressum" className="hover:text-white transition">Impressum</Link></li>
                <li><Link href="/datenschutz" className="hover:text-white transition">Datenschutz</Link></li>
                <li><Link href="/agb" className="hover:text-white transition">AGB</Link></li>
                <li><Link href="/widerruf" className="hover:text-white transition">Widerruf</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              &copy; 2026 Südpfote. Alle Rechte vorbehalten.
            </p>
            <p className="text-sm text-zinc-500">
              Made with &#128156; by Fabian &amp; Nyx &#129438;
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
