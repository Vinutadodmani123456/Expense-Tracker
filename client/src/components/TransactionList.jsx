import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard
} from 'lucide-react';
import { formatINR, formatDate, getCategoryMeta } from '../utils/formatters.js';
import { ALL_CATEGORIES } from '../utils/constants.js';

export const TransactionList = ({
  transactions = [],
  pagination = {},
  loading = false,
  onPageChange,
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onEdit,
  onDeleteRequest,
  onAddNew
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'date_desc') {
      setSortBy('date');
      setSortOrder('desc');
    } else if (val === 'date_asc') {
      setSortBy('date');
      setSortOrder('asc');
    } else if (val === 'amount_desc') {
      setSortBy('amount');
      setSortOrder('desc');
    } else if (val === 'amount_asc') {
      setSortBy('amount');
      setSortOrder('asc');
    }
  };

  const currentSortKey = `${sortBy}_${sortOrder}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
      {/* Header and Filter Controls */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Transaction History
            </h3>
            <p className="text-xs text-slate-500">
              Complete searchable ledger of receipts, bills, and disbursements
            </p>
          </div>

          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-midnight-950 hover:bg-midnight-900 rounded-xl transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-mint-400" />
            <span>Record Entry</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="md:col-span-3 flex bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t === 'all' ? '' : t)}
                className={`flex-1 py-1 text-xs font-medium rounded-lg capitalize transition ${
                  (t === 'all' && !typeFilter) || typeFilter === t
                    ? 'bg-white text-midnight-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={categoryFilter || 'all'}
              onChange={(e) => setCategoryFilter(e.target.value === 'all' ? '' : e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition cursor-pointer"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-2 relative">
            <select
              value={currentSortKey}
              onChange={handleSortChange}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Active Category Filter Chip */}
        {categoryFilter && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              <span>{categoryFilter}</span>
              <button
                onClick={() => setCategoryFilter('')}
                className="hover:text-mint-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Transactions Table / List */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-mint-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading ledger entries...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-700">No matching transactions</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {localSearch || typeFilter || categoryFilter
              ? 'Try modifying your search query or removing category/type filters.'
              : 'Log your first income or expense entry to begin tracking.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-5">Transaction</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const catMeta = getCategoryMeta(tx.category);

                  return (
                    <tr
                      key={tx._id || tx.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Title & Description */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isIncome
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-xs">
                              {tx.title}
                            </p>
                            {tx.description && (
                              <p className="text-[11px] text-slate-400 truncate max-w-xs">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${catMeta.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dot}`} />
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {formatDate(tx.date)}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>{tx.paymentMethod || 'UPI / Net Banking'}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`text-sm font-bold ${
                            isIncome ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isIncome ? '+' : '-'} {formatINR(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => onEdit(tx)}
                            title="Edit transaction"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRequest(tx)}
                            title="Delete transaction"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const catMeta = getCategoryMeta(tx.category);

              return (
                <div key={tx._id || tx.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-xs">{tx.title}</p>
                        <p className="text-[11px] text-slate-400">{formatDate(tx.date)}</p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatINR(tx.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catMeta.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dot}`} />
                      {tx.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1 text-slate-400 hover:text-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRequest(tx)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 bg-slate-50/75 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Showing <strong>{(pagination.page - 1) * pagination.limit + 1}</strong> to{' '}
                <strong>
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </strong>{' '}
                of <strong>{pagination.total}</strong> records
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;
