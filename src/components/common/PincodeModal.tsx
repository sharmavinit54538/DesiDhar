import React, { useState } from 'react';
import { Modal } from './Modal';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { MapPin, CheckCircle2, AlertCircle, Snowflake, Search } from 'lucide-react';
import type { PincodeCheckResult } from '../../types';

const POPULAR_LOCATIONS = [
  { city: 'New Delhi (CP)', pincode: '110001' },
  { city: 'South Delhi (CR Park)', pincode: '110019' },
  { city: 'Noida (Sector 18)', pincode: '201301' },
  { city: 'Gurugram Central', pincode: '122001' },
  { city: 'Mumbai (Bandra)', pincode: '400050' },
  { city: 'Bengaluru (Koramangala)', pincode: '560034' },
  { city: 'Jaipur (C-Scheme)', pincode: '302001' },
  { city: 'Lucknow (Hazratganj)', pincode: '226001' },
];

export const PincodeModal: React.FC = () => {
  const { isPincodeModalOpen, closePincodeModal, addToast } = useUiStore();
  const { selectedPincode, setPincode } = useAuthStore();

  const [inputPincode, setInputPincode] = useState(selectedPincode);
  const [result, setResult] = useState<PincodeCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheck = async (pin: string) => {
    const clean = pin.trim();
    if (!/^\d{6}$/.test(clean)) {
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
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to check serviceability.');
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
          Enter your 6-digit PIN code to check early morning cold-chain delivery slots and fresh milk availability.
        </p>

        {/* Input box */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={6}
              value={inputPincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setInputPincode(val);
                setErrorMsg('');
              }}
              placeholder="Enter 6-digit Pincode"
              className="w-full h-11 pl-4 pr-4 rounded-xl border border-stone-200 text-sm font-semibold tracking-wider text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button
            type="button"
            disabled={isChecking || inputPincode.length < 6}
            onClick={() => handleCheck(inputPincode)}
            className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-50 text-stone-900 font-bold text-sm transition-all shadow-xs flex items-center gap-1.5"
          >
            {isChecking ? (
              <span>Checking...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
          </p>
        )}

        {/* Result notification */}
        {result && (
          <div
            className={`p-3.5 rounded-xl border text-xs ${
              result.isServiceable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {result.isServiceable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  {result.city} ({result.pincode})
                </div>
                <div className="font-medium">{result.message}</div>
                {result.isServiceable && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-emerald-800">
                    <span className="font-semibold">⚡ {result.estimatedDelivery}</span>
                    {result.coldChainAvailable && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                        <Snowflake className="w-3 h-3 text-emerald-700" /> Cold-Chain 4°C Guaranteed
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick select popular cities */}
        <div>
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Popular Dairy Hubs
          </div>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_LOCATIONS.map((loc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPopular(loc.pincode)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                  selectedPincode === loc.pincode
                    ? 'border-amber-500 bg-amber-50 font-bold text-amber-900'
                    : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="truncate">
                  <div className="font-medium truncate">{loc.city}</div>
                  <div className="text-[10px] text-stone-400 font-mono">{loc.pincode}</div>
                </div>
                {selectedPincode === loc.pincode && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 text-center">
          🚚 Free refrigerated delivery on all orders above ₹499
        </div>
      </div>
    </Modal>
  );
};
