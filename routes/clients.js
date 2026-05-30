const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Client = require('../models/Client');
const { protectAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/quotations')),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET all clients
router.get('/', protectAdmin, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single client
router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create client
router.post('/', protectAdmin, upload.single('quotation'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.quotation = req.file.filename;
    if (typeof data.services === 'string') data.services = [data.services];
    const client = await Client.create(data);
    res.status(201).json(client);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT update client
router.put('/:id', protectAdmin, upload.single('quotation'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.quotation = req.file.filename;
    if (typeof data.services === 'string') data.services = [data.services];
    const client = await Client.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE client
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
