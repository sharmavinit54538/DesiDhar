import React from 'react';
import type { AllergenInfo } from '../../types';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface AllergenBadgeRowProps {
  allergens?: AllergenInfo;
  ingredientsText?: string;
}

export const AllergenBadgeRow: React.FC<AllergenBadgeRowProps> = ({
  allergens,
  ingredientsText,
}) => {
  const contains = allergens?.contains || (ingredientsText?.toLowerCase().includes('cashew') ? ['Milk', 'Cashew Nuts (Tree Nuts)'] : ['Milk / Dairy']);
  const freeFrom = allergens?.freeFrom || ['Peanuts', 'Egg', 'Gluten / Wheat', 'Chemical Preservatives'];

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-[#4A2C17] uppercase tracking-wider text-[11px]">
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <span>Allergen Declaration &amp; Purity Standards</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-stone-600">Contains:</span>
        {contains.map((item) => (
          <span
            key={item}
            className="px-2.5 py-1 rounded-lg bg-amber-200/80 text-amber-950 font-bold text-[11px] border border-amber-300"
          >
            {item}
          </span>
        ))}
      </div>

      {freeFrom.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
          <span className="font-semibold text-stone-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Free from:
          </span>
          {freeFrom.map((item) => (
            <span
              key={item}
              className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200"
            >
              ✓ {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
