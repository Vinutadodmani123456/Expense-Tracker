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
  'Cash',
  'UPI / Net Banking',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Other'
];

export const TRANSACTION_TYPES = ['income', 'expense'];
