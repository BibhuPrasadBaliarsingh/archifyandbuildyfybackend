const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receipt_number: { type: String, required: true, unique: true, trim: true },
  address:        { type: String },
  client_name:    { type: String },
  client_address: { type: String },
  client_contact: { type: String },
  receipt_date:   { type: Date },
  description:    { type: String },
  area:           { type: Number, min: 0, default: 0 },
  unit_price:     { type: Number, min: 0, default: 0 },
  grand_total:    { type: Number, min: 0, default: 0 },
  payment_date:   { type: Date },
  payment_mode:   { type: String },
  advance_amount: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

receiptSchema.index({ receipt_number: 1 });

module.exports = mongoose.model('Receipt', receiptSchema);
