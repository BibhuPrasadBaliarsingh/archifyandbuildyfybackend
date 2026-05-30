const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  first_name:  { type: String, required: true },
  last_name:   { type: String, required: true },
  username:    { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  email:       { type: String },
  department:  { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  shift:       { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' },
  designation: { type: String },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
  phone:       { type: String },
  address:     { type: String },
  role:        { type: Number, default: 0 },  // 0=employee, 1=manager
  status:      { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
