// routes/auth.js — REPLACE your existing register handler with this
// Only the POST /register route changes — login stays the same

const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields required' });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({
      email,
      password: hashed,
      role:     role || 'User',
    });

    // Send welcome email with credentials
    // We send the plain password here because user needs to know it
    // (only time we ever send it — they should change it after login)
    try {
      await sendWelcomeEmail({
        to:       email,
        name:     email.split('@')[0],
        password: password,   // plain text — sent once at registration
      });
    } catch (emailErr) {
      // Don't fail registration if email fails — just log it
      console.error('[Email] Failed to send welcome email:', emailErr.message);
    }

    res.status(201).json({ success: true, message: 'Account created. Check your email.' });

  } catch (err) {
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