import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Allgemeine Geschäftsbedingungen von Südpfote.',
};

export default function AGBPage() {
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
          <h1 className="text-4xl font-bold text-zinc-900 mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="prose prose-zinc max-w-none">
            <h2>§ 1 Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die Verbraucher 
              und Unternehmer über unseren Online-Shop abschließen.
            </p>

            <h2>§ 2 Vertragspartner</h2>
            <p>
              Der Kaufvertrag kommt zustande mit Südpfote, [vollständige Firmenangaben].
            </p>

            <h2>§ 3 Vertragsschluss</h2>
            <p>
              (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, 
              sondern einen unverbindlichen Online-Katalog dar.
            </p>
            <p>
              (2) Durch Anklicken des Buttons "Jetzt kaufen" geben Sie eine verbindliche Bestellung der 
              im Warenkorb enthaltenen Waren ab. Die Bestätigung des Zugangs der Bestellung erfolgt 
              unmittelbar nach dem Absenden.
            </p>
            <p>
              (3) Der Kaufvertrag kommt zustande, wenn wir Ihre Bestellung durch eine Auftragsbestätigung 
              per E-Mail annehmen.
            </p>

            <h2>§ 4 Preise und Zahlung</h2>
            <p>
              (1) Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
            </p>
            <p>
              (2) Versandkosten werden gesondert ausgewiesen. Ab einem Bestellwert von 50 € liefern wir 
              versandkostenfrei innerhalb Deutschlands.
            </p>
            <p>
              (3) Die Zahlung erfolgt wahlweise per Kreditkarte, PayPal oder anderen angebotenen 
              Zahlungsmethoden.
            </p>

            <h2>§ 5 Lieferung</h2>
            <p>
              (1) Die Lieferung erfolgt innerhalb Deutschlands. Lieferungen in andere EU-Länder sind 
              nach Absprache möglich.
            </p>
            <p>
              (2) Die Lieferzeit beträgt in der Regel 2-5 Werktage.
            </p>

            <h2>§ 6 Eigentumsvorbehalt</h2>
            <p>
              Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
            </p>

            <h2>§ 7 Gewährleistung</h2>
            <p>
              Es gelten die gesetzlichen Gewährleistungsrechte.
            </p>

            <h2>§ 8 Haftung</h2>
            <p>
              Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach Maßgabe des 
              Produkthaftungsgesetzes. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung 
              einer wesentlichen Vertragspflicht.
            </p>

            <h2>§ 9 Schlussbestimmungen</h2>
            <p>
              (1) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.
            </p>
            <p>
              (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit 
              der übrigen Bestimmungen unberührt.
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
