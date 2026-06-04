const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  amount:      { type: Number, required: true, min: 0 },
  quantity:    { type: Number, required: true, min: 0 },
  vendor:      { type: String, trim: true },
  description: { type: String },
  address:     { type: String },
  contact:     { type: String },
  date:        { type: Date, required: true },
}, { timestamps: true });

equipmentSchema.index({ name: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
