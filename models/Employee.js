const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  originalId:   { type: Number, index: true },
  first_name:   { type: String, required: true, trim: true },
  last_name:    { type: String, required: true, trim: true },
  username:     { type: String, required: true, unique: true, trim: true },
  password:     { type: String, required: true },
  email:        { type: String, trim: true },
  dob:          { type: Date },
  employee_id:  { type: String, trim: true, unique: true },
  joining_date: { type: Date },
  phone:        { type: String },
  shift:        { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' },
  department:   { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation:  { type: String },
  gender:       { type: String, enum: ['Male', 'Female', 'Other'] },
  role:         { type: Number, default: 0 },
  status:       { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  created_at:   { type: Date, default: Date.now },
}, { timestamps: true });

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

employeeSchema.index({ employee_id: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
