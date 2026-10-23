import React, { useEffect, useState } from 'react';
import type { PaymentMethod, PaymentMethodOption } from '../../types';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { ErrorState } from '../common/ErrorState';
import { QrCode, CreditCard, Building2, Banknote, ShieldCheck, Lock } from 'lucide-react';

interface PaymentStepProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onProceed: () => void;
  onBack: () => void;
}

const ICONS: Record<string, React.ElementType> = {
  UPI: QrCode,
  CARD: CreditCard,
  NETBANKING: Building2,
  COD: Banknote,
};

/**
 * The available payment methods are decided by the server. Online methods only
 * appear when a payment provider has actually been configured; otherwise the
 * customer sees cash on delivery and an explanation.
 */
export const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedMethod,
  onSelectMethod,
  onProceed,
  onBack,
}) => {
  const [methods, setMethods] = useState<PaymentMethodOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api
      .getPaymentMethods()
      .then((options) => {
        if (!active) return;
        setMethods(options);
        if (options.length > 0 && !options.some((option) => option.id === selectedMethod && option.enabled)) {
          const firstEnabled = options.find((option) => option.enabled);
          if (firstEnabled) onSelectMethod(firstEnabled.id);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Payment methods could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const onlineAvailable = methods.some((method) => method.enabled && method.id !== 'COD');

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="pb-3 border-b border-stone-100">
        <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading">
          Select Payment Method
        </h3>
        <p className="text-xs text-stone-500">
          Payment details are handled by the payment provider. DesiDhar never stores your card or
          UPI credentials.
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && error && (
        <ErrorState
          title="Payment options unavailable"
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {methods.map((option) => {
            const isSelected = selectedMethod === option.id;
            const Icon = ICONS[option.id] || Banknote;

            return (
              <button
                key={option.id}
                type="button"
                disabled={!option.enabled}
                onClick={() => onSelectMethod(option.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/10'
                    : 'border-stone-200 hover:border-amber-300 bg-white'
                } ${!option.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#4A2C17]">{option.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {option.enabled
                        ? option.id === 'COD'
                          ? 'Pay in cash when your order is delivered.'
                          : `Secure payment via ${option.provider || 'the payment provider'}.`
                        : 'Not available until the payment provider is configured.'}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-amber-600 bg-amber-600' : 'border-stone-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}

          {methods.length === 0 && (
            <p className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              No payment methods are enabled right now. Please contact customer care.
            </p>
          )}

          {!onlineAvailable && methods.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                Online payments are not configured for this store yet. Cash on delivery is
                available; card and UPI will appear automatically once the payment provider is
                connected.
              </span>
            </div>
          )}
        </div>
      )}

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack}>
          Back to Slot
        </Button>
        <Button
          variant="gold"
          size="md"
          onClick={onProceed}
          disabled={loading || Boolean(error) || methods.length === 0}
        >
          Review Order Details
        </Button>
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>Card and UPI details are entered on the provider’s secure page.</span>
      </div>
    </div>
  );
};
