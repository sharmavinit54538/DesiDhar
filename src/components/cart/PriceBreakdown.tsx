import React from 'react';
import { OrderPricing } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface PriceBreakdownProps {
  pricing: OrderPricing;
  itemCount: number;
  onCheckout?: () => void;
  checkoutButtonText?: string;
  isCheckoutDisabled?: boolean;
  isLoading?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  pricing,
  itemCount,
  onCheckout,
  checkoutButtonText = 'Proceed to Checkout',
  isCheckoutDisabled = false,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-xs space-y-4">
      <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 pb-3 border-b border-stone-100 font-heading">
        Price Details ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h3>

      <div className="space-y-2.5 text-xs">
        {/* Total MRP */}
        <div className="flex justify-between items-center text-stone-600">
          <span>Total MRP</span>
          <span className="font-semibold text-stone-800 font-mono">
            {formatINR(pricing.mrpTotal)}
          </span>
        </div>

        {/* Product Discount */}
        {pricing.discount > 0 && (
          <div className="flex justify-between items-center text-emerald-800 font-medium">
            <span>Discount on MRP</span>
            <span className="font-bold font-mono">
              - {formatINR(pricing.discount)}
            </span>
          </div>
        )}

        {/* Coupon Discount */}
        {pricing.couponDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-800 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Coupon ({pricing.couponCode})</span>
            </span>
            <span className="font-bold font-mono">
              - {formatINR(pricing.couponDiscount)}
            </span>
          </div>
        )}

        {/* Delivery Fee */}
        <div className="flex justify-between items-center text-stone-600">
          <span>Cold-Chain Delivery Fee</span>
          {pricing.deliveryFee === 0 ? (
            <span className="text-emerald-800 font-bold uppercase text-[11px]">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-stone-800 font-mono">
              {formatINR(pricing.deliveryFee)}
            </span>
          )}
        </div>

        {/* Total Amount Row */}
        <div className="pt-3 border-t border-dashed border-stone-200 flex justify-between items-baseline">
          <span className="text-sm font-extrabold text-[#4A2C17] font-heading">
            Total Amount
          </span>
          <span className="text-xl font-black text-[#4A2C17] font-heading">
            {formatINR(pricing.total)}
          </span>
        </div>
      </div>

      {/* Savings Notification Pill */}
      {pricing.savings > 0 && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-900">
          🎉 You are saving {formatINR(pricing.savings)} on this order!
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <Button
          variant="gold"
          size="lg"
          className="w-full text-sm font-extrabold shadow-md"
          onClick={onCheckout}
          disabled={isCheckoutDisabled}
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {checkoutButtonText}
        </Button>
      )}

      {/* Trust Guarantee */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Safe &amp; Secure Payments • 100% Pure Dairy</span>
      </div>
    </div>
  );
};
