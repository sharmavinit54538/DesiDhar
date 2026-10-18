import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { Button } from '../common/Button';
import { QrCode, CreditCard, Building2, Banknote, ShieldCheck, Check } from 'lucide-react';

interface PaymentStepProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedMethod,
  onSelectMethod,
  onProceed,
  onBack,
}) => {
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const paymentOptions: {
    id: PaymentMethod;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: 'UPI',
      title: 'UPI (Google Pay, PhonePe, Paytm, BHIM)',
      subtitle: 'Instant zero-fee payment with any UPI application',
      icon: QrCode,
      badge: 'Fastest ⚡',
    },
    {
      id: 'CARD',
      title: 'Credit / Debit Card',
      subtitle: 'Visa, MasterCard, RuPay, Amex',
      icon: CreditCard,
    },
    {
      id: 'NETBANKING',
      title: 'Net Banking',
      subtitle: 'All major Indian national & private banks',
      icon: Building2,
    },
    {
      id: 'COD',
      title: 'Cash / Pay on Delivery',
      subtitle: 'Pay via Cash or UPI QR at your doorstep',
      icon: Banknote,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="pb-3 border-b border-stone-100">
        <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading">
          Select Payment Method
        </h3>
        <p className="text-xs text-stone-500">
          All transactions are encrypted with 256-bit bank grade security.
        </p>
      </div>

      <div className="space-y-3">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => onSelectMethod(opt.id)}
              className={`rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/10'
                  : 'border-stone-200 hover:border-amber-300 bg-white'
              }`}
            >
              <div className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#4A2C17]">
                        {opt.title}
                      </span>
                      {opt.badge && (
                        <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {opt.subtitle}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-amber-600 bg-amber-600'
                      : 'border-stone-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Sub-inputs when option is selected */}
              {isSelected && opt.id === 'UPI' && (
                <div className="px-4 pb-4 pt-1 bg-amber-50/50 border-t border-amber-100 space-y-2.5">
                  <div className="text-xs font-semibold text-stone-600">
                    Enter Virtual Payment Address (UPI ID)
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium text-[#4A2C17] focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-stone-500">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                      <span key={app} className="bg-white px-2 py-0.5 rounded border border-stone-200">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isSelected && opt.id === 'CARD' && (
                <div className="px-4 pb-4 pt-1 bg-amber-50/50 border-t border-amber-100 space-y-2.5">
                  <div className="text-xs font-semibold text-stone-600">
                    Card Information (Demo Mode)
                  </div>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="Card Number (e.g. 4532 •••• •••• 8821)"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold text-[#4A2C17] focus:outline-none focus:border-amber-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM / YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold text-[#4A2C17] focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVV"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold text-[#4A2C17] focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-[#4A2C17] focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {isSelected && opt.id === 'NETBANKING' && (
                <div className="px-4 pb-4 pt-1 bg-amber-50/50 border-t border-amber-100 space-y-2.5">
                  <div className="text-xs font-semibold text-stone-600">
                    Popular Net Banking Portals
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['HDFC', 'ICICI', 'SBI', 'Axis Bank', 'Kotak', 'PNB'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                          selectedBank === bank
                            ? 'bg-amber-100 border-amber-500 text-amber-950'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check className="w-3 h-3 text-amber-700" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack}>
          Back to Slot
        </Button>
        <Button variant="gold" size="md" onClick={onProceed}>
          Review Order Details
        </Button>
      </div>
    </div>
  );
};
