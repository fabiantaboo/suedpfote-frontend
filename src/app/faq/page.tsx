'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'Sind eure Produkte wirklich anders als normale?',
    answer: 'Ja! Unsere Produkte sind von Grund auf für Linkshänder konzipiert - nicht einfach gespiegelt oder adaptiert. Die Ergonomie, die Mechanik, alles ist für die linke Hand optimiert. Bei unseren Scheren zum Beispiel ist die Klingenführung so angepasst, dass die Schneidebewegung der linken Hand das Material zusammendrückt statt auseinander.'
  },
  {
    question: 'Woher weiß ich, ob ich ein Produkt brauche?',
    answer: 'Wenn du dich jemals gefragt hast, warum etwas "irgendwie komisch" in der Hand liegt oder nicht richtig funktioniert - das ist oft kein Zufall. Viele Linkshänder haben sich so daran gewöhnt, dass sie gar nicht mehr merken, wie viel Energie sie für Kompensation aufwenden.'
  },
  {
    question: 'Sind Linkshänder-Produkte nicht teurer?',
    answer: 'Traditionell ja, weil kleine Stückzahlen die Produktion verteuern. Wir arbeiten mit Herstellern zusammen, die auf Linkshänder-Produkte spezialisiert sind und können so faire Preise anbieten. Qualität hat ihren Preis - aber keinen Aufschlag nur weil du links schreibst.'
  },
  {
    question: 'Kann ich auch als Rechtshänder bestellen?',
    answer: 'Klar! Viele unserer Kunden kaufen Geschenke für linkshändige Familienmitglieder oder Freunde. Nur sei gewarnt: Die Produkte funktionieren wirklich nur gut für Linkshänder - ein Rechtshänder hätte die gleichen Probleme, die Linkshänder mit normalen Produkten haben.'
  },
  {
    question: 'Wie funktioniert die Rückgabe?',
    answer: '30 Tage Rückgaberecht, keine Fragen. Wenn ein Produkt nicht passt, schick es zurück. Wir wissen, dass jede Hand anders ist - und manchmal muss man ausprobieren.'
  },
  {
    question: 'Liefert ihr auch ins Ausland?',
    answer: 'Aktuell liefern wir nach Deutschland, Österreich und in die Schweiz. EU-weiter Versand ist in Planung. Schreib uns, wenn du woanders wohnst - wir finden eine Lösung.'
  },
  {
    question: 'Habt ihr ein Ladengeschäft?',
    answer: 'Noch nicht - wir sind ein reiner Online-Shop. Aber wir planen Pop-up Stores und Events, wo du unsere Produkte anfassen und testen kannst. Newsletter abonnieren, um informiert zu bleiben!'
  },
  {
    question: 'Warum "Südpfote"?',
    answer: 'Linkshänder werden im Englischen manchmal "Southpaw" genannt - die "Südpfote". Der Begriff kommt ursprünglich aus dem Baseball, wo ein linkshändiger Pitcher nach Süden zeigt. Wir fanden: Das klingt nach einer Bewegung. Nach uns.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
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

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">
            Häufige Fragen
          </p>
          <h1 className="text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-6">
            Alles was du wissen musst
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
              <div 
                key={index}
                className="border border-zinc-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-50 transition"
                >
                  <span className="font-medium text-zinc-900 pr-4">{faq.question}</span>
                  <span className={`text-2xl text-zinc-400 transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-zinc-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 bg-zinc-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Noch Fragen?
          </h2>
          <p className="text-zinc-500 mb-8">
            Unser Team antwortet innerhalb von 24 Stunden.
          </p>
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
