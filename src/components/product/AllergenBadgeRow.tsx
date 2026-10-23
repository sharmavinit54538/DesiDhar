import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AllergenBadgeRowProps {
  ingredientsText?: string;
}

const ALLERGENS: { label: string; matches: string[] }[] = [
  { label: 'Milk / Dairy', matches: ['milk', 'dahi', 'curd', 'paneer', 'cream', 'ghee', 'butter', 'khoya', 'malai'] },
  { label: 'Tree Nuts (Cashew / Pistachio)', matches: ['cashew', 'kaju', 'pistachio', 'pista', 'almond', 'badam'] },
  { label: 'Gluten / Wheat', matches: ['wheat', 'maida', 'atta', 'gluten', 'semolina', 'suji'] },
];

/**
 * Derived from the ingredient text stored for the product. We only show an allergen
 * when the ingredient list actually mentions it, and the label remains authoritative.
 */
export const AllergenBadgeRow: React.FC<AllergenBadgeRowProps> = ({ ingredientsText }) => {
  if (!ingredientsText) return null;
  const normalized = ingredientsText.toLowerCase();
  const contains = ALLERGENS.filter((allergen) =>
    allergen.matches.some((keyword) => normalized.includes(keyword))
  ).map((allergen) => allergen.label);

  if (contains.length === 0) return null;

  return (
    <div className="space-y-2 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-[#4A2C17] uppercase tracking-wider text-[11px]">
        <AlertCircle className="w-4 h-4 text-amber-600" />
        <span>Allergen Information (from ingredient list)</span>
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

      <p className="text-[11px] text-stone-500">
        Check the physical pack label for the manufacturer’s full allergen declaration.
      </p>
    </div>
  );
};
