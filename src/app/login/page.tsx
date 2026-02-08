'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSpinner, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const redirectTo = searchParams.get('redirect') || '/konto';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Image src="/logo-t.png" alt="Südpfote" width={80} height={80} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-3">
              Willkommen zurück!
            </h1>
            <p className="text-zinc-600">
              Melde dich an um deine Bestellungen und Punkte zu sehen
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="bg-zinc-50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  E-Mail
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                    placeholder="deine@email.de"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Passwort
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                  />
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-zinc-700 text-white font-semibold py-4 px-6 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                    Moment...
                  </>
                ) : (
                  'Anmelden'
                )}
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Noch kein Konto?</h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Bei deiner ersten Bestellung wird automatisch ein Konto erstellt. 
                  Die Zugangsdaten erhältst du per E-Mail.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500 mb-4">Dein Konto bietet:</p>
            <div className="flex justify-center gap-6 text-sm text-zinc-600">
              <span className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Bestellhistorie
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Treuepunkte
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span> Schneller Checkout
              </span>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-10">
            <Link 
              href="/" 
              className="text-zinc-500 hover:text-zinc-900 transition"
            >
              ← Zurück zum Shop
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
