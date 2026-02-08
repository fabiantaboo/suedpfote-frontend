'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  { text: 'Deine Bestellung wird vorbereitet...', emoji: '📦' },
  { text: 'Versandkosten werden berechnet...', emoji: '🚚' },
  { text: 'Sichere Verbindung wird aufgebaut...', emoji: '🔒' },
  { text: 'Fast geschafft!', emoji: '✨' },
];

export default function CheckoutLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle messages every 1.8s
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 1800);

    // Smooth progress bar (fills to ~90% over 8s, never hits 100 until done)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.08;
      });
    }, 100);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const current = MESSAGES[messageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center px-8 max-w-sm">
        {/* Animated hand/paw */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 flex items-center justify-center animate-pulse">
            <span className="text-4xl animate-bounce">{current.emoji}</span>
          </div>
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-zinc-200 rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                  animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Message with fade transition */}
        <p
          key={messageIndex}
          className="text-lg font-medium text-zinc-800 mb-2 animate-fadeIn"
        >
          {current.text}
        </p>
        <p className="text-sm text-zinc-400 mb-8">Einen Moment bitte</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-800 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Südpfote branding */}
        <p className="mt-6 text-xs text-zinc-300 tracking-widest uppercase">
          🤚 Südpfote
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-12px) scale(1.2); opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
