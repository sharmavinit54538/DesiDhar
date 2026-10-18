import React from 'react';
import { Address, DeliverySlot, PaymentMethod, CartItem, OrderPricing } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Button } from '../common/Button';
import { VegBadge } from '../common/VegBadge';
import { MapPin, Clock, CreditCard, ShieldCheck } from 'lucide-react';

interface ReviewStepProps {
  address: Address;
  slot: DeliverySlot;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  pricing: OrderPricing;
  onEditStep: (step: 'ADDRESS' | 'SLOT' | 'PAYMENT') => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  address,
  slot,
  paymentMethod,
  items,
  pricing,
  onEditStep,
  onPlaceOrder,
  isPlacingOrder,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      <div className="pb-3 border-b border-stone-100">
        <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading">
          Final Order Review
        </h3>
        <p className="text-xs text-stone-500">
          Please verify your delivery address, timing, and item quantities before confirming.
        </p>
      </div>

      {/* Summary Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Address summary */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" /> Deliver To
              </span>
              <button
                type="button"
                onClick={() => onEditStep('ADDRESS')}
                className="text-amber-700 hover:text-amber-800 underline text-[11px]"
              >
                Change
              </button>
            </div>
            <p className="font-bold text-xs text-[#4A2C17]">{address.name}</p>
            <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
              {address.addressLine1}, {address.city} ({address.pincode})
            </p>
            <p className="text-[11px] text-stone-500 font-mono mt-0.5">
              +91 {address.phone}
            </p>
          </div>
        </div>

        {/* Slot summary */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Delivery Slot
              </span>
              <button
                type="button"
                onClick={() => onEditStep('SLOT')}
                className="text-amber-700 hover:text-amber-800 underline text-[11px]"
              >
                Change
              </button>
            </div>
            <p className="font-bold text-xs text-[#4A2C17]">{slot.title}</p>
            <p className="text-[11px] text-stone-600">
              {slot.date} • {slot.timeWindow}
            </p>
            <p className="text-[10px] text-emerald-700 font-bold mt-1">
              ❄️ 4°C Insulated Pack
            </p>
          </div>
        </div>

        {/* Payment summary */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-sky-600" /> Payment
              </span>
              <button
                type="button"
                onClick={() => onEditStep('PAYMENT')}
                className="text-amber-700 hover:text-amber-800 underline text-[11px]"
              >
                Change
              </button>
            </div>
            <p className="font-bold text-xs text-[#4A2C17]">{paymentMethod}</p>
            <p className="text-[11px] text-stone-500">
              {paymentMethod === 'COD' ? 'Cash / UPI at doorstep' : 'Prepaid (Simulated)'}
            </p>
            <p className="text-[11px] font-bold text-amber-900 mt-1">
              Total: {formatINR(pricing.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Items list preview */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Items in this Delivery ({items.length})
        </h4>
        <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
          {items.map((item) => (
            <div key={item.variantId} className="p-3 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <VegBadge size="sm" />
                    <span className="font-bold text-xs text-[#4A2C17] line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {item.weight} × <span className="font-bold text-stone-700">{item.quantity}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-[#4A2C17]">
                  {formatINR(item.price * item.quantity)}
                </div>
                {item.mrp > item.price && (
                  <div className="text-[10px] text-stone-400 line-through">
                    {formatINR(item.mrp * item.quantity)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Place Order CTA */}
      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>FSSAI certified dairy with 100% money-back freshness guarantee</span>
        </div>

        <Button
          variant="gold"
          size="lg"
          className="w-full sm:w-auto px-8"
          isLoading={isPlacingOrder}
          onClick={onPlaceOrder}
        >
          Confirm &amp; Place Order ({formatINR(pricing.total)})
        </Button>
      </div>
    </div>
  );
};
