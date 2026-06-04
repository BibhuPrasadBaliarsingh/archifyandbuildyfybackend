const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protectAdmin } = require('../middleware/auth');
const { sendExcel, formatDate } = require('../utils/export');

// Auto-generate invoice or quotation number helper
const generateInvoiceNumber = async (type) => {
  const year = new Date().getFullYear();
  const prefix = 'ABC';
  const count = await Invoice.countDocuments({
    type,
    invoice_number: { $regex: `^${prefix}-${year}-` },
  });
  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}-${sequence}`;
};

const computeDocumentTotals = (data) => {
  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];
  const hasLineItems = lineItems.some(item => Number(item.amount) > 0);

  if (hasLineItems) {
    const subTotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const total = subTotal + (Number(data.tax) || 0);
    const balance = total - (Number(data.amountPaid) || 0);
    return { subTotal, total, balance };
  }

  const amountPaid = Number(data.amountPaid) || 0;
  const quantity = Number(data.totalArea || data.total_area || 0) || Number(data.area || 0);
  const unitPrice = Number(data.unit_price || data.unitPrice || 0);
  const discountRate = Number(data.discount || 0);
  const gstRate = Number(data.tax || data.gst || 0);

  if (quantity > 0 && unitPrice > 0) {
    const baseAmount = quantity * unitPrice;
    const discountAmount = baseAmount * discountRate / 100;
    const afterDiscount = Math.max(0, baseAmount - discountAmount);
    const gstAmount = afterDiscount * gstRate / 100;
    const total = afterDiscount + gstAmount;
    const balance = total - amountPaid;
    return { subTotal: afterDiscount, total, balance };
  }

  return { subTotal: 0, total: 0, balance: -amountPaid };
};

const normalizeInvoiceDoc = (doc) => {
  const normalized = {
    ...doc,
    invoiceNumber: doc.invoiceNumber || doc.invoice_number || '',
    type: doc.type || 'Invoice',
    status: doc.status || 'Unpaid',
    clientName: doc.clientName || doc.client_name || doc.requestedBy || doc.requested_by || '',
    clientContact: doc.clientContact || doc.client_contact || doc.contactNumber || doc.contact_number || '',
    date: doc.date || doc.invoice_date || doc.quotationDate || doc.quotation_date || doc.receipt_date || null,
    dueDate: doc.dueDate || doc.due_date || null,
    total: doc.total || doc.grand_total || 0,
    amountPaid: doc.amountPaid || doc.amount_paid || 0,
    balance: doc.balance || 0,
  };
  return normalized;
};

router.get('/', protectAdmin, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type && type !== 'All' ? { type } : {};
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    const normalized = invoices.map(inv => normalizeInvoiceDoc(inv.toObject({ virtuals: true })));
    res.json(normalized);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/export', protectAdmin, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    const normalized = invoices.map(inv => normalizeInvoiceDoc(inv.toObject({ virtuals: true })));
    const headers = ['Invoice #', 'Type', 'Client', 'Contact', 'Date', 'Due Date', 'Status', 'Total', 'Paid', 'Balance', 'Notes'];
    const rows = normalized.map(invoice => [
      invoice.invoiceNumber,
      invoice.type,
      invoice.clientName,
      invoice.clientContact,
      formatDate(invoice.date),
      formatDate(invoice.dueDate),
      invoice.status,
      invoice.total,
      invoice.amountPaid,
      invoice.balance,
      invoice.notes,
    ]);
    sendExcel(res, 'invoices.xls', headers, rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/next-number', protectAdmin, async (req, res) => {
  try {
    const type = req.query.type || 'Invoice';
    const invoiceNumber = await generateInvoiceNumber(type);
    res.json({ invoiceNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const doc = normalizeInvoiceDoc(invoice.toObject({ virtuals: true }));
    res.json(doc);
  } catch (err) {
    console.error('GET /api/invoices/:id error', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protectAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (!data.invoiceNumber) {
      data.invoiceNumber = await generateInvoiceNumber(data.type || 'Invoice');
    }
    const totals = computeDocumentTotals(data);
    data.subTotal = totals.subTotal;
    data.total = totals.total;
    data.balance = totals.balance;
    const invoice = await Invoice.create(data);
    res.status(201).json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const data = req.body;
    const totals = computeDocumentTotals(data);
    data.subTotal = totals.subTotal;
    data.total = totals.total;
    data.balance = totals.balance;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
