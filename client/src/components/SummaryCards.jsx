import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { formatINR } from '../utils/formatters.js';

export const SummaryCards = ({ summary, loading = false }) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card animate-pulse">
            <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
            <div className="h-7 w-32 bg-slate-200 rounded mb-3"></div>
            <div className="h-4 w-28 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalBalance = 0,
    totalIncome = 0,
    totalExpenses = 0,
    netSavingsRate = 0,
    comparison
  } = summary;

  // Comparison helper
  const renderTrendBadge = (changeVal, isExpense = false) => {
    if (!comparison || !comparison.hasPrevData || changeVal === null || changeVal === undefined) {
      return (
        <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
          <Minus className="w-3 h-3 text-slate-400" />
          <span>No prior data</span>
        </div>
      );
    }

    const isPositive = changeVal > 0;
    const isZero = changeVal === 0;

    // For expenses, an increase is cautionary (red/coral), decrease is favorable (green)
    const isGood = isExpense ? !isPositive : isPositive;

    const colorClass = isZero
      ? 'text-slate-600 bg-slate-100 border-slate-200'
      : isGood
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

    return (
      <div className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>
        {isPositive ? (
          <ArrowUpRight className="w-3.5 h-3.5" />
        ) : isZero ? (
          <Minus className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3.5 h-3.5" />
        )}
        <span>{Math.abs(changeVal)}%</span>
        <span className="font-normal opacity-70 ml-0.5">vs prev</span>
      </div>
    );
  };

  const cards = [
    {
      id: 'balance',
      title: 'Total Balance',
      value: formatINR(totalBalance),
      subtext: 'Net disposable funds',
      badge: renderTrendBadge(comparison?.balanceChange),
      icon: Wallet,
      iconBg: 'bg-midnight-950 text-mint-400 shadow-md shadow-midnight-950/20',
      accentColor: totalBalance >= 0 ? 'text-slate-900' : 'text-rose-600',
      sparkColor: '#10B981'
    },
    {
      id: 'income',
      title: 'Total Income',
      value: formatINR(totalIncome),
      subtext: `${summary.transactionCounts?.income || 0} deposits received`,
      badge: renderTrendBadge(comparison?.incomeChange, false),
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      accentColor: 'text-emerald-600',
      sparkColor: '#059669'
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: formatINR(totalExpenses),
      subtext: `${summary.transactionCounts?.expense || 0} outflows logged`,
      badge: renderTrendBadge(comparison?.expensesChange, true),
      icon: TrendingDown,
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      accentColor: 'text-rose-600',
      sparkColor: '#F43F5E'
    },
    {
      id: 'savings',
      title: 'Net Savings Rate',
      value: `${netSavingsRate}%`,
      subtext: totalIncome > 0 ? 'Of gross cash receipts' : 'No income recorded',
      badge: (
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span>Target &ge; 25%</span>
        </div>
      ),
      icon: PiggyBank,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      accentColor: netSavingsRate >= 25 ? 'text-indigo-600' : 'text-slate-900',
      sparkColor: '#818CF8'
    }
  ];

  return (
    <section aria-label="Financial Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-elevated transition-smooth flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <h2 className={`text-2xl font-bold tracking-tight ${card.accentColor}`}>
                  {card.value}
                </h2>
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {card.subtext}
              </span>
              <div>{card.badge}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SummaryCards;
