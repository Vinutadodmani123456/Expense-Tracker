import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/healthRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Allowed origins configuration
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...clientUrls
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, render health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        process.env.CLIENT_URL === '*' ||
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', healthRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'SpendSphere REST API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
