// routes/devices.js
const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');

// ── Email service ─────────────────────────────────────────────────────────
const { sendDeviceAssignedEmail } = require('../services/emailService');

// ── Auth middleware ───────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ── Device Schema ─────────────────────────────────────────────────────────
const deviceSchema = new mongoose.Schema({
  deviceId:      { type: String, required: true, unique: true },
  name:          { type: String, required: true },
  location:      { type: String, default: '' },
  type:          { type: String, default: 'ESP32' },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);

// ── User model (needed for email) ─────────────────────────────────────────
const User = mongoose.models.User || mongoose.model('User',
  new mongoose.Schema({
    email:    String,
    password: String,
    role:     String,
  })
);

// GET /api/devices  — get all devices (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const devices = await Device.find().populate('assignedUsers', 'email role');
    res.json({ success: true, devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/devices/my  — get devices assigned to logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const devices = await Device.find({ assignedUsers: req.user.id });
    res.json({ success: true, devices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/devices  — create device (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { deviceId, name, location, type } = req.body;
    if (!deviceId || !name)
      return res.status(400).json({ success: false, message: 'deviceId and name required' });
    const existing = await Device.findOne({ deviceId });
    if (existing)
      return res.status(400).json({ success: false, message: 'Device ID already exists' });
    const device = await Device.create({ deviceId, name, location, type });
    res.status(201).json({ success: true, device });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/devices/:deviceId  — delete device (admin only)
router.delete('/:deviceId', authMiddleware, async (req, res) => {
  try {
    await Device.findOneAndDelete({ deviceId: req.params.deviceId });
    res.json({ success: true, message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/devices/:deviceId/assign  — assign/unassign user
router.put('/:deviceId/assign', authMiddleware, async (req, res) => {
  try {
    const { userId, assign } = req.body;
    const device = await Device.findOne({ deviceId: req.params.deviceId });
    if (!device)
      return res.status(404).json({ success: false, message: 'Device not found' });

    if (assign) {
      if (!device.assignedUsers.includes(userId))
        device.assignedUsers.push(userId);
    } else {
      device.assignedUsers = device.assignedUsers.filter(id => id.toString() !== userId);
    }
    await device.save();

    // ── Send email when user is assigned ─────────────────────────────────
    if (assign) {
      try {
        const assignedUser = await User.findById(userId);
        if (assignedUser) {
          await sendDeviceAssignedEmail({
            to:         assignedUser.email,
            name:       assignedUser.email.split('@')[0],
            deviceName: device.name,
            deviceId:   device.deviceId,
          });
          console.log('[Email] Device assigned email sent to', assignedUser.email);
        }
      } catch (emailErr) {
        // Email failure should never break the assign operation
        console.error('[Email] Failed to send device assign email:', emailErr.message);
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    const updated = await Device.findOne({ deviceId: req.params.deviceId })
      .populate('assignedUsers', 'email role');
    res.json({ success: true, device: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;