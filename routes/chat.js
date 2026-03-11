// routes/chat.js  — ADD THIS FILE to your backend
const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// Simple chat message schema
const messageSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  sender:   { type: String, required: true },
  text:     { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// GET /api/chat/:deviceId
router.get('/:deviceId', async (req, res) => {
  try {
    const messages = await Message.find({ deviceId: req.params.deviceId })
      .sort({ createdAt: 1 }).limit(100);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/chat/:deviceId  { sender, text }
router.post('/:deviceId', async (req, res) => {
  try {
    const { sender, text } = req.body;
    if (!sender || !text)
      return res.status(400).json({ success: false, message: 'sender and text required' });
    const msg = await Message.create({
      deviceId: req.params.deviceId,
      sender, text,
    });
    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;