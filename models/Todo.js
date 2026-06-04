const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task_status: { type: String, required: true, trim: true },
  task_desc:   { type: String, required: true, trim: true },
  user_id:     { type: Number, index: true },
  staff:       { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

todoSchema.index({ task_status: 1 });

module.exports = mongoose.model('Todo', todoSchema);
