const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protectAdmin } = require('../middleware/auth');

router.get('/', protectAdmin, async (req, res) => {
  try {
    const staffs = await Staff.find().select('-password').sort({ createdAt: -1 });
    res.json(staffs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protectAdmin, async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ ...staff.toObject(), password: undefined });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    // If password not being changed, remove it from update
    if (!data.password) delete data.password;
    const staff = await Staff.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).select('-password');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
