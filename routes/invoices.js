const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protectAdmin } = require('../middleware/auth');

// Auto-generate invoice number helper
const generateInvoiceNumber = async (type) => {
  const prefix = type === 'Quotation' ? 'QT' : type === 'Receipt' ? 'RC' : 'INV';
  const count = await Invoice.countDocuments({ type });
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
};

router.get('/', protectAdmin, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const invoices = await Invoice.find(filter).populate('client', 'fullname').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protectAdmin, async (req, res) => {
  try {
    const data = req.body;
    if (!data.invoiceNumber) {
      data.invoiceNumber = await generateInvoiceNumber(data.type || 'Invoice');
    }
    // Auto-calc totals
    data.subTotal = (data.lineItems || []).reduce((s, i) => s + (i.amount || 0), 0);
    data.total = data.subTotal + (data.tax || 0);
    data.balance = data.total - (data.amountPaid || 0);
    const invoice = await Invoice.create(data);
    res.status(201).json(invoice);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const data = req.body;
    data.subTotal = (data.lineItems || []).reduce((s, i) => s + (i.amount || 0), 0);
    data.total = data.subTotal + (data.tax || 0);
    data.balance = data.total - (data.amountPaid || 0);
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
