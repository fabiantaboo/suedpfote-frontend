import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung',
  description: 'Widerrufsbelehrung für Südpfote - Ihr 14-tägiges Widerrufsrecht.',
};

export default function WiderrufPage() {
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
          <h1 className="text-4xl font-bold text-zinc-900 mb-8">Widerrufsbelehrung</h1>
          
          <div className="prose prose-zinc max-w-none">
            <h2>Widerrufsrecht</h2>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen 
              Vertrag zu widerrufen.
            </p>
            <p>
              Die Widerrufsfrist beträgt <strong>vierzehn Tage</strong> ab dem Tag, an dem Sie 
              oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren 
              in Besitz genommen haben bzw. hat.
            </p>

            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
            </p>
            <p className="bg-zinc-50 p-4 rounded-lg">
              <strong>Südpfote</strong><br />
              [Adresse]<br />
              E-Mail: hallo@suedpfote.de
            </p>
            <p>
              mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder 
              E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>

            <h2>Folgen des Widerrufs</h2>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von 
              Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der 
              zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der 
              Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt 
              haben), unverzüglich und spätestens binnen <strong>vierzehn Tagen</strong> ab 
              dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses 
              Vertrags bei uns eingegangen ist.
            </p>
            <p>
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der 
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde 
              ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen 
              dieser Rückzahlung Entgelte berechnet.
            </p>
            <p>
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten 
              haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt 
              haben, je nachdem, welches der frühere Zeitpunkt ist.
            </p>

            <h2>Rücksendung der Waren</h2>
            <p>
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen 
              <strong> vierzehn Tagen</strong> ab dem Tag, an dem Sie uns über den Widerruf 
              dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben.
            </p>
            <p>
              Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn 
              Tagen absenden.
            </p>
            <p>
              <strong>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</strong>
            </p>

            <h2>Wertverlust</h2>
            <p>
              Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser 
              Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und 
              Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
              <h3 className="text-amber-900 mt-0">Muster-Widerrufsformular</h3>
              <p className="text-amber-800 text-sm mb-4">
                Wenn Sie den Vertrag widerrufen wollen, können Sie das folgende Formular 
                ausfüllen und an uns senden:
              </p>
              <div className="bg-white p-4 rounded border border-amber-200 text-sm">
                <p className="mb-2">An:</p>
                <p className="mb-4">
                  Südpfote<br />
                  [Adresse]<br />
                  E-Mail: hallo@suedpfote.de
                </p>
                <p className="mb-2">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen 
                  Vertrag über den Kauf der folgenden Waren (*):
                </p>
                <p className="mb-2">_________________________________</p>
                <p className="mb-2">Bestellt am (*) / erhalten am (*):</p>
                <p className="mb-2">_________________________________</p>
                <p className="mb-2">Name des/der Verbraucher(s):</p>
                <p className="mb-2">_________________________________</p>
                <p className="mb-2">Anschrift des/der Verbraucher(s):</p>
                <p className="mb-2">_________________________________</p>
                <p className="mb-2">Datum, Unterschrift</p>
                <p className="mb-0">_________________________________</p>
                <p className="text-xs text-zinc-500 mt-4">(*) Unzutreffendes streichen</p>
              </div>
            </div>
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
