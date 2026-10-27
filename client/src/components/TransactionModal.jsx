import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants.js';
import { formatINR } from '../utils/formatters.js';

export const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  transactionToEdit = null,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'expense',
    amount: '',
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI / Net Banking',
    description: ''
  });

  const [errors, setErrors] = useState({});

  // Reset or populate on open
  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        title: transactionToEdit.title || '',
        type: transactionToEdit.type || 'expense',
        amount: transactionToEdit.amount !== undefined ? String(transactionToEdit.amount) : '',
        category: transactionToEdit.category || (transactionToEdit.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
        date: transactionToEdit.date ? new Date(transactionToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        paymentMethod: transactionToEdit.paymentMethod || 'UPI / Net Banking',
        description: transactionToEdit.description || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'expense',
        amount: '',
        category: EXPENSE_CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI / Net Banking',
        description: ''
      });
    }
    setErrors({});
  }, [transactionToEdit, isOpen]);

  // Handle type change and update category to matching default
  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    }));
    // clear category error if any
    setErrors((prev) => ({ ...prev, category: null }));
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required and cannot be empty';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    const numAmount = Number(formData.amount);
    if (!formData.amount || formData.amount.trim() === '') {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(numAmount) || !isFinite(numAmount)) {
      newErrors.amount = 'Amount must be a valid number';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    } else if (numAmount > 100000000) {
      newErrors.amount = 'Amount exceeds maximum allowable limit';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a valid category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      title: formData.title.trim(),
      description: formData.description.trim()
    });
  };

  if (!isOpen) return null;

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isEditing = Boolean(transactionToEdit);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-midnight-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {isEditing ? 'Edit Transaction' : 'Record New Transaction'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update the details of this ledger entry' : 'Log an income receipt or expense outflow'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Type selector toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition ${
                    formData.type === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Income Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition ${
                    formData.type === 'expense'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Expense Outflow</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title / Payee <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                placeholder="e.g. Monthly Salary, Grocery Mart, Apartment Rent"
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border ${
                  errors.title ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                } focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition`}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.title}</p>
              )}
            </div>

            {/* Amount and Live Rupee Preview */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Amount in ₹ <span className="text-rose-500">*</span>
                </label>
                {formData.amount && !isNaN(Number(formData.amount)) && Number(formData.amount) > 0 && (
                  <span className="text-xs font-bold text-mint-700 bg-mint-50 px-2 py-0.5 rounded-md border border-mint-200">
                    Preview: {formatINR(Number(formData.amount))}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value });
                    if (errors.amount) setErrors({ ...errors, amount: null });
                  }}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3.5 py-2.5 text-xs rounded-xl border ${
                    errors.amount ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                  } focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition font-medium`}
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.amount}</p>
              )}
            </div>

            {/* Category and Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transaction Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    if (errors.date) setErrors({ ...errors, date: null });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition"
                />
                {errors.date && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.date}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Notes / Memo
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional context or invoice reference..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-midnight-950 bg-gradient-to-r from-mint-400 to-mint-500 hover:from-mint-500 hover:to-mint-600 rounded-xl shadow-md shadow-mint-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Save Changes' : 'Confirm & Save'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
