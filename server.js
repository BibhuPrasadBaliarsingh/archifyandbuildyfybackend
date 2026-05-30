const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/clients',    require('./routes/clients'));
app.use('/api/staffs',     require('./routes/staffs'));
app.use('/api/leads',      require('./routes/leads'));
app.use('/api/projects',   require('./routes/projects'));
app.use('/api/invoices',   require('./routes/invoices'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/employees',  require('./routes/employees'));
app.use('/api/dashboard',  require('./routes/dashboard'));
app.use('/api/departments',require('./routes/departments'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
