const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId:          { type: Number, index: true },
  fullname:        { type: String, required: true, trim: true },
  gender:          { type: String, trim: true },
  dor:             { type: Date },
  services:        { type: String },
  amount:          { type: Number, min: 0 },
  paid_date:       { type: Date },
  p_year:          { type: Number, min: 0 },
  address:         { type: String },
  contact:         { type: String },
  status:          { type: String, default: 'Active' },
  attendance_count:{ type: Number, min: 0, default: 0 },
  ini_weight:      { type: Number, min: 0, default: 0 },
  curr_weight:     { type: Number, min: 0, default: 0 },
  ini_bodytype:    { type: String },
  curr_bodytype:   { type: String },
  progress_date:   { type: Date },
  reminder:        { type: Number, default: 0 },
}, { timestamps: true });

memberSchema.index({ fullname: 1 });

module.exports = mongoose.model('Member', memberSchema);
