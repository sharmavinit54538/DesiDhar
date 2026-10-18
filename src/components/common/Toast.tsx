import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex flex-col gap-2.5 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200',
              isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-700'
                : isError
                ? 'bg-red-900/95 text-white border-red-700'
                : 'bg-stone-900/95 text-white border-stone-700'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400" />}
            </div>

            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
