import React from 'react';
import { OrderTimelineItem } from '../../types';
import { Check, Clock, Package, Truck, Home, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface OrderTimelineProps {
  timeline: OrderTimelineItem[];
  isCancelled?: boolean;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline, isCancelled }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'PLACED':
        return Clock;
      case 'PACKED':
        return Package;
      case 'OUT_FOR_DELIVERY':
        return Truck;
      case 'DELIVERED':
        return Home;
      case 'CANCELLED':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="py-4">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
        {timeline.map((item, idx) => {
          const Icon = getIcon(item.status);
          const isDone = item.done;
          const isItemCancelled = item.status === 'CANCELLED';

          return (
            <div key={idx} className="relative group">
              {/* Circle Node */}
              <div
                className={cn(
                  'absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ring-4 ring-white',
                  isItemCancelled
                    ? 'bg-red-600 text-white'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                )}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Text content */}
              <div className="space-y-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4
                    className={cn(
                      'text-sm font-bold font-heading',
                      isItemCancelled
                        ? 'text-red-700'
                        : isDone
                        ? 'text-[#4A2C17]'
                        : 'text-stone-400'
                    )}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-400">
                    {item.time}
                  </span>
                </div>

                {item.description && (
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
