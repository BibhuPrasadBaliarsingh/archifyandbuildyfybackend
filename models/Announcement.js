const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true },
  date:    { type: Date, required: true },
}, { timestamps: true });

announcementSchema.index({ date: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
