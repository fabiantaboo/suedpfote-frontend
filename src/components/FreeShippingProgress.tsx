'use client';

import { TruckIcon, CheckIcon } from './Icons';

const FREE_SHIPPING_THRESHOLD = 39;

interface FreeShippingProgressProps {
  currentTotal: number;
  compact?: boolean;
}

export default function FreeShippingProgress({ currentTotal, compact = false }: FreeShippingProgressProps) {
  const progress = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - currentTotal, 0);
  const hasFreeShipping = currentTotal >= FREE_SHIPPING_THRESHOLD;

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${hasFreeShipping ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-center">
          {hasFreeShipping ? (
            <span className="text-emerald-600 font-medium flex items-center justify-center gap-1">
              <CheckIcon className="w-4 h-4" />
              Gratisversand aktiviert!
            </span>
          ) : (
            <span className="text-zinc-500">
              Noch <span className="font-semibold text-zinc-900">€{remaining.toFixed(2)}</span> bis Gratisversand
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl p-4 border border-amber-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-700 flex items-center gap-2">
          <TruckIcon className="w-5 h-5 text-zinc-600" />
          {hasFreeShipping ? 'Gratisversand!' : 'Versandkosten sparen'}
        </span>
        <span className="text-sm text-zinc-500">
          {hasFreeShipping ? (
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckIcon className="w-4 h-4" /> Erreicht
            </span>
          ) : (
            `€${currentTotal.toFixed(2)} / €${FREE_SHIPPING_THRESHOLD}`
          )}
        </span>
      </div>
      
      <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${
            hasFreeShipping 
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
              : 'bg-gradient-to-r from-amber-300 to-amber-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {!hasFreeShipping && (
        <p className="mt-2 text-sm text-center text-zinc-600">
          Noch <span className="font-bold text-zinc-900">€{remaining.toFixed(2)}</span> bis zum kostenlosen Versand!
        </p>
      )}
      
      {hasFreeShipping && (
        <p className="mt-2 text-sm text-center text-emerald-600 font-medium">
          Du sparst €2,99 Versandkosten!
        </p>
      )}
    </div>
  );
}
