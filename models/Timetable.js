const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  deviceId: { type: String, required:true },
  columns: [String],
  rows: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Timetable', timetableSchema);