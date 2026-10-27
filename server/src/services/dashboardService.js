import { Transaction } from '../models/Transaction.js';

/**
 * Calculates financial summary metrics with comparison to previous period
 */
export const calculateSummary = async (start, end, prevStart, prevEnd) => {
  // Aggregate current period
  const currentPipeline = [
    {
      $match: {
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ];

  const currentResults = await Transaction.aggregate(currentPipeline);

  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  currentResults.forEach((item) => {
    if (item._id === 'income') {
      totalIncome = Math.round(item.total * 100) / 100;
      incomeCount = item.count;
    } else if (item._id === 'expense') {
      totalExpenses = Math.round(item.total * 100) / 100;
      expenseCount = item.count;
    }
  });

  const totalBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;
  
  // Safe savings rate calculation
  const netSavingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 1000) / 10
    : 0;

  // Comparison with previous period
  let comparison = null;
  if (prevStart && prevEnd) {
    const prevPipeline = [
      {
        $match: {
          date: { $gte: prevStart, $lte: prevEnd }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ];

    const prevResults = await Transaction.aggregate(prevPipeline);
    let prevIncome = 0;
    let prevExpenses = 0;

    prevResults.forEach((item) => {
      if (item._id === 'income') {
        prevIncome = Math.round(item.total * 100) / 100;
      } else if (item._id === 'expense') {
        prevExpenses = Math.round(item.total * 100) / 100;
      }
    });

    const prevBalance = Math.round((prevIncome - prevExpenses) * 100) / 100;
    const prevSavingsRate = prevIncome > 0
      ? Math.round(((prevIncome - prevExpenses) / prevIncome) * 1000) / 10
      : 0;

    const computeChange = (curr, prev) => {
      if (prev === 0) {
        return curr > 0 ? null : 0;
      }
      return Math.round(((curr - prev) / Math.abs(prev)) * 1000) / 10;
    };

    comparison = {
      incomeChange: computeChange(totalIncome, prevIncome),
      expensesChange: computeChange(totalExpenses, prevExpenses),
      balanceChange: computeChange(totalBalance, prevBalance),
      savingsRateDiff: Math.round((netSavingsRate - prevSavingsRate) * 10) / 10,
      prevIncome,
      prevExpenses,
      prevBalance,
      hasPrevData: prevIncome > 0 || prevExpenses > 0
    };
  }

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    netSavingsRate,
    transactionCounts: {
      income: incomeCount,
      expense: expenseCount,
      total: incomeCount + expenseCount
    },
    comparison,
    period: {
      start: start.toISOString(),
      end: end.toISOString()
    }
  };
};

/**
 * Returns date-grouped cashflow series (Income vs Expense)
 */
export const calculateCashflow = async (start, end) => {
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const isMonthlyGrouping = daysDiff > 35;

  const dateGrouping = isMonthlyGrouping
    ? {
        year: { $year: '$date' },
        month: { $month: '$date' }
      }
    : {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' }
      };

  const pipeline = [
    {
      $match: {
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: {
          period: dateGrouping,
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    {
      $sort: {
        '_id.period.year': 1,
        '_id.period.month': 1,
        ...(!isMonthlyGrouping ? { '_id.period.day': 1 } : {})
      }
    }
  ];

  const results = await Transaction.aggregate(pipeline);

  // Map to structured chronologically sorted records
  const map = new Map();

  results.forEach((item) => {
    const p = item._id.period;
    let key;
    let label;

    if (isMonthlyGrouping) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      key = `${p.year}-${String(p.month).padStart(2, '0')}`;
      label = `${monthNames[p.month - 1]} ${p.year}`;
    } else {
      key = `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
      const d = new Date(p.year, p.month - 1, p.day);
      label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    if (!map.has(key)) {
      map.set(key, {
        key,
        label,
        income: 0,
        expense: 0,
        net: 0
      });
    }

    const entry = map.get(key);
    const amount = Math.round(item.total * 100) / 100;
    if (item._id.type === 'income') {
      entry.income = amount;
    } else if (item._id.type === 'expense') {
      entry.expense = amount;
    }
    entry.net = Math.round((entry.income - entry.expense) * 100) / 100;
  });

  const timeline = Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));

  return {
    grouping: isMonthlyGrouping ? 'monthly' : 'daily',
    timeline
  };
};

/**
 * Returns category-wise expense breakdown with percentages
 */
export const calculateCategories = async (start, end) => {
  const pipeline = [
    {
      $match: {
        date: { $gte: start, $lte: end },
        type: 'expense'
      }
    },
    {
      $group: {
        _id: '$category',
        amount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { amount: -1 }
    }
  ];

  const results = await Transaction.aggregate(pipeline);
  const totalExpense = results.reduce((acc, curr) => acc + curr.amount, 0);

  const categories = results.map((item) => {
    const amount = Math.round(item.amount * 100) / 100;
    const percentage = totalExpense > 0
      ? Math.round((amount / totalExpense) * 1000) / 10
      : 0;
    return {
      category: item._id,
      amount,
      percentage,
      count: item.count
    };
  });

  return {
    totalExpense: Math.round(totalExpense * 100) / 100,
    categories
  };
};
