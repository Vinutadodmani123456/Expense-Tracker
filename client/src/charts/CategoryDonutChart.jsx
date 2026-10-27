import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { CATEGORY_COLORS } from '../utils/constants.js';
import { formatINR } from '../utils/formatters.js';

export const CategoryDonutChart = ({
  categoryData,
  loading = false,
  selectedCategory,
  onSelectCategory
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card animate-pulse">
        <div className="h-6 w-40 bg-slate-200 rounded mb-4"></div>
        <div className="h-72 w-full bg-slate-100 rounded-full"></div>
      </div>
    );
  }

  const categories = categoryData?.categories || [];
  const totalExpense = categoryData?.totalExpense || 0;
  const hasExpenses = categories.length > 0 && totalExpense > 0;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-midnight-950 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.fill }}
            />
            <span className="font-semibold text-slate-200">{data.category}</span>
          </div>
          <p className="text-sm font-bold text-white">{formatINR(data.amount)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{data.percentage}% of total expenses</p>
          <p className="text-[10px] text-mint-400 mt-1 font-medium">Click to filter transactions</p>
        </div>
      );
    }
    return null;
  };

  const chartData = categories.map((item) => ({
    ...item,
    fill: CATEGORY_COLORS[item.category] || '#64748B'
  }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Expense Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Click any category to filter the transaction list
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[11px] font-semibold text-mint-600 hover:text-mint-700 bg-mint-50 px-2.5 py-1 rounded-lg border border-mint-200 transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Body */}
      {!hasExpenses ? (
        <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No expense logs found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Log an expense to see your spending allocation and category distribution donut.
          </p>
        </div>
      ) : (
        <div>
          {/* Donut Chart Container */}
          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  onClick={(data) => {
                    if (data && data.category) {
                      onSelectCategory(selectedCategory === data.category ? null : data.category);
                    }
                  }}
                  cursor="pointer"
                >
                  {chartData.map((entry) => {
                    const isSelected = selectedCategory === entry.category;
                    return (
                      <Cell
                        key={`cell-${entry.category}`}
                        fill={entry.fill}
                        stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        opacity={selectedCategory && !isSelected ? 0.45 : 1}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Total
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {formatINR(totalExpense, false)}
              </span>
            </div>
          </div>

          {/* Interactive Categories Legend */}
          <div className="mt-4 max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {chartData.map((item) => {
              const isSelected = selectedCategory === item.category;
              return (
                <button
                  key={item.category}
                  onClick={() =>
                    onSelectCategory(isSelected ? null : item.category)
                  }
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="truncate">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                      {item.percentage}%
                    </span>
                    <span className="font-semibold">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDonutChart;
