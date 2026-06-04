const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  date:        { type: Date },
  assigned_to: { type: String },
  note:        { type: String },
}, { _id: false });

const leadSchema = new mongoose.Schema({
  originalId:      { type: Number, index: true },
  lead_name:       { type: String, required: true, trim: true },
  contact_number:  { type: String, required: true, trim: true },
  email_address:   { type: String, trim: true },
  lead_source:     { type: String, trim: true },
  project_type:    { type: String, trim: true },
  project_location:{ type: String, trim: true },
  project_budget:  { type: Number, min: 0 },
  lead_status:     { type: String, trim: true },
  lead_priority:   { type: String, trim: true },
  lead_notes:      { type: String },
  follow_ups:      [followUpSchema],
  lead_conversion: { type: String, trim: true },
  reason_for_loss: { type: String },
}, { timestamps: true });

leadSchema.index({ lead_name: 1 });

module.exports = mongoose.model('Lead', leadSchema);
