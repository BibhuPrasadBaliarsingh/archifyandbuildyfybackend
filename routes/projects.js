const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protectAdmin } = require('../middleware/auth');
const { sendExcel, formatDate } = require('../utils/export');

router.get('/export', protectAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const headers = ['ID', 'Date', 'Client Name', 'Contact', 'Project Type', 'Location', 'Status', 'Notes', '2D Plan', '3D Elevation', 'Interior Design', 'Plan Approved', 'Structure Detailing', '3D Elevation Detailing', 'Landscape Designing', 'Construction Drawing'];
    const rows = projects.map(project => [
      project._id?.toString(),
      formatDate(project.date),
      project.clientName,
      project.contactNumber,
      project.projectType,
      project.projectLocation,
      project.overallStatus,
      project.notes,
      project.twoDPlan?.status,
      project.threeDElevation?.status,
      project.interiorDesign?.status,
      project.planApproved?.status,
      project.structureDetailing?.status,
      project.threeDElevationDetailing?.status,
      project.landscapeDesigning?.status,
      project.constructionDrawing?.status,
    ]);
    sendExcel(res, 'projects.xls', headers, rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protectAdmin, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protectAdmin, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
