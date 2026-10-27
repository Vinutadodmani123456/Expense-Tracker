import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { formatCompactINR, formatINR } from '../utils/formatters.js';

export const CashflowChart = ({ cashflow, loading = false }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'area'

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card animate-pulse">
        <div className="h-6 w-44 bg-slate-200 rounded mb-4"></div>
        <div className="h-72 w-full bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  const timeline = cashflow?.timeline || [];
  const hasData = timeline.length > 0 && timeline.some((d) => d.income > 0 || d.expense > 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-midnight-950 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1">
            {label}
          </p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="font-bold text-white">
                  {formatINR(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Cash-Flow Analysis
          </h3>
          <p className="text-xs text-slate-500">
            Income vs Expense inflows and outflows across selected timeframe
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              chartType === 'bar'
                ? 'bg-white text-midnight-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bars</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              chartType === 'area'
                ? 'bg-white text-midnight-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Area</span>
          </button>
        </div>
      </div>

      {/* Chart Body */}
      {!hasData ? (
        <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No cashflow transactions in this period</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Add your income and expenses to view comparative bars and cash balance curves.
          </p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#F43F5E"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            ) : (
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
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
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CashflowChart;
