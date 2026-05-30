const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  shift:      { type: String, required: true, unique: true },
  start_time: { type: String, required: true },
  end_time:   { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Shift', shiftSchema);
