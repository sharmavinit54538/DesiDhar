import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { useStorefront } from '../../context/StorefrontContext';
import { api } from '../../services/api';
import type { PincodeCheckResult } from '../../types';
import { MapPin, Truck, Snowflake, CheckCircle2, AlertCircle } from 'lucide-react';

export const PincodeDeliveryBox: React.FC = () => {
  const { selectedPincode, selectedCity, setPincode } = useAuthStore();
  const { openPincodeModal, addToast } = useUiStore();
  const { settings } = useStorefront();

  const [inputPin, setInputPin] = useState(selectedPincode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PincodeCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    const pincode = inputPin.trim();
    setError(null);
    if (!/^\d{6}$/.test(pincode)) {
      setError('Enter a valid 6-digit pincode.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.checkPincode(pincode);
      setResult(response);
      if (response.isServiceable) {
        setPincode(response.pincode, response.city);
        addToast(`Delivery confirmed for ${response.city}`, 'success');
      }
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error ? err.message : 'Serviceability could not be checked right now.'
      );
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
          Change city
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={inputPin}
          onChange={(event) => setInputPin(event.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit pincode"
          aria-label="Pincode"
          className="w-full h-10 px-3.5 rounded-xl border border-stone-200 text-xs font-bold tracking-wider text-[#4A2C17] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="button"
          disabled={loading || inputPin.length < 6}
          onClick={() => void handleCheck()}
          className="h-10 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs transition-colors shrink-0"
        >
          {loading ? 'Checking…' : 'Check'}
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}

      <div className="pt-2 text-xs space-y-2">
        {result ? (
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
            {result.isServiceable && (
              <p className="mt-1 text-emerald-800">
                Earliest delivery: {result.estimatedDelivery}
                {result.coldChainAvailable ? ' · cold-chain carrier' : ''}
              </p>
            )}
          </div>
        ) : selectedPincode ? (
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-[#4A2C17]">
                Delivering to {selectedCity || 'your area'} ({selectedPincode})
              </div>
              <div className="text-stone-500 text-[11px]">
                Exact windows are shown at checkout based on kitchen cut-off. Verify a pincode to
                confirm serviceability.
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-stone-500">
            Enter your pincode to see whether DesiDhar delivers in your area.
          </p>
        )}

        <div className="flex items-start gap-2.5">
          <Snowflake className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-[#4A2C17]">Cold-chain handling</div>
            <div className="text-stone-500 text-[11px]">
              {settings?.freeDeliveryThreshold
                ? `Free delivery on orders of ₹${settings.freeDeliveryThreshold} or more.`
                : 'Delivery charges are confirmed at checkout.'}{' '}
              Items are packed in insulated carriers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
