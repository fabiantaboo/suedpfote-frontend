import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Informationen von Südpfote.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-semibold text-zinc-900 tracking-tight">Südpfote</span>
          </Link>
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 transition">
            ← Zurück zum Shop
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-zinc-900 mb-8">Impressum</h1>
          
          <div className="prose prose-zinc max-w-none">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              Südpfote (Fabian Budde)<br />
              Wird nach Umzug aktualisiert<br />
              Wird nach Umzug aktualisiert<br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail: info@suedpfote.de<br />
              Telefon: Auf Anfrage
            </p>

            <h2>Umsatzsteuer-ID</h2>
            <p>
              Kleinunternehmer gem. §19 UStG
            </p>

            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Fabian Budde<br />
              Wird nach Umzug aktualisiert
            </p>

            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>

            <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100">
            <p className="text-sm text-zinc-500">
              Stand: Februar 2026
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 py-8 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center text-sm text-zinc-500">
          <Link href="/impressum" className="hover:text-zinc-900">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-zinc-900">Datenschutz</Link>
          <Link href="/agb" className="hover:text-zinc-900">AGB</Link>
          <Link href="/widerruf" className="hover:text-zinc-900">Widerruf</Link>
        </div>
      </footer>
    </div>
  );
}
