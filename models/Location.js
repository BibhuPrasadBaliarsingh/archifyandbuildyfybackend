const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location:   { type: String, required: true, unique: true, trim: true },
  created_at: { type: Date, default: Date.now },
}, { timestamps: true });

locationSchema.index({ location: 1 });

module.exports = mongoose.model('Location', locationSchema);
