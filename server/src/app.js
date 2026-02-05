const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const profileRoutes = require('./routes/profileRoutes');
const scanRoutes = require('./routes/scanRoutes');
const alertRoutes = require('./routes/alertRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (profile photos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'DIGIVERA backend is running',
    data: {
      version: '1.0.0',
      status: 'active'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/me', profileRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/subscribe', subscriptionRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
