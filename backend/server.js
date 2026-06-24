require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for credentials/Authorization headers
app.use(cors({
  origin: '*', // Allow all origins for simplicity in development, can customize as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Task Management System REST API is running',
    databaseFallback: db.isFallback
  });
});

// Register routes
app.use('/', authRoutes);
app.use('/', taskRoutes);

// Fallback handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start database then start listening
const startServer = async () => {
  await db.connect();
  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
