import React, { useEffect, useState } from 'react';
import { Tag, Sparkles, Truck, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useStorefront } from '../../context/StorefrontContext';
import type { Coupon } from '../../types';
import { formatINR } from '../../utils/formatters';

/**
 * Coupons are read from `GET /api/coupons`, which returns only currently active,
 * publicly advertised codes. The server also validates them at checkout.
 */
export const OffersBox: React.FC = () => {
  const { settings } = useStorefront();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    api
      .getPublicCoupons()
      .then((items) => {
        if (!active) return;
        setCoupons(items);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  const freeDelivery = settings?.freeDeliveryThreshold ?? 0;
  const hasContent = coupons.length > 0 || freeDelivery > 0;

  if (!hasContent && status === 'ready') return null;

  return (
    <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>Offers &amp; Discounts</span>
      </div>

      <div className="space-y-2 text-xs text-stone-700">
        {status === 'loading' && <p className="text-stone-500">Loading current offers…</p>}
        {status === 'error' && (
          <p className="text-stone-500 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Offers could not be loaded right now.
          </p>
        )}

        {coupons.map((coupon) => (
          <div key={coupon.code} className="flex items-start gap-2">
            <Tag className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-mono font-bold bg-amber-200 text-stone-900 px-1.5 py-0.5 rounded">
                {coupon.code}
              </span>{' '}
              — {coupon.description}
              {coupon.minOrderValue > 0 && (
                <span className="text-stone-500"> (min order {formatINR(coupon.minOrderValue)})</span>
              )}
            </div>
          </div>
        ))}

        {status === 'ready' && coupons.length === 0 && (
          <p className="text-stone-500">No coupon codes are active right now.</p>
        )}

        {freeDelivery > 0 && (
          <div className="flex items-start gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <strong>Free delivery</strong> on orders of {formatINR(freeDelivery)} or more.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
