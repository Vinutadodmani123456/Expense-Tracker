import test from 'node:test';
import assert from 'node:assert';
import { validateTransactionInput } from '../src/validators/transactionValidator.js';
import { validateBudgetInput } from '../src/validators/budgetValidator.js';
import { getDateRange } from '../src/utils/dateUtils.js';

test('Transaction Validator - validates valid income transaction', () => {
  const result = validateTransactionInput({
    title: 'Consulting Retainer',
    type: 'income',
    amount: 50000,
    category: 'Salary',
    date: '2026-10-15',
    paymentMethod: 'Bank Transfer'
  });
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.errors.length, 0);
});

test('Transaction Validator - rejects negative and zero amounts', () => {
  const negativeRes = validateTransactionInput({
    title: 'Invalid',
    type: 'income',
    amount: -100,
    category: 'Salary',
    date: '2026-10-15'
  });
  assert.strictEqual(negativeRes.isValid, false);
  assert.ok(negativeRes.errors.some(e => e.includes('strictly greater than zero')));

  const zeroRes = validateTransactionInput({
    title: 'Invalid',
    type: 'expense',
    amount: 0,
    category: 'Food & Dining',
    date: '2026-10-15'
  });
  assert.strictEqual(zeroRes.isValid, false);
  assert.ok(zeroRes.errors.some(e => e.includes('strictly greater than zero')));
});

test('Transaction Validator - rejects mismatched category and type', () => {
  // 'Food & Dining' is an expense category, but type is marked as 'income'
  const mismatchRes = validateTransactionInput({
    title: 'Wrong Combo',
    type: 'income',
    amount: 500,
    category: 'Food & Dining',
    date: '2026-10-15'
  });
  assert.strictEqual(mismatchRes.isValid, false);
  assert.ok(mismatchRes.errors.some(e => e.includes('not a valid income category')));
});

test('Transaction Validator - rejects empty or whitespace-only titles', () => {
  const emptyRes = validateTransactionInput({
    title: '   ',
    type: 'expense',
    amount: 250,
    category: 'Food & Dining',
    date: '2026-10-15'
  });
  assert.strictEqual(emptyRes.isValid, false);
});

test('Budget Validator - validates valid budget input', () => {
  const valid = validateBudgetInput({
    month: 10,
    year: 2026,
    monthlyLimit: 50000
  });
  assert.strictEqual(valid.isValid, true);
});

test('Budget Validator - rejects invalid month and negative limit', () => {
  const invalid = validateBudgetInput({
    month: 13,
    year: 2026,
    monthlyLimit: -500
  });
  assert.strictEqual(invalid.isValid, false);
  assert.strictEqual(invalid.errors.length, 2);
});

test('Date Utils - computes correct month ranges and comparisons', () => {
  const range = getDateRange('this_month');
  assert.ok(range.start instanceof Date);
  assert.ok(range.end instanceof Date);
  assert.ok(range.prevStart instanceof Date);
  assert.ok(range.prevEnd instanceof Date);
  assert.ok(range.start < range.end);
  assert.ok(range.prevStart < range.start);
});
