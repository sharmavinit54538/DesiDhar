import React from 'react';
import { DeliverySlot } from '../../types';
import { Button } from '../common/Button';
import { Clock, Sunrise, Sun, Sunset, Snowflake } from 'lucide-react';

interface SlotStepProps {
  selectedSlotId: string;
  onSelectSlot: (slot: DeliverySlot) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const DELIVERY_SLOTS: DeliverySlot[] = [
  {
    id: 'slot-early-morning',
    title: 'Early Morning Milk Run (Recommended)',
    timeWindow: '6:00 AM – 8:00 AM',
    date: 'Tomorrow',
    tag: 'Coldest Delivery ❄️',
    isAvailable: true,
  },
  {
    id: 'slot-mid-morning',
    title: 'Mid-Morning Breakfast Slot',
    timeWindow: '8:00 AM – 11:00 AM',
    date: 'Tomorrow',
    isAvailable: true,
  },
  {
    id: 'slot-evening',
    title: 'Evening Refreshment & Dinner Slot',
    timeWindow: '5:00 PM – 8:00 PM',
    date: 'Tomorrow',
    isAvailable: true,
  },
];

export const SlotStep: React.FC<SlotStepProps> = ({
  selectedSlotId,
  onSelectSlot,
  onProceed,
  onBack,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="pb-3 border-b border-stone-100">
        <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading">
          Choose Delivery Slot
        </h3>
        <p className="text-xs text-stone-500">
          All dairy items are dispatched directly in refrigerated insulated boxes.
        </p>
      </div>

      <div className="space-y-3">
        {DELIVERY_SLOTS.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          const isEarly = slot.id === 'slot-early-morning';
          const isMid = slot.id === 'slot-mid-morning';

          const SlotIcon = isEarly ? Sunrise : isMid ? Sun : Sunset;

          return (
            <div
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/10'
                  : 'border-stone-200 hover:border-amber-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <SlotIcon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#4A2C17]">
                      {slot.title}
                    </span>
                    {slot.tag && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {slot.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold text-stone-700">{slot.date}</span>
                    <span>•</span>
                    <span className="font-mono text-stone-600">{slot.timeWindow}</span>
                  </div>
                </div>
              </div>

              {/* Radio Indicator */}
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
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-2.5 text-xs text-sky-900">
        <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
        <span>
          <strong>Temperature Protected:</strong> Milk and paneer maintain 4°C temperature in our insulated boxes for up to 3 hours after doorstep drop.
        </span>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack}>
          Back to Address
        </Button>
        <Button
          variant="gold"
          size="md"
          disabled={!selectedSlotId}
          onClick={onProceed}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};
