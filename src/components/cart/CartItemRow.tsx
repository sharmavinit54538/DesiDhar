import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types';
import { formatINR, calculateDiscountPercent } from '../../utils/formatters';
import { QuantityStepper } from '../common/QuantityStepper';
import { VegBadge } from '../common/VegBadge';
import { Bookmark, Trash2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onSaveForLater: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}) => {
  const discountPercent = calculateDiscountPercent(item.mrp, item.price);

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-100 last:border-b-0 hover:bg-stone-50/40 transition-colors">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Product image */}
        <Link
          to={`/product/${item.slug}`}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 shrink-0"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <VegBadge size="sm" />
            <span className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
              {item.brand}
            </span>
          </div>

          <Link
            to={`/product/${item.slug}`}
            className="text-xs sm:text-sm font-bold text-[#4A2C17] hover:text-amber-700 transition-colors line-clamp-1 font-heading"
          >
            {item.name}
          </Link>

          <div className="text-xs text-stone-500 mt-0.5 font-medium">
            Pack: <span className="font-semibold text-stone-700">{item.weight}</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm sm:text-base font-extrabold text-[#4A2C17]">
              {formatINR(item.price * item.quantity)}
            </span>
            {item.mrp > item.price && (
              <>
                <span className="text-xs text-stone-400 line-through">
                  {formatINR(item.mrp * item.quantity)}
                </span>
                <span className="text-[11px] text-emerald-800 font-bold">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stepper & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
        <QuantityStepper
          quantity={item.quantity}
          max={item.maxStock}
          onIncrement={() => onUpdateQuantity(item.quantity + 1)}
          onDecrement={() => onUpdateQuantity(item.quantity - 1)}
          size="sm"
          showTrashOnOne
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveForLater}
            className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            title="Save for later"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Save for Later</span>
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
