const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  message:  { type: String, required: true },
  status:   { type: String, required: true, trim: true },
  date:     { type: Date, required: true },
  userId:   { type: Number, index: true },
  staff:    { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

reminderSchema.index({ userId: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
