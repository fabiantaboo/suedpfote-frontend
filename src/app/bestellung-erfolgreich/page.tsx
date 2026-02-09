import Link from 'next/link';

export const metadata = {
  title: 'Bestellung erfolgreich | Südpfote',
  description: 'Vielen Dank für deine Bestellung bei Südpfote!',
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">
          Vielen Dank!
        </h1>
        <p className="text-lg text-zinc-600 mb-2">
          Deine Bestellung ist eingegangen.
        </p>
        <p className="text-zinc-500 mb-8">
          Du erhältst in Kürze eine Bestätigung per E-Mail.
          Wir versenden so schnell wie möglich!
        </p>

        <div className="bg-zinc-50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-zinc-900 mb-3">Was passiert jetzt?</h3>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Zahlung erfolgreich verarbeitet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>Bestätigungs-Email wird versendet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-zinc-300 mt-0.5">○</span>
              <span>Versand innerhalb von 1-3 Werktagen</span>
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block w-full py-4 bg-zinc-900 text-white rounded-full font-medium hover:bg-zinc-700 transition"
        >
          Weiter einkaufen
        </Link>
      </div>
    </div>
  );
}
