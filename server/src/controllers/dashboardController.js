import { getDateRange } from '../utils/dateUtils.js';
import { calculateSummary, calculateCashflow, calculateCategories } from '../services/dashboardService.js';

export const getSummary = async (req, res, next) => {
  try {
    const { period = 'this_month', startDate, endDate } = req.query;
    const { start, end, prevStart, prevEnd } = getDateRange(period, startDate, endDate);

    const summary = await calculateSummary(start, end, prevStart, prevEnd);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

export const getCashflow = async (req, res, next) => {
  try {
    const { period = 'this_month', startDate, endDate } = req.query;
    const { start, end } = getDateRange(period, startDate, endDate);

    const cashflow = await calculateCashflow(start, end);

    res.status(200).json({
      success: true,
      data: cashflow
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const { period = 'this_month', startDate, endDate } = req.query;
    const { start, end } = getDateRange(period, startDate, endDate);

    const categories = await calculateCategories(start, end);

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
