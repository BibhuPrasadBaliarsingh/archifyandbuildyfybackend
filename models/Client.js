const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  fullname:        { type: String, required: true, trim: true },
  gender:          { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dor:             { type: Date },                       // Date of Registration
  contact_number:  { type: String, required: true },
  whatsapp_number: { type: String },
  address:         { type: String },
  services:        [{ type: String }],                  // array of chosen services
  quotation:       { type: String },                    // file path/URL
  email:           { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
