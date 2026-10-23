import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { useStorefront } from '../../context/StorefrontContext';
import { api } from '../../services/api';
import type { Coupon } from '../../types';
import { Tag, Check, X, Sparkles } from 'lucide-react';

export const CouponBox: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, getPricing } = useCartStore();
  const { addToast } = useUiStore();
  const { settings } = useStorefront();
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  const pricing = getPricing(
    settings
      ? {
          freeDeliveryThreshold: settings.freeDeliveryThreshold,
          deliveryFee: settings.deliveryFee,
        }
      : undefined
  );

  useEffect(() => {
    let active = true;
    api
      .getPublicCoupons()
      .then((coupons) => {
        if (active) setAvailableCoupons(coupons);
      })
      .catch(() => {
        if (active) setAvailableCoupons([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleApply = async (couponCodeToUse?: string) => {
    const targetCode = (couponCodeToUse || code).trim().toUpperCase();
    if (!targetCode) return;

    setErrorMsg('');
    setIsApplying(true);
    try {
      const result = await api.validateCoupon(targetCode, pricing.mrpTotal - pricing.discount);
      if (result.isValid && result.coupon) {
        applyCoupon(result.coupon);
        addToast(`Coupon ${result.coupon.code} applied.`, 'success');
        setCode('');
      } else {
        setErrorMsg(result.error || 'This coupon cannot be applied to your cart.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'The coupon could not be validated.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-[#4A2C17] uppercase tracking-wider">
        <Tag className="w-4 h-4 text-amber-600" />
        <span>Apply Coupon Code</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold text-emerald-900 tracking-wider">
                {appliedCoupon.code} APPLIED
              </div>
              <div className="text-emerald-700 text-[11px]">{appliedCoupon.description}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              addToast('Coupon removed', 'info');
            }}
            className="text-stone-400 hover:text-red-600 p-1 rounded-lg hover:bg-white transition-colors"
            aria-label="Remove coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase());
                setErrorMsg('');
              }}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-wider text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              disabled={isApplying || !code.trim()}
              onClick={() => void handleApply()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-xs transition-colors shrink-0"
            >
              {isApplying ? 'Applying…' : 'Apply'}
            </button>
          </div>

          {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}

          {availableCoupons.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <div className="text-[11px] text-stone-500 font-semibold mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Active offers:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon.code}
                    type="button"
                    onClick={() => void handleApply(coupon.code)}
                    disabled={isApplying}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold font-mono transition-colors disabled:opacity-50"
                  >
                    {coupon.code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
