import React from 'react';

interface NutritionFactsTableProps {
  nutrition: Record<string, string>;
  servingSize?: string;
}

/**
 * Renders the nutrition values stored for the product. No percentages are computed
 * and no lab claims are attached — the table only shows the recorded values.
 */
export const NutritionFactsTable: React.FC<NutritionFactsTableProps> = ({
  nutrition,
  servingSize = '100g',
}) => {
  const entries = Object.entries(nutrition).filter(
    ([, value]) => value !== undefined && value !== null && String(value).trim() !== ''
  );

  if (entries.length === 0) return null;

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <div className="bg-[#FFF8EC] border-b border-stone-200 p-4">
        <h4 className="font-extrabold text-sm text-[#4A2C17] uppercase tracking-wider font-heading">
          Nutrition Facts / पोषण संबंधी जानकारी
        </h4>
        <p className="text-xs text-stone-500 mt-0.5">
          Values declared for <strong className="text-stone-700">{servingSize}</strong>
        </p>
      </div>

      <table className="w-full text-xs text-left">
        <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase text-[10px]">
          <tr>
            <th className="px-4 py-2.5">Nutrient</th>
            <th className="px-4 py-2.5 text-right">Per serving</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {entries.map(([key, value]) => (
            <tr key={key} className="hover:bg-amber-50/30 transition-colors">
              <td className="px-4 py-2.5 font-medium text-stone-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </td>
              <td className="px-4 py-2.5 text-right font-mono font-bold text-stone-900">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-2.5 bg-stone-50 text-[11px] text-stone-400 border-t border-stone-100">
        Values are provided by the kitchen for the finished product. Always check the pack label
        before use.
      </div>
    </div>
  );
};
