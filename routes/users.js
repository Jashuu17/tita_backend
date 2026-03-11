// routes/users.js  — ADD THIS FILE to your backend
const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const jwt     = require('jsonwebtoken');

// Middleware: verify JWT token
const auth = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ success: false, message: 'No token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware: admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin')
    return res.status(403).json({ success: false, message: 'Admins only' });
  next();
};

// GET /api/users — list all users (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude passwords
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/users/:id — delete a user (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (req.user.id === req.params.id)
      return res.status(400).json({ success: false, message: "Can't delete yourself" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;