import Link from 'next/link';
import Image from 'next/image';
import CartToggle from '@/components/CartToggle';

export default async function Home() {
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
    <div className="min-h-screen bg-[#f6f2ef]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CartToggle>
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative w-full h-[520px] sm:h-[600px] md:h-[680px] mt-16 md:mt-20 overflow-hidden">
          {/* Background — lifestyle hero image */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-banner.png"
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
                style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
              >
                Endlich für<br />
                links gedacht.
              </h1>
              <p className="text-[16px] sm:text-[18px] text-[#555] leading-relaxed mb-8 max-w-md">
                Die passenden Produkte für<br />
                Schule, Alltag und Küche.
              </p>
              <Link
                href="/kategorien"
                className="inline-block px-7 py-3 bg-[#2F2F2A] text-white text-[15px] font-medium rounded-full hover:bg-[#3D3D36] transition"
              >
                Jetzt entdecken
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== CATEGORY SECTION ==================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f6f2ef]">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Für Kinder */}
              <Link href="/kategorie/kinder" className="group block">
                <div className="overflow-hidden rounded-t-2xl">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-[#ede5e1]">
                    <Image
                      src="/images/categories/kinder.jpg"
                      alt="Für Kinder — Linkshänder Produkte"
                      fill
                      className="object-cover scale-[1.08] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-[#ede5e1] rounded-b-2xl py-4">
                  <p
                    className="text-center text-[18px] sm:text-[20px] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
                  >
                    Für Kinder
                  </p>
                </div>
              </Link>

              {/* Alltag */}
              <Link href="/kategorie/alltag" className="group block">
                <div className="overflow-hidden rounded-t-2xl">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-[#ede5e1]">
                    <Image
                      src="/images/categories/alltag.jpg"
                      alt="Alltag — Linkshänder Produkte"
                      fill
                      className="object-cover scale-[1.08] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-[#ede5e1] rounded-b-2xl py-4">
                  <p
                    className="text-center text-[18px] sm:text-[20px] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
                  >
                    Alltag
                  </p>
                </div>
              </Link>

              {/* Küche */}
              <Link href="/kategorie/kueche" className="group block">
                <div className="overflow-hidden rounded-t-2xl">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-[#ede5e1]">
                    <Image
                      src="/images/categories/kueche.png"
                      alt="Küche — Linkshänder Produkte"
                      fill
                      className="object-cover scale-[1.08] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-[#ede5e1] rounded-b-2xl py-4">
                  <p
                    className="text-center text-[18px] sm:text-[20px] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
                  >
                    Küche
                  </p>
                </div>
              </Link>
            </div>

            {/* Second Category Grid: Schule, Sport & Freizeit, Alle Produkte */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              {/* Schule */}
              <Link href="/kategorie/schule" className="group block">
                <div className="overflow-hidden rounded-t-2xl">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-[#ede5e1]">
                    <Image
                      src="/images/categories/schule.jpg"
                      alt="Schule — Linkshänder Produkte"
                      fill
                      className="object-cover scale-[1.08] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-[#ede5e1] rounded-b-2xl py-4">
                  <p
                    className="text-center text-[18px] sm:text-[20px] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
                  >
                    Schule
                  </p>
                </div>
              </Link>

              {/* Sport & Freizeit */}
              <Link href="/kategorie/sport" className="group block">
                <div className="overflow-hidden rounded-t-2xl">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-[#ede5e1]">
                    <Image
                      src="/images/categories/sport.jpg"
                      alt="Sport & Freizeit — Linkshänder Produkte"
                      fill
                      className="object-cover scale-[1.08] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-[#ede5e1] rounded-b-2xl py-4">
                  <p
                    className="text-center text-[18px] sm:text-[20px] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
                  >
                    Sport &amp; Freizeit
                  </p>
                </div>
              </Link>

              {/* Alle Produkte */}
              <Link href="/kategorien" className="group block">
                <div className="overflow-hidden rounded-t-2xl">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-[#ede5e1]">
                    <Image
                      src="/images/categories/alle-produkte.png"
                      alt="Alle Produkte — Linkshänder Shop"
                      fill
                      className="object-cover scale-[1.08] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="bg-[#ede5e1] rounded-b-2xl py-4">
                  <p
                    className="text-center text-[18px] sm:text-[20px] text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
                  >
                    Alle Produkte
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== PRODUCT HIGHLIGHTS ==================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#ede5e1]">
          <div className="max-w-[1100px] mx-auto">
            <h2
              className="text-[28px] sm:text-[36px] text-[#1A1A1A] mb-2"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
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
                  <Link
                    href="/kategorien"
                    className="inline-block px-5 py-2 bg-[#ab9b83] text-white text-[13px] font-medium rounded-full hover:bg-[#9A8B75] transition"
                  >
                    Entdecken
                  </Link>
                </div>
                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#f6f2ef]">
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
                  <Link
                    href="/kategorien"
                    className="inline-block px-5 py-2 bg-[#ab9b83] text-white text-[13px] font-medium rounded-full hover:bg-[#9A8B75] transition"
                  >
                    Entdecken
                  </Link>
                </div>
                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#f6f2ef]">
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
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f6f2ef]">
          <div className="max-w-[1100px] mx-auto text-center mb-10">
            <h2
              className="text-[28px] sm:text-[36px] text-[#1A1A1A] mb-3"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
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

        {/* ==================== FAQ SECTION ==================== */}
        <section className="py-20 px-6 bg-[#f6f2ef]" id="faq">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-[28px] sm:text-[36px] text-center text-[#1A1A1A] mb-4"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 }}
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
        <footer className="bg-[#f2edeb] text-[#3D3329] py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center gap-1.5">
                  <Image
                    src="/logo-icon.png"
                    alt="Südpfote Logo"
                    width={28}
                    height={28}
                    className="!h-5 sm:!h-6 !w-auto max-h-5 sm:max-h-6"
                  />
                  <Image
                    src="/logo-suedpfote.png"
                    alt="Südpfote"
                    width={80}
                    height={14}
                    className="!h-3 sm:!h-4 !w-auto max-h-3 sm:max-h-4"
                  />
                </div>
                <p className="text-[#8B7E74] max-w-sm mb-6">
                  Premium Produkte für Linkshänder. Weil 10% der Welt auch 100% verdienen.
                </p>
                <div className="flex gap-3">
                  <span className="px-3 py-1 bg-[#D9D2C9] rounded text-xs text-[#6B5F53]">Visa</span>
                  <span className="px-3 py-1 bg-[#D9D2C9] rounded text-xs text-[#6B5F53]">Mastercard</span>
                  <span className="px-3 py-1 bg-[#D9D2C9] rounded text-xs text-[#6B5F53]">PayPal</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-[#8B7E74]">
                  <li><Link href="/kategorien" className="hover:text-[#3D3329] transition">Alle Produkte</Link></li>
                  <li><Link href="/kategorie/schule" className="hover:text-[#3D3329] transition">Schule</Link></li>
                  <li><Link href="/kategorie/kueche" className="hover:text-[#3D3329] transition">Küche</Link></li>
                  <li><Link href="/kategorie/sport" className="hover:text-[#3D3329] transition">Sport &amp; Freizeit</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Über uns</h4>
                <ul className="space-y-2 text-[#8B7E74]">
                  <li><Link href="/story" className="hover:text-[#3D3329] transition">Unsere Story</Link></li>
                  <li><Link href="/faq" className="hover:text-[#3D3329] transition">FAQ</Link></li>
                  <li><Link href="/versand" className="hover:text-[#3D3329] transition">Lieferung &amp; Versand</Link></li>
                  <li><a href="mailto:hallo@suedpfote.de" className="hover:text-[#3D3329] transition">Kontakt</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Rechtliches</h4>
                <ul className="space-y-2 text-[#8B7E74]">
                  <li><Link href="/impressum" className="hover:text-[#3D3329] transition">Impressum</Link></li>
                  <li><Link href="/datenschutz" className="hover:text-[#3D3329] transition">Datenschutz</Link></li>
                  <li><Link href="/agb" className="hover:text-[#3D3329] transition">AGB</Link></li>
                  <li><Link href="/widerruf" className="hover:text-[#3D3329] transition">Widerruf</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-[#D9D2C9] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#8B7E74]">© 2026 Südpfote. Alle Rechte vorbehalten.</p>
              <p className="text-sm text-[#8B7E74]">Made with 💜 by Fabian &amp; Nyx 🦞</p>
            </div>
          </div>
        </footer>
      </CartToggle>
    </div>
  );
}
