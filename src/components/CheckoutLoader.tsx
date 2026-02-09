'use client';

import { useState, useEffect } from 'react';

type CheckoutLoaderProps = {
  totalPrice?: number;
};

const STEPS = [
  { text: 'Bestellung wird geprüft', icon: '🤚' },
  { text: 'Versand wird berechnet', icon: '📦' },
  { text: 'Sichere Verbindung', icon: '🔒' },
  { text: 'Fast geschafft', icon: '✨' },
];

const FUN_FACTS = [
  '10–15% der Welt sind Linkshänder',
  'Leonardo da Vinci war Linkshänder',
  '5 der letzten 8 US-Präsidenten — Linkshänder',
  '"Southpaw" → daher Südpfote 🐾',
  'Linkshänder sind statistisch kreativer',
];

export default function CheckoutLoader({ totalPrice = 0 }: CheckoutLoaderProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 2000);

    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % FUN_FACTS.length);
    }, 3500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.05;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900">
      <div className="w-full max-w-sm px-8 text-center">

        {/* Paw logo */}
        <div className="mb-12">
          <span className="text-5xl">🐾</span>
        </div>

        {/* Step text */}
        <p className="text-lg font-medium text-white mb-1">
          {current.text}
        </p>
        <p className="text-sm text-zinc-500 mb-8">
          {current.icon}
        </p>

        {/* Minimal progress bar */}
        <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden mb-12">
          <div
            className="h-full bg-white rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Fun fact */}
        <p className="text-xs text-zinc-600 transition-opacity duration-300">
          {FUN_FACTS[factIndex]}
        </p>

      </div>
    </div>
  );
}
