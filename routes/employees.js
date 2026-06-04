const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { protectAdmin, protectEmployee } = require('../middleware/auth');
const { sendExcel, formatDate } = require('../utils/export');

// Employee: get own profile
router.get('/profile/me', protectEmployee, async (req, res) => {
  try {
    const emp = await Employee.findById(req.employee._id)
      .select('-password')
      .populate('department', 'name')
      .populate('shift', 'shift start_time end_time');
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', protectAdmin, async (req, res) => {
  try {
    const employees = await Employee.find().select('-password')
      .populate('department', 'name')
      .populate('shift', 'shift start_time end_time')
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/export', protectAdmin, async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name').populate('shift', 'shift start_time end_time').sort({ createdAt: -1 });
    const headers = ['ID', 'First Name', 'Last Name', 'Username', 'Email', 'Employee ID', 'Department', 'Shift', 'Designation', 'Gender', 'Phone', 'Status', 'Joining Date', 'Date of Birth'];
    const rows = employees.map(emp => [
      emp._id?.toString(),
      emp.first_name,
      emp.last_name,
      emp.username,
      emp.email,
      emp.employee_id,
      emp.department?.name || '',
      emp.shift?.shift || '',
      emp.designation,
      emp.gender,
      emp.phone,
      emp.status,
      formatDate(emp.joining_date),
      formatDate(emp.dob),
    ]);
    sendExcel(res, 'employees.xls', headers, rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
