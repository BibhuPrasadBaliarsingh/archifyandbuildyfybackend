const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protectEmployee, protectAdmin } = require('../middleware/auth');

// Employee: get today's attendance status
router.get('/today', protectEmployee, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({ employee: req.employee._id, date: today });
    res.json(record || null);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Employee: check in (Turn It!)
router.post('/checkin', protectEmployee, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({ employee: req.employee._id, date: today });
    if (existing && existing.check_in) return res.status(400).json({ message: 'Already checked in today' });

    const record = await Attendance.create({
      employee: req.employee._id,
      date: today,
      shift: req.body.shift,
      location: req.body.location,
      message: req.body.message,
      check_in: new Date(),
      status: 'Present',
    });
    res.status(201).json(record);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Employee: check out
router.put('/checkout', protectEmployee, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({ employee: req.employee._id, date: today });
    if (!record) return res.status(404).json({ message: 'No check-in found for today' });
    if (record.check_out) return res.status(400).json({ message: 'Already checked out today' });

    record.check_out = new Date();
    record.work_report = req.body.work_report;
    await record.save();
    res.json(record);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin: get all attendance records with optional filters
router.get('/', protectAdmin, async (req, res) => {
  try {
    const { employee, date, month } = req.query;
    const filter = {};
    if (employee) filter.employee = employee;
    if (date) filter.date = date;
    if (month) filter.date = { $regex: `^${month}` };

    const records = await Attendance.find(filter)
      .populate('employee', 'first_name last_name username')
      .sort({ date: -1, createdAt: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: delete attendance record
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
