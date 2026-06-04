const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protectAdmin } = require('../middleware/auth');
const { sendExcel, formatDate } = require('../utils/export');

router.get('/export', protectAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    const headers = ['ID', 'Lead Name', 'Contact Number', 'Email', 'Source', 'Project Type', 'Budget', 'Status', 'Priority', 'Assigned Staff', 'Follow-up Date', 'Added'];
    const rows = leads.map(lead => [
      lead._id?.toString(),
      lead.lead_name,
      lead.contact_number,
      lead.email_address,
      lead.lead_source,
      lead.project_type,
      lead.project_budget,
      lead.lead_status,
      lead.lead_priority,
      lead.assigned_staff,
      formatDate(lead.follow_ups?.[0]?.date),
      formatDate(lead.createdAt),
    ]);
    sendExcel(res, 'leads.xls', headers, rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protectAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protectAdmin, async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
