export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Scholarship',
  'Investment Returns',
  'Other Income'
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Education',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Entertainment',
  'Rent',
  'Travel',
  'Personal Care',
  'Other Expense'
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const PAYMENT_METHODS = [
  'UPI / Net Banking',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'Other'
];

export const PERIOD_OPTIONS = [
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'This Year', value: 'this_year' },
  { label: 'All Time', value: 'all_time' }
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#F59E0B',
  Transportation: '#06B6D4',
  Rent: '#F43F5E',
  'Bills & Utilities': '#FB923C',
  Shopping: '#EC4899',
  Healthcare: '#EF4444',
  Entertainment: '#8B5CF6',
  'Personal Care': '#D946EF',
  Education: '#0284C7',
  Travel: '#3B82F6',
  'Other Expense': '#64748B',

  Salary: '#10B981',
  Freelance: '#14B8A6',
  Business: '#6366F1',
  Scholarship: '#38BDF8',
  'Investment Returns': '#8B5CF6',
  'Other Income': '#059669'
};
