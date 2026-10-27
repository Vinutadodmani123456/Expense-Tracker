import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { formatINR } from '../utils/formatters.js';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  transaction = null,
  isDeleting = false
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-midnight-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
            Delete Transaction?
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            This action will permanently remove this entry from your financial database and update all dashboard totals.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left mb-6 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 truncate">
                {transaction.title}
              </span>
              <span className="text-xs font-bold text-slate-900">
                {formatINR(transaction.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{transaction.category}</span>
              <span className="capitalize">{transaction.type}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="w-1/2 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Yes, Delete</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
