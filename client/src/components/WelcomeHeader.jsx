import React from 'react';
import { Plus, Calendar, Menu, RefreshCw } from 'lucide-react';
import { getGreeting } from '../utils/formatters.js';
import { PERIOD_OPTIONS } from '../utils/constants.js';

export const WelcomeHeader = ({
  period,
  setPeriod,
  onOpenAddModal,
  onRefresh,
  isRefreshing = false,
  setMobileOpen
}) => {
  const greeting = getGreeting();
  
  // Format current date nicely: e.g. "Friday, 23 October 2026"
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="mb-8">
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-slate-200">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-mint-500 flex items-center justify-center text-midnight-950 font-bold text-sm shadow-sm">
            ₹
          </div>
          <span className="font-bold text-slate-800 text-base">SpendSphere</span>
        </div>

        <button
          onClick={onOpenAddModal}
          className="p-2 rounded-xl bg-mint-500 text-midnight-950 hover:bg-mint-400 font-semibold shadow-sm"
          aria-label="Add transaction"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedToday}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-midnight-900 to-slate-700">Financial Overview</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor real-time cash flow, category breakdowns, and monthly savings limits.
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="relative inline-flex items-center">
            <select
              id="period-filter-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition cursor-pointer"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard data"
            className="p-2.5 bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 rounded-xl shadow-sm hover:border-slate-300 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-mint-600' : ''}`} />
          </button>

          {/* Add Transaction Button */}
          <button
            id="add-transaction-btn"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase text-midnight-950 bg-gradient-to-r from-mint-400 to-mint-500 hover:from-mint-500 hover:to-mint-600 transition shadow-md shadow-mint-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader;
