const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotation_number: { type: String, required: true, unique: true, trim: true },
  address:          { type: String },
  requested_by:     { type: String },
  present_address:  { type: String },
  project_location: { type: String },
  project_type:     { type: String },
  contact_number:   { type: String },
  quotation_date:   { type: Date },
  valid_date:       { type: Date },
  prepared_by:      { type: String },
  description:      { type: String },
  plan_type:        { type: String },
  ground:           { type: Number, min: 0, default: 0 },
  first:            { type: Number, min: 0, default: 0 },
  second:           { type: Number, min: 0, default: 0 },
  third:            { type: Number, min: 0, default: 0 },
  fourth:           { type: Number, min: 0, default: 0 },
  fifth:            { type: Number, min: 0, default: 0 },
  total_area:       { type: Number, min: 0, default: 0 },
  unit_price:       { type: Number, min: 0, default: 0 },
  grand_total:      { type: Number, min: 0, default: 0 },
}, { timestamps: true });

quotationSchema.index({ quotation_number: 1 });

module.exports = mongoose.model('Quotation', quotationSchema);
