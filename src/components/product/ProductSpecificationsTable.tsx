import React from 'react';
import type { Product, ProductVariant } from '../../types';
import { ShieldCheck } from 'lucide-react';

interface ProductSpecificationsTableProps {
  product: Product;
  activeVariant: ProductVariant;
}

export const ProductSpecificationsTable: React.FC<ProductSpecificationsTableProps> = ({
  product,
  activeVariant,
}) => {
  const specs = [
    { label: 'Brand', value: product.brand },
    { label: 'Hindi Name', value: product.hindiName || '—' },
    { label: 'Category', value: `${product.category} › ${product.subcategory}` },
    { label: 'Sweet / Item Type', value: product.sweetType || product.subcategory },
    { label: 'Region of Origin', value: product.originRegion || 'North India / Braj Heritage' },
    { label: 'Vegetarian Symbol', value: '100% Shuddh Vegetarian (Green Dot Marked)' },
    { label: 'Net Content', value: activeVariant.weight },
    { label: 'Selected SKU', value: activeVariant.sku },
    { label: 'FSSAI License No.', value: `Lic. #${product.fssaiNumber || '10020011002341'}` },
    { label: 'Shelf Life', value: product.shelfLife || '30 Days from Packing' },
    { label: 'Storage Instructions', value: product.storage || 'Cool, dry, hygienic place away from sunlight' },
    { label: 'HSN Code (GST)', value: 'HSN 2106 / 0405 (5% GST Inclusive - Sample)' },
    { label: 'Country of Origin', value: 'India (Bharat)' },
    { label: 'Manufacturer / Packer', value: 'DesiDhar Dairy Hub, Mathura Road, NCR 110001' },
  ];

  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-[#4A2C17] uppercase tracking-wider font-heading">
          Product Specifications / उत्पाद विवरण
        </h4>
        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Verified
        </span>
      </div>

      <div className="divide-y divide-stone-100 text-xs">
        {specs.map((item, idx) => (
          <div
            key={item.label}
            className={`grid grid-cols-1 sm:grid-cols-3 px-4 py-2.5 ${
              idx % 2 === 0 ? 'bg-white' : 'bg-[#FFFDF9]'
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
