import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface FreeDeliveryBarProps {
  currentTotal: number;
  threshold?: number;
}

export const FreeDeliveryBar: React.FC<FreeDeliveryBarProps> = ({
  currentTotal,
  threshold = 499,
}) => {
  const isFree = currentTotal >= threshold;
  const remaining = Math.max(0, threshold - currentTotal);
  const percentage = Math.min(100, Math.round((currentTotal / threshold) * 100));

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 mb-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A2C17]">
          {isFree ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Truck className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>
            {isFree ? (
              <span className="text-emerald-800 font-extrabold">
                Yay! You unlocked FREE 4°C Cold-Chain Delivery!
              </span>
            ) : (
              <span>
                Add <strong className="text-amber-800">{formatINR(remaining)}</strong> more of fresh dairy to get <strong>FREE delivery</strong>
              </span>
            )}
          </span>
        </div>
        <span className="text-xs font-bold text-stone-500 font-mono">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFree ? 'bg-emerald-600' : 'bg-gradient-to-r from-amber-400 to-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
