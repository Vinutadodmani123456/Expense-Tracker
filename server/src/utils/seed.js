import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';
import { Budget } from '../models/Budget.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendsphere';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    console.log('Cleared existing transactions and budgets.');

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Helper for dates
    const d = (year, month, day, hour = 12) => new Date(year, month, day, hour, 0, 0);

    const transactions = [
      // Current Month Income
      {
        title: 'Monthly Software Consulting Salary',
        type: 'income',
        amount: 85000,
        category: 'Salary',
        date: d(currentYear, currentMonth, 1, 10),
        paymentMethod: 'Bank Transfer',
        description: 'Direct salary deposit for the month'
      },
      {
        title: 'Fintech UI Design Freelance',
        type: 'income',
        amount: 28500,
        category: 'Freelance',
        date: d(currentYear, currentMonth, 7, 14),
        paymentMethod: 'UPI / Net Banking',
        description: 'Design sprint milestone 2 completed'
      },
      {
        title: 'Quarterly Mutual Fund Dividend',
        type: 'income',
        amount: 6400,
        category: 'Investment Returns',
        date: d(currentYear, currentMonth, 14, 11),
        paymentMethod: 'Bank Transfer',
        description: 'Index fund dividend payout'
      },

      // Current Month Expenses
      {
        title: 'Apartment Monthly Rent',
        type: 'expense',
        amount: 22000,
        category: 'Rent',
        date: d(currentYear, currentMonth, 2, 9),
        paymentMethod: 'UPI / Net Banking',
        description: 'Monthly flat rent paid to landlord'
      },
      {
        title: 'Nature Basket Organic Groceries',
        type: 'expense',
        amount: 5420,
        category: 'Food & Dining',
        date: d(currentYear, currentMonth, 4, 18),
        paymentMethod: 'Credit Card',
        description: 'Monthly fresh groceries and dairy'
      },
      {
        title: 'High-speed Fiber Broadband',
        type: 'expense',
        amount: 1199,
        category: 'Bills & Utilities',
        date: d(currentYear, currentMonth, 5, 11),
        paymentMethod: 'UPI / Net Banking',
        description: 'Airtel 300 Mbps unlimited plan'
      },
      {
        title: 'Annual Gym & Fitness Membership',
        type: 'expense',
        amount: 2500,
        category: 'Personal Care',
        date: d(currentYear, currentMonth, 8, 8),
        paymentMethod: 'Credit Card',
        description: 'Cult.fit monthly installment'
      },
      {
        title: 'Weekend Dining at Smoke House Deli',
        type: 'expense',
        amount: 2750,
        category: 'Food & Dining',
        date: d(currentYear, currentMonth, 11, 20),
        paymentMethod: 'Credit Card',
        description: 'Dinner with friends'
      },
      {
        title: 'Metro Rail Pass & Shell Fuel',
        type: 'expense',
        amount: 3200,
        category: 'Transportation',
        date: d(currentYear, currentMonth, 13, 17),
        paymentMethod: 'UPI / Net Banking',
        description: 'Smartcard top-up and bike petrol'
      },
      {
        title: 'Electricity & Water Utility Bill',
        type: 'expense',
        amount: 2480,
        category: 'Bills & Utilities',
        date: d(currentYear, currentMonth, 16, 15),
        paymentMethod: 'UPI / Net Banking',
        description: 'BESCOM electricity bill'
      },
      {
        title: 'Ergonomic Mechanical Keyboard',
        type: 'expense',
        amount: 4599,
        category: 'Shopping',
        date: d(currentYear, currentMonth, 18, 16),
        paymentMethod: 'Credit Card',
        description: 'Keychron wireless keyboard for work'
      },
      {
        title: 'Pharmacy & Wellness Vitamins',
        type: 'expense',
        amount: 1150,
        category: 'Healthcare',
        date: d(currentYear, currentMonth, 20, 19),
        paymentMethod: 'UPI / Net Banking',
        description: 'Multivitamins and first aid'
      },

      // Previous Month Data (for comparison & historical trends)
      {
        title: 'Previous Month Salary',
        type: 'income',
        amount: 85000,
        category: 'Salary',
        date: d(currentYear, currentMonth - 1, 1, 10),
        paymentMethod: 'Bank Transfer',
        description: 'Salary credited'
      },
      {
        title: 'Mobile App Freelance Gig',
        type: 'income',
        amount: 20000,
        category: 'Freelance',
        date: d(currentYear, currentMonth - 1, 10, 15),
        paymentMethod: 'UPI / Net Banking',
        description: 'React Native contract'
      },
      {
        title: 'Previous Month Rent',
        type: 'expense',
        amount: 22000,
        category: 'Rent',
        date: d(currentYear, currentMonth - 1, 2, 9),
        paymentMethod: 'UPI / Net Banking',
        description: 'Rent'
      },
      {
        title: 'Supermarket Groceries',
        type: 'expense',
        amount: 4950,
        category: 'Food & Dining',
        date: d(currentYear, currentMonth - 1, 5, 17),
        paymentMethod: 'Credit Card',
        description: 'Groceries'
      },
      {
        title: 'Transportation & Cabs',
        type: 'expense',
        amount: 2800,
        category: 'Transportation',
        date: d(currentYear, currentMonth - 1, 12, 12),
        paymentMethod: 'UPI / Net Banking',
        description: 'Cab fares and metro'
      },
      {
        title: 'Utility Bills',
        type: 'expense',
        amount: 3400,
        category: 'Bills & Utilities',
        date: d(currentYear, currentMonth - 1, 18, 14),
        paymentMethod: 'UPI / Net Banking',
        description: 'Electricity and water'
      },
      {
        title: 'Online Shopping - Books & Clothes',
        type: 'expense',
        amount: 3800,
        category: 'Shopping',
        date: d(currentYear, currentMonth - 1, 24, 16),
        paymentMethod: 'Credit Card',
        description: 'Tech books and shirts'
      }
    ];

    await Transaction.insertMany(transactions);
    console.log(`Successfully seeded ${transactions.length} transactions.`);

    // Seed Current Month Budget: Limit ₹55,000
    await Budget.create({
      month: currentMonth + 1,
      year: currentYear,
      monthlyLimit: 55000
    });
    console.log(`Successfully seeded budget for month ${currentMonth + 1}/${currentYear} (₹55,000).`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
