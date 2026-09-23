const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// 1. Submit Attendance API (POST)
router.post('/submit', async (req, res) => {
  try {
    const { empId, empName, status, location, selfie } = req.body;

    if (!empId || !empName || !location || !selfie) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const record = new Attendance({
      empId,
      empName,
      status: status || 'Present',
      location,
      selfie
    });

    await record.save();

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully!',
      data: record
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ success: false, message: 'Server error saving attendance.' });
  }
});

// 2. Fetch All Attendance Records API (GET)
router.get('/all', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ success: false, message: 'Server error fetching records.' });
  }
});

module.exports = router;