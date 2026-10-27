import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingDown } from 'lucide-react';
import { formatCompactINR, formatINR } from '../utils/formatters.js';

export const SpendingTrendChart = ({ cashflow, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded mb-4"></div>
        <div className="h-56 w-full bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  const timeline = cashflow?.timeline || [];
  const expenseData = timeline.map((item) => ({
    label: item.label,
    expense: item.expense
  }));

  const hasData = expenseData.some((d) => d.expense > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-midnight-950 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Total Spent:</span>
            <span className="font-bold text-white">{formatINR(payload[0].value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span>Outflow Velocity & Trend</span>
          </h3>
          <p className="text-xs text-slate-500">
            Chronological expense velocity across intervals
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs font-semibold text-slate-600">No expense velocity data recorded</p>
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={expenseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="spendVelocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                tickFormatter={formatCompactINR}
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#F43F5E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendVelocityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SpendingTrendChart;
