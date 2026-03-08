const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true },
  authSecret: { type: String },
  assignedFaculty: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }]
});

module.exports = mongoose.model('Device', deviceSchema);