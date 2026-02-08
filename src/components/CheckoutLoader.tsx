'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CheckoutLoaderProps = {
  totalPrice?: number;
};

const STEPS = [
  { text: 'Deine Bestellung wird geprüft', emoji: '📦', subtext: 'Qualität ist uns wichtig' },
  { text: 'Versanddetails werden berechnet', emoji: '🚚', subtext: 'Kostenloser Versand ab 39€' },
  { text: 'Sichere Verbindung zu deiner Bank', emoji: '🔒', subtext: 'SSL-verschlüsselt & sicher' },
  { text: 'Fast geschafft!', emoji: '✨', subtext: 'Gleich kannst du bezahlen' },
];

const FUN_FACTS = [
  '10–15% der Weltbevölkerung sind Linkshänder',
  'Linkshänder sind oft kreativer & lösungsorientierter',
  '5 der letzten 8 US-Präsidenten waren Linkshänder',
  'Leonardo da Vinci, Einstein & Beethoven – alle Linkshänder',
  'Im Englischen heißt es "Southpaw" – daher Südpfote 🤚',
];

export default function CheckoutLoader({ totalPrice = 0 }: CheckoutLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length));
  const [progress, setProgress] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  const loyaltyPoints = Math.round(totalPrice * 10);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 2200);

    const factInterval = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % FUN_FACTS.length);
        setFactVisible(true);
      }, 300);
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 92) return prev;
        return prev + (92 - prev) * 0.06;
      });
    }, 80);

    return () => {
      clearInterval(stepInterval);
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const current = STEPS[stepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-8 text-center">
        
        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/logo.png"
            alt="Südpfote"
            width={140}
            height={50}
            className="mx-auto opacity-90"
          />
        </div>

        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= stepIndex
                  ? 'w-8 bg-zinc-800'
                  : 'w-1.5 bg-zinc-200'
              }`}
            />
          ))}
        </div>

        {/* Animated emoji */}
        <div className="mb-6">
          <span
            key={stepIndex}
            className="inline-block text-5xl animate-fadeIn"
          >
            {current.emoji}
          </span>
        </div>

        {/* Main text */}
        <div key={`text-${stepIndex}`} className="animate-fadeIn mb-2">
          <p className="text-xl font-semibold text-zinc-900">
            {current.text}
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            {current.subtext}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 mb-10">
          <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-800 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loyalty points teaser */}
        {loyaltyPoints > 0 && (
          <div className="mb-8 py-3 px-5 bg-amber-50 rounded-xl inline-block">
            <p className="text-sm text-amber-800 font-medium">
              🎉 Du erhältst <span className="font-bold">{loyaltyPoints} Punkte</span> für diese Bestellung
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              = €{(loyaltyPoints / 100).toFixed(2)} Rabatt auf deine nächste Bestellung
            </p>
          </div>
        )}

        {/* Fun fact */}
        <div className="min-h-[3rem]">
          <p className="text-xs text-zinc-300 uppercase tracking-wider mb-1">Wusstest du?</p>
          <p
            className={`text-sm text-zinc-500 transition-all duration-300 ${
              factVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {FUN_FACTS[factIndex]}
          </p>
        </div>

        {/* Values */}
        <div className="mt-10 flex justify-center gap-6 text-xs text-zinc-300">
          <span>🌱 Nachhaltig</span>
          <span>🇩🇪 Aus Deutschland</span>
          <span>❤️ Für Linkshänder</span>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
