import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import type { CartItem, CartValidationResult } from '../types';
import { useCartStore } from '../store/cartStore';

interface UseCartValidationResult {
  validation: CartValidationResult | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Re-validates the cart against the live catalog (prices, stock, coupon) on the
 * server and reconciles the locally cached line data with the authoritative
 * values. The UI shows an error instead of falling back to stale prices.
 */
export function useCartValidation(
  items: CartItem[],
  couponCode: string | undefined
): UseCartValidationResult {
  const [validation, setValidation] = useState<CartValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const reconcile = useCartStore((state) => state.reconcileWithServer);
  const requestId = useRef(0);

  const refresh = useCallback(() => setNonce((value) => value + 1), []);

  const signature = items
    .map((item) => `${item.variantId}:${item.quantity}`)
    .sort()
    .join('|');

  useEffect(() => {
    if (items.length === 0) {
      setValidation(null);
      setLoading(false);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.validateCart(
          items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
          couponCode
        );
        if (id !== requestId.current) return;
        setValidation(result);
        reconcile(result.items);
      } catch (err) {
        if (id !== requestId.current) return;
        setValidation(null);
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to verify your cart with the server right now.'
        );
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, couponCode, nonce]);

  return { validation, loading, error, refresh };
}
