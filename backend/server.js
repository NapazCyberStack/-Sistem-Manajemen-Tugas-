require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');
const userRepository = require('./src/repositories/userRepository');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString('id-ID')}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Task Management System API berjalan',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info
app.get('/', (req, res) => {
  res.json({
    name: 'Task Management System API',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/logout', '/api/auth/me'],
      tasks: ['/api/tasks/data', '/api/tasks/data/:id', '/api/tasks/stats']
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingByEmail = await userRepository.findByEmail(adminEmail.toLowerCase());
  const existingByUsername = await userRepository.findByUsername(adminUsername);

  if (existingByEmail || existingByUsername) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  await userRepository.create({
    username: adminUsername,
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: 'Admin'
  });

  console.log(`✅ Default admin created: ${adminEmail} / ${adminPassword}`);
};

// Start server
const startServer = async () => {
  await db.connect();
  await ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer();
