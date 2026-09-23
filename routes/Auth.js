const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret Key (Aap ise .env file me bhi rakh sakte hain jaise process.env.JWT_SECRET)
const JWT_SECRET = 'apna_secret_key_yahan_rakhein';

// 1. Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered!" });
    }

    // Password ko hash karna (Encryption)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const count = await User.countDocuments();
    const empId = `EMP${String(101 + count).padStart(3, '0')}`;

    // Hash kiye hue password ko save karna
    const newUser = new User({ empId, name, email, password: hashedPassword });
    await newUser.save();

    // JWT Token generate karna
    const token = jwt.sign({ id: newUser._id, empId: newUser.empId }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ success: true, token, empId, name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  try {
    const { empId, password } = req.body;
    if (!empId || !password) {
      return res.status(400).json({ success: false, message: "Employee ID and Password are required" });
    }

    // Pehle empId se user ko dhoondhein
    const user = await User.findOne({ empId: empId.trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Employee ID or Password!" });
    }

    // Database ke hashed password ke sath entered password ko compare karna
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Employee ID or Password!" });
    }

    // Login successful hone par JWT Token generate karna
    const token = jwt.sign({ id: user._id, empId: user.empId }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token, empId: user.empId, name: user.name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;