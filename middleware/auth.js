const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

// Protect admin routes
const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorised, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Protect employee/attendance routes
const protectEmployee = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorised, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'employee') return res.status(403).json({ message: 'Access denied' });
    req.employee = await Employee.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protectAdmin, protectEmployee };
