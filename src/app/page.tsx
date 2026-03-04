import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/medusa-server';
import ProductFilter from '@/components/ProductFilter';
import CartToggle from '@/components/CartToggle';

const bgColors = [
  'bg-[#FFF8F3]',
  'bg-[#FDF2E9]',
  'bg-[#F5EDE4]',
  'bg-[#FEF0E6]',
  'bg-[#F9F0EA]',
  'bg-[#FFF5EE]',
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
    tags: p.tags || [],
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
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative w-full h-[520px] sm:h-[600px] md:h-[680px] mt-16 md:mt-20 overflow-hidden">
          {/* Background — lifestyle hero image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-lifestyle.jpg"
              alt="Linkshänder Workspace — Südpfote"
              fill
              className="object-cover"
              priority
            />
            {/* Soft overlay so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent" />
          </div>
          
          {/* Text overlay LEFT */}
          <div className="relative h-full flex items-center">
            <div className="px-6 sm:px-10 md:px-16 lg:px-24 max-w-2xl">
              <h1
                className="text-[36px] sm:text-[44px] md:text-[52px] leading-[1.1] text-[#1A1A1A] mb-5"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Endlich für<br />
                links gedacht.
              </h1>
              <p className="text-[16px] sm:text-[18px] text-[#555] leading-relaxed mb-8 max-w-md">
                Die passenden Produkte für<br />
                Schule, Alltag und Küche.
              </p>
              <a
                href="#produkte"
                className="inline-block px-7 py-3 bg-[#2A2A2A] text-white text-[15px] font-medium rounded-full hover:bg-[#1a1a1a] transition"
              >
                Jetzt entdecken
              </a>
            </div>
          </div>
        </section>

        {/* ==================== CATEGORY SECTION ==================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Für Kinder */}
              <Link href="/kategorie/kinder" className="group block">
                <div className="relative aspect-[1/1.1] rounded-2xl overflow-hidden bg-[#EAE6DF]">
                  <Image
                    src="/images/stabilo-easygraph-bleistift-linkshaender.jpg"
                    alt="Für Kinder — Linkshänder Produkte"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p
                  className="text-center mt-4 text-[18px] sm:text-[20px] text-[#1A1A1A]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Für Kinder
                </p>
              </Link>

              {/* Alltag */}
              <Link href="/kategorie/alltag" className="group block">
                <div className="relative aspect-[1/1.1] rounded-2xl overflow-hidden bg-[#EAE6DF]">
                  <Image
                    src="/images/leuchtturm1917-notizbuch-linkshaender.jpg"
                    alt="Alltag — Linkshänder Produkte"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p
                  className="text-center mt-4 text-[18px] sm:text-[20px] text-[#1A1A1A]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Alltag
                </p>
              </Link>

              {/* Küche */}
              <Link href="/kategorie/kueche" className="group block">
                <div className="relative aspect-[1/1.1] rounded-2xl overflow-hidden bg-[#EAE6DF]">
                  <Image
                    src="/images/linkshaender-kuechenmesser-20cm.jpg"
                    alt="Küche — Linkshänder Produkte"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p
                  className="text-center mt-4 text-[18px] sm:text-[20px] text-[#1A1A1A]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Küche
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== PRODUCT HIGHLIGHTS ==================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F0EBE3]">
          <div className="max-w-[1100px] mx-auto">
            <h2
              className="text-[28px] sm:text-[36px] text-[#1A1A1A] mb-2"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Unsere Highlights für den Alltag
            </h2>
            <p className="text-[16px] text-[#888] italic mb-10">
              Perfekt für den täglichen Gebrauch.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Card 1 — Linkshänder-Schere */}
              <div className="bg-white rounded-[14px] p-6 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-1">
                    Linkshänder-Schere
                  </h3>
                  <p className="text-[16px] text-[#555] mb-4">€ 16,90</p>
                  <a
                    href="#produkte"
                    className="inline-block px-5 py-2 bg-[#B5A87E] text-white text-[13px] font-medium rounded-full hover:bg-[#A49770] transition"
                  >
                    Entdecken
                  </a>
                </div>
                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#F6F5F2]">
                  <Image
                    src="/images/westcott-linkshaender-schere.jpg"
                    alt="Linkshänder-Schere"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Product Card 2 — Notizbuch */}
              <div className="bg-white rounded-[14px] p-6 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-1">
                    Notizbuch für Linkshänder
                  </h3>
                  <p className="text-[16px] text-[#555] mb-4">€ 19,90</p>
                  <a
                    href="#produkte"
                    className="inline-block px-5 py-2 bg-[#B5A87E] text-white text-[13px] font-medium rounded-full hover:bg-[#A49770] transition"
                  >
                    Entdecken
                  </a>
                </div>
                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#F6F5F2]">
                  <Image
                    src="/images/leuchtturm1917-notizbuch-linkshaender.jpg"
                    alt="Notizbuch für Linkshänder"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SOCIAL PROOF / INSTAGRAM ==================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-[1100px] mx-auto text-center mb-10">
            <h2
              className="text-[28px] sm:text-[36px] text-[#1A1A1A] mb-3"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Links praktisch — von Experten geprüft
            </h2>
            <p className="text-[16px] text-[#888]">
              Folge uns auf Instagram 📷
            </p>
          </div>

          {/* Instagram Grid — 5 squares, full-width, no gaps */}
          <div className="grid grid-cols-5 w-full">
            {[
              '#E8DFD3',
              '#D4C4AC',
              '#EAE6DF',
              '#F0EBE3',
              '#D9CFC2',
            ].map((color, i) => (
              <div key={i} className="relative aspect-square" style={{ backgroundColor: color }}>
                {/* Placeholder with subtle variation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B5A87E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== PRODUCTS FROM MEDUSA ==================== */}
        <section id="produkte" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F6F5F2]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-16">
              <h2
                className="text-[28px] sm:text-[36px] text-[#1A1A1A] mb-4"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Unsere Linkshänder-Produkte
              </h2>
              <p className="text-[#888] max-w-lg mx-auto text-[16px]">
                Jedes Produkt wurde speziell für die linke Hand entwickelt. Keine Kompromisse.
              </p>
            </div>

            <ProductFilter products={products} />
          </div>
        </section>

        {/* ==================== FAQ SECTION ==================== */}
        <section className="py-20 px-6 bg-[#F6F5F2]" id="faq">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-[28px] sm:text-[36px] text-center text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Häufig gestellte Fragen
            </h2>
            <p className="text-[#888] text-center mb-12">
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
                <details key={i} className="group bg-white rounded-2xl">
                  <summary className="flex justify-between items-center cursor-pointer p-6 font-medium text-[#1A1A1A]">
                    {faq.q}
                    <span className="ml-4 text-[#A9A39A] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-6 pb-6 text-[#555] leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="bg-[#0F2E4F] text-white py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 21c-1.5 0-7-3.5-7-9.5C5 8 7.5 6 9 6c1 0 2 .5 3 2 1-1.5 2-2 3-2 1.5 0 4 2 4 5.5 0 6-5.5 9.5-7 9.5z" fill="currentColor"/>
                    <circle cx="7" cy="5" r="2.5" fill="currentColor"/>
                    <circle cx="17" cy="5" r="2.5" fill="currentColor"/>
                    <circle cx="4" cy="9" r="2" fill="currentColor"/>
                    <circle cx="20" cy="9" r="2" fill="currentColor"/>
                  </svg>
                  <span className="text-lg font-bold tracking-wide">SÜDPFOTE</span>
                </div>
                <p className="text-[#8BA3BE] max-w-sm mb-6">
                  Premium Produkte für Linkshänder. Weil 10% der Welt auch 100% verdienen.
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-[#1A3E60] rounded text-xs text-[#8BA3BE]">Visa</span>
                  <span className="px-3 py-1 bg-[#1A3E60] rounded text-xs text-[#8BA3BE]">Mastercard</span>
                  <span className="px-3 py-1 bg-[#1A3E60] rounded text-xs text-[#8BA3BE]">PayPal</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-[#8BA3BE]">
                  <li><a href="#produkte" className="hover:text-white transition">Alle Produkte</a></li>
                  <li><Link href="/kategorie/schule" className="hover:text-white transition">Schule</Link></li>
                  <li><Link href="/kategorie/kueche" className="hover:text-white transition">Küche</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Über uns</h4>
                <ul className="space-y-2 text-[#8BA3BE]">
                  <li><Link href="/story" className="hover:text-white transition">Unsere Story</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                  <li><a href="mailto:hallo@suedpfote.de" className="hover:text-white transition">Kontakt</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Rechtliches</h4>
                <ul className="space-y-2 text-[#8BA3BE]">
                  <li><Link href="/impressum" className="hover:text-white transition">Impressum</Link></li>
                  <li><Link href="/datenschutz" className="hover:text-white transition">Datenschutz</Link></li>
                  <li><Link href="/agb" className="hover:text-white transition">AGB</Link></li>
                  <li><Link href="/widerruf" className="hover:text-white transition">Widerruf</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-[#1A3E60] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#6B8DAB]">© 2026 Südpfote. Alle Rechte vorbehalten.</p>
              <p className="text-sm text-[#6B8DAB]">Made with 💜 by Fabian &amp; Nyx 🦞</p>
            </div>
          </div>
        </footer>
      </CartToggle>
    </div>
  );
}
