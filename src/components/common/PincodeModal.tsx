import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { MapPin, CheckCircle2, AlertCircle, Snowflake, Search } from 'lucide-react';
import type { PincodeCheckResult } from '../../types';

interface PopularPincode {
  pincode: string;
  city: string;
}

export const PincodeModal: React.FC = () => {
  const { isPincodeModalOpen, closePincodeModal, addToast } = useUiStore();
  const { selectedPincode, setPincode } = useAuthStore();

  const [inputPincode, setInputPincode] = useState(selectedPincode);
  const [result, setResult] = useState<PincodeCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [popular, setPopular] = useState<PopularPincode[]>([]);
  const [popularError, setPopularError] = useState('');

  useEffect(() => {
    if (!isPincodeModalOpen) return;
    setInputPincode(selectedPincode);
    let active = true;
    api
      .getPopularPincodes()
      .then((pincodes) => {
        if (active) {
          setPopular(pincodes);
          setPopularError('');
        }
      })
      .catch(() => {
        if (active) {
          setPopular([]);
          setPopularError('Delivery areas could not be loaded.');
        }
      });
    return () => {
      active = false;
    };
  }, [isPincodeModalOpen, selectedPincode]);

  const handleCheck = async (pin: string) => {
    const clean = pin.trim();
    if (!/^[1-9]\d{5}$/.test(clean)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      setResult(null);
      return;
    }

    setErrorMsg('');
    setIsChecking(true);
    try {
      const res = await api.checkPincode(clean);
      setResult(res);
      if (res.isServiceable) {
        setPincode(res.pincode, res.city);
        addToast(`Delivery location set to ${res.city} (${res.pincode})`, 'success');
      }
    } catch (err) {
      setResult(null);
      setErrorMsg(
        err instanceof Error ? err.message : 'Serviceability check failed. Please try again.'
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleSelectPopular = (pincode: string) => {
    setInputPincode(pincode);
    handleCheck(pincode);
  };

  return (
    <Modal
      isOpen={isPincodeModalOpen}
      onClose={closePincodeModal}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" />
          <span>Select Delivery Location</span>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-stone-500">
          Enter your 6-digit PIN code to check whether DesiDhar delivers to your address.
        </p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={inputPincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setInputPincode(val);
                setErrorMsg('');
              }}
              placeholder="6-digit PIN code"
              aria-label="PIN code"
              className="w-full h-11 pl-4 pr-4 rounded-xl border border-stone-200 text-sm font-semibold tracking-wider text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button
            type="button"
            disabled={isChecking || inputPincode.length !== 6}
            onClick={() => handleCheck(inputPincode)}
            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>{isChecking ? 'Checking…' : 'Check'}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {result && (
          <div
            className={`p-3 rounded-xl border text-xs ${
              result.isServiceable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start gap-2">
              {result.isServiceable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold">
                  {result.isServiceable
                    ? `${result.city} (${result.pincode})`
                    : `PIN ${result.pincode}`}
                </div>
                <p className="mt-0.5">{result.message}</p>
                {result.isServiceable && result.estimatedDelivery && (
                  <p className="mt-1 flex items-center gap-1">
                    <Snowflake className="w-3 h-3" /> {result.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-stone-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            Active delivery areas
          </div>
          {popularError ? (
            <p className="text-xs text-stone-500">{popularError}</p>
          ) : popular.length === 0 ? (
            <p className="text-xs text-stone-500">
              No delivery areas are configured yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {popular.map((location) => (
                <button
                  key={location.pincode}
                  type="button"
                  onClick={() => handleSelectPopular(location.pincode)}
                  className="text-left px-2.5 py-2 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 text-xs"
                >
                  <span className="font-semibold text-[#4A2C17] block truncate">
                    {location.city}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">{location.pincode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-stone-400">
          Delivery options and charges are confirmed at checkout based on your address.
        </p>
      </div>
    </Modal>
  );
};
