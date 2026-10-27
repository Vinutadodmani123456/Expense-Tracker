import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then listen
const startServer = async () => {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`🚀 [SpendSphere API] running on http://localhost:${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Stopping SpendSphere API server...');
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
