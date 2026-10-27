import React from 'react';
import { Target, AlertTriangle, CheckCircle2, AlertOctagon, Edit3 } from 'lucide-react';
import { formatINR } from '../utils/formatters.js';

export const MonthlyBudgetCard = ({ budget, loading = false, onOpenBudgetModal }) => {
  if (loading || !budget) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card animate-pulse">
        <div className="h-5 w-36 bg-slate-200 rounded mb-4"></div>
        <div className="h-4 w-full bg-slate-100 rounded mb-3"></div>
      </div>
    );
  }

  const {
    monthlyLimit = 0,
    spent = 0,
    remaining = 0,
    percentageUsed = 0,
    isExceeded = false,
    isWarning = false,
    isConfigured = false
  } = budget;

  // Status styling
  let statusBadge = (
    <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>On Track</span>
    </div>
  );

  let progressBarColor = 'bg-emerald-500';

  if (isExceeded) {
    statusBadge = (
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
        <AlertOctagon className="w-3.5 h-3.5" />
        <span>Budget Exceeded</span>
      </div>
    );
    progressBarColor = 'bg-rose-500';
  } else if (isWarning) {
    statusBadge = (
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Approaching Limit</span>
      </div>
    );
    progressBarColor = 'bg-amber-500';
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-midnight-950 text-mint-400 flex items-center justify-center shadow-md shadow-midnight-950/15">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Monthly Spending Budget
              </h3>
              {isConfigured && statusBadge}
            </div>
            <p className="text-xs text-slate-500">
              {isConfigured
                ? `Limit: ${formatINR(monthlyLimit)} for current billing cycle`
                : 'No spending limit configured for this month'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200 self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>{isConfigured ? 'Adjust Limit' : 'Set Budget'}</span>
        </button>
      </div>

      {isConfigured ? (
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${Math.min(100, Math.max(2, percentageUsed))}%` }}
            />
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div>
              <p className="text-slate-400 font-medium">Spent so far</p>
              <p className="text-sm font-bold text-slate-800">{formatINR(spent)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 font-medium">Usage</p>
              <p className="text-sm font-bold text-slate-800">{percentageUsed}%</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-medium">
                {isExceeded ? 'Over limit by' : 'Remaining'}
              </p>
              <p
                className={`text-sm font-bold ${
                  isExceeded ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {formatINR(Math.abs(remaining))}
              </p>
            </div>
          </div>

          {/* Contextual Warning Note */}
          {isExceeded && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 mt-2">
              <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>
                You have spent <strong>{formatINR(Math.abs(remaining))}</strong> more than your set threshold. Review your discretionary expenses in Recent Transactions below.
              </span>
            </div>
          )}
          {isWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                You have consumed <strong>{percentageUsed}%</strong> of your monthly allowance with <strong>{formatINR(remaining)}</strong> left for remaining days.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Setting a monthly limit alerts you when your expenditure approaches or exceeds safe savings boundaries.
          </p>
          <button
            onClick={onOpenBudgetModal}
            className="text-xs font-semibold text-mint-600 hover:text-mint-700 bg-white border border-mint-200 px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap"
          >
            Configure Budget Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MonthlyBudgetCard;
