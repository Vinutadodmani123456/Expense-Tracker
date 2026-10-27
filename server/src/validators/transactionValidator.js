import mongoose from 'mongoose';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS, TRANSACTION_TYPES } from '../config/constants.js';

export const validateTransactionInput = (data, isUpdate = false) => {
  const errors = [];
  const { title, type, amount, category, date, paymentMethod, description } = data;

  // Title validation
  if (!isUpdate || title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Transaction title is required and cannot be empty or only spaces');
    } else if (title.trim().length < 2) {
      errors.push('Transaction title must be at least 2 characters long');
    } else if (title.trim().length > 100) {
      errors.push('Transaction title cannot exceed 100 characters');
    }
  }

  // Type validation
  if (!isUpdate || type !== undefined) {
    if (!type || !TRANSACTION_TYPES.includes(type.toLowerCase())) {
      errors.push('Transaction type must be either "income" or "expense"');
    }
  }

  // Amount validation
  if (!isUpdate || amount !== undefined) {
    const numAmount = Number(amount);
    if (amount === undefined || amount === null || amount === '') {
      errors.push('Amount is required');
    } else if (isNaN(numAmount) || !isFinite(numAmount)) {
      errors.push('Amount must be a valid number');
    } else if (numAmount <= 0) {
      errors.push('Amount must be strictly greater than zero');
    } else if (numAmount > 100000000) {
      errors.push('Amount exceeds the maximum permissible limit (₹10,00,00,000)');
    }
  }

  // Category validation (aligned with type)
  const effectiveType = type ? type.toLowerCase() : undefined;
  if (!isUpdate || category !== undefined) {
    if (!category || typeof category !== 'string') {
      errors.push('Category is required');
    } else {
      if (effectiveType === 'income' && !INCOME_CATEGORIES.includes(category)) {
        errors.push(`"${category}" is not a valid income category`);
      } else if (effectiveType === 'expense' && !EXPENSE_CATEGORIES.includes(category)) {
        errors.push(`"${category}" is not a valid expense category`);
      } else if (!effectiveType && !INCOME_CATEGORIES.includes(category) && !EXPENSE_CATEGORIES.includes(category)) {
        errors.push(`"${category}" is not a recognized category`);
      }
    }
  }

  // Date validation
  if (!isUpdate || date !== undefined) {
    if (!date) {
      errors.push('Transaction date is required');
    } else {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push('Invalid transaction date format');
      } else {
        const year = parsedDate.getFullYear();
        if (year < 2000 || year > 2100) {
          errors.push('Date must be between year 2000 and 2100');
        }
      }
    }
  }

  // Payment Method validation
  if (paymentMethod !== undefined) {
    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      errors.push(`"${paymentMethod}" is not an accepted payment method`);
    }
  }

  // Description validation
  if (description !== undefined && typeof description === 'string' && description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
