import { Budget } from '../models/Budget.js';
import { Transaction } from '../models/Transaction.js';
import { validateBudgetInput } from '../validators/budgetValidator.js';

export const getBudget = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : now.getFullYear();

    if (isNaN(month) || month < 1 || month > 12 || isNaN(year) || year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month or year parameters'
      });
    }

    // Find configured budget or default
    let budgetDoc = await Budget.findOne({ month, year });

    const monthlyLimit = budgetDoc ? budgetDoc.monthlyLimit : 0;

    // Calculate actual expenses for this month
    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = expenseAgg.length > 0 ? Math.round(expenseAgg[0].totalSpent * 100) / 100 : 0;
    const remaining = monthlyLimit > 0 ? Math.round((monthlyLimit - spent) * 100) / 100 : 0;
    const percentageUsed = monthlyLimit > 0 ? Math.min(999, Math.round((spent / monthlyLimit) * 1000) / 10) : 0;
    const isExceeded = monthlyLimit > 0 && spent > monthlyLimit;
    const isWarning = monthlyLimit > 0 && percentageUsed >= 80 && !isExceeded;

    res.status(200).json({
      success: true,
      data: {
        id: budgetDoc ? budgetDoc._id : null,
        month,
        year,
        monthlyLimit,
        spent,
        remaining,
        percentageUsed,
        isExceeded,
        isWarning,
        isConfigured: !!budgetDoc
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const validation = validateBudgetInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const month = parseInt(req.body.month, 10);
    const year = parseInt(req.body.year, 10);
    const monthlyLimit = Math.round(Number(req.body.monthlyLimit) * 100) / 100;

    const budget = await Budget.findOneAndUpdate(
      { month, year },
      { monthlyLimit },
      { new: true, upsert: true, runValidators: true }
    );

    // Calculate spent in this month
    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const spent = expenseAgg.length > 0 ? Math.round(expenseAgg[0].totalSpent * 100) / 100 : 0;
    const remaining = Math.round((monthlyLimit - spent) * 100) / 100;
    const percentageUsed = Math.min(999, Math.round((spent / monthlyLimit) * 1000) / 10);
    const isExceeded = spent > monthlyLimit;
    const isWarning = percentageUsed >= 80 && !isExceeded;

    res.status(200).json({
      success: true,
      message: 'Monthly budget updated successfully',
      data: {
        id: budget._id,
        month,
        year,
        monthlyLimit: budget.monthlyLimit,
        spent,
        remaining,
        percentageUsed,
        isExceeded,
        isWarning,
        isConfigured: true
      }
    });
  } catch (error) {
    next(error);
  }
};
