const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  description: { type: String, trim: true, default: '' },
  quantity:    { type: Number, min: 0, default: 1 },
  rate:        { type: Number, min: 0, default: 0 },
  amount:      { type: Number, min: 0, default: 0 },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  originalId:    { type: Number, index: true },
  address:       { type: String },
  invoice_number:{ type: String, required: true, trim: true, alias: 'invoiceNumber' },
  client_name:   {
    type: String,
    trim: true,
    alias: 'clientName',
    required: function() { return this.type !== 'Quotation'; },
  },
  client_address:{ type: String, trim: true, alias: 'clientAddress' },
  client_contact:{ type: String, trim: true, alias: 'clientContact' },
  invoice_date:  { type: Date, alias: 'date' },
  due_date:      { type: Date, alias: 'dueDate' },
  quotation_date:{ type: Date, alias: 'quotationDate' },
  valid_date:    { type: Date, alias: 'validDate' },
  requested_by:  { type: String, trim: true, alias: 'requestedBy' },
  present_address:{ type: String, trim: true, alias: 'presentAddress' },
  project_location:{ type: String, trim: true, alias: 'projectLocation' },
  project_type:  { type: String, trim: true, alias: 'projectType' },
  contact_number:{ type: String, trim: true, alias: 'contactNumber' },
  prepared_by:   { type: String, trim: true, alias: 'preparedBy' },
  plan_type:     { type: String, trim: true, alias: 'planType' },
  ground:        { type: Number, min: 0, default: 0 },
  first:         { type: Number, min: 0, default: 0 },
  second:        { type: Number, min: 0, default: 0 },
  third:         { type: Number, min: 0, default: 0 },
  fourth:        { type: Number, min: 0, default: 0 },
  fifth:         { type: Number, min: 0, default: 0 },
  total_area:    { type: Number, min: 0, default: 0, alias: 'totalArea' },
  type:          { type: String, enum: ['Invoice', 'Quotation', 'Receipt'], default: 'Invoice' },
  status:        { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  lineItems:     { type: [lineItemSchema], default: [] },
  subTotal:      { type: Number, min: 0, default: 0 },
  gst:           { type: Number, min: 0, default: 0, alias: 'tax' },
  grand_total:   { type: Number, min: 0, default: 0, alias: 'total' },
  amountPaid:    { type: Number, min: 0, default: 0 },
  balance:       { type: Number, min: 0, default: 0 },
  notes:         { type: String, trim: true },
  description:   { type: String, trim: true },
  area:          { type: Number, min: 0 },
  unit_price:    { type: Number, min: 0 },
  discount:      { type: Number, min: 0, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

invoiceSchema.index({ invoice_number: 1 }, { unique: true, partialFilterExpression: { invoice_number: { $type: 'string', $ne: '' } } });
module.exports = mongoose.model('Invoice', invoiceSchema);
