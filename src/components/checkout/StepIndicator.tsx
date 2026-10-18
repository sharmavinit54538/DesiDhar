import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export type CheckoutStep = 'ADDRESS' | 'SLOT' | 'PAYMENT' | 'REVIEW';

interface StepIndicatorProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

const STEPS: { key: CheckoutStep; label: string; number: number }[] = [
  { key: 'ADDRESS', label: 'Address', number: 1 },
  { key: 'SLOT', label: 'Delivery Slot', number: 2 },
  { key: 'PAYMENT', label: 'Payment', number: 3 },
  { key: 'REVIEW', label: 'Review & Order', number: 4 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 mb-6 shadow-xs select-none">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isClickable = isDone && onStepClick;

          return (
            <React.Fragment key={step.key}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.key)}
                className={cn(
                  'flex items-center gap-2 group text-left transition-colors',
                  isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                )}
              >
                {/* Circle Number */}
                <div
                  className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0',
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-100 font-extrabold'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  )}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-bold whitespace-nowrap hidden sm:inline font-heading',
                    isDone
                      ? 'text-emerald-700'
                      : isCurrent
                      ? 'text-[#4A2C17]'
                      : 'text-stone-400'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connecting line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-4 transition-colors',
                    idx < currentIdx ? 'bg-emerald-600' : 'bg-stone-200'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
