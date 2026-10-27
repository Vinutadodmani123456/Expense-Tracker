import React from 'react';
import { PlusCircle, SearchX, AlertCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PlusCircle,
  title = 'No transactions recorded',
  description = 'Start tracking your personal finances by logging your first income or expense.',
  actionText = '+ Add Transaction',
  onAction
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-4">
    <div className="w-14 h-14 rounded-2xl bg-white shadow-subtle border border-slate-100 flex items-center justify-center text-mint-600 mb-4">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-sm mb-5">{description}</p>
    {onAction && actionText && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-midnight-900 hover:bg-midnight-800 rounded-xl transition-all shadow-sm"
      >
        {actionText}
      </button>
    )}
  </div>
);

export const ErrorState = ({
  message = 'Failed to load data. The backend server might be offline.',
  onRetry
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-200 my-4">
    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h3 className="text-base font-semibold text-rose-900 mb-1">Connection Issue</h3>
    <p className="text-sm text-rose-700 max-w-sm mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 rounded-xl transition shadow-sm"
      >
        Retry Request
      </button>
    )}
  </div>
);
