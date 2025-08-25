const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

dotenv.config();

const app = express();

// Updated CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:5173',  
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'LMS Backend API is running!' });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;