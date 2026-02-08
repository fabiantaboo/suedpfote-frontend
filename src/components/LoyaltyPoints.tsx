'use client';

import { useState, useEffect } from 'react';
import { CoinsIcon, GiftIcon, LockIcon, RocketIcon } from './Icons';

const POINTS_PER_EURO = 10;
const BOOST_THRESHOLD = 100;
const BOOST_MULTIPLIER = 2;

type RedemptionTier = {
  points: number;
  discount: number;
  code_prefix: string;
};

interface LoyaltyPointsProps {
  orderTotal: number;
  customerEmail?: string;
  showEarnings?: boolean;
  showRedemption?: boolean;
  onRedeemed?: (code: string, discount: number) => void;
}

export default function LoyaltyPoints({ 
  orderTotal, 
  customerEmail,
  showEarnings = true,
  showRedemption = false,
  onRedeemed,
}: LoyaltyPointsProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [redemptionTiers, setRedemptionTiers] = useState<RedemptionTier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch points from API
  useEffect(() => {
    if (customerEmail) {
      fetchPoints();
    }
  }, [customerEmail]);

  const fetchPoints = async () => {
    if (!customerEmail) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/loyalty?email=${encodeURIComponent(customerEmail)}`);
      const data = await res.json();
      setTotalPoints(data.points || 0);
      setRedemptionTiers(data.redemptionTiers || []);
    } catch (err) {
      console.error('Failed to fetch loyalty points:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (tier: RedemptionTier) => {
    if (!customerEmail || totalPoints < tier.points) return;
    
    setIsRedeeming(true);
    setError(null);
    
    try {
      const res = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem',
          email: customerEmail,
          tierId: tier.points,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setRedeemedCode(data.discountCode);
        setTotalPoints(data.newBalance);
        onRedeemed?.(data.discountCode, data.discountAmount);
      } else {
        setError(data.error || 'Einlösen fehlgeschlagen');
      }
    } catch (err) {
      setError('Verbindungsfehler');
    } finally {
      setIsRedeeming(false);
    }
  };

  const hasBoost = orderTotal >= BOOST_THRESHOLD;
  const basePoints = Math.floor(orderTotal * POINTS_PER_EURO);
  const earnedPoints = hasBoost ? basePoints * BOOST_MULTIPLIER : basePoints;
  const nextBoostIn = Math.max(BOOST_THRESHOLD - orderTotal, 0);

  // Simple display without API
  if (!customerEmail && !showEarnings) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <CoinsIcon className="w-5 h-5 text-amber-500" />
        <span className="text-zinc-500">Melde dich an für Treuepunkte</span>
      </div>
    );
  }

  // Earnings preview (checkout)
  if (showEarnings && !showRedemption) {
    return (
      <div className={`rounded-2xl p-4 border ${hasBoost ? 'bg-amber-50 border-amber-200' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CoinsIcon className="w-5 h-5 text-zinc-700" />
            <span className="font-semibold text-zinc-900">Treuepunkte</span>
          </div>
          {hasBoost && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
              2x BOOST!
            </span>
          )}
        </div>

        <div className="space-y-2">
          {customerEmail && (
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Deine Punkte:</span>
              <span className="font-bold text-zinc-900">
                {isLoading ? '...' : totalPoints.toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Diese Bestellung:</span>
            <span className={`font-bold ${hasBoost ? 'text-amber-600' : 'text-emerald-600'}`}>
              +{earnedPoints.toLocaleString()} {hasBoost && '(2x!)'}
            </span>
          </div>

          {!hasBoost && orderTotal > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-200">
              <p className="text-xs text-zinc-500 text-center">
                Noch <span className="font-semibold text-zinc-700">€{nextBoostIn.toFixed(2)}</span> bis zum{' '}
                <span className="text-amber-600 font-semibold">2x Punkte-Boost!</span>
              </p>
              <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min((orderTotal / BOOST_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {hasBoost && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-xs text-center text-amber-600 font-medium flex items-center justify-center gap-1">
                <RocketIcon className="w-4 h-4" />
                2x Boost aktiviert! Du sammelst doppelt so viele Punkte!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full redemption view
  if (showRedemption && customerEmail) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-zinc-200">
        <div className="flex items-center gap-3 mb-6">
          <CoinsIcon className="w-10 h-10 text-amber-500" />
          <div>
            <h3 className="font-bold text-xl text-zinc-900">Meine Treuepunkte</h3>
            <p className="text-2xl font-bold text-amber-500">
              {isLoading ? '...' : totalPoints.toLocaleString()} Punkte
            </p>
          </div>
        </div>

        {redeemedCode ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-emerald-800 font-medium mb-2 flex items-center justify-center gap-2">
              <GiftIcon className="w-5 h-5" />
              Gutschein erstellt!
            </p>
            <p className="text-2xl font-mono font-bold text-emerald-700 bg-white px-4 py-2 rounded-lg">
              {redeemedCode}
            </p>
            <p className="text-sm text-emerald-600 mt-2">
              Kopiere den Code und nutze ihn beim Checkout!
            </p>
          </div>
        ) : (
          <>
            <h4 className="font-semibold text-zinc-900 mb-3">Punkte einlösen:</h4>
            <div className="grid gap-3">
              {redemptionTiers.map((tier, i) => {
                const canRedeem = totalPoints >= tier.points;
                return (
                  <button
                    key={i}
                    onClick={() => handleRedeem(tier)}
                    disabled={!canRedeem || isRedeeming}
                    className={`flex items-center justify-between p-4 rounded-xl border transition ${
                      canRedeem 
                        ? 'bg-amber-50 border-amber-200 hover:bg-amber-100 cursor-pointer'
                        : 'bg-zinc-50 border-zinc-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {canRedeem ? (
                        <GiftIcon className="w-6 h-6 text-amber-600" />
                      ) : (
                        <LockIcon className="w-6 h-6 text-zinc-400" />
                      )}
                      <div className="text-left">
                        <p className="font-bold text-zinc-900">€{tier.discount} Gutschein</p>
                        <p className="text-sm text-zinc-500">{tier.points.toLocaleString()} Punkte</p>
                      </div>
                    </div>
                    {canRedeem && (
                      <span className="px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                        {isRedeeming ? '...' : 'Einlösen'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {error && (
              <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}

// Helper function to add points after successful order (calls API)
export async function addLoyaltyPoints(email: string, orderTotal: number): Promise<number> {
  try {
    const res = await fetch('/api/loyalty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        email,
        orderTotal,
      }),
    });
    
    const data = await res.json();
    return data.pointsEarned || 0;
  } catch (err) {
    console.error('Failed to add loyalty points:', err);
    return 0;
  }
}
