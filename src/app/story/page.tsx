import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unsere Story | Warum wir für Linkshänder kämpfen',
  description: 'Die Geschichte hinter Südpfote. Wir glauben, dass 10% der Weltbevölkerung bessere Produkte verdienen. Das ist unsere Mission.',
  alternates: { canonical: 'https://suedpfote.de/story' },
  openGraph: {
    title: 'Unsere Story | Südpfote',
    description: 'Die Geschichte hinter Südpfote. Wir glauben, dass 10% der Weltbevölkerung bessere Produkte verdienen.',
    url: 'https://suedpfote.de/story',
  },
};

export default function StoryPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Über Südpfote',
    description: 'Die Geschichte hinter Südpfote - Premium Produkte für Linkshänder.',
    url: 'https://suedpfote.de/story',
    mainEntity: {
      '@type': 'Organization',
      name: 'Südpfote',
      url: 'https://suedpfote.de',
      foundingDate: '2026',
      description: 'Premium Produkte für Linkshänder. Der Shop für die anderen 10%.',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suedpfote.de' },
      { '@type': 'ListItem', position: 2, name: 'Unsere Story', item: 'https://suedpfote.de/story' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-semibold text-zinc-900 tracking-tight">Südpfote</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/#produkte" className="text-sm text-zinc-600 hover:text-zinc-900 transition">Produkte</Link>
            <Link href="/story" className="text-sm text-zinc-900 font-medium">Story</Link>
            <Link href="/faq" className="text-sm text-zinc-600 hover:text-zinc-900 transition">FAQ</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">
            Unsere Geschichte
          </p>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-6">
            Warum wir das machen
          </h1>
        </div>
      </section>

      {/* Story Content */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg prose-zinc">
            <p className="text-xl text-zinc-600 leading-relaxed mb-8">
              Alles begann mit einer Schere, die nicht schnitt.
            </p>
            
            <p className="text-zinc-600 leading-relaxed mb-6">
              Kennst du das? Du willst einfach nur Papier schneiden. Aber die Schere 
              quetscht statt zu schneiden. Deine Hand verkrampft. Du drehst und wendest - 
              nichts hilft. Weil die Schere nicht für dich gemacht wurde.
            </p>

            <p className="text-zinc-600 leading-relaxed mb-6">
              10% der Weltbevölkerung sind Linkshänder. Das sind über 800 Millionen Menschen. 
              In Deutschland allein 8 Millionen. Und trotzdem ist fast jedes Alltagsprodukt 
              für die rechte Hand optimiert.
            </p>

            <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">
              Die unsichtbare Barriere
            </h2>

            <p className="text-zinc-600 leading-relaxed mb-6">
              Als Linkshänder lernst du früh, dich anzupassen. Du hältst die Schere "falsch". 
              Du schmierst beim Schreiben. Du liest das Lineal von der falschen Seite. 
              Irgendwann denkst du: So bin ich halt.
            </p>

            <p className="text-zinc-600 leading-relaxed mb-6">
              Aber das stimmt nicht. Du bist nicht falsch. Die Produkte sind es.
            </p>

            <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">
              Südpfote: Für die anderen 10%
            </h2>

            <p className="text-zinc-600 leading-relaxed mb-6">
              Wir haben Südpfote gegründet, weil wir glauben: Jeder verdient Produkte, 
              die einfach funktionieren. Ohne Kompromisse. Ohne Anpassung.
            </p>

            <p className="text-zinc-600 leading-relaxed mb-6">
              Jedes Produkt in unserem Shop wurde von Grund auf für Linkshänder entwickelt. 
              Nicht adaptiert. Nicht "auch für Links geeignet". Sondern: Links first.
            </p>

            <div className="bg-zinc-50 rounded-2xl p-8 my-12">
              <p className="text-xl font-medium text-zinc-900 text-center italic">
                "Du bist nicht falsch gebaut. Die Welt ist es."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">
              Unsere Mission
            </h2>

            <p className="text-zinc-600 leading-relaxed mb-6">
              Wir wollen, dass sich Linkshänder-Produkte anfühlen, als wären sie 
              schon immer für dich da gewesen. Natürlich. Intuitiv. Richtig.
            </p>

            <p className="text-zinc-600 leading-relaxed mb-8">
              Das ist Südpfote. Für die anderen 10%.
            </p>

            <div className="flex justify-center">
              <Link 
                href="/#produkte"
                className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition"
              >
                Produkte entdecken →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12">Das Team</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-24 h-24 bg-zinc-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍💻
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">Fabian</h3>
              <p className="text-zinc-500">Gründer & Linkshänder</p>
            </div>
            <div>
              <div className="w-24 h-24 bg-zinc-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                🦞
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">Nyx</h3>
              <p className="text-zinc-500">AI Co-Founder & Linksschererin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-semibold text-zinc-900">Südpfote</span>
          </div>
          <p className="text-sm text-zinc-400">
            Made with 💜 by Fabian & Nyx 🦞
          </p>
          <p className="text-sm text-zinc-400">
            © 2026 Südpfote
          </p>
        </div>
      </footer>
    </div>
  );
}
