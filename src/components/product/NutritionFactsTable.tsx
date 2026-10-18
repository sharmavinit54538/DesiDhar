import React from 'react';
import type { NutritionalInfo } from '../../types';

interface NutritionFactsTableProps {
  nutrition: NutritionalInfo | Record<string, string | number>;
  servingSize?: string;
  isSampleData?: boolean;
}

export const NutritionFactsTable: React.FC<NutritionFactsTableProps> = ({
  nutrition,
  servingSize = '100g',
  isSampleData = true,
}) => {
  // Normalize entries whether typed as NutritionalInfo or Record<string, string | number>
  const entries: [string, string][] = Object.entries(nutrition).map(([k, v]) => {
    const formattedKey = k
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Kcal', ' (kcal)');
    const formattedVal = typeof v === 'number' ? (k.includes('Kcal') ? `${v} kcal` : `${v} g`) : String(v);
    return [formattedKey, formattedVal];
  });

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
      {/* Header */}
      <div className="bg-[#FFF8EC] border-b border-stone-200 p-4">
        <h4 className="font-extrabold text-sm text-[#4A2C17] uppercase tracking-wider font-heading">
          Nutrition Facts / पोषण संबंधी जानकारी
        </h4>
        <p className="text-xs text-stone-500 mt-0.5">
          Approximate values per serving size: <strong className="text-stone-700">{servingSize}</strong>
        </p>
      </div>

      {/* Table */}
      <table className="w-full text-xs text-left">
        <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px]">
          <tr>
            <th className="px-4 py-2.5">Nutrient Parameter</th>
            <th className="px-4 py-2.5 text-right">Per {servingSize}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {entries.map(([key, val]) => (
            <tr key={key} className="hover:bg-amber-50/30 transition-colors">
              <td className="px-4 py-2.5 font-medium text-stone-700">{key}</td>
              <td className="px-4 py-2.5 text-right font-mono font-bold text-stone-900">
                {val}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer footnote */}
      <div className="px-4 py-2.5 bg-stone-50 text-[11px] text-stone-400 border-t border-stone-100 flex items-center justify-between">
        <span>* % Daily Values based on standard 2,000 calorie diet (ICMR guidelines).</span>
        {isSampleData && (
          <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-mono">
            Sample Lab Test Data
          </span>
        )}
      </div>
    </div>
  );
};
