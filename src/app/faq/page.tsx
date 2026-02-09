import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FAQ | Häufige Fragen zu Linkshänder-Produkten',
  description: 'Antworten auf häufige Fragen zu Linkshänder-Produkten, Versand, Rückgabe und mehr. Alles was du über Südpfote und unsere Linkshänder-Produkte wissen musst.',
  alternates: { canonical: 'https://suedpfote.de/faq' },
  openGraph: {
    title: 'FAQ | Südpfote Linkshänder-Shop',
    description: 'Häufige Fragen zu Linkshänder-Produkten, Versand und Rückgabe.',
    url: 'https://suedpfote.de/faq',
  },
};

const faqs = [
  {
    question: 'Sind eure Produkte wirklich anders als normale?',
    answer: 'Ja! Unsere Produkte sind von Grund auf für Linkshänder konzipiert - nicht einfach gespiegelt oder adaptiert. Die Ergonomie, die Mechanik, alles ist für die linke Hand optimiert. Bei unseren Scheren zum Beispiel ist die Klingenführung so angepasst, dass die Schneidebewegung der linken Hand das Material zusammendrückt statt auseinander.',
  },
  {
    question: 'Woher weiß ich, ob ich ein Produkt brauche?',
    answer: 'Wenn du dich jemals gefragt hast, warum etwas "irgendwie komisch" in der Hand liegt oder nicht richtig funktioniert - das ist oft kein Zufall. Viele Linkshänder haben sich so daran gewöhnt, dass sie gar nicht mehr merken, wie viel Energie sie für Kompensation aufwenden.',
  },
  {
    question: 'Sind Linkshänder-Produkte nicht teurer?',
    answer: 'Traditionell ja, weil kleine Stückzahlen die Produktion verteuern. Wir arbeiten mit Herstellern zusammen, die auf Linkshänder-Produkte spezialisiert sind und können so faire Preise anbieten. Qualität hat ihren Preis - aber keinen Aufschlag nur weil du links schreibst.',
  },
  {
    question: 'Kann ich auch als Rechtshänder bestellen?',
    answer: 'Klar! Viele unserer Kunden kaufen Geschenke für linkshändige Familienmitglieder oder Freunde. Nur sei gewarnt: Die Produkte funktionieren wirklich nur gut für Linkshänder - ein Rechtshänder hätte die gleichen Probleme, die Linkshänder mit normalen Produkten haben.',
  },
  {
    question: 'Wie funktioniert die Rückgabe?',
    answer: '30 Tage Rückgaberecht, keine Fragen. Wenn ein Produkt nicht passt, schick es zurück. Wir wissen, dass jede Hand anders ist - und manchmal muss man ausprobieren.',
  },
  {
    question: 'Liefert ihr auch ins Ausland?',
    answer: 'Aktuell liefern wir nach Deutschland, Österreich und in die Schweiz. EU-weiter Versand ist in Planung. Schreib uns, wenn du woanders wohnst - wir finden eine Lösung.',
  },
  {
    question: 'Habt ihr ein Ladengeschäft?',
    answer: 'Noch nicht - wir sind ein reiner Online-Shop. Aber wir planen Pop-up Stores und Events, wo du unsere Produkte anfassen und testen kannst. Newsletter abonnieren, um informiert zu bleiben!',
  },
  {
    question: 'Warum "Südpfote"?',
    answer: 'Linkshänder werden im Englischen manchmal "Southpaw" genannt - die "Südpfote". Der Begriff kommt ursprünglich aus dem Baseball, wo ein linkshändiger Pitcher nach Süden zeigt. Wir fanden: Das klingt nach einer Bewegung. Nach uns.',
  },
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://suedpfote.de' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://suedpfote.de/faq' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
            <Link href="/story" className="text-sm text-zinc-600 hover:text-zinc-900 transition">Story</Link>
            <Link href="/faq" className="text-sm text-zinc-900 font-medium">FAQ</Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-20 px-6">
        <ol className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-zinc-400">
          <li><Link href="/" className="hover:text-zinc-600 transition">Home</Link></li>
          <li>/</li>
          <li className="text-zinc-900 font-medium">FAQ</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="pt-8 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">
            Häufige Fragen
          </p>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-6">
            Alles was du über Linkshänder-Produkte wissen musst
          </h1>
          <p className="text-xl text-zinc-500">
            Noch Fragen? Schreib uns an hallo@suedpfote.de
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border border-zinc-200 rounded-2xl overflow-hidden">
                <summary className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-50 transition cursor-pointer">
                  <span className="font-medium text-zinc-900 pr-4">{faq.question}</span>
                  <span className="text-2xl text-zinc-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-zinc-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Noch Fragen?</h2>
          <p className="text-zinc-500 mb-8">Unser Team antwortet innerhalb von 24 Stunden.</p>
          <a
            href="mailto:hallo@suedpfote.de"
            className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-800 transition"
          >
            Kontakt aufnehmen
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-semibold text-zinc-900">Südpfote</span>
          </div>
          <p className="text-sm text-zinc-400">Made with 💜 by Fabian &amp; Nyx 🦞</p>
          <p className="text-sm text-zinc-400">© 2026 Südpfote</p>
        </div>
      </footer>
    </div>
  );
}
