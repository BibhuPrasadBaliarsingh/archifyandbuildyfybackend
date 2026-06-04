const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  charge: { type: Number, required: true, min: 0 },
}, { timestamps: true });

rateSchema.index({ name: 1 });

module.exports = mongoose.model('Rate', rateSchema);
