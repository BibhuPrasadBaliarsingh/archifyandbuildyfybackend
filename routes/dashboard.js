const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Lead = require('../models/Lead');
const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Staff = require('../models/Staff');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const { protectAdmin } = require('../middleware/auth');

// GET /api/dashboard/summary
router.get('/summary', protectAdmin, async (req, res) => {
  try {
    const [
      totalClients,
      totalLeads,
      totalProjects,
      totalStaff,
      totalEmployees,
      invoices,
      clientsByService,
      clientsByGender,
      leadsByStatus,
      projectsByStatus,
    ] = await Promise.all([
      Client.countDocuments(),
      Lead.countDocuments(),
      Project.countDocuments(),
      Staff.countDocuments(),
      Employee.countDocuments(),
      Invoice.find({}, 'total amountPaid type'),
      Client.aggregate([{ $unwind: '$services' }, { $group: { _id: '$services', count: { $sum: 1 } } }]),
      Client.aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$lead_status', count: { $sum: 1 } } }]),
      Project.aggregate([{ $group: { _id: '$overallStatus', count: { $sum: 1 } } }]),
    ]);

    const totalRevenue = invoices.filter(i => i.type === 'Invoice').reduce((s, i) => s + i.total, 0);
    const totalPaid = invoices.filter(i => i.type === 'Invoice').reduce((s, i) => s + i.amountPaid, 0);
    const totalOutstanding = totalRevenue - totalPaid;

    // Today's attendance count
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.countDocuments({ date: today });

    res.json({
      counts: { totalClients, totalLeads, totalProjects, totalStaff, totalEmployees, todayAttendance },
      finance: { totalRevenue, totalPaid, totalOutstanding },
      charts: { clientsByService, clientsByGender, leadsByStatus, projectsByStatus },
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
