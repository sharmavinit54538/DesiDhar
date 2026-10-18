import React from 'react';
import { Tag, Sparkles, Truck, ShieldCheck } from 'lucide-react';

export const OffersBox: React.FC = () => {
  return (
    <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>Available Dairy Offers &amp; Discounts</span>
      </div>

      <div className="space-y-2 text-xs text-stone-700">
        <div className="flex items-start gap-2">
          <Tag className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <strong>Special Coupon:</strong> Use code <span className="font-mono font-bold bg-amber-200 text-stone-900 px-1.5 py-0.5 rounded">DESI10</span> for 10% Instant OFF up to ₹150 on orders above ₹299.
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Tag className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <strong>First Order Welcome:</strong> Use <span className="font-mono font-bold bg-amber-200 text-stone-900 px-1.5 py-0.5 rounded">FIRSTORDER</span> for flat ₹100 discount above ₹399.
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Truck className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <strong>Free Cold-Chain Delivery:</strong> Automatically free on all orders over ₹499.
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <strong>Purity Assurance:</strong> 100% money back if taste does not feel pure and fresh.
          </div>
        </div>
      </div>
    </div>
  );
};
