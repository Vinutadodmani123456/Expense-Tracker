import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: [true, 'Month is required (1-12)'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12']
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be valid'],
      max: [2100, 'Year must be valid']
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly spending limit is required'],
      min: [1, 'Monthly limit must be greater than zero'],
      set: (v) => Math.round(Number(v) * 100) / 100
    }
  },
  {
    timestamps: true
  }
);

// Enforce one overall budget per month/year
budgetSchema.index({ month: 1, year: 1 }, { unique: true });

export const Budget = mongoose.model('Budget', budgetSchema);
