import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Südpfote - Informationen zum Umgang mit Ihren Daten.',
};

export default function DatenschutzPage() {
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
          <h1 className="text-4xl font-bold text-zinc-900 mb-8">Datenschutzerklärung</h1>
          
          <div className="prose prose-zinc max-w-none">
            <h2>1. Datenschutz auf einen Blick</h2>
            
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
              personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
            </p>

            <h3>Datenerfassung auf unserer Website</h3>
            <p>
              <strong>Wer ist verantwortlich für die Datenerfassung?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. 
              Dessen Kontaktdaten können Sie dem Impressum entnehmen.
            </p>

            <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3>Datenschutz</h3>
            <p>
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre 
              personenbezogenen Daten vertraulich und entsprechend der gesetzlichen 
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3>Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br /><br />
              Südpfote<br />
              [Adresse]<br />
              E-Mail: hallo@suedpfote.de
            </p>

            <h2>3. Datenerfassung auf unserer Website</h2>
            
            <h3>Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Cookies richten auf Ihrem Rechner keinen Schaden 
              an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher 
              und effektiver zu machen.
            </p>
            <p>
              Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies 
              informiert werden und Cookies nur im Einzelfall erlauben.
            </p>

            <h3>Server-Log-Dateien</h3>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in 
              sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
            </p>

            <h2>4. Bestellabwicklung</h2>
            <p>
              Wir erheben personenbezogene Daten, wenn Sie uns diese im Rahmen Ihrer Bestellung 
              mitteilen. Pflichtfelder werden als solche gekennzeichnet. Die Daten werden für 
              die Abwicklung Ihrer Bestellung und zur Bearbeitung Ihrer Anfragen verwendet.
            </p>

            <h2>5. Zahlungsdienstleister</h2>
            
            <h3>Stripe</h3>
            <p>
              Wir nutzen den Zahlungsdienstleister Stripe. Bei Zahlung via Stripe werden Ihre 
              Zahlungsdaten an Stripe übermittelt. Es gelten die Datenschutzbestimmungen von 
              Stripe: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">
                https://stripe.com/de/privacy
              </a>
            </p>

            <h2>6. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul>
              <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten</li>
              <li>Diese Daten berichtigen oder löschen zu lassen</li>
              <li>Die Verarbeitung einschränken zu lassen</li>
              <li>Der Verarbeitung zu widersprechen</li>
              <li>Datenübertragbarkeit zu verlangen</li>
            </ul>

            <h2>7. SSL-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-Verschlüsselung. Eine 
              verschlüsselte Verbindung erkennen Sie an dem Schloss-Symbol in Ihrer Browserzeile.
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
