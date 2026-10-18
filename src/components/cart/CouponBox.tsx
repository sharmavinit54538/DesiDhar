import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { api } from '../../services/api';
import { Tag, Check, X, Sparkles } from 'lucide-react';

export const CouponBox: React.FC = () => {
  const { appliedCoupon, applyCoupon, removeCoupon, getPricing } = useCartStore();
  const { addToast } = useUiStore();
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const pricing = getPricing();

  const handleApply = async (couponCodeToUse?: string) => {
    const targetCode = (couponCodeToUse || code).trim();
    if (!targetCode) return;

    setErrorMsg('');
    setIsApplying(true);
    try {
      const res = await api.validateCoupon(targetCode, pricing.mrpTotal - pricing.discount);
      if (res.isValid && res.coupon) {
        applyCoupon(res.coupon);
        addToast(`Coupon ${res.coupon.code} applied successfully!`, 'success');
        setCode('');
      } else {
        setErrorMsg(res.error || 'Invalid coupon code.');
      }
    } catch {
      setErrorMsg('Failed to apply coupon.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    addToast('Coupon removed', 'info');
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
              <div className="text-emerald-700 text-[11px]">
                {appliedCoupon.description}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
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
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setErrorMsg('');
              }}
              placeholder="Enter coupon code"
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold uppercase tracking-wider text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              disabled={isApplying || !code.trim()}
              onClick={() => handleApply()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-xs transition-colors shrink-0"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
          )}

          {/* Quick coupon suggestions */}
          <div className="pt-2 border-t border-stone-100">
            <div className="text-[11px] text-stone-500 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Tap to Apply:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { code: 'DESI10', label: 'DESI10 (10% OFF)' },
                { code: 'FIRSTORDER', label: 'FIRSTORDER (₹100 OFF)' },
                { code: 'FESTIVE20', label: 'FESTIVE20 (20% OFF)' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleApply(c.code)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold font-mono transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
