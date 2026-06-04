const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  fullname:        { type: String, required: true, trim: true },
  gender:          { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dor:             { type: Date, required: true },
  contact_number:  { type: String, required: true, trim: true },
  whatsapp_number: { type: String, trim: true },
  address:         { type: String },
  quotation:       { type: String },
  services:        [{ type: String }],
  status:          { type: String, default: 'Active' },
  email:           { type: String, trim: true },
}, { timestamps: true });

clientSchema.index({ contact_number: 1 });
clientSchema.index({ fullname: 1 });

module.exports = mongoose.model('Client', clientSchema);
