const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Shift = require('../models/Shift');
const { protectAdmin } = require('../middleware/auth');

// Departments
router.get('/', protectAdmin, async (req, res) => {
  try { res.json(await Department.find().sort({ name: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protectAdmin, async (req, res) => {
  try { res.status(201).json(await Department.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Shifts (nested under departments router for convenience)
router.get('/shifts/all', protectAdmin, async (req, res) => {
  try { res.json(await Shift.find().sort({ shift: 1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/shifts', protectAdmin, async (req, res) => {
  try { res.status(201).json(await Shift.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/shifts/:id', protectAdmin, async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
