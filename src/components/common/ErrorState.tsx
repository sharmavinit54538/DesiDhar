import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center p-8 sm:p-10 bg-white rounded-2xl border border-red-100 my-4 ${className}`}
    role="alert"
  >
    <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
      <AlertTriangle className="w-7 h-7" />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-[#4A2C17] font-heading mb-1.5">{title}</h3>
    <p className="text-sm text-stone-500 max-w-md mb-5">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
        {retryLabel}
      </Button>
    )}
  </div>
);
