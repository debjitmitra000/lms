// backend/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

dotenv.config();

const app = express();

// Updated CORS configuration for production
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  // Add your exact Render frontend URL here
  'https://your-frontend-app-name.onrender.com'
];

console.log('🌐 Allowed CORS origins:', allowedOrigins);
console.log('🌐 Frontend URL from env:', process.env.FRONTEND_URL);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('🌐 CORS request from origin:', origin);
      
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        console.log('✅ CORS: Origin allowed');
        return callback(null, true);
      } else {
        console.log('❌ CORS: Origin not allowed');
        return callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true, // This is crucial for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  console.log('🍪 Cookies received:', req.cookies);
  console.log('📋 Headers:', {
    origin: req.get('origin'),
    authorization: req.get('authorization'),
    'user-agent': req.get('user-agent')
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'LMS Backend API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({ message: 'CORS error: Origin not allowed' });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.path);
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;