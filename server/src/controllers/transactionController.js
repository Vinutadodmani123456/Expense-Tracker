import { Transaction } from '../models/Transaction.js';
import { validateTransactionInput, validateObjectId } from '../validators/transactionValidator.js';
import { getDateRange } from '../utils/dateUtils.js';

export const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      period,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Period / Date filter
    if (period && period !== 'all_time') {
      const { start, end } = getDateRange(period, startDate, endDate);
      filter.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      const { start, end } = getDateRange('custom', startDate, endDate);
      filter.date = { $gte: start, $lte: end };
    }

    // Type filter
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      filter.type = type.toLowerCase();
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Search filter (title or description)
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } }
      ];
    }

    // Sorting
    const sort = {};
    const validSortFields = ['date', 'amount', 'title', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'date';
    sort[field] = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Transaction.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: totalPages || 1,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const validation = validateTransactionInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const { title, type, amount, category, date, paymentMethod, description } = req.body;

    const transaction = new Transaction({
      title: title.trim(),
      type: type.toLowerCase(),
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI / Net Banking',
      description: description ? description.trim() : ''
    });

    const saved = await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    const existing = await Transaction.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Merge type & category check
    const mergedData = {
      type: req.body.type || existing.type,
      ...req.body
    };

    const validation = validateTransactionInput(mergedData, true);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    if (req.body.title !== undefined) existing.title = req.body.title.trim();
    if (req.body.type !== undefined) existing.type = req.body.type.toLowerCase();
    if (req.body.amount !== undefined) existing.amount = Number(req.body.amount);
    if (req.body.category !== undefined) existing.category = req.body.category;
    if (req.body.date !== undefined) existing.date = new Date(req.body.date);
    if (req.body.paymentMethod !== undefined) existing.paymentMethod = req.body.paymentMethod;
    if (req.body.description !== undefined) existing.description = req.body.description.trim();

    const updated = await existing.save();

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};
