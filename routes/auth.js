const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields required' });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    // ✅ Don't hash here — model pre('save') hook handles it
    const user = await User.create({
      email,
      password: password, // plain password — model will hash it
      role: role || 'User',
    });

    try {
      await sendWelcomeEmail({
        to:       email,
        name:     email.split('@')[0],
        password: password,
      });
    } catch (emailErr) {
      console.error('[Email] Failed to send welcome email:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Account created. Check your email.' });

  } catch (err) {
    // ✅ Handle duplicate key error from MongoDB explicitly
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    console.error('[Auth] Register error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login  — unchanged
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;