import React from 'react';
import type { Product, ProductVariant } from '../../types';
import { useStorefront } from '../../context/StorefrontContext';
import { ShieldCheck } from 'lucide-react';

interface ProductSpecificationsTableProps {
  product: Product;
  activeVariant: ProductVariant;
}

/**
 * Only shows attributes that exist in the catalogue record. Rows are dropped when
 * the value is missing instead of filling them with invented defaults.
 */
export const ProductSpecificationsTable: React.FC<ProductSpecificationsTableProps> = ({
  product,
  activeVariant,
}) => {
  const { settings } = useStorefront();

  const specs: { label: string; value: string }[] = [
    { label: 'Brand', value: product.brand },
    { label: 'Hindi Name', value: product.hindiName },
    { label: 'Category', value: product.subcategory ? `${product.category} › ${product.subcategory}` : product.category },
    { label: 'Item Type', value: product.sweetType },
    { label: 'Region of Origin', value: product.originRegion },
    { label: 'Net Content', value: activeVariant.weight },
    { label: 'SKU', value: activeVariant.sku },
    { label: 'Shelf Life', value: product.shelfLife },
    { label: 'Storage Instructions', value: product.storage },
    {
      label: 'FSSAI Licence',
      value: settings?.fssaiLicenseNumber ? settings.fssaiLicenseNumber : undefined,
    },
    { label: 'Country of Origin', value: 'India' },
  ].filter((spec): spec is { label: string; value: string } =>
    Boolean(spec.value && String(spec.value).trim() !== '')
  );

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-[#4A2C17] uppercase tracking-wider font-heading">
          Product Specifications / उत्पाद विवरण
        </h4>
        {settings?.fssaiLicenseNumber && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Licence on record
          </span>
        )}
      </div>

      <div className="divide-y divide-stone-100 text-xs">
        {specs.map((item, index) => (
          <div
            key={item.label}
            className={`grid grid-cols-1 sm:grid-cols-3 px-4 py-2.5 ${
              index % 2 === 0 ? 'bg-white' : 'bg-[#FFFDF9]'
            }`}
          >
            <span className="font-semibold text-stone-500">{item.label}</span>
            <span className="sm:col-span-2 font-medium text-stone-800 break-words mt-0.5 sm:mt-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
