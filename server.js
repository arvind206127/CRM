const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// CORS aur Payload size fix
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  empId: String,
  empName: String,
  status: { type: String, default: 'Present' },
  location: Object,
  selfie: String,
  createdAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// 1. GET Route (/api/attendance) - Iske na hone se 404 aa raha tha
app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. POST Route (/api/attendance)
app.post('/api/attendance', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));