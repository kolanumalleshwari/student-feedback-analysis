const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Student Feedback Analysis System API',
    frontendUrl: 'http://localhost:5173',
    healthCheck: 'http://localhost:5000/api/health',
    endpoints: {
      feedback: '/api/feedback',
      analyticsSummary: '/api/analytics/summary',
      departmentAnalytics: '/api/analytics/departments',
      subjectAnalytics: '/api/analytics/subjects',
      sentimentAnalytics: '/api/analytics/sentiment'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API Routes
const feedbackRoutes = require('./routes/feedbackRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`===================================================`);
  console.log(` Student Feedback Analysis System Backend Running `);
  console.log(` Server URL: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);

  await testConnection();
});
