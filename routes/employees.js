const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { protectAdmin } = require('../middleware/auth');

router.get('/', protectAdmin, async (req, res) => {
  try {
    const employees = await Employee.find().select('-password')
      .populate('department', 'name')
      .populate('shift', 'shift start_time end_time')
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id).select('-password')
      .populate('department', 'name')
      .populate('shift', 'shift start_time end_time');
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protectAdmin, async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    const result = emp.toObject();
    delete result.password;
    res.status(201).json(result);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.password) delete data.password;
    const emp = await Employee.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).select('-password');
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
