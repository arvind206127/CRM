require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
// Base64 Selfie Image size badi hoti hai, isliye limit 10mb rakhi hai
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve Frontend Files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB (MongoDB Atlas Connection String ya Local)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/api/attendance', attendanceRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});