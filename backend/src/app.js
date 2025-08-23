const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");

dotenv.config();

const app = express();

//middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.get('/', (req, res) => {
  res.json({ message: 'LMS Backend API is running!' });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes)


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;