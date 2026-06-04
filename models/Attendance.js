const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId:  { type: String, trim: true },
  employee:    { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  department:  { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  shift:       { type: String, trim: true },
  location:    { type: String, default: 'Office' }, // Changed to String to store location name
  message:     { type: String },
  date:        { type: Date, required: true },
  check_in:    { type: Date },
  in_status:   { type: String },
  check_out:   { type: Date },
  out_status:  { type: String },
  work_report: { type: String }, // Added for checkout work report
  status:      { type: String, enum: ['Present', 'Absent', 'Leave', 'Half-Day'], default: 'Present' },
  created_at:  { type: Date, default: Date.now },
}, { timestamps: true });

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
