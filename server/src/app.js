const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const alertRoutes = require('./routes/alertRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DIGIVERA backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/subscribe', subscriptionRoutes);

module.exports = app;
