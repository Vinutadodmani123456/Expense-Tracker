export const validateBudgetInput = (data) => {
  const errors = [];
  const { month, year, monthlyLimit } = data;

  const numMonth = Number(month);
  if (month === undefined || isNaN(numMonth) || !Number.isInteger(numMonth) || numMonth < 1 || numMonth > 12) {
    errors.push('Month must be an integer between 1 and 12');
  }

  const numYear = Number(year);
  if (year === undefined || isNaN(numYear) || !Number.isInteger(numYear) || numYear < 2000 || numYear > 2100) {
    errors.push('Year must be an integer between 2000 and 2100');
  }

  const numLimit = Number(monthlyLimit);
  if (monthlyLimit === undefined || isNaN(numLimit) || !isFinite(numLimit) || numLimit <= 0) {
    errors.push('Monthly budget limit must be a positive number greater than zero');
  } else if (numLimit > 100000000) {
    errors.push('Monthly budget limit cannot exceed ₹10,00,00,000');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
