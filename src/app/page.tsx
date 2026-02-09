import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/medusa-server';
import { ProductCard } from '@/components/HomeClient';
import CartToggle from '@/components/CartToggle';

const bgColors = [
  'bg-zinc-50',
  'bg-amber-50/50',
  'bg-emerald-50/50',
  'bg-sky-50/50',
  'bg-rose-50/50',
  'bg-violet-50/50',
];

export default async function Home() {
  const rawProducts = await getAllProducts();
  const products = rawProducts.map((p: any, i: number) => ({
    id: p.id,
    variantId: p.variants?.[0]?.id || p.id,
    name: p.title,
    price: p.variants?.[0]?.calculated_price?.calculated_amount || 0,
    description: p.description || '',
    image: p.thumbnail || null,
    color: bgColors[i % bgColors.length],
    handle: p.handle || p.id,
  }));

  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Südpfote',
    url: 'https://suedpfote.de',
    description: 'Premium Produkte für Linkshänder',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://suedpfote.de/suche?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Südpfote',
    url: 'https://suedpfote.de',
    logo: 'https://suedpfote.de/logo.png',
    description: 'Premium Produkte für Linkshänder. Der Shop für die anderen 10%.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hallo@suedpfote.de',
      contactType: 'customer service',
      availableLanguage: 'German',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Warum brauche ich spezielle Linkshänder-Produkte?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Die meisten Alltagsprodukte sind für Rechtshänder designt. Scheren, Füller, Küchengeräte - alles ist spiegelverkehrt aufgebaut. Das führt bei Linkshändern zu Ermüdung, schlechteren Ergebnissen und Frustration. Unsere Produkte sind ergonomisch für die linke Hand entwickelt und machen den Unterschied spürbar.',
        },
      },
      {
        '@type': 'Question',
        name: 'Sind Linkshänder-Scheren wirklich anders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja! Bei einer Linkshänder-Schere sind die Klingen vertauscht. Wenn du mit der linken Hand schneidest, drückst du automatisch nach innen - genau wie die Klingen zusammengedrückt werden.',
        },
      },
      {
        '@type': 'Question',
        name: 'Wie lange dauert der Versand?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Wir versenden innerhalb von 1-2 Werktagen. Die Lieferung dauert in Deutschland 2-4 Werktage. Ab 39€ Bestellwert ist der Versand kostenlos!',
        },
      },
      {
        '@type': 'Question',
        name: 'Kann ich Produkte zurückgeben?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Selbstverständlich! Du hast 30 Tage Zeit, Produkte ohne Angabe von Gründen zurückzugeben. Wir erstatten den vollen Kaufpreis.',
        },
      },
      {
        '@type': 'Question',
        name: 'Sind alle Produkte für Linkshänder geeignet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, 100%! Jedes Produkt bei Südpfote ist speziell für Linkshänder entwickelt oder ausgewählt. Wir testen alles selbst - denn wir sind auch Linkshänder.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CartToggle>
        {/* Hero */}
        <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="absolute -top-10 -left-20 w-40 h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 -right-20 w-40 h-40 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full blur-3xl opacity-50" />

            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4 relative">
              Für die anderen 10%
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight leading-tight mb-6 relative">
              Linkshänder Produkte,{' '}
              <span className="block">die funktionieren.</span>
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
                Linkshänder-Produkte entdecken
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
                <span>✂️ Linkshänder-Scheren die schneiden</span>
                <span>✍️ Füller für Linkshänder</span>
                <span>📐 Lineale die du lesen kannst</span>
                <span>🍳 Küchenwerkzeug für Linkshänder</span>
                <span>🖱️ Linkshänder-Maus &amp; Tech</span>
                <span>❤️ Made for Lefties</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-b border-zinc-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="group">
              <p className="text-3xl sm:text-5xl font-bold text-zinc-900 group-hover:scale-110 transition-transform">8 Mio</p>
              <p className="text-sm text-zinc-500 mt-2">Linkshänder in Deutschland</p>
            </div>
            <div className="group">
              <p className="text-3xl sm:text-5xl font-bold text-zinc-900 group-hover:scale-110 transition-transform">10%</p>
              <p className="text-sm text-zinc-500 mt-2">der Weltbevölkerung</p>
            </div>
            <div className="group">
              <p className="text-3xl sm:text-5xl font-bold text-zinc-900 group-hover:scale-110 transition-transform">100%</p>
              <p className="text-sm text-zinc-500 mt-2">für Links designed</p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="produkte" className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">Unsere Linkshänder-Produkte</h2>
              <p className="text-zinc-500 max-w-lg mx-auto text-lg">
                Jedes Produkt wurde speziell für die linke Hand entwickelt.
                Keine Kompromisse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-zinc-500">Keine Produkte gefunden.</p>
                </div>
              ) : (
                products.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} total={products.length} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 px-6 bg-gradient-to-b from-zinc-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-8">💬</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed mb-8">
              &ldquo;Ich wusste gar nicht, wie viel Energie ich mein Leben lang verschwendet habe,
              nur weil meine Schere für die falsche Hand war.&rdquo;
            </blockquote>
            <cite className="text-zinc-500 not-italic">
              — Sarah, Lehrerin aus München
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
              Unsere Mission lesen →
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-zinc-100">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4">
              Bleib auf dem Laufenden
            </h2>
            <p className="text-zinc-500 mb-8 text-base sm:text-lg">
              Neue Linkshänder-Produkte, Tipps für Linkshänder, und 10% auf deine erste Bestellung.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="deine@email.de"
                className="flex-1 min-w-0 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-zinc-200 focus:outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition text-base sm:text-lg"
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
                  <span className="text-2xl">🚚</span>
                </div>
                <p className="font-medium text-zinc-900">Kostenloser Versand</p>
                <p className="text-sm text-zinc-500">Ab 39 € Bestellwert</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">↩️</span>
                </div>
                <p className="font-medium text-zinc-900">30 Tage Rückgabe</p>
                <p className="text-sm text-zinc-500">Ohne Wenn und Aber</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="font-medium text-zinc-900">Sichere Zahlung</p>
                <p className="text-sm text-zinc-500">SSL-verschlüsselt</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💜</span>
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
                  q: 'Warum brauche ich spezielle Linkshänder-Produkte?',
                  a: 'Die meisten Alltagsprodukte sind für Rechtshänder designt. Scheren, Füller, Küchengeräte - alles ist spiegelverkehrt aufgebaut. Das führt bei Linkshändern zu Ermüdung, schlechteren Ergebnissen und Frustration. Unsere Produkte sind ergonomisch für die linke Hand entwickelt und machen den Unterschied spürbar.',
                },
                {
                  q: 'Sind Linkshänder-Scheren wirklich anders?',
                  a: 'Ja! Bei einer Linkshänder-Schere sind die Klingen vertauscht. Wenn du mit der linken Hand schneidest, drückst du automatisch nach innen - genau wie die Klingen zusammengedrückt werden. Bei Rechtshänder-Scheren drücken Linkshänder die Klingen auseinander, was zu unsauberen Schnitten führt.',
                },
                {
                  q: 'Wie lange dauert der Versand?',
                  a: 'Wir versenden innerhalb von 1-2 Werktagen. Die Lieferung dauert in Deutschland 2-4 Werktage. Ab 39 € Bestellwert ist der Versand kostenlos!',
                },
                {
                  q: 'Kann ich Produkte zurückgeben?',
                  a: 'Selbstverständlich! Du hast 30 Tage Zeit, Produkte ohne Angabe von Gründen zurückzugeben. Wir erstatten den vollen Kaufpreis.',
                },
                {
                  q: 'Sind alle Produkte für Linkshänder geeignet?',
                  a: 'Ja, 100%! Jedes Produkt bei Südpfote ist speziell für Linkshänder entwickelt oder ausgewählt. Wir testen alles selbst - denn wir sind auch Linkshänder.',
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl shadow-sm">
                  <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-zinc-900">
                    {faq.q}
                    <span className="ml-4 text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-6 pb-6 text-zinc-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-900 text-white py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <Image src="/logo-t.png" alt="Südpfote - Linkshänder Shop" width={140} height={46} />
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
                  <li><a href="#produkte" className="hover:text-white transition">Alle Linkshänder-Produkte</a></li>
                  <li><a href="#produkte" className="hover:text-white transition">Linkshänder-Scheren</a></li>
                  <li><a href="#produkte" className="hover:text-white transition">Linkshänder-Füller</a></li>
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
              <p className="text-sm text-zinc-500">© 2026 Südpfote. Alle Rechte vorbehalten.</p>
              <p className="text-sm text-zinc-500">Made with 💜 by Fabian &amp; Nyx 🦞</p>
            </div>
          </div>
        </footer>
      </CartToggle>

    </div>
  );
}
