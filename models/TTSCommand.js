const mongoose = require('mongoose');

const ttsSchema = new mongoose.Schema({
  deviceId: { type: String },
  announcement: { type: String },
  audio_url: { type: String },
  status: { type: String, enum:['pending','read'], default:'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TTSCommand', ttsSchema);