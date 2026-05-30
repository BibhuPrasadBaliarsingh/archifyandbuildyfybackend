const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid username or password' });

    res.json({ token: signToken(admin._id, 'admin'), role: 'admin', name: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/employee/login
router.post('/employee/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const employee = await Employee.findOne({ username }).populate('shift');
    if (!employee || !(await employee.matchPassword(password)))
      return res.status(401).json({ message: 'Incorrect login details' });

    res.json({
      token: signToken(employee._id, 'employee'),
      role: 'employee',
      name: `${employee.first_name} ${employee.last_name}`,
      id: employee._id,
      shift: employee.shift,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/admin/seed  (dev utility — creates first admin)
router.post('/admin/seed', async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists' });
    await Admin.create({ username: 'admin', password: 'admin123' });
    res.json({ message: 'Admin created: admin / admin123' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
