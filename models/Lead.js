const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  follow_up_date: { type: Date },
  assigned_to:    { type: String },
  note:           { type: String },
});

const leadSchema = new mongoose.Schema({
  lead_name:        { type: String, required: true },
  contact_number:   { type: String, required: true },
  email_address:    { type: String },
  lead_source:      { type: String },
  other_source:     { type: String },
  project_type:     { type: String },
  project_location: { type: String },
  project_budget:   { type: String },
  lead_status:      { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'], default: 'New' },
  lead_priority:    { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  lead_notes:       { type: String },
  follow_ups:       [followUpSchema],
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
