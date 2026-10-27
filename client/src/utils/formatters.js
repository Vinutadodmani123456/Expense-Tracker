/**
 * Format number as Indian Rupee (INR) with Indian comma grouping:
 * e.g. 125000 -> ₹1,25,000.00
 */
export const formatINR = (amount, includeDecimals = true) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }

  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  }).format(num);
};

/**
 * Compact Indian formatting for chart axes (e.g., ₹25K, ₹1.5L)
 */
export const formatCompactINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Math.abs(Number(amount));
  const sign = Number(amount) < 0 ? '-' : '';

  if (num >= 10000000) {
    return `${sign}₹${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `${sign}₹${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `${sign}₹${(num / 1000).toFixed(0)}k`;
  }
  return `${sign}₹${num}`;
};

/**
 * Format standard date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format relative date for recent items
 */
export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
};

/**
 * Dynamic greeting based on current local hour
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Category color and badge mapper
 */
export const getCategoryMeta = (category) => {
  const map = {
    Salary: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Freelance: { bg: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    Business: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    Scholarship: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'Investment Returns': { bg: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
    'Other Income': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    
    // Expense Categories
    Rent: { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    'Food & Dining': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    Transportation: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500' },
    Education: { bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
    Shopping: { bg: 'bg-pink-50 text-pink-700 border-pink-200', dot: 'bg-pink-500' },
    'Bills & Utilities': { bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    Healthcare: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
    Entertainment: { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    Travel: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'Personal Care': { bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', dot: 'bg-fuchsia-500' },
    'Other Expense': { bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' }
  };

  return map[category] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
};
