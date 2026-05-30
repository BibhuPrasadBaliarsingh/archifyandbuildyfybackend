const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  fullname:    { type: String, required: true },
  username:    { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  email:       { type: String, required: true },
  address:     { type: String },
  designation: { type: String },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
  contact:     { type: String },
  status:      { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

staffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
