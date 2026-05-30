const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protectAdmin } = require('../middleware/auth');

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
