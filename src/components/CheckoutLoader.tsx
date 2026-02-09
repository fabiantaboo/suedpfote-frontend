'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type CheckoutLoaderProps = {
  totalPrice?: number;
};

const STEPS = [
  'Bestellung wird geprüft',
  'Versand wird berechnet',
  'Sichere Verbindung',
  'Fast geschafft',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900">
      <div className="w-full max-w-sm px-8 text-center">

        {/* Logo in weiß */}
        <div className="mb-12">
          <Image
            src="/logo.png"
            alt="Südpfote"
            width={160}
            height={56}
            className="mx-auto invert brightness-200"
            priority
          />
        </div>

        {/* Step text */}
        <p className="text-lg font-medium text-white mb-8">
          {STEPS[stepIndex]}
        </p>

        {/* Minimal progress bar */}
        <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden mb-12">
          <div
            className="h-full bg-white rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Fun fact */}
        <p className="text-xs text-zinc-600">
          {FUN_FACTS[factIndex]}
        </p>

      </div>
    </div>
  );
}
