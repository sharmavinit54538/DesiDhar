import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { api } from '../../services/api';
import type { PincodeCheckResult } from '../../types';
import { MapPin, Truck, Snowflake, CheckCircle2, AlertCircle } from 'lucide-react';

export const PincodeDeliveryBox: React.FC = () => {
  const { selectedPincode, selectedCity, setPincode } = useAuthStore();
  const { openPincodeModal, addToast } = useUiStore();

  const [inputPin, setInputPin] = useState(selectedPincode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PincodeCheckResult | null>(null);

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(inputPin.trim())) return;
    setLoading(true);
    try {
      const res = await api.checkPincode(inputPin.trim());
      setResult(res);
      if (res.isServiceable) {
        setPincode(res.pincode, res.city);
        addToast(`Verified serviceability for ${res.city}`, 'success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A2C17] uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Delivery &amp; Serviceability</span>
        </div>
        <button
          type="button"
          onClick={openPincodeModal}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
        >
          Change City
        </button>
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit Pincode"
            className="w-full h-10 px-3.5 rounded-xl border border-stone-200 text-xs font-bold tracking-wider text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <button
          type="button"
          disabled={loading || inputPin.length < 6}
          onClick={handleCheck}
          className="h-10 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs transition-colors shrink-0"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {/* Live Serviceability Details */}
      <div className="pt-2 text-xs space-y-2">
        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-[#4A2C17]">
              Early Morning Drop: Tomorrow before 7:00 AM
            </div>
            <div className="text-stone-500 text-[11px]">
              Available for delivery in <span className="font-semibold">{selectedCity}</span> ({selectedPincode})
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Snowflake className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-[#4A2C17]">
              Insulated 4°C Cold-Chain Carrier
            </div>
            <div className="text-stone-500 text-[11px]">
              Packed with gel refrigerant pads to preserve raw freshness and probiotic culture.
            </div>
          </div>
        </div>

        {result && (
          <div
            className={`p-2.5 rounded-xl border text-[11px] ${
              result.isServiceable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {result.isServiceable ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              )}
              <span>{result.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
