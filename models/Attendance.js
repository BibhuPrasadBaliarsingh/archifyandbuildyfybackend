const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee:    { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date:        { type: String, required: true },   // YYYY-MM-DD for easy querying
  shift:       { type: String },
  location:    { type: String },
  check_in:    { type: Date },
  check_out:   { type: Date },
  message:     { type: String },
  status:      { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day'], default: 'Present' },
  work_report: { type: String },
}, { timestamps: true });

// Compound index to prevent duplicate check-in on same day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
