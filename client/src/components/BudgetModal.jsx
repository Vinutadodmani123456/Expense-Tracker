import React, { useState, useEffect } from 'react';
import { X, Loader2, Target } from 'lucide-react';
import { formatINR } from '../utils/formatters.js';

export const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentBudget = null,
  isSubmitting = false
}) => {
  const now = new Date();
  const [formData, setFormData] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    monthlyLimit: ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentBudget) {
      setFormData({
        month: currentBudget.month || now.getMonth() + 1,
        year: currentBudget.year || now.getFullYear(),
        monthlyLimit: currentBudget.monthlyLimit ? String(currentBudget.monthlyLimit) : ''
      });
    } else {
      setFormData({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        monthlyLimit: ''
      });
    }
    setError(null);
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const limitNum = Number(formData.monthlyLimit);
    if (!formData.monthlyLimit || isNaN(limitNum) || limitNum <= 0) {
      setError('Please specify a positive budget limit greater than zero.');
      return;
    }
    if (limitNum > 100000000) {
      setError('Budget limit cannot exceed ₹10,00,00,000.');
      return;
    }

    onSubmit({
      month: Number(formData.month),
      year: Number(formData.year),
      monthlyLimit: limitNum
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-midnight-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-midnight-950 text-mint-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Set Monthly Budget Limit
                </h3>
                <p className="text-xs text-slate-500">
                  Target spending ceiling for the month
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Month & Year Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Month
                </label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition cursor-pointer"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition font-medium"
                />
              </div>
            </div>

            {/* Monthly Limit Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Monthly Limit (₹) <span className="text-rose-500">*</span>
                </label>
                {formData.monthlyLimit && !isNaN(Number(formData.monthlyLimit)) && Number(formData.monthlyLimit) > 0 && (
                  <span className="text-xs font-bold text-mint-700 bg-mint-50 px-2 py-0.5 rounded-md border border-mint-200">
                    Preview: {formatINR(Number(formData.monthlyLimit))}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={formData.monthlyLimit}
                  onChange={(e) => {
                    setFormData({ ...formData, monthlyLimit: e.target.value });
                    if (error) setError(null);
                  }}
                  placeholder="e.g. 50000"
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition font-medium"
                />
              </div>
              {error && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{error}</p>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              SpendSphere automatically tallies all expense transactions in the chosen calendar month against this limit and triggers proactive threshold warnings.
            </p>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-midnight-950 bg-gradient-to-r from-mint-400 to-mint-500 hover:from-mint-500 hover:to-mint-600 rounded-xl shadow-md shadow-mint-500/20 disabled:opacity-50 transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Budget</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
