const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  description: { type: String },
  quantity:    { type: Number, default: 1 },
  rate:        { type: Number, default: 0 },
  amount:      { type: Number, default: 0 },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  type:          { type: String, enum: ['Invoice', 'Quotation', 'Receipt'], default: 'Invoice' },
  client:        { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName:    { type: String, required: true },
  clientAddress: { type: String },
  clientContact: { type: String },
  date:          { type: Date, default: Date.now },
  dueDate:       { type: Date },
  lineItems:     [lineItemSchema],
  subTotal:      { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  total:         { type: Number, default: 0 },
  amountPaid:    { type: Number, default: 0 },
  balance:       { type: Number, default: 0 },
  status:        { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  notes:         { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
